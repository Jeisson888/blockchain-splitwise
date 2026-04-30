# Block Splitter

On chain application for tracking expenses and split those in equals parts for groups of people with the feature to pay using tokens or stablecoins.

> Note: Using Scaffold Eth structure with Foundry.

## Functionality
1. Create or join to any kind of groups that are gonna have expenses.
2. Register a Expense for all the participants of the group.
  -Stablish the ones that are included for every expense.
3. Split and sum balances of debt.
4. Stablish the doubt an the person to pay for it.
5. Voting system at the moment of getting totals to request review.
5. Perform the payment (Swap if it is necessary deventind of the currency).

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Foundryup](https://book.getfoundry.sh/getting-started/installation)

> **Note for Windows users**. Foundryup is not currently supported by Powershell or Cmd, and has issues with Git Bash. You will need to use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) as your terminal.

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone -b foundry https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install && forge install --root packages/foundry
```

2. Run a local network in the first terminal:

```
yarn chain
```

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

## Deploying to Live Networks

### Deployment Commands

<details open>
<summary>Understanding deployment scripts structure</summary>

Scaffold-ETH 2 uses two types of deployment scripts in `packages/foundry/script`:

1. `Deploy.s.sol`: Main deployment script that runs all contracts sequentially
2. Individual scripts (e.g., `DeployYourContract.s.sol`): Deploy specific contracts

Each script inherits from `ScaffoldETHDeploy` which handles:

- Deployer account setup and funding
- Contract verification preparation
- Exporting ABIs and addresses to the frontend
</details>

<details open>
<summary>Basic deploy commands</summary>
  
  
1. Deploy to a network (uses `Deploy.s.sol`):

```bash
yarn deploy --network <network-name>
```

2. Deploy specific contract:

```bash
yarn deploy --network <network-name> --file DeployYourContract.s.sol
```

This will use the `DeployYourContract.s.sol` script to deploy the contract.

</details>

<details>
<summary>Environment-specific behavior</summary>

**Local Development (`yarn chain`)**:

- No password needed for deployment if `LOCALHOST_KEYSTORE_ACCOUNT=scaffold-eth-default` is set in `.env` file.
- Uses Anvil's Account #9 as default keystore account
- Update `LOCALHOST_KEYSTORE_ACCOUNT` in `.env` to use a different keystore account for deployment

**Live Networks**:

- Requires custom keystore (see "Creating new deployments" below)
- Will prompt for keystore password

</details>

<details>
<summary>Creating new deployments</summary>

1. Create your contract in `packages/foundry/contracts`
2. Create deployment script in `packages/foundry/script` (use existing scripts as templates)
3. Add to main `Deploy.s.sol` if needed
4. Deploy using commands above
</details>

### Generate/Import keystore account

<details>
<summary>Option 1: Generate new account</summary>

```
yarn generate
```

This creates a `scaffold-eth-custom` [keystore](https://book.getfoundry.sh/reference/cli/cast/wallet#cast-wallet) in `~/.foundry/keystores/scaffold-eth-custom` account.

</details>

<details>
<summary>Option 2: Import existing private key</summary>

```
yarn account:import
```

</details>

View your account status:

```
yarn account
```

This will ask you to select [keystore](https://book.getfoundry.sh/reference/cli/cast/wallet#cast-wallet) present `~/.foundry/keystores` and show you the balance of selected account on network configured in `packages/foundry/foundry.toml`.

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
