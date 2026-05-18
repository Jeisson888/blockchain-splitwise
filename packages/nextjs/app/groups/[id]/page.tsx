import Link from "next/link";
import { ArrowLeftIcon, PlusIcon, UsersIcon } from "@heroicons/react/24/outline";

type GroupDetailsPageProps = {
  params: {
    id: string;
  };
};

const GroupDetails = ({ params }: GroupDetailsPageProps) => {
  const groupId = params.id;
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

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="btn btn-ghost btn-circle">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
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
                      <span className="font-medium">{member.address}</span>
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
                  <button className="btn btn-primary btn-sm">
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
                                Paid by {expense.paidBy}
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
                          <span className="font-medium">{member.address}</span>
                          <p className="text-sm text-error">owes you</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-error">
                            {Math.abs(member.balance).toFixed(2)} ETH
                          </p>
                          <button className="btn btn-sm btn-error mt-1">
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

      </div>
    </div>
  );
};

export default GroupDetails;