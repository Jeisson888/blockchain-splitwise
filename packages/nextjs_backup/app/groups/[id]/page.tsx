"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ArrowLeftIcon, PlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import AddExpenseModal from "~~/components/AddExpenseModal";
import PaymentModal from "~~/components/PaymentModal";

const GroupDetails = () => {
  const { id } = useParams();
  const { address: connectedAddress, isConnected } = useAccount();
  const router = useRouter();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    debtor: string;
    amount: number;
    description?: string;
  } | null>(null);

  // Mock data - replace with actual contract data
  const groupData = {
    name: "Weekend Trip",
    members: [
      { address: "0x1234...5678", balance: 0.5 },
      { address: "0x5678...9012", balance: -0.3 },
      { address: "0x9012...3456", balance: -0.2 },
    ],
    expenses: [
      {
        id: 1,
        description: "Hotel booking",
        amount: 1.0,
        paidBy: "0x1234...5678",
        date: "2024-01-15",
      },
    ],
  };

  const handleAddExpense = () => {
    setShowAddExpense(true);
  };

  const handlePayment = (debtor: string, amount: number) => {
    setPaymentData({ debtor, amount, description: "Group expense settlement" });
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-2xl mb-4">Connect Your Wallet</h2>
            <p className="mb-6">You need to connect your wallet to view group details</p>
            <div className="card-actions justify-center">
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost btn-circle"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold">{groupData.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <UsersIcon className="h-5 w-5" />
                  Members ({groupData.members.length})
                </h2>
                <div className="space-y-3">
                  {groupData.members.map((member, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <Address address={member.address as `0x${string}`} />
                      <span
                        className={`font-semibold ${
                          member.balance > 0
                            ? "text-success"
                            : member.balance < 0
                            ? "text-error"
                            : "text-base-content"
                        }`}
                      >
                        {member.balance > 0 ? "+" : ""}
                        {member.balance.toFixed(2)} ETH
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Expenses and Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Expense Button */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <h2 className="card-title">Group Expenses</h2>
                  <button
                    onClick={handleAddExpense}
                    className="btn btn-primary btn-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Expense
                  </button>
                </div>

                {/* Expenses List */}
                <div className="space-y-3">
                  {groupData.expenses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No expenses yet
                    </div>
                  ) : (
                    groupData.expenses.map((expense) => (
                      <div key={expense.id} className="card bg-base-200">
                        <div className="card-body p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{expense.description}</h3>
                              <p className="text-sm text-gray-600">
                                Paid by <Address address={expense.paidBy as `0x${string}`} />
                              </p>
                              <p className="text-xs text-gray-500">{expense.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{expense.amount} ETH</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Debts Summary */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Outstanding Debts</h2>
                <div className="space-y-3">
                  {groupData.members
                    .filter((member) => member.balance < 0)
                    .map((member, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-error/10 rounded-lg">
                        <div>
                          <Address address={member.address as `0x${string}`} />
                          <p className="text-sm text-error">owes you</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-error">
                            {Math.abs(member.balance).toFixed(2)} ETH
                          </p>
                          <button
                            className="btn btn-sm btn-error mt-1"
                            onClick={() => handlePayment(member.address, Math.abs(member.balance))}
                          >
                            Request Payment
                          </button>
                        </div>
                      </div>
                    ))}
                  {groupData.members.filter((member) => member.balance < 0).length === 0 && (
                    <p className="text-center text-gray-500 py-4">No outstanding debts!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        <AddExpenseModal
          isOpen={showAddExpense}
          onClose={() => setShowAddExpense(false)}
          groupId={id as string}
          members={groupData.members}
        />

        {/* Payment Modal */}
        <PaymentModal
          isOpen={!!paymentData}
          onClose={() => setPaymentData(null)}
          debtor={paymentData?.debtor || ""}
          amount={paymentData?.amount || 0}
          description={paymentData?.description}
        />
      </div>
    </div>
  );
};

export default GroupDetails;