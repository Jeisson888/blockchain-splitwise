"use client";

import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtor: string;
  amount: number;
  description?: string;
}

const PaymentModal = ({ isOpen, onClose, debtor, amount, description }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);

    // TODO: Implement payment with smart contract
    // For now, simulate transaction
    setTimeout(() => {
      setTxHash("0x1234567890abcdef...");
      setIsLoading(false);
    }, 3000);
  };

  const handleClose = () => {
    setTxHash(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {!txHash ? (
          <>
            <h3 className="font-bold text-lg mb-4">Confirm Payment</h3>

            <div className="bg-base-200 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Amount:</span>
                <span className="font-bold text-lg">{amount.toFixed(4)} ETH</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">To:</span>
                <span className="font-mono text-sm">{debtor}</span>
              </div>
              {description && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">For:</span>
                  <span className="text-sm">{description}</span>
                </div>
              )}
            </div>

            <div className="alert alert-warning mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div className="text-xs">
                <p>This action cannot be undone. Make sure you want to pay this amount.</p>
                <p className="mt-1">Estimated gas fee: ~0.001 ETH</p>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                  </>
                ) : (
                  `Pay ${amount.toFixed(4)} ETH`
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-bold text-lg mb-4 text-success">Payment Successful!</h3>

            <div className="bg-success/10 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-success shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-semibold text-success">Transaction completed</span>
              </div>
              <p className="text-sm mb-2">Transaction Hash:</p>
              <p className="font-mono text-xs bg-base-300 p-2 rounded break-all">{txHash}</p>
            </div>

            <div className="modal-action">
              <button onClick={handleClose} className="btn btn-primary">
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;