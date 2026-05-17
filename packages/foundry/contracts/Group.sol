// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

contract Group {
    event CreatedGroup(
        address creator,
        address groupAddress,
        address[] initialMembers
    );
    event ExpenseAdded(address payer, uint256 amount);
    event DebtsPaid(address payer, uint256 totalOwned);

    uint256 totalMembers;
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
     * @notice initialize the mapping of balances all in zeros for
     * every single member of the group.
     */
    constructor(
        address registry_,
        address creator_,
        address[] memory members_
    ) {
        require(members_.length > 0, "Can't create a group with no members");
        creator = creator_;
        registry = registry_;
        for (uint i = 0; i < members_.length; i++) {
            members.push(members_[i]);
            isMember[members_[i]] = true;
            balances[members_[i]] = 0;
        }
        totalMembers = members_.length;
        emit CreatedGroup(msg.sender, address(this), members);
    }

    /**
     *
     * @param payer_ Address that have pay for the expense
     * @param amount_ amount paid
     */
    function addExpense(address payer_, uint256 amount_) public {
        require(isMember[payer_], "Payer is not in the group");
        require(amount_ > 0, "Amount can't be 0 or less");

        uint256 splitValue = (amount_ * 1e18) / totalMembers;
        for (uint i = 0; i < members.length; i++) {
            balances[members[i]] -= int256(splitValue / 1e18);
        }
        balances[payer_] += int256(amount_);
        totalExpenses += amount_;
        emit ExpenseAdded(payer_, amount_);
    }

    /**
     * @notice split every single time that balances are recalculated
     * This function is to get the value that every member needs to pay
     * to each other. (make liquidation)
     */
    function split() public {
        for (uint i = 0; i < debts.length; i++) {
            require(
                debts[i].value == 0,
                "Outstanding debts must be settled first"
            );
        }
        uint256 n_deptors; //negative balance
        uint256 n_creditors; //positive balance

        uint256 n = members.length;
        for (uint i = 0; i < n; i++) {
            if (balances[members[i]] >= 0) n_creditors += 1;
            else n_deptors += 1;
        }
        //Complete the two aux lists
        address[] memory deptors = new address[](n_deptors);
        address[] memory creditors = new address[](n_creditors);
        uint256 i_deptors;
        uint256 i_creditors;
        for (uint i = 0; i < n; i++) {
            if (balances[members[i]] >= 0) {
                creditors[i_creditors] = members[i];
                i_creditors += 1;
            } else {
                deptors[i_deptors] = members[i];
                i_deptors += 1;
            }
        }
        getDebts(deptors, creditors);
        //TODO: Review On-Chain Sorting
    }

    /**
     * Returns true if the array is sorted or reverts with 'Array is not sorted'
     * @param array_ Array to sort
     */
    function isSorted(
        address[] memory array_
    ) internal view returns (bool sorted) {
        for (uint i = 0; i < array_.length - 1; i++) {
            require(
                balances[array_[i]] <= balances[array_[i + 1]],
                "Array is not sorted"
            );
        }
        return true;
    }

    /**
     * @notice Generate the individuals dev of each member of the group and each is
     * register directly into ´debts´ array
     * @dev Requiere deptors and creditors arrays already sorted in decremental order
     * example [addr(1), addr(2), addr(3)] -> addr(1) on index Zero should have the
     * Biggest value and addr(3) on index 2 should have the address with the smallest
     * balance.
     * @param creditors_ Address with positive Balance sorted decrementaly
     * @param deptors_ Addresses with negative Balance sorted decrementaly
     */
    function getDebts(
        address[] memory deptors_,
        address[] memory creditors_
    ) internal {
        uint256 j; //Deptor pointer
        uint256 leftCredit;
        uint256 leftDebt = abs(balances[deptors_[j]]);
        for (uint i = 0; i < creditors_.length; i++) {
            leftCredit = abs(balances[creditors_[i]]);

            while (leftDebt > 0 && j < deptors_.length) {
                //Debt is bigger than the credit
                if (leftCredit >= leftDebt) {
                    addDebt(deptors_[j], creditors_[i], leftDebt);
                    leftCredit = leftCredit - leftDebt; //(pays all the Debt)
                    leftDebt = 0; //next debtor
                    j++;
                    if (j < deptors_.length) {
                        leftDebt = abs(balances[deptors_[j]]);
                    }
                } else {
                    addDebt(deptors_[j], creditors_[i], leftCredit);
                    leftDebt -= leftCredit;
                    leftCredit = 0; //(breaks while in next iteration)
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
        debts.push(Debt({from: from_, to: to_, value: value_}));
    }

    //return absolute value of a number
    function abs(int256 x_) internal pure returns (uint256) {
        require(x_ != type(int256).min, "Overflow");
        return x_ >= 0 ? uint256(x_) : uint256(-x_);
    }

    /**
     * @notice Add a new member to the group
     * @dev By default it's balance is zero and is also
     * added to the registry map
     */
    function addMember() public {
        //TODO:A member can't be in the group twice
    }

    /**
     * //TODO: pay a specific debt
     */
    function pay() public payable onlyMember {}

    /**
     * @notice transfer all values stablished in the debt mapping and erase it after it.
     */
    function payAll() public payable onlyMember {
        uint256 totalOwed;
        for (uint i = 0; i < debts.length; i++) {
            if (debts[i].from == msg.sender) {
                totalOwed += debts[i].value;
            }
        }
        require(totalOwed > 0, "no debts to pay");
        require(totalOwed == msg.value, "Must send exact debts total");

        for (uint i = 0; i < debts.length; i++) {
            if (debts[i].from == msg.sender && debts[i].value > 0) {
                uint256 amount = debts[i].value;
                balances[msg.sender] += int256(amount);
                balances[debts[i].to] -= int256(amount);
                debts[i].value = 0;

                (bool success, ) = debts[i].to.call{value: amount}("");
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
