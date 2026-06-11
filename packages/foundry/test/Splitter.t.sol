// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import { Test } from "lib/forge-std/src/Test.sol";

import { console } from "lib/forge-std/src/console.sol";
import { Group } from "../contracts/Group.sol";
import { Utils } from "../contracts/Utils.sol";
import { RegistryGroups } from "../contracts/RegistryGroups.sol";

contract Splitter is Test {
    //TODO: Implement Fuzztesting for different expenses and payments.

    RegistryGroups rg;
    Group testGroup;
    Utils utils;

    /**
     * @notice Deploys RegistryGroups and creates a test group with 4 members:
     * members[0]=thomas, members[1]=camilo, members[2]=Jeisson, members[3]=john doe
     */
    function setUp() public {
        rg = new RegistryGroups(vm.addr(1));
        utils = new Utils();
        address[] memory members_ = new address[](4);
        members_[0] = makeAddr("thomas");
        members_[1] = makeAddr("camilo");
        members_[2] = makeAddr("Jeisson");
        members_[3] = makeAddr("john doe");
        rg.createGroup(members_);
        testGroup = Group(rg.groupContracts(rg.groupTotal()));
    }

    // ********************
    // Registry tests
    // ********************

    /**
     * @notice Verifies that RegistryGroups deploys to a non-zero address
     * and that the owner is set correctly.
     */
    function testRegistryGroupDeployedPropperly() external view {
        assert(address(rg) != address(0));
        assert(rg.owner() == vm.addr(1));
    }

    /**
     * @notice Verifies that createGroup deploys a Group contract at a non-zero
     * address and stores the correct number of members.
     */
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

    // ********************
    // addExpense tests
    // ********************

    /**
     * @notice Verifies that addExpense correctly credits the payer and debits
     * each member their share of the expense.
     */
    function testAddExpenseWorksProperly() external {
        address payer_ = testGroup.members(0);
        address debtor = testGroup.members(1);
        uint256 amount_ = 150000;
        vm.prank(payer_);
        testGroup.addExpense(payer_, 150000);
        uint256 splitValue = amount_ / testGroup.getMembers().length;
        assert(utils.abs(testGroup.balances(payer_)) == amount_ - splitValue);
        assert(utils.abs(testGroup.balances(debtor)) == splitValue);
    }

    /**
     * @notice Verifies that addExpense reverts when amount is zero,
     * since splitting zero has no meaning.
     */
    function testAddExpenseDoNotAcceptZero() external {
        address payer_ = testGroup.members(0);
        uint256 amount_ = 0;
        vm.prank(payer_);
        vm.expectRevert("Amount can't be 0");
        testGroup.addExpense(payer_, amount_);
    }

    // ********************
    // Split and debts logic
    // ********************

    /**
     * @notice Verifies that split() correctly assigns debts when there is a single creditor.
     * thomas(123456) and camilo(1000) pay. Only thomas ends with positive balance.
     * Expected debts — camilo→thomas: 30114, Jeisson→thomas: 31114, john doe→thomas: 31114.
     */
    function testSplitWorksProperly() external {
        address thomas = testGroup.members(0);
        address camilo = testGroup.members(1);
        address jeisson = testGroup.members(2);
        address johnDoe = testGroup.members(3);

        vm.prank(thomas);
        testGroup.addExpense(thomas, 123456);
        vm.prank(camilo);
        testGroup.addExpense(camilo, 1000);

        vm.prank(jeisson);
        testGroup.split();
        (address from0, address to0, uint256 value0) = testGroup.debts(0);
        assertEq(from0, camilo);
        assertEq(to0, thomas);
        assertEq(value0, 30114);

        (address from1, address to1, uint256 value1) = testGroup.debts(1);
        assertEq(from1, jeisson);
        assertEq(to1, thomas);
        assertEq(value1, 31114);

        (address from2, address to2, uint256 value2) = testGroup.debts(2);
        assertEq(from2, johnDoe);
        assertEq(to2, thomas);
        assertEq(value2, 31114);
    }

    /**
     * @notice Verifies the greedy two-pointer algorithm when there are multiple creditors.
     * thomas(120) and camilo(80) pay → thomas(+70), camilo(+30), Jeisson(-50), john doe(-50).
     * Expected debts — Jeisson→thomas: 50, john doe→thomas: 20, john doe→camilo: 30.
     */
    function testSplitMultipleCreditors() external {
        address thomas = testGroup.members(0);
        address camilo = testGroup.members(1);
        address jeisson = testGroup.members(2);
        address johnDoe = testGroup.members(3);

        vm.prank(thomas);
        testGroup.addExpense(thomas, 120);
        vm.prank(camilo);
        testGroup.addExpense(camilo, 80);
        vm.prank(jeisson);
        testGroup.split();

        (address from0, address to0, uint256 value0) = testGroup.debts(0);
        assertEq(from0, jeisson);
        assertEq(to0, thomas);
        assertEq(value0, 50);

        (address from1, address to1, uint256 value1) = testGroup.debts(1);
        assertEq(from1, johnDoe);
        assertEq(to1, thomas);
        assertEq(value1, 20);

        (address from2, address to2, uint256 value2) = testGroup.debts(2);
        assertEq(from2, johnDoe);
        assertEq(to2, camilo);
        assertEq(value2, 30);
    }

    // ********************
    // payAll tests
    // ********************

    /**
     * @notice Verifies that payAll() zeroes out the caller's debt, transfers ETH
     * to the creditor, and updates the caller's balance to zero.
     * Jeisson owes 50 to thomas and pays it in full.
     */
    function testPayAllWorksProperly() external {
        address thomas = testGroup.members(0);
        address camilo = testGroup.members(1);
        address jeisson = testGroup.members(2);

        vm.prank(thomas);
        testGroup.addExpense(thomas, 120);
        vm.prank(camilo);
        testGroup.addExpense(camilo, 80);

        vm.prank(jeisson);
        testGroup.split();
        // debts[0]: Jeisson → thomas  50
        // debts[1]: john doe → thomas 20
        // debts[2]: john doe → camilo 30

        vm.deal(jeisson, 50);
        vm.prank(jeisson);
        testGroup.payAll{ value: 50 }();

        (,, uint256 value0) = testGroup.debts(0);
        assertEq(value0, 0);
        assertEq(jeisson.balance, 0);
        assertEq(thomas.balance, 50);
        assertEq(testGroup.balances(jeisson), 0);
    }

    /**
     * @notice Verifies that payAll() correctly handles a member with debts to
     * multiple creditors — john doe owes 20 to thomas and 30 to camilo (total 50).
     */
    function testPayAllWorksProperlyForMultipleDebts() external {
        address thomas = testGroup.members(0);
        address camilo = testGroup.members(1);
        address johnDoe = testGroup.members(2);

        vm.prank(thomas);
        testGroup.addExpense(thomas, 120);
        vm.prank(camilo);
        testGroup.addExpense(camilo, 80);

        vm.prank(johnDoe);
        testGroup.split();
        // debts[0]: Jeisson → thomas  50
        // debts[1]: john doe → thomas 20
        // debts[2]: john doe → camilo 30

        vm.deal(johnDoe, 50);
        vm.prank(johnDoe);
        testGroup.payAll{ value: 50 }();

        (,, uint256 value0) = testGroup.debts(0);
        assertEq(value0, 0);
        assertEq(johnDoe.balance, 0);
        assertEq(thomas.balance, 50);
        assertEq(camilo.balance, 0);
        assertEq(testGroup.balances(johnDoe), 0);
    }

    /**
     * @notice Verifies that payAll() reverts when the sent ETH does not match
     * the exact total owed by the caller.
     */
    function testPayAllRevertsIfNotEnoughValue() external {
        address thomas = testGroup.members(0);
        address camilo = testGroup.members(1);
        address johnDoe = testGroup.members(2);

        vm.prank(thomas);
        testGroup.addExpense(thomas, 120);
        vm.prank(camilo);
        testGroup.addExpense(camilo, 80);
        vm.prank(johnDoe);
        testGroup.split();

        vm.deal(johnDoe, 10);
        vm.prank(johnDoe);
        vm.expectRevert("Must send exact debts total");
        testGroup.payAll{ value: 10 }();
    }

    /**
     * @notice Verifies that payAll() reverts when the caller has no outstanding debts,
     * i.e. all their debts were already paid in a previous call.
     */
    function testPayAllRevertNoDebtsToPay() external {
        address thomas = testGroup.members(0);
        address camilo = testGroup.members(1);
        address johnDoe = testGroup.members(2);

        vm.prank(thomas);
        testGroup.addExpense(thomas, 120);
        vm.prank(camilo);
        testGroup.addExpense(camilo, 80);

        vm.prank(johnDoe);
        testGroup.split();
        vm.deal(johnDoe, 100);
        vm.startPrank(johnDoe);
        testGroup.payAll{ value: 50 }();
        vm.expectRevert("no debts to pay");
        testGroup.payAll{ value: 50 }();
    }
}
