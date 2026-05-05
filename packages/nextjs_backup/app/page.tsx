"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";

const Home = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const router = useRouter();
  const [groups, setGroups] = useState<string[]>([]);

  const handleCreateGroup = () => {
    router.push("/groups/create");
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-2xl mb-4">Welcome to SplitPay Web3</h2>
            <p className="mb-6">Connect your wallet to start splitting expenses with friends</p>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">SplitPay Web3</h1>
          <div className="flex items-center gap-4">
            <Address address={connectedAddress} />
            <RainbowKitCustomConnectButton />
          </div>
        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Balance Summary */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Balance Summary</h2>
              <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">You Owe</div>
                  <div className="stat-value text-error">0.00 ETH</div>
                </div>
                <div className="stat">
                  <div className="stat-title">You Are Owed</div>
                  <div className="stat-value text-success">0.00 ETH</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <button className="btn btn-primary w-full mb-2" onClick={handleCreateGroup}>
                Create New Group
              </button>
              <button className="btn btn-outline w-full">
                Join Existing Group
              </button>
            </div>
          </div>
        </div>

        {/* Groups */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Your Groups</h2>
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No groups yet</p>
                <button className="btn btn-primary" onClick={handleCreateGroup}>
                  Create Your First Group
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group, index) => (
                  <div key={index} className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer" onClick={() => router.push(`/groups/${index + 1}`)}>
                    <div className="card-body">
                      <h3 className="card-title text-lg">{group}</h3>
                      <p className="text-sm">Members: 3</p>
                      <p className="text-sm">Your balance: 0.00 ETH</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); router.push(`/groups/${index + 1}`); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
