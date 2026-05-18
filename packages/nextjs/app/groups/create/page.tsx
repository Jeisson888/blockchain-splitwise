"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const CreateGroup = () => {
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

    setTimeout(() => {
      setIsLoading(false);
      alert("Group created successfully! This is a static preview.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="btn btn-ghost btn-circle">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Group</h1>
            <p className="text-sm opacity-80">Static preview only — wallet connection disabled.</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
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

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Group Members</span>
                  <span className="label-text-alt">Ethereum addresses (preview only)</span>
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

              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="font-bold">Important!</h3>
                  <div className="text-xs">
                    <p>• This page is a static UI preview.</p>
                    <p>• No wallet connection is required.</p>
                    <p>• Actual group creation is not implemented yet.</p>
                  </div>
                </div>
              </div>

              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Group..." : "Create Group"}
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
