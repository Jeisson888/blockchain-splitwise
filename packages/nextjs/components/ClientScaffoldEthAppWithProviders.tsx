"use client";

import { ReactNode } from "react";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";

export const ClientScaffoldEthAppWithProviders = ({ children }: { children: ReactNode }) => {
  return <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>;
};
