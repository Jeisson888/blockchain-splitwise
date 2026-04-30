// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

contract Group {

    //TODO: create events

    uint256 totalMembers;
    address registry;
    address creator;
    uint256 totalExpenses;
    address[] members;
    mapping(address => int256) balances;
    mapping(address => bool) isMember;
    
    
    // mapping(address => mapping(address => uint256)) membersDebt;

    /**
     * @notice initialize the mapping of balances all in zeros for 
     * every single member of the group.
     */
    constructor(address registry_, address creator_, address[] memory members_) {
        creator = creator_;
        registry = registry_;
        for (uint i = 0; i < members_.length; i++) {
            members.push(members_[i]);
            isMember[members_[i]] = true;
            balances[members_[i]] = 0;
        }
        totalMembers = members_.length;
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
    }


    /**
     * @notice Add a new member to the group
     * @dev By default it's balance is zero and is also
     * added to the registry map
     */
    function addMember()  public {
        
    }

    /** 
     * @notice split wvery single time that balances are recalculated
     */
    function split()  public {
        
    }

    function pay() public {

    }

}