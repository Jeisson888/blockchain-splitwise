"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";

const CreateGroup = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);

  const addMember = () => {
    setMembers([...members, ""]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement group creation with smart contract
    // For now, just simulate and redirect
    setTimeout(() => {
      alert("Group created successfully! (This is a placeholder)");
      router.push("/");
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-2xl mb-4">Connect Your Wallet</h2>
            <p className="mb-6">You need to connect your wallet to create a group</p>
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost btn-circle"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold">Create New Group</h1>
        </div>

        {/* Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Group Name */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Group Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Weekend Trip, Roommates"
                  className="input input-bordered"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>

              {/* Members */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Group Members</span>
                  <span className="label-text-alt">Ethereum addresses</span>
                </label>

                {members.map((member, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="0x..."
                      className="input input-bordered flex-1"
                      value={member}
                      onChange={(e) => updateMember(index, e.target.value)}
                      required
                    />
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="btn btn-outline btn-error"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMember}
                  className="btn btn-outline btn-sm mt-2"
                >
                  Add Member
                </button>
              </div>

              {/* Info */}
              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="font-bold">Important!</h3>
                  <div className="text-xs">
                    <p>• All members must have valid Ethereum addresses</p>
                    <p>• You will be automatically added as a member</p>
                    <p>• Group creation requires a blockchain transaction</p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Group...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;