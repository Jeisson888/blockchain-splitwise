// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

contract Group {

    event CreatedGroup( address creator,address  groupAddress, address[] initialMembers); 
    event ExpenseAdded(address payer, uint256 amount);

    uint256 totalMembers;
    address registry;
    address creator;
    uint256 totalExpenses;
    address[] public members;
    mapping(address => int256) public balances;
    mapping(address => bool) isMember;
    struct debt {
        address from;
        address to;
        uint256 value;
    }
    
    
    // mapping(address => mapping(address => uint256)) membersDebt;

    /**
     * @notice initialize the mapping of balances all in zeros for 
     * every single member of the group.
     */
    constructor(address registry_, address creator_, address[] memory members_) {
        require(members_.length > 0,"Can't create a group with no members");
        creator = creator_;
        registry = registry_;
        for (uint i = 0; i < members_.length; i++) {
            members.push(members_[i]);
            isMember[members_[i]] = true;
            balances[members_[i]] = 0;
        }
        totalMembers = members_.length;
        emit CreatedGroup(msg.sender ,address(this), members);

    }

    /**
     * 
     * @param payer_ Address that have pay for the expense
     * @param amount_ amount paid
     */
    function addExpense(address payer_, uint256 amount_)  public {
        require(isMember[payer_], "Payer is not in the group");
        require(amount_ > 0, "Amount can't be 0");

        uint256 splitValue = (amount_ * 1e18 ) / totalMembers;
        for (uint i = 0; i < members.length; i++) {
            balances[members[i]] -= int256(splitValue / 1e18);
        }
        balances[payer_] += int256(amount_);
        totalExpenses += amount_;
        emit ExpenseAdded(payer_, amount_);
    }

    /** 
     * @notice split wvery single time that balances are recalculated
     * This function is to get the value that every member needs to pay
     * to each other.
     */
    function split()  public {
    
        //TODO: implement new logic
        //Divide in aux list + and -
        //Then Sort
        //Then get the transactions to pay (with the struct).
    }

    function abs(int256 x_)  public pure returns (uint256)  {
        require (x_ != type(int256).min, "Overflow");
        return x_ >= 0 ? uint256(x_): uint256(-x_);
    }

    /**
     * @notice Add a new member to the group
     * @dev By default it's balance is zero and is also
     * added to the registry map
     */
    function addMember()  public {
        
    }

    
    /**
     * @notice transfer values stablished in the debt mapping and erase it after it.
     */
    function pay() public {

    }

    function getMembers() public view returns (address[] memory members_) {
        members_ = members;
    }

}