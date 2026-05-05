# SplitPay Web3

SplitPay Web3 es una aplicación web que permite a los usuarios dividir gastos compartidos y saldar deudas utilizando tecnología blockchain (Ethereum). Los usuarios conectan su wallet (MetaMask), registran gastos y realizan pagos directamente entre ellos mediante smart contracts, sin intermediarios.

## Descripción General

- **Objetivo**: Simplificar la gestión de gastos compartidos y garantizar transparencia
- **Usuarios**: Personas que comparten gastos (amigos, compañeros de piso, viajes)
- **Tecnología**: Ethereum blockchain con smart contracts

## Funcionalidades Principales

### Conexión de Wallet
- Botón para conectar wallet (MetaMask)
- Mostrar dirección conectada
- Estado de conexión (conectado / desconectado)

### Dashboard
- Lista de grupos del usuario
- Resumen de balances:
  - Total que debe el usuario
  - Total que le deben al usuario
- Botón para crear grupo

### Gestión de Grupos
- Crear grupo con nombre
- Añadir participantes (direcciones de wallet)
- Ver detalles del grupo:
  - Miembros
  - Balance individual

### Creación de Gastos
- Introducir monto total
- Seleccionar participantes involucrados
- Descripción opcional
- Cálculo automático del gasto dividido
- Generación de deudas entre usuarios

### Visualización de Deudas
- Mostrar deudas de forma clara
- Indicadores de estado (Pendiente/Pagado)

### Pago de Deudas
- Botón "Pagar"
- Modal de confirmación con monto y gas estimado
- Firma de transacción mediante wallet
- Actualización del estado tras confirmación

## Requisitos

Antes de comenzar, necesitas instalar las siguientes herramientas:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Foundryup](https://book.getfoundry.sh/getting-started/installation)

> **Nota para usuarios de Windows**: Foundryup no es compatible actualmente con Powershell o Cmd, y tiene problemas con Git Bash. Necesitarás usar [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) como terminal.

## Inicio Rápido

Para comenzar con SplitPay Web3, sigue estos pasos:

1. Instala las dependencias

```
yarn install && forge install --root packages/foundry
```

2. Ejecuta una red local en la primera terminal:

```
yarn chain
```

3. En una segunda terminal, despliega los contratos:

```
yarn deploy
```

4. En una tercera terminal, inicia la aplicación frontend:

```
cd packages/nextjs
yarn dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Estructura del Proyecto

```
packages/
├── foundry/          # Smart contracts con Foundry
│   ├── contracts/    # Contratos Solidity
│   ├── script/       # Scripts de despliegue
│   └── test/         # Tests de contratos
├── nextjs/           # Frontend con Next.js
│   ├── app/          # Páginas y rutas
│   ├── components/   # Componentes React
│   └── hooks/        # Hooks personalizados
└── hardhat/          # Configuración Hardhat (legacy)
```

## Contratos Inteligentes

- **Group.sol**: Gestiona grupos y balances de miembros
- **RegistryGroups.sol**: Registry para crear y gestionar grupos

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, DaisyUI
- **Wallet**: RainbowKit, Wagmi
- **Blockchain**: Ethereum, Foundry
- **UI/UX**: Diseño minimalista y centrado en la usabilidad

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
