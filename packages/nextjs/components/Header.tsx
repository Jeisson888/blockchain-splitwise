"use client";

import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 z-20 bg-base-100 border-b border-base-200 shadow-sm">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 lg:max-w-6xl">
        <div>
          <Link href="/" className="text-xl font-bold">
            SplitPay Web3
          </Link>
          <p className="text-sm text-gray-500">Interfaz de ejemplo sin conexión a wallets</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          <Link href="/" className="btn btn-ghost btn-sm">
            Home
          </Link>
          <Link href="/debug" className="btn btn-ghost btn-sm">
            Debug Contracts
          </Link>
        </nav>
      </div>
    </header>
  );
};
