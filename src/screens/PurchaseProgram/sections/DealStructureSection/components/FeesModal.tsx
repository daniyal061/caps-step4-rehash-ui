import React from "react";
import { Button } from "../../../../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../../../../components/ui/dialog";
import { Input } from "../../../../../components/ui/input";
import { CurrencyInput } from "../../../../../components/ui/currency-input";

interface FeeItem {
    name: string;
    amount: number;
    vendorName?: string;
    hasAmountInput: boolean;
    hasVendorInput: boolean;
    maxAmount?: number;
    isReadOnly?: boolean;
    domId?: string; // Add DOM element ID for saving
    vendorDomId?: string; // Add vendor DOM element ID for saving
}

interface FeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (totalFees: number, feeItems: FeeItem[]) => void;
}

// Helper function to safely get DOM element value
const getDOMValue = (id: string, defaultValue: string = ''): string => {
    const element = document.getElementById(id) as HTMLInputElement | null;
    return element?.value || defaultValue;
};

// Helper function to parse number from DOM value
const parseNumber = (value: string, defaultValue: number = 0): number => {
    const parsed = parseFloat(value.replace(/[,$]/g, ''));
    return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to update DOM element value
const updateDOMValue = (id: string, value: string | number) => {
    const element = document.getElementById(id) as HTMLInputElement | null;
    if (element) {
        element.value = value.toString();
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }
};

export const FeesModal = ({
                              isOpen,
                              onClose,
                              onSave
                          }: FeesModalProps): JSX.Element => {
    const [feeItems, setFeeItems] = React.useState<FeeItem[]>([]);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Load fee data from hidden fields when modal opens
    React.useEffect(() => {
        if (isOpen) {
            // Get fee values from the actual form fields
            const titleFeeAmountDirect = parseNumber(getDOMValue('step4:titleFeeAmountDirect'), 9);
            const titleFeeVendorName = getDOMValue('step4:titleFeeVendorName', '');
            const titleFeeVendorNameDirect = getDOMValue('step4:titleFeeVendorNameDirect', '');
            
            const cvrElectronicFilingFeeAmount = parseNumber(getDOMValue('step4:cvrElectronicFilingFeeAmount'), 9);
            const cvrElectronicFilingFeeVendorName = getDOMValue('step4:cvrElectronicFilingFeeVendorName', '');
            
            const lienFilingFeeAmount = parseNumber(getDOMValue('step4:lienFilingFeeAmount'), 9);
            const lienFilingFeeVendorName = getDOMValue('step4:lienFilingFeeVendorName', 'MI DMV corp');
            
            const registrationFeeAmount = parseNumber(getDOMValue('step4:registrationFeeAmount'), 9);
            const registrationFeeVendorName = getDOMValue('step4:registrationFeeVendorName', '');
            
            const docFeeAmount = parseNumber(getDOMValue('step4:docFeeAmount'), 9);
            const docFeeVendorName = getDOMValue('step4:docFeeVendorName', '');
            
            const totalCustomerFeesAmount = parseNumber(getDOMValue('step4:totalCustomerFeesAmount'), 9);

            const updatedFeeItems: FeeItem[] = [
                {
                    name: "Title",
                    amount: titleFeeAmountDirect,
                    vendorName: titleFeeVendorName || titleFeeVendorNameDirect,
                    hasAmountInput: true,
                    hasVendorInput: false,
                    maxAmount: 15.00,
                    domId: 'step4:titleFeeAmountDirect',
                    vendorDomId: 'step4:titleFeeVendorNameDirect'
                },
                {
                    name: "CVR Electronic Filing Fee",
                    amount: cvrElectronicFilingFeeAmount,
                    vendorName: cvrElectronicFilingFeeVendorName,
                    hasAmountInput: true,
                    hasVendorInput: false,
                    maxAmount: 24.00,
                    domId: 'step4:cvrElectronicFilingFeeAmount',
                    vendorDomId: 'step4:cvrElectronicFilingFeeVendorName'
                },
                {
                    name: "Lien Filing Fee",
                    amount: lienFilingFeeAmount,
                    vendorName: lienFilingFeeVendorName,
                    hasAmountInput: false,
                    hasVendorInput: true,
                    isReadOnly: true,
                    domId: 'step4:lienFilingFeeAmount',
                    vendorDomId: 'step4:lienFilingFeeVendorName'
                },
                {
                    name: "Registration",
                    amount: registrationFeeAmount,
                    vendorName: registrationFeeVendorName,
                    hasAmountInput: true,
                    hasVendorInput: false,
                    domId: 'step4:registrationFeeAmount',
                    vendorDomId: 'step4:registrationFeeVendorName'
                },
                {
                    name: "Doc Fee",
                    amount: docFeeAmount,
                    vendorName: docFeeVendorName,
                    hasAmountInput: false,
                    hasVendorInput: false,
                    isReadOnly: true,
                    domId: 'step4:docFeeAmount',
                    vendorDomId: 'step4:docFeeVendorName'
                }
            ];

            setFeeItems(updatedFeeItems);
        }
    }, [isOpen]);

    const handleAmountChange = (index: number, value: string | number) => {
        const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[,$]/g, '')) || 0;
        const updatedItems = [...feeItems];
        updatedItems[index].amount = numericValue;
        setFeeItems(updatedItems);

        // Validate against max amount if it exists
        const newErrors = { ...errors };
        const item = updatedItems[index];

        if (item.maxAmount && numericValue > item.maxAmount) {
            newErrors[item.name] = `${item.name.toUpperCase()} cannot be greater than $${item.maxAmount.toFixed(2)}`;
        } else {
            delete newErrors[item.name];
        }

        setErrors(newErrors);
    };

    const handleVendorChange = (index: number, value: string) => {
        const updatedItems = [...feeItems];
        updatedItems[index].vendorName = value;
        setFeeItems(updatedItems);
    };

    const totalFees = feeItems.reduce((sum, item) => sum + item.amount, 0);
    const hasErrors = Object.keys(errors).length > 0;

    const handleApply = () => {
        if (!hasErrors) {
            // Save individual fee amounts to DOM elements
            feeItems.forEach((item) => {
                if (item.domId) {
                    updateDOMValue(item.domId, item.amount);
                }
                if (item.vendorDomId && item.vendorName) {
                    updateDOMValue(item.vendorDomId, item.vendorName);
                }
            });

            // Update total fees
            updateDOMValue('step4:totalCustomerFeesAmount', totalFees);

            // Call the onSave callback with both total fees and individual fee items
            onSave(totalFees, feeItems);

            // Find and click the update callback button:
            const jsfButton = document.getElementById('submitDealForm:updateCallbackButton') as HTMLButtonElement;
                           if (jsfButton) {
                             jsfButton.click();
                           }

            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[900px] max-h-[90vh] bg-white rounded-2xl shadow-lg p-0 border border-gray-200 flex flex-col">
                <DialogHeader className="px-8 py-6 border-b border-gray-200">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Fees
                    </DialogTitle>
                </DialogHeader>

                <div className="px-8 pb-8 flex-1 overflow-hidden flex flex-col">
                    {/* Table Header */}
                    <div className="bg-gray-200 rounded-t-lg">
                        <div className="grid grid-cols-3 gap-4 px-6 py-4">
                            <div className="font-semibold text-gray-900">Item</div>
                            <div className="font-semibold text-gray-900 text-center">Amount</div>
                            <div className="font-semibold text-gray-900 text-center">Vendor Name</div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="border border-gray-200 rounded-b-lg flex-1 overflow-y-auto">
                        {feeItems.map((item, index) => (
                            <div key={index} className={`${index !== feeItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <div className="grid grid-cols-3 gap-4 px-6 py-4">
                                    {/* Item Name */}
                                    <div className="font-medium text-gray-900 flex items-center">
                                        {item.name}
                                    </div>

                                    {/* Amount */}
                                    <div className="flex items-center justify-center">
                                        {item.hasAmountInput ? (
                                            <CurrencyInput
                                                value={item.amount}
                                                onChange={(value) => handleAmountChange(index, value)}
                                                className="h-10 text-center rounded-md border-gray-300 text-sm"
                                            />
                                        ) : (
                                            <span className="text-gray-900 font-medium">
                        ${item.amount.toFixed(2)}
                      </span>
                                        )}
                                    </div>

                                    {/* Vendor Name */}
                                    <div className="flex items-center justify-center">
                                        {item.hasVendorInput ? (
                                            <Input
                                                type="text"
                                                value={item.vendorName || ""}
                                                onChange={(e) => handleVendorChange(index, e.target.value)}
                                                className="h-10 rounded-md border-gray-300 text-sm"
                                                placeholder="Enter vendor name"
                                            />
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </div>
                                </div>

                                {/* Error Message */}
                                {errors[item.name] && (
                                    <div className="px-6 pb-4">
                                        <p className="text-red-600 text-sm font-medium">
                                            {errors[item.name]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Apply Button */}
                    <Button
                        onClick={handleApply}
                        disabled={hasErrors}
                        className={`w-full h-12 mt-6 text-base font-medium rounded-lg transition-colors flex-shrink-0 ${
                            hasErrors
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#2c5282] hover:bg-[#2a4f7a] text-white"
                        }`}
                    >
                        Apply
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};