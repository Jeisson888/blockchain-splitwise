// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import "forge-std/Test.sol";

import {Group} from "../contracts/Group.sol";
import {RegistryGroups} from "../contracts/RegistryGroups.sol";

contract Splitter is Test {
    //TODO: Implement Fuzztesting for different expenses and payments.

    RegistryGroups rg;
    Group testGroup;

    function setUp() public {
        rg = new RegistryGroups(vm.addr(1));
        address[] memory members_ = new address[](4);
        members_[0] = makeAddr("thomas");
        members_[1] = makeAddr("camilo");
        members_[2] = makeAddr("Jeisson");
        members_[3] = makeAddr("john doe");
        rg.createGroup(members_);
        testGroup = Group(rg.groupContracts(rg.groupTotal()));
    }

    // REGISTRY TESTS

    function testRegistryGroupDeployedPropperly() external view {
        assert(address(rg) != address(0));
        assert(rg.owner() == vm.addr(1));
    }

    function testCreateGroupProperly() external {
        address[] memory members_ = new address[](3);
        members_[0] = makeAddr("thomas");
        members_[1] = makeAddr("camilo");
        members_[2] = makeAddr("Jeisson");

        rg.createGroup(members_);
        address group = rg.groupContracts(rg.groupTotal());
        assert(group != address(0));
        assert(group == rg.groupContracts(rg.groupTotal()));
        assert(members_.length == Group(group).getMembers().length);
    }

    //GROUP TESTS

    function testAddExpenseWorksProperly() external {
        address payer_ = testGroup.members(0);
        address debtor = testGroup.members(1);
        uint256 amount_ = 150000;
        testGroup.addExpense(payer_, 150000);
        uint256 splitValue = (amount_ * 1e18) / testGroup.getMembers().length;
        splitValue = splitValue / 1e18;
        assert(
            testGroup.abs(testGroup.balances(payer_)) == amount_ - splitValue
        );
        assert(testGroup.abs(testGroup.balances(debtor)) == splitValue);
    }

    function testAddExpenseDoNotAcceptNegatives() external {
        vm.expectRevert("Amount can't be 0 or less");
        address payer_ = testGroup.members(0);
        address debtor = testGroup.members(1);
        uint256 amount_ = -1150000;
        testGroup.addExpense(payer_, amount_);
    }

    //TODO: Test debts array after addExpense, check if the debts are created properly.
    //TODO: Chekc pay all Fucntion to pay every single debt, check balances and debts after performing it.
    //TODO: Check Split function (revert with unsorted), performed if sorted
    //TODO: Add continuos expenses
    //TODO: Add continuos expenses and payments and check balances and debts after each one.

    // function testMessageOnDeployment() public view {
    // require(
    // keccak256(bytes(yourContract.greeting())) ==
    // keccak256("Building Unstoppable Apps!!!")
    // );
    // }
}
