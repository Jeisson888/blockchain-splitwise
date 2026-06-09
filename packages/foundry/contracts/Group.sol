// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;
import { Utils } from "./Utils.sol";

contract Group {
    Utils utils;

    event CreatedGroup(address creator, address groupAddress, address[] initialMembers);
    event ExpenseAdded(address payer, uint256 amount);
    event DebtsPaid(address payer, uint256 totalOwned);

    uint256 public totalMembers;
    address public registry;
    address public creator;
    uint256 totalExpenses;
    address[] public members;
    mapping(address => int256) public balances;
    mapping(address => bool) isMember;

    struct Debt {
        address from;
        address to;
        uint256 value;
    }
    Debt[] public debts;

    modifier onlyMember() {
        require(isMember[msg.sender], "Not a member of the group");
        _;
    }

    /**
     * @param registry_ Address of the RegistryGroups factory
     * @param creator_ Address that created this group
     * @param members_ Initial members
     * @param utils_ Shared Utils contract deployed once by RegistryGroups
     */
    constructor(address registry_, address creator_, address[] memory members_, address utils_) {
        require(members_.length > 0, "Can't create a group with no members");
        creator = creator_;
        registry = registry_;
        for (uint256 i = 0; i < members_.length; i++) {
            members.push(members_[i]);
            isMember[members_[i]] = true;
            balances[members_[i]] = 0;
        }
        totalMembers = members_.length;
        utils = Utils(utils_);
        emit CreatedGroup(msg.sender, address(this), members);
    }

    /**
     * @notice Any member can record an expense on behalf of the payer.
     * Remainder from integer division stays with the payer (standard rounding).
     * @param payer_ Member address that paid for the expense
     * @param amount_ Total amount paid
     */
    function addExpense(address payer_, uint256 amount_) public onlyMember {
        require(isMember[payer_], "Payer is not in the group");
        require(amount_ != 0, "Amount can't be 0");

        uint256 splitValue = amount_ / totalMembers;
        for (uint256 i = 0; i < members.length; i++) {
            balances[members[i]] -= int256(splitValue);
        }
        balances[payer_] += int256(amount_);
        totalExpenses += amount_;
        emit ExpenseAdded(payer_, amount_);
    }

    /**
     * @notice Recomputes individual debts from current balances.
     * Clears the previous debts array on every call.
     * @dev Sorting is handled off-chain. For the two-pointer algorithm in getDebts()
     * to produce an optimal result, members must be ordered by balance descending
     * before expenses are added.
     */
    function split() public onlyMember {
        delete debts;
        uint256 n_deptors;
        uint256 n_creditors;

        uint256 n = members.length;
        for (uint256 i = 0; i < n; i++) {
            if (balances[members[i]] >= 0) n_creditors += 1;
            else n_deptors += 1;
        }
        address[] memory deptors = new address[](n_deptors);
        address[] memory creditors = new address[](n_creditors);
        uint256 i_deptors;
        uint256 i_creditors;
        for (uint256 i = 0; i < n; i++) {
            if (balances[members[i]] >= 0) {
                creditors[i_creditors] = members[i];
                i_creditors += 1;
            } else {
                deptors[i_deptors] = members[i];
                i_deptors += 1;
            }
        }
        getDebts(deptors, creditors);
    }

    /**
     * @notice Greedy two-pointer algorithm to minimize the number of transactions.
     * @dev Both arrays must be sorted descending by absolute balance for optimal results.
     * @param deptors_ Addresses with negative balance
     * @param creditors_ Addresses with positive balance
     */
    function getDebts(address[] memory deptors_, address[] memory creditors_) internal {
        uint256 j;
        uint256 leftCredit;
        uint256 leftDebt = utils.abs(balances[deptors_[j]]);
        for (uint256 i = 0; i < creditors_.length; i++) {
            leftCredit = utils.abs(balances[creditors_[i]]);

            while (leftDebt > 0 && leftCredit > 0 && j < deptors_.length) {
                if (leftCredit >= leftDebt) {
                    addDebt(deptors_[j], creditors_[i], leftDebt);
                    leftCredit = leftCredit - leftDebt;
                    leftDebt = 0;
                    j++;
                    if (j < deptors_.length) {
                        leftDebt = utils.abs(balances[deptors_[j]]);
                    }
                } else {
                    addDebt(deptors_[j], creditors_[i], leftCredit);
                    leftDebt -= leftCredit;
                    leftCredit = 0;
                }
            }
        }
    }

    /**
     * Push a debt sctruct to have registry of debts on ´debts´ array
     * @param from_ address of the debtor
     * @param to_ address of creditor
     * @param value_ value debt
     */
    function addDebt(address from_, address to_, uint256 value_) internal {
        debts.push(Debt({ from: from_, to: to_, value: value_ }));
    }

    /**
     * @notice Add a new member to the group.
     * @param newMember_ Address of the new member
     */
    function addMember(address newMember_) public {
        //TODO: validate newMember_ is not already in the group
        //TODO: add to members[], isMember, balances, and increment totalMembers
        //TODO: call registry to update memberGroups mapping
    }

    function pay() public payable onlyMember {
        //TODO: pay a specific debt by index
    }

    function leaveGroup() public onlyMember {
        //TODO: validate caller has no outstanding debts (balance == 0)
        //TODO: remove from members[], update isMember, decrement totalMembers
        //TODO: call registry to update memberGroups mapping
    }

    function dissolveGroup() public onlyMember {
        //TODO: validate all balances are zero (all debts settled)
        //TODO: restrict to creator or require unanimous member approval
    }

    /**
     * @notice Pays all of the caller's outstanding debts in one transaction.
     * msg.value must equal the exact total owed.
     */
    function payAll() public payable onlyMember {
        uint256 totalOwed;
        for (uint256 i = 0; i < debts.length; i++) {
            if (debts[i].from == msg.sender) {
                totalOwed += debts[i].value;
            }
        }
        require(totalOwed > 0, "no debts to pay");
        require(totalOwed == msg.value, "Must send exact debts total");

        for (uint256 i = 0; i < debts.length; i++) {
            if (debts[i].from == msg.sender && debts[i].value > 0) {
                uint256 amount = debts[i].value;
                balances[msg.sender] += int256(amount);
                balances[debts[i].to] -= int256(amount);
                debts[i].value = 0;

                (bool success,) = debts[i].to.call{ value: amount }("");
                require(success, "Transfer failed");
            }
        }
        emit DebtsPaid(msg.sender, totalOwed);
    }

    /**
     * returns array ´members´ directly
     */
    function getMembers() public view returns (address[] memory members_) {
        members_ = members;
    }
}
