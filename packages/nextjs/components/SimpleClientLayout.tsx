"use client";

import { ReactNode } from "react";
import { Header } from "~~/components/Header";
import { Footer } from "~~/components/Footer";

export const SimpleClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="relative flex flex-col flex-1">{children}</main>
      <Footer />
    </div>
  );
};
