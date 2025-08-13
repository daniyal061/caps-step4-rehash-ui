import React from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { CurrencyInput } from "../../../../../components/ui/currency-input";
import { Input } from "../../../../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../components/ui/select";
import { Separator } from "../../../../../components/ui/separator";
import { Switch } from "../../../../../components/ui/switch";
import { DealData, VSCData, GAPData } from "../../../../../types";
import { DynamicDataState } from "../../../../../hooks/useDynamicData";
import { AlertsContainer } from "./Alerts";
import { FeesModal } from "./FeesModal";
import { InterestRateModal } from "./InterestRateModal";
import { TaxesModal } from "./TaxesModal";
import { ThirdPartyVSCModal } from "./ThirdPartyVSCModal";
import { UpdateCallbackModal } from "./UpdateCallbackModal";
import { VSCOptionsModal } from "./VSCOptionsModal";

interface UnifiedProgramViewProps {
    activeProgram: "purchase" | "portfolio";
    onProgramChange: (program: "purchase" | "portfolio") => void;
    updateDealData: (field: keyof DealData, value: number | boolean) => void;
    updateVSCData: (field: keyof VSCData, value: string | number) => void;
    updateGAPData: (field: keyof GAPData, value: string | number) => void;
    handleUpdateCallback: () => void;
    dynamicData: DynamicDataState;
}

