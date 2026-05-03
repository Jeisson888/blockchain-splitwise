// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Group} from "./Group.sol";

contract RegistryGroups is Ownable {
    
    event CreatedGroup( address  groupAddress, address[] initialMembers); 

    //TODO: Create events
    /**Factory pattern */

    uint256 public groupTotal;
    mapping (uint256 => address) public groupContracts; // GroupId => Address
    mapping (address => address[]) public memberGroups; //user => groups he belongs to  

    constructor(address owner_) Ownable(owner_){} 


    /**
     * 
     * @param initialMembers_ Initial members of the group to create the group
     */
    function createGroup( address[] memory initialMembers_)  public {
        Group newGroup = new Group( address(this),msg.sender, initialMembers_);
        groupTotal +=1;
        groupContracts[groupTotal] = address(newGroup);
        for (uint i = 0; i < initialMembers_.length; i++) {
            memberGroups[initialMembers_[i]].push(address(newGroup));
        }
        emit CreatedGroup(address(newGroup), initialMembers_);
    }
}