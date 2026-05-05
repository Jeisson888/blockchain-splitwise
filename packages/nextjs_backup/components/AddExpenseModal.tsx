"use client";

import { useState } from "react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  members: Array<{ address: string; balance: number }>;
}

const AddExpenseModal = ({ isOpen, onClose, groupId, members }: AddExpenseModalProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement expense creation with smart contract
    // For now, just simulate
    setTimeout(() => {
      alert("Expense added successfully! (This is a placeholder)");
      setDescription("");
      setAmount("");
      setSelectedMembers([]);
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  const toggleMember = (address: string) => {
    setSelectedMembers(prev =>
      prev.includes(address)
        ? prev.filter(m => m !== address)
        : [...prev, address]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-4">Add New Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Dinner at restaurant"
              className="input input-bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Amount (ETH)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="input input-bordered"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Split between</span>
            </label>
            <div className="max-h-32 overflow-y-auto border rounded-lg p-2">
              {members.map((member, index) => (
                <label key={index} className="flex items-center gap-2 p-1 cursor-pointer hover:bg-base-200 rounded">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedMembers.includes(member.address)}
                    onChange={() => toggleMember(member.address)}
                  />
                  <span className="text-sm font-mono">{member.address}</span>
                </label>
              ))}
            </div>
            {selectedMembers.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Amount per person: {(parseFloat(amount) / selectedMembers.length || 0).toFixed(4)} ETH
              </p>
            )}
          </div>

          <div className="alert alert-info mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-xs">
              This will create a blockchain transaction to record the expense
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !description || !amount || selectedMembers.length === 0}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                'Add Expense'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;