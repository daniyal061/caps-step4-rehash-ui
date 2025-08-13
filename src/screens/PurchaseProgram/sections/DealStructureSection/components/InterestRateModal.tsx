import React from "react";
import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Input } from "../../../../../components/ui/input";

interface InterestRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: string;
  onSave: (newRate: string) => void;
}

export const InterestRateModal = ({
                                    isOpen,
                                    onClose,
                                    currentRate,
                                    onSave
                                  }: InterestRateModalProps): JSX.Element => {
  const [showComplianceMessage, setShowComplianceMessage] = React.useState(false);
  const [newRate, setNewRate] = React.useState<string>("");
  const [selectedReasons, setSelectedReasons] = React.useState<string[]>([]);
  const [dealerName, setDealerName] = React.useState<string>("");
  const [financeCompanyName, setFinanceCompanyName] = React.useState<string>("");

  // Check the DOM element to determine which modal to show
  React.useEffect(() => {
    if (isOpen) {
      const fixIntRateDlrElement = document.getElementById('step4:fixIntRateDlr') as HTMLInputElement | null;
      const shouldShowCompliance = fixIntRateDlrElement?.value === 'true';
      setShowComplianceMessage(shouldShowCompliance);

      // Read interest rate from two separate elements
      const wholeNumberElement = document.getElementById('step4:interestRateText') as HTMLInputElement | null;
      const fractionElement = document.getElementById('step4:selectInterestRateFraction') as HTMLInputElement | null;

      if (wholeNumberElement && fractionElement) {
        const wholeNumber = wholeNumberElement.value || '0';
        const fraction = fractionElement.value || '00';
        const combinedRate = `${wholeNumber}.${fraction}`;
        setNewRate(combinedRate);
      } else {
        // Fallback to current rate if elements not found
        setNewRate(currentRate.replace('%', ''));
      }
    }
  }, [isOpen]);

  const reasons = [
    "Matched or set lower than the rate offered by another dealer",
    "Matched or set lower than the rate offered by another finance company",
    "Customer stated monthly payment constraint",
    "Customer qualified for a dealership promotional financing due to Autopay"
  ];

  React.useEffect(() => {
    if (isOpen) {
      setSelectedReasons([]);
      setDealerName("");
      setFinanceCompanyName("");
    }
  }, [isOpen]);

  const handleSave = () => {
    const isDealerSelected = selectedReasons.includes("Matched or set lower than the rate offered by another dealer");
    const isFinanceCompanySelected = selectedReasons.includes("Matched or set lower than the rate offered by another finance company");

    const isDealerNameRequired = isDealerSelected && dealerName.trim() === "";
    const isFinanceCompanyNameRequired = isFinanceCompanySelected && financeCompanyName.trim() === "";

    if (newRate.trim() && selectedReasons.length > 0 && !isDealerNameRequired && !isFinanceCompanyNameRequired) {
      onSave(`${newRate}%`);
      onClose();
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace('%', '');
    setNewRate(value);
  };

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons(prev =>
        prev.includes(reason)
            ? prev.filter(r => r !== reason)
            : [...prev, reason]
    );
  };

  const isValidRate = newRate.trim() !== "" && !isNaN(parseFloat(newRate));
  const isDealerSelected = selectedReasons.includes("Matched or set lower than the rate offered by another dealer");
  const isFinanceCompanySelected = selectedReasons.includes("Matched or set lower than the rate offered by another finance company");
  const isDealerNameValid = !isDealerSelected || dealerName.trim() !== "";
  const isFinanceCompanyNameValid = !isFinanceCompanySelected || financeCompanyName.trim() !== "";
  const canSave = isValidRate && isDealerNameValid && isFinanceCompanyNameValid;

  // If compliance message should be shown, render the simple modal
  if (showComplianceMessage) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-[600px] bg-white rounded-2xl shadow-lg p-0 border border-gray-200">
            <DialogHeader className="px-8 py-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Interest Rate
              </DialogTitle>
            </DialogHeader>

            <div className="px-8 pb-8">
              <div className="mb-8">
                <p className="text-base text-gray-900 leading-relaxed mb-6">
                  In order to reduce the interest rate, you must comply with the requirements in Credit Acceptance's Fair Lending Policy available in Funding Manual in CAPS, including completing the Managing Fair Lending Risk training module, certifying your own Fair Lending Compliance Program, appointing a Fair Lending Compliance Coordinator, and documenting a specific legitimate business reason for the rate reduction.
                </p>
                <p className="font-bold text-gray-900 leading-relaxed">
                  Please contact your Market Area Representative to find out more.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    );
  }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[600px] bg-white rounded-2xl shadow-lg p-0 border border-gray-200">
          {/* Header */}
          <DialogHeader className="px-8 py-6 border-b-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Interest Rate
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="px-8 pb-8">
            {/* Enter Rate Section */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Enter rate
              </label>
              <div className="relative">
                <Input
                    type="text"
                    value={`${newRate}%`}
                    onChange={handleRateChange}
                    placeholder="24.49%"
                    className="h-12 px-4 py-3 bg-white rounded-lg border border-gray-300 text-base font-medium text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Reason for Change Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reason for change (required)
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                To improve your compliance with the Equal Opportunity Act, document your good faith,
                competitive reason(s) for reducing the interest rate by checking all that apply:
              </p>

              <div className="space-y-4">
                {reasons.map((reason, index) => (
                    <div key={index} className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id={`reason-${index}`}
                            checked={selectedReasons.includes(reason)}
                            onChange={() => handleReasonToggle(reason)}
                            className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <label
                            htmlFor={`reason-${index}`}
                            className="text-base text-gray-900 leading-relaxed cursor-pointer"
                        >
                          {reason}
                        </label>
                      </div>

                      {/* Conditional input for dealer name */}
                      {reason === "Matched or set lower than the rate offered by another dealer" &&
                          selectedReasons.includes(reason) && (
                              <div className="ml-8">
                                <label className="block text-base font-medium text-gray-900 mb-2">
                                  Competing Dealer Name (required)
                                </label>
                                <Input
                                    type="text"
                                    value={dealerName}
                                    onChange={(e) => setDealerName(e.target.value)}
                                    placeholder="Enter dealer name"
                                    className="h-12 px-4 py-3 bg-white rounded-lg border border-gray-300 text-base"
                                />
                              </div>
                          )}

                      {/* Conditional input for finance company name */}
                      {reason === "Matched or set lower than the rate offered by another finance company" &&
                          selectedReasons.includes(reason) && (
                              <div className="ml-8">
                                <label className="block text-base font-medium text-gray-900 mb-2">
                                  Finance Company Name (required)
                                </label>
                                <Input
                                    type="text"
                                    value={financeCompanyName}
                                    onChange={(e) => setFinanceCompanyName(e.target.value)}
                                    placeholder="Enter finance company name"
                                    className="h-12 px-4 py-3 bg-white rounded-lg border border-gray-300 text-base"
                                />
                              </div>
                          )}
                    </div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <Button
                onClick={handleSave}
                disabled={!canSave}
                className={`w-full h-12 text-base font-medium rounded-lg transition-colors ${
                    canSave
                        ? "bg-[#0a293b] text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
};