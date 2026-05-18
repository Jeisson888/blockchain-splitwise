import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import Link from "next/link";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Debug = () => {
  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-base-100 p-10 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Debug Contracts</h1>
        <p className="text-gray-600 mb-6">
          Esta es una página de ejemplo estática. La funcionalidad de contrato y wallet se quitaron para que puedas ver la interfaz sin errores.
        </p>
        <Link href="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default Debug;