export const UnifiedProgramView = ({
    activeProgram,
    onProgramChange,
    updateDealData,
    updateVSCData,
    updateGAPData,
    handleUpdateCallback,
    dynamicData
}: UnifiedProgramViewProps): JSX.Element => {
    const [isFeesModalOpen, setIsFeesModalOpen] = React.useState(false);
    const [isTaxesModalOpen, setIsTaxesModalOpen] = React.useState(false);
    const [isInterestRateModalOpen, setIsInterestRateModalOpen] = React.useState(false);
    const [isVSCOptionsModalOpen, setIsVSCOptionsModalOpen] = React.useState(false);
    const [isThirdPartyVSCModalOpen, setIsThirdPartyVSCModalOpen] = React.useState(false);
    const [isUpdateCallbackModalOpen, setIsUpdateCallbackModalOpen] = React.useState(false);
    const [vscEnabled, setVscEnabled] = React.useState(dynamicData.vscEnabled);
    const [gapEnabled, setGapEnabled] = React.useState(dynamicData.gapEnabled);

    // Update local state when dynamic data changes
    React.useEffect(() => {
        setVscEnabled(dynamicData.vscEnabled);
        setGapEnabled(dynamicData.gapEnabled);
    }, [dynamicData.vscEnabled, dynamicData.gapEnabled]);

    const handleVSCToggle = (enabled: boolean) => {
        setVscEnabled(enabled);
        if (!enabled) {
            updateVSCData('sellingPrice', 0);
            updateVSCData('selectedVendor', '');
            updateDealData('vsc', 0);
        }
        // Update the dynamic data state
        dynamicData.vscEnabled = enabled;
    };

    const handleGAPToggle = (enabled: boolean) => {
        setGapEnabled(enabled);
        if (!enabled) {
            updateGAPData('sellingPrice', 0);
            updateGAPData('selectedVendor', '');
            updateDealData('gap', 0);
        }
        // Update the dynamic data state
        dynamicData.gapEnabled = enabled;
    };

    const handleVSCVendorChange = (vendorCode: string) => {
        updateVSCData('selectedVendor', vendorCode);
        // Trigger recalculation
        handleUpdateCallback();
    };

    const handleGAPVendorChange = (vendorCode: string) => {
        updateGAPData('selectedVendor', vendorCode);
        
        // Update DOM elements for GAP vendor selection
        const selectedGapVendorEl = document.getElementById('step4:mainGapVendors') as HTMLSelectElement | null;
        const mainGapSellingPriceEl = document.getElementById('step4:mainGapSellingPriceReact') as HTMLInputElement | null;
        
        if (selectedGapVendorEl) {
            selectedGapVendorEl.value = vendorCode;
            selectedGapVendorEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Set a default selling price if needed
        if (mainGapSellingPriceEl && !mainGapSellingPriceEl.value) {
            mainGapSellingPriceEl.value = '0';
            mainGapSellingPriceEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Trigger GAP recalculation
        if (window.setGapRecalculated) {
            window.setGapRecalculated(true);
        }
    };

    const handleVSCPriceChange = (price: number) => {
        updateVSCData('sellingPrice', price);
        updateDealData('vsc', price);
        handleUpdateCallback();
    };

    const handleGAPPriceChange = (price: number) => {
        updateGAPData('sellingPrice', price);
        updateDealData('gap', price);
        
        // Update DOM element
        const mainGapSellingPriceEl = document.getElementById('step4:mainGapSellingPriceReact') as HTMLInputElement | null;
        if (mainGapSellingPriceEl) {
            mainGapSellingPriceEl.value = price.toString();
            mainGapSellingPriceEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        handleUpdateCallback();
    };

    const handleTradeInToggle = (enabled: boolean) => {
        updateDealData('tradeInEnabled', enabled);
        if (!enabled) {
            updateDealData('grossTradeIn', 0);
            updateDealData('tradeInPayoff', 0);
        }
        handleUpdateCallback();
    };

    const handleUpdateCallbackClick = () => {
        setIsUpdateCallbackModalOpen(true);
    };

    const handleProceedCallback = () => {
        setIsUpdateCallbackModalOpen(false);
        handleUpdateCallback();
    };

    const currentProgram = activeProgram === "purchase" ? dynamicData.purchaseProgram : dynamicData.portfolioProgram;

    return (
        <div className="flex flex-col w-full max-w-[850px] gap-6">
            {/* Alerts Section */}
            <AlertsContainer alertData={dynamicData.alertData} />

            {/* Vehicle Information Card */}
            <Card className="shadow-shadow-base bg-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-zinc-950">
                        Vehicle Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-zinc-500">Vehicle ID</p>
                            <p className="font-medium text-zinc-950">{dynamicData.vehicle.id}</p>
                        </div>
                        <div className="flex-1 ml-6">
                            <p className="text-sm text-zinc-500">Vehicle Summary</p>
                            <p className="font-medium text-zinc-950">{dynamicData.vehicle.summary}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Deal Structure Card */}
            <Card className="shadow-shadow-base bg-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-zinc-950">
                        Deal Structure
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Program Toggle */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-zinc-950">Program:</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onProgramChange("purchase")}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                    activeProgram === "purchase"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                Purchase Program
                            </button>
                            <button
                                onClick={() => onProgramChange("portfolio")}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                    activeProgram === "portfolio"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                Portfolio Program
                            </button>
                        </div>
                    </div>

                    {/* Deal Structure Fields */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Selling Price
                            </label>
                            <CurrencyInput
                                value={dynamicData.dealData.sellingPrice}
                                onChange={(value) => {
                                    updateDealData('sellingPrice', value);
                                    handleUpdateCallback();
                                }}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Taxes
                                <button
                                    onClick={() => setIsTaxesModalOpen(true)}
                                    className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                                >
                                    Edit
                                </button>
                            </label>
                            <CurrencyInput
                                value={dynamicData.dealData.taxes}
                                onChange={(value) => {
                                    updateDealData('taxes', value);
                                    handleUpdateCallback();
                                }}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Fees
                                <button
                                    onClick={() => setIsFeesModalOpen(true)}
                                    className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                                >
                                    Edit
                                </button>
                            </label>
                            <CurrencyInput
                                value={dynamicData.dealData.fees}
                                onChange={(value) => {
                                    updateDealData('fees', value);
                                    handleUpdateCallback();
                                }}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Term (months)
                            </label>
                            <Select
                                value={dynamicData.dealData.term.toString()}
                                onValueChange={(value) => {
                                    updateDealData('term', parseInt(value));
                                    handleUpdateCallback();
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {dynamicData.loanTerms.availableTerms.map((term) => (
                                        <SelectItem key={term.value} value={term.value.toString()}>
                                            {term.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Interest Rate
                                <button
                                    onClick={() => setIsInterestRateModalOpen(true)}
                                    className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                                >
                                    Edit
                                </button>
                            </label>
                            <Input
                                type="text"
                                value={`${dynamicData.dealData.interestRate}%`}
                                readOnly
                                className="w-full bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Cash Down
                            </label>
                            <CurrencyInput
                                value={dynamicData.dealData.cashDown}
                                onChange={(value) => {
                                    updateDealData('cashDown', value);
                                    handleUpdateCallback();
                                }}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Trade-in Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={dynamicData.dealData.tradeInEnabled}
                                onCheckedChange={handleTradeInToggle}
                            />
                            <label className="text-sm font-medium text-zinc-700">
                                Trade-in
                            </label>
                        </div>

                        {dynamicData.dealData.tradeInEnabled && (
                            <div className="grid grid-cols-2 gap-6 pl-8">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Gross Trade-in
                                    </label>
                                    <CurrencyInput
                                        value={dynamicData.dealData.grossTradeIn}
                                        onChange={(value) => {
                                            updateDealData('grossTradeIn', value);
                                            handleUpdateCallback();
                                        }}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Trade-in Payoff
                                    </label>
                                    <CurrencyInput
                                        value={dynamicData.dealData.tradeInPayoff}
                                        onChange={(value) => {
                                            updateDealData('tradeInPayoff', value);
                                            handleUpdateCallback();
                                        }}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* VSC Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={vscEnabled}
                                onCheckedChange={handleVSCToggle}
                            />
                            <label className="text-sm font-medium text-zinc-700">
                                Vehicle Service Contract (VSC)
                            </label>
                            <button
                                onClick={() => setIsVSCOptionsModalOpen(true)}
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                                Options
                            </button>
                        </div>

                        {vscEnabled && (
                            <div className="grid grid-cols-2 gap-6 pl-8">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        VSC Vendor
                                    </label>
                                    <Select
                                        value={dynamicData.vscData.selectedVendor}
                                        onValueChange={handleVSCVendorChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select vendor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dynamicData.vscData.availableVendors.map((vendor) => (
                                                <SelectItem key={vendor.value} value={vendor.value}>
                                                    {vendor.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        VSC Selling Price
                                        <button
                                            onClick={() => setIsThirdPartyVSCModalOpen(true)}
                                            className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                                        >
                                            Info
                                        </button>
                                    </label>
                                    <CurrencyInput
                                        value={dynamicData.vscData.sellingPrice}
                                        onChange={handleVSCPriceChange}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* GAP Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={gapEnabled}
                                onCheckedChange={handleGAPToggle}
                            />
                            <label className="text-sm font-medium text-zinc-700">
                                Guaranteed Asset Protection (GAP)
                            </label>
                        </div>

                        {gapEnabled && (
                            <div className="grid grid-cols-2 gap-6 pl-8">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        GAP Vendor
                                    </label>
                                    <Select
                                        value={dynamicData.gapData.selectedVendor}
                                        onValueChange={handleGAPVendorChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select vendor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dynamicData.gapData.availableVendors.map((vendor) => (
                                                <SelectItem key={vendor.code} value={vendor.code}>
                                                    {vendor.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        GAP Selling Price
                                    </label>
                                    <CurrencyInput
                                        value={dynamicData.gapData.sellingPrice}
                                        onChange={handleGAPPriceChange}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Other Back End */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Other Back End
                        </label>
                        <CurrencyInput
                            value={dynamicData.dealData.otherBackEnd}
                            onChange={(value) => {
                                updateDealData('otherBackEnd', value);
                                handleUpdateCallback();
                            }}
                            className="w-full"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Program Summary Card */}
            <Card className="shadow-shadow-base bg-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-zinc-950">
                        {activeProgram === "purchase" ? "Purchase Program" : "Portfolio Program"} Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-zinc-500">Amount Paid to Dealer</p>
                            <p className="text-lg font-semibold text-zinc-950">
                                ${currentProgram.paidToDealer.toFixed(2)}
                            </p>
                        </div>

                        {activeProgram === "purchase" ? (
                            <div>
                                <p className="text-sm text-zinc-500">Discount Lender Fee</p>
                                <p className="text-lg font-semibold text-zinc-950">
                                    ${dynamicData.purchaseProgram.discountLenderFee.toFixed(2)}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm text-zinc-500">Initial Profit</p>
                                    <p className="text-lg font-semibold text-zinc-950">
                                        ${dynamicData.portfolioProgram.initialProfit.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Portfolio Profit</p>
                                    <p className="text-lg font-semibold text-zinc-950">
                                        ${dynamicData.portfolioProgram.portfolioProfit.toFixed(2)}
                                    </p>
                                </div>
                            </>
                        )}

                        <div>
                            <p className="text-sm text-zinc-500">Flat</p>
                            <p className="text-lg font-semibold text-zinc-950">
                                ${currentProgram.flat.toFixed(2)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-zinc-500">Total Back End</p>
                            <p className="text-lg font-semibold text-zinc-950">
                                ${currentProgram.totalBackEnd.toFixed(2)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-zinc-500">Amount Financed</p>
                            <p className="text-lg font-semibold text-zinc-950">
                                ${currentProgram.amountFinanced.toFixed(2)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-zinc-500">Monthly Payment</p>
                            <p className="text-lg font-semibold text-zinc-950">
                                ${currentProgram.monthlyPayment.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="flex justify-center">
                        <Button
                            onClick={handleUpdateCallbackClick}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                        >
                            Update Callback
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Modals */}
            <FeesModal
                isOpen={isFeesModalOpen}
                onClose={() => setIsFeesModalOpen(false)}
                onSave={(totalFees) => {
                    updateDealData('fees', totalFees);
                    handleUpdateCallback();
                }}
            />

            <TaxesModal
                isOpen={isTaxesModalOpen}
                onClose={() => setIsTaxesModalOpen(false)}
                onSave={(totalTaxes) => {
                    updateDealData('taxes', totalTaxes);
                    handleUpdateCallback();
                }}
            />

            <InterestRateModal
                isOpen={isInterestRateModalOpen}
                onClose={() => setIsInterestRateModalOpen(false)}
                currentRate={`${dynamicData.dealData.interestRate}%`}
                onSave={(newRate) => {
                    const numericRate = parseFloat(newRate.replace('%', ''));
                    updateDealData('interestRate', numericRate);
                    handleUpdateCallback();
                }}
            />

            <VSCOptionsModal
                isOpen={isVSCOptionsModalOpen}
                onClose={() => setIsVSCOptionsModalOpen(false)}
            />

            <ThirdPartyVSCModal
                isOpen={isThirdPartyVSCModalOpen}
                onClose={() => setIsThirdPartyVSCModalOpen(false)}
            />

            <UpdateCallbackModal
                isOpen={isUpdateCallbackModalOpen}
                onClose={() => setIsUpdateCallbackModalOpen(false)}
                onProceed={handleProceedCallback}
            />
        </div>
    );
};