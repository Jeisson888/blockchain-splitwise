import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-base-100 border-t border-base-200 py-6">
      <div className="mx-auto flex flex-col gap-3 px-4 text-center text-sm text-gray-600 lg:max-w-6xl lg:flex-row lg:justify-between lg:text-left">
        <div>
          <p className="font-medium">SplitPay Web3</p>
          <p>Interfaz de ejemplo estática para revisar el diseño.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="link">
            Home
          </Link>
          <Link href="/debug" className="link">
            Debug Contracts
          </Link>
          <a href="https://github.com/scaffold-eth/se-2" target="_blank" rel="noreferrer" className="link">
            Fork me
          </a>
        </div>
      </div>
    </footer>
  );
};
