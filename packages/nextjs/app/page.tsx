import Link from "next/link";

const groups = [
  {
    name: "Vacation Split",
    members: 4,
    balance: "0.24 ETH",
    link: "/groups/1",
  },
  {
    name: "Dinner with Friends",
    members: 3,
    balance: "0.05 ETH",
    link: "/groups/2",
  },
  {
    name: "House Utilities",
    members: 5,
    balance: "0.12 ETH",
    link: "/groups/3",
  },
];

const Home = () => {
  return (
    <div className="bg-base-200 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
        <section className="rounded-3xl bg-base-100 p-8 shadow-lg">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">SplitPay Web3</h1>
            <p className="text-lg text-gray-600">
              Esta es una vista estática de la aplicación. Más adelante podrás conectar wallets y usar contratos, pero por ahora puedes ver cómo queda la interfaz.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-base-100 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Resumen</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-secondary/10 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Tú debes</p>
                <p className="mt-3 text-3xl font-bold text-error">0.00 ETH</p>
              </div>
              <div className="rounded-2xl bg-secondary/10 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Te deben</p>
                <p className="mt-3 text-3xl font-bold text-success">0.00 ETH</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-base-100 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Acciones rápidas</h2>
            <div className="flex flex-col gap-3">
              <Link href="/groups/create" className="btn btn-primary w-full text-base font-semibold">
                Crear nuevo grupo
              </Link>
              <button className="btn btn-outline w-full text-base font-semibold" disabled>
                Unirse a grupo (próximamente)
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-base-100 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Grupos de ejemplo</h2>
              <p className="text-sm text-gray-500">Datos estáticos para que veas el resultado.</p>
            </div>
            <Link href="/groups/create" className="btn btn-sm btn-secondary">
              Crear grupo
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {groups.map(group => (
              <div key={group.name} className="rounded-3xl border border-base-200 bg-base-200 p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">{group.name}</h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{group.members} miembros</span>
                </div>
                <p className="text-gray-600 mb-4">Balance aproximado</p>
                <p className="text-3xl font-bold">{group.balance}</p>
                <Link href={group.link} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Ver detalles →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
