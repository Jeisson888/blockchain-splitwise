// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Group } from "./Group.sol";
import { Utils } from "./Utils.sol";

contract RegistryGroups is Ownable {
    event CreatedGroup(address groupAddress, address[] initialMembers);

    Utils public utils;

    uint256 public groupTotal;
    mapping(uint256 => address) public groupContracts; // GroupId => Address
    mapping(address => address[]) public memberGroups; //user => groups he belongs to

    constructor(address owner_) Ownable(owner_) {
        utils = new Utils();
    }

    /**
     *
     * @param initialMembers_ Initial members of the group to create the group
     */
    function createGroup(address[] memory initialMembers_) public {
        Group newGroup = new Group(address(this), msg.sender, initialMembers_, address(utils));
        groupTotal += 1;
        groupContracts[groupTotal] = address(newGroup);
        for (uint256 i = 0; i < initialMembers_.length; i++) {
            memberGroups[initialMembers_[i]].push(address(newGroup));
        }
        emit CreatedGroup(address(newGroup), initialMembers_);
    }
}
