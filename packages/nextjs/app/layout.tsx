import { SimpleClientLayout } from "~~/components/SimpleClientLayout";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "SplitPay Web3",
  description: "Split expenses and settle debts using Ethereum blockchain",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <SimpleClientLayout>{children}</SimpleClientLayout>
      </body>
    </html>
  );
};

export default RootLayout;
