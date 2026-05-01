// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

contract Group {

    event ExpenseAdded(address payer, uint256 amount);

    uint256 totalMembers;
    address registry;
    address creator;
    uint256 totalExpenses;
    address[] members;
    mapping(address => int256) balances;
    mapping(address => bool) isMember;
    mapping(address => mapping(address => uint256)) debtTopay;
    
    
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
        emit ExpenseAdded(payer_, amount_);
    }

    /** 
     * @notice split wvery single time that balances are recalculated
     * This function is to get the value that every member needs to pay
     * to each other.
     */
    function split()  public {
        address to_;
        uint256 toPay;
        for (uint i = 0; i < members.length; i++) {
            if(balances[members[i]]>0){
                to_=members[i];
                toPay = balances[members[i]];
            }else if(balances[members[i]]<0){
                int256 difference = toPay - abs(balances[members[i]]);
            }
            
            if (difference < 0) { //
                
            }else if(difference > 0){
                
            }else {

            }
            //TODO: Not working ... needs to be  greedy or helper lists / pointers to keep registers (even pointers)
            
            else if (balances[members[i]]<0) {
                
                if (balances[to_] + balances[members[i]] > 0 ) { 
                    debtTopay[members[i]][to_]=abs(balances[members[i]]);
                    reminder = abs(balances[to_]) - abs(balances[members[i]]);
                
            }
        }
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

}