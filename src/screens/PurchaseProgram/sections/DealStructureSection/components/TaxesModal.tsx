import React from "react";
import { Button } from "../../../../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../../../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../components/ui/select";

interface TaxItem {
    taxMethodPk: string;
    taxableItemName: string;
    taxableAmount: number;
    selectedTaxMethod: string;
    taxMethodTypeDetailsWO: string;
    taxAmount: number;
    taxMethodTypeReadOnly?: boolean;
}

interface TaxMethodOption {
    disabled: boolean;
    label: string;
    value: string;
    escape: boolean;
    noSelectionOption: boolean;
}

interface TaxesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (totalTaxes: number) => void;
}

export const TaxesModal = ({
                               isOpen,
                               onClose,
                               onSave,
                           }: TaxesModalProps): JSX.Element => {
    // const [taxItems, setTaxItems] = React.useState<TaxItem[]>([
    //     {
    //         taxableItemName: "Total Selling Price",
    //         taxableAmount: 18000.0,
    //         taxMethodTypeDetailsWO: "7.50000% in Tax",
    //         taxAmount: 1350.0,
    //         taxMethodTypeReadOnly: false,
    //         taxMethodPk: "1",
    //         selectedTaxMethod: "7.50000% in Tax",
    //     },
    //     {
    //         taxableItemName: "Title",
    //         taxableAmount: 15.0,
    //         taxMethodTypeDetailsWO: "0% Tax Rate",
    //         taxAmount: 0.0,
    //         taxMethodTypeReadOnly: true,
    //         taxMethodPk: "2",
    //         selectedTaxMethod: "0% Tax Rate",
    //     },
    //     {
    //         taxableItemName: "CVR Electronic Filing Fee",
    //         taxableAmount: 24.0,
    //         taxMethodTypeDetailsWO: "0% Tax Rate",
    //         taxAmount: 0.0,
    //         taxMethodTypeReadOnly: true,
    //         taxMethodPk: "3",
    //         selectedTaxMethod: "0% Tax Rate",
    //     },
    //     {
    //         taxableItemName: "Lien Filing Fee",
    //         taxableAmount: 1.0,
    //         taxMethodTypeDetailsWO: "0% Tax Rate",
    //         taxAmount: 0.0,
    //         taxMethodTypeReadOnly: true,
    //         taxMethodPk: "4",
    //         selectedTaxMethod: "0% Tax Rate",
    //     },
    //     {
    //         taxableItemName: "Registration",
    //         taxableAmount: 500.0,
    //         taxMethodTypeDetailsWO: "0% Tax Rate",
    //         taxAmount: 0.0,
    //         taxMethodTypeReadOnly: true,
    //         taxMethodPk: "5",
    //         selectedTaxMethod: "0% Tax Rate",
    //     },
    //     {
    //         taxableItemName: "Doc Fee",
    //         taxableAmount: 280.0,
    //         taxMethodTypeDetailsWO: "6.0% MI State Sales Tax",
    //         taxAmount: 16.8,
    //         taxMethodTypeReadOnly: false,
    //         taxMethodPk: "6",
    //         selectedTaxMethod: "6.0% MI State Sales Tax",
    //     },
    // ]);

    // const [taxItems, setTaxItems] = React.useState<TaxItem[]>(() => {
    //     const rawValueEle = document.getElementById("step4:salesTaxDataListAsJson") as HTMLInputElement;
    //     const rawValue = rawValueEle ? rawValueEle.value : "";
    //     const taxItems: TaxItem[] = rawValue
    //         ? JSON.parse(rawValue).map((item: any) => ({
    //             taxMethodPk: item.taxMethodPk,
    //             taxableItemName: item.taxableItemName,
    //             taxableAmount: parseFloat(item.taxableAmount.replace(/,/g, "")), // Convert to number
    //             selectedTaxMethod: item.selectedTaxMethod,
    //             taxAmount: parseFloat(item.taxAmount), // Convert to number
    //             taxMethodTypeReadOnly: item.taxMethodTypeReadOnly,
    //             taxMethodTypeDetailsWO: item.taxMethodTypeDetailsWO,
    //         }))
    //         : [];
    //
    //     console.log(taxItems);
    //     return taxItems; // Ensure the array is returned
    // });

    // const taxMethodOptions = [
    //     "0% Tax Rate",
    //     "6.0% MI State Sales Tax",
    //     "7.50000% in Tax",
    //     "8.25% CA State Sales Tax",
    //     "9.0% NY State Sales Tax",
    // ];

    // const [taxMethodOptions, setTaxMethodOptions] = React.useState<TaxMethodOption[]>(() => {
    //     const hiddenField = document.getElementById("step4:taxMethodItemsAsJson") as HTMLInputElement;
    //     const rawValue = hiddenField ? hiddenField.value : "[]"; // Default to an empty array if the field is not found
    //     try {
    //         return JSON.parse(rawValue).map((item: any): TaxMethodOption => ({
    //             disabled: item.disabled,
    //             label: item.label,
    //             value: item.value,
    //             escape: item.escape,
    //             noSelectionOption: item.noSelectionOption,
    //         }));
    //     } catch (error) {
    //         console.error("Failed to parse tax method options from hidden field:", error);
    //         return [];
    //     }
    // });

    const [taxItems, setTaxItems] = React.useState<TaxItem[]>([]);
    const [taxMethodOptions, setTaxMethodOptions] = React.useState<TaxMethodOption[]>([]);

    React.useEffect(() => {
        // Load taxItems
        const rawValueEle = document.getElementById("step4:salesTaxDataListAsJson") as HTMLInputElement;
        const rawValue = rawValueEle ? rawValueEle.value : "";
        const parsedTaxItems: TaxItem[] = rawValue
            ? JSON.parse(rawValue).map((item: any) => ({
                taxMethodPk: item.taxMethodPk,
                taxableItemName: item.taxableItemName,
                taxableAmount: parseFloat(item.taxableAmount.replace(/,/g, "")), // Convert to number
                selectedTaxMethod: item.selectedTaxMethod,
                taxAmount: parseFloat(item.taxAmount), // Convert to number
                taxMethodTypeReadOnly: item.taxMethodTypeReadOnly,
                taxMethodTypeDetailsWO: item.taxMethodTypeDetailsWO,
            }))
            : [];
        setTaxItems(parsedTaxItems);

        // Load taxMethodOptions
        const hiddenField = document.getElementById("step4:taxMethodItemsAsJson") as HTMLInputElement;
        const rawOptionsValue = hiddenField ? hiddenField.value : "[]"; // Default to an empty array if the field is not found
        try {
            const parsedOptions = JSON.parse(rawOptionsValue).map((item: any): TaxMethodOption => ({
                disabled: item.disabled,
                label: item.label,
                value: item.value,
                escape: item.escape,
                noSelectionOption: item.noSelectionOption,
            }));
            setTaxMethodOptions(parsedOptions);
        } catch (error) {
            console.error("Failed to parse tax method options from hidden field:", error);
            setTaxMethodOptions([]);
        }
    }, []);

    const updateHiddenFields = (updatedItems: TaxItem[]) => {
        const hiddenField = document.getElementById(
            "salesTaxDataList"
        ) as HTMLInputElement;
        if (hiddenField) {
            hiddenField.value = JSON.stringify(updatedItems);
        }
    };

    const handleTaxMethodChange = (index: number, newMethod: string) => {
        const updatedItems = [...taxItems];
        updatedItems[index].taxMethodTypeDetailsWO = newMethod;

        // Calculate new tax amount based on method
        const amount = updatedItems[index].taxableAmount;
        let taxAmount = 0;

        if (newMethod.includes("0%")) {
            taxAmount = 0;
        } else if (newMethod.includes("6.0%")) {
            taxAmount = amount * 0.06;
        } else if (newMethod.includes("7.50000%")) {
            taxAmount = amount * 0.075;
        } else if (newMethod.includes("8.25%")) {
            taxAmount = amount * 0.0825;
        } else if (newMethod.includes("9.0%")) {
            taxAmount = amount * 0.09;
        }

        updatedItems[index].taxAmount = taxAmount;
        setTaxItems(updatedItems);
        updateHiddenFields(updatedItems);
    };

    const totalTaxAmount = taxItems.reduce((sum, item) => sum + item.taxAmount, 0);

    const handleApply = () => {
        updateHiddenFields(taxItems);
        onSave(totalTaxAmount);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[900px] max-h-[90vh] bg-white rounded-2xl shadow-lg p-0 border border-gray-200 flex flex-col">
                <DialogHeader className="px-8 py-6 border-b border-gray-200">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Taxes
                    </DialogTitle>
                </DialogHeader>

                <div className="px-8 pb-8 flex-1 overflow-auto flex flex-col">
                    {/* Table Header */}
                    <div className="bg-gray-200 rounded-t-lg">
                        <div className="grid grid-cols-4 gap-4 px-6 py-4">
                            <div className="font-semibold text-gray-900">Taxable Item</div>
                            <div className="font-semibold text-gray-900 text-center">Amount</div>
                            <div className="font-semibold text-gray-900 text-center">Tax Method</div>
                            <div className="font-semibold text-gray-900 text-right">Tax Amount</div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="border border-gray-200 rounded-b-lg flex-1 overflow-y-auto">
                        {taxItems.map((item, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-4 gap-4 px-6 py-4 ${
                                    index !== taxItems.length - 1
                                        ? "border-b border-gray-200"
                                        : ""
                                }`}
                            >
                                <div className="font-medium text-gray-900 flex items-center">
                                    {item.taxableItemName}
                                </div>
                                <div className="text-gray-900 text-center flex items-center justify-center">
                                    ${item.taxableAmount.toFixed(2)}
                                </div>
                                <div className="flex items-center justify-center">
                                    <Select
                                        value={item.selectedTaxMethod}
                                        onValueChange={(value) =>
                                            handleTaxMethodChange(index, value)
                                        }
                                        disabled={item.taxMethodTypeReadOnly}
                                    >
                                        <SelectTrigger
                                            className={`h-10 rounded-md border-gray-300 text-sm ${
                                                item.taxMethodTypeReadOnly
                                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {taxMethodOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}
                                                            disabled={option.disabled}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="text-gray-900 text-right flex items-center justify-end font-medium">
                                    ${item.taxAmount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Information Text */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg flex-shrink-0">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            You are electing to register the vehicle in a state that assesses
                            sales tax net of trade and rebates. The Tax Amount associated with
                            the Vehicle Selling Price is calculated after deducting the Gross
                            Trade In value and Rebate amount, if any.
                        </p>
                    </div>

                    {/* Apply Button */}
                    <Button
                        onClick={handleApply}
                        className="w-full h-12 mt-6 bg-[#2c5282] hover:bg-[#2a4f7a] text-white text-base font-medium rounded-lg transition-colors flex-shrink-0"
                    >
                        Apply
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};