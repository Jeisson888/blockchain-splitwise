# blockchain-splitwise — Foundry package

## Project overview

On-chain Splitwise clone. Uses a factory pattern: `RegistryGroups` deploys individual `Group` contracts. Each group tracks member balances, computes debts via a greedy two-pointer algorithm, and handles ETH payments.

## Contract architecture

```
RegistryGroups (factory + registry)
  └── deploys Group instances
  └── holds one shared Utils instance (passed to every Group)

Group (per-group logic)
  ├── addExpense(payer, amount)  — any member can record
  ├── split()                   — recomputes debts from current balances
  ├── payAll()                  — pays all caller's debts in one tx (exact ETH required)
  └── stubs: addMember, pay, leaveGroup, dissolveGroup

Utils (stateless helpers, deployed once by RegistryGroups)
  └── abs(int256) → uint256
  └── isSorted / isSortedDesc
```

## Key design decisions

- **Balances are `int256`**: positive = creditor (owed money), negative = debtor (owes money).
- **Sorting is off-chain**: `split()` → `getDebts()` assumes debtors and creditors arrays are sorted descending by absolute balance. The caller is responsible for this ordering. On-chain sorting was explicitly deferred.
- **`Utils` is shared**: `RegistryGroups` deploys `Utils` once and passes `address(utils)` to every `Group` constructor. Groups must NOT deploy their own `Utils`.
- **Integer division rounding**: `amount / totalMembers` truncates. The remainder stays with the payer (standard splitwise rounding — no wei is lost to the contract).
- **`addExpense` access**: `onlyMember` — any member of the group may record an expense on behalf of any other member.
- **`payAll` requires exact ETH**: `msg.value` must equal the exact total owed. Partial payments are not supported in V1.

## Testing conventions

- Test file: `test/Splitter.t.sol`
- 4 members in setUp: `thomas`=members(0), `camilo`=members(1), `Jeisson`=members(2), `john doe`=members(3)
- **Always declare address variables before `vm.prank`**: calling `testGroup.members(X)` is an external call that consumes the active prank. Store addresses in locals first, then prank.
  ```solidity
  // WRONG — prank consumed by members(0)
  vm.prank(testGroup.members(0));
  testGroup.addExpense(testGroup.members(0), 100);

  // CORRECT
  address thomas = testGroup.members(0);
  vm.prank(thomas);
  testGroup.addExpense(thomas, 100);
  ```
- `split()` has `onlyMember` — always prank as a member before calling it in tests.
- `script/` is excluded from `forge coverage` via `no_match_coverage = "script/.*"` in `foundry.toml`.

## Commands

```bash
forge test                  # run all tests
forge test -vvv             # verbose (shows traces on failure)
forge coverage              # coverage report (scripts excluded)
forge build                 # compile
```

## Pending TODOs (V1 scope — do not implement without discussion)

- `addMember(address)` — add member to existing group + notify registry
- `pay(uint256 index)` — pay a single specific debt by index
- `leaveGroup()` — exit group if balance is zero
- `dissolveGroup()` — disband group (requires all balances = 0, creator or unanimous)
- Fuzz testing for `addExpense` and `split()`
- On-chain sorting (currently caller responsibility)
