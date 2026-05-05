import { ThemeProvider } from "~~/components/ThemeProvider";
import { ClientScaffoldEthAppWithProviders } from "~~/components/ClientScaffoldEthAppWithProviders";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "SplitPay Web3",
  description: "Split expenses and settle debts using Ethereum blockchain",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ClientScaffoldEthAppWithProviders>{children}</ClientScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
