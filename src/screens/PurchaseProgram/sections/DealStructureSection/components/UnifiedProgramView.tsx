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
import { DynamicDataState } from "../../../../../hooks/useDynamicData";
import { DealData } from "../../../../../types/DealData";
import { GAPData } from "../../../../../types/GAPData";
import { VSCData } from "../../../../../types/VSCData";
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
    dynamicData,
}: UnifiedProgramViewProps): JSX.Element => {
    const [showTaxesModal, setShowTaxesModal] = React.useState(false);
    const [showFeesModal, setShowFeesModal] = React.useState(false);
    const [showInterestRateModal, setShowInterestRateModal] = React.useState(false);
    const [showVSCOptionsModal, setShowVSCOptionsModal] = React.useState(false);
    const [showThirdPartyVSCModal, setShowThirdPartyVSCModal] = React.useState(false);
    const [showUpdateCallbackModal, setShowUpdateCallbackModal] = React.useState(false);

    const currentProgram = activeProgram === "purchase" ? dynamicData.purchaseProgram : dynamicData.portfolioProgram;

    // Helper function to update DOM element value
    const updateDOMValue = (id: string, value: string | number) => {
        const element = document.getElementById(id) as HTMLInputElement | null;
        if (element) {
            element.value = value.toString();
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    const handleVSCToggle = (enabled: boolean) => {
        dynamicData.vscEnabled = enabled;
        if (!enabled) {
            updateVSCData('selectedVendor', '');
            updateVSCData('sellingPrice', 0);
            updateDealData('vsc', 0);
        }
        handleUpdateCallback();
    };

    const handleGAPToggle = (enabled: boolean) => {
        dynamicData.gapEnabled = enabled;
        if (!enabled) {
            updateGAPData('selectedVendor', '');
            updateGAPData('sellingPrice', 0);
            updateDealData('gap', 0);
        } else {
            // When enabling GAP, trigger recalculation to load vendors
            handleUpdateCallback();
        }
    };

    const handleVSCVendorChange = (vendorCode: string) => {
        updateVSCData('selectedVendor', vendorCode);
        
        // Update DOM elements
        updateDOMValue('step4:vscSelectedVendorCode', vendorCode);
        
        // Trigger backend calculation
        const jsfButton = document.getElementById('vscForm:vscVendorChangeBtn') as HTMLButtonElement;
        if (jsfButton) {
            jsfButton.click();
        }
    };

    const handleGAPVendorChange = (vendorCode: string) => {
        updateGAPData('selectedVendor', vendorCode);
        
        // Update DOM elements
        updateDOMValue('step4:gapSelectedVendorCode', vendorCode);
        updateDOMValue('step4:mainGapVendors', vendorCode);
        
        // Trigger backend calculation
        const jsfButton = document.getElementById('gapForm:gapVendorChangeBtn') as HTMLButtonElement;
        if (jsfButton) {
            jsfButton.click();
        }
    };

    const handleVSCPriceChange = (price: number) => {
        updateVSCData('sellingPrice', price);
        updateDealData('vsc', price);
        updateDOMValue('step4:vscSelectedVendorSellingPrice', price);
        updateDOMValue('step4:vsc', price);
        handleUpdateCallback();
    };

    const handleGAPPriceChange = (price: number) => {
        updateGAPData('sellingPrice', price);
        updateDealData('gap', price);
        updateDOMValue('step4:gapSelectedVendorSellingPrice', price);
        updateDOMValue('step4:mainGapSellingPriceReact', price);
        updateDOMValue('step4:gap', price);
        handleUpdateCallback();
    };

    const handleDealFieldChange = (field: keyof DealData, value: number | boolean) => {
        updateDealData(field, value);
        
        // Update corresponding DOM elements
        const domFieldMap: Record<string, string> = {
            sellingPrice: 'step4:sellingPrice',
            cashDown: 'step4:cashDown',
            grossTradeIn: 'step4:grossTradeIn',
            tradeInPayoff: 'step4:tradeInPayoff',
            otherBackEnd: 'step4:otherBackEnd',
        };
        
        if (domFieldMap[field]) {
            updateDOMValue(domFieldMap[field], value);
        }
        
        handleUpdateCallback();
    };

    const handleTermChange = (termValue: string) => {
        const numericTerm = parseInt(termValue);
        updateDealData('term', numericTerm);
        updateDOMValue('step4:term', numericTerm);
        handleUpdateCallback();
    };

    const handleInterestRateChange = (newRate: string) => {
        const numericRate = parseFloat(newRate.replace('%', ''));
        updateDealData('interestRate', numericRate);
        
        // Split rate into whole and fraction parts for DOM update
        const [whole, fraction = '00'] = numericRate.toString().split('.');
        updateDOMValue('step4:interestRateText', whole);
        updateDOMValue('step4:selectInterestRateFraction', fraction.padEnd(2, '0').substring(0, 2));
        
        handleUpdateCallback();
    };

    const handleUpdateCallbackClick = () => {
        setShowUpdateCallbackModal(true);
    };

    const handleProceedCallback = () => {
        setShowUpdateCallbackModal(false);
        
        // Trigger the actual callback
        const jsfButton = document.getElementById('submitDealForm:updateCallbackButton') as HTMLButtonElement;
        if (jsfButton) {
            jsfButton.click();
        }
    };

    // Get the selected GAP vendor display name
    const getSelectedGAPVendorName = () => {
        const selectedVendor = dynamicData.gapData.availableVendors.find(
            vendor => vendor.code === dynamicData.gapData.selectedVendor
        );
        return selectedVendor ? selectedVendor.name : '';
    };

    // Get the selected VSC vendor display name
    const getSelectedVSCVendorName = () => {
        const selectedVendor = dynamicData.vscData.availableVendors.find(
            vendor => vendor.value === dynamicData.vscData.selectedVendor
        );
        return selectedVendor ? selectedVendor.label : '';
    };

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
                        <span className="text-sm text-zinc-500">Vehicle ID</span>
                        <span className="font-medium text-zinc-950">{dynamicData.vehicle.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Vehicle</span>
                        <span className="font-medium text-zinc-950">{dynamicData.vehicle.summary}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">First Payment Date</span>
                        <span className="font-medium text-zinc-950">{dynamicData.approval.firstPaymentDate}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Program Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => onProgramChange("purchase")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeProgram === "purchase"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Purchase Program
                </button>
                <button
                    onClick={() => onProgramChange("portfolio")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeProgram === "portfolio"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Portfolio Program
                </button>
            </div>

            {/* Deal Structure Card */}
            <Card className="shadow-shadow-base bg-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-zinc-950">
                        Deal Structure
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Selling Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Selling Price</span>
                        <CurrencyInput
                            value={dynamicData.dealData.sellingPrice}
                            onChange={(value) => handleDealFieldChange('sellingPrice', value)}
                            className="w-32 text-right"
                        />
                    </div>

                    {/* Taxes */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Taxes</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-950">
                                ${dynamicData.dealData.taxes.toFixed(2)}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowTaxesModal(true)}
                                className="h-8 w-8 p-0"
                            >
                                <img src={`${import.meta.env.BASE_URL}pencil-line.svg`} alt="Edit" className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Fees */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Fees</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-950">
                                ${dynamicData.dealData.fees.toFixed(2)}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFeesModal(true)}
                                className="h-8 w-8 p-0"
                            >
                                <img src={`${import.meta.env.BASE_URL}pencil-line.svg`} alt="Edit" className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Term */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Term</span>
                        <Select
                            value={dynamicData.dealData.term.toString()}
                            onValueChange={handleTermChange}
                        >
                            <SelectTrigger className="w-32">
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

                    {/* Interest Rate */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Interest Rate</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-950">
                                {dynamicData.dealData.interestRate.toFixed(2)}%
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowInterestRateModal(true)}
                                className="h-8 w-8 p-0"
                            >
                                <img src={`${import.meta.env.BASE_URL}pencil-line.svg`} alt="Edit" className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Cash Down */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Cash Down</span>
                        <CurrencyInput
                            value={dynamicData.dealData.cashDown}
                            onChange={(value) => handleDealFieldChange('cashDown', value)}
                            className="w-32 text-right"
                        />
                    </div>

                    {/* Trade-in Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-500">Trade-in</span>
                            <Switch
                                checked={dynamicData.dealData.tradeInEnabled}
                                onCheckedChange={(checked) => handleDealFieldChange('tradeInEnabled', checked)}
                            />
                        </div>

                        {dynamicData.dealData.tradeInEnabled && (
                            <>
                                <div className="flex items-center justify-between pl-4">
                                    <span className="text-sm text-zinc-500">Gross Trade-in</span>
                                    <CurrencyInput
                                        value={dynamicData.dealData.grossTradeIn}
                                        onChange={(value) => handleDealFieldChange('grossTradeIn', value)}
                                        className="w-32 text-right"
                                    />
                                </div>
                                <div className="flex items-center justify-between pl-4">
                                    <span className="text-sm text-zinc-500">Trade-in Payoff</span>
                                    <CurrencyInput
                                        value={dynamicData.dealData.tradeInPayoff}
                                        onChange={(value) => handleDealFieldChange('tradeInPayoff', value)}
                                        className="w-32 text-right"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* VSC Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-500">VSC</span>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={dynamicData.vscEnabled}
                                    onCheckedChange={handleVSCToggle}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowVSCOptionsModal(true)}
                                    className="h-8 w-8 p-0"
                                >
                                    <img src={`${import.meta.env.BASE_URL}circle-questionmark--faq--help--questionaire.svg`} alt="Info" className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {dynamicData.vscEnabled && (
                            <>
                                <div className="flex items-center justify-between pl-4">
                                    <span className="text-sm text-zinc-500">VSC Vendor</span>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={dynamicData.vscData.selectedVendor}
                                            onValueChange={handleVSCVendorChange}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Select vendor">
                                                    {getSelectedVSCVendorName() || "Select vendor"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dynamicData.vscData.availableVendors.map((vendor) => (
                                                    <SelectItem key={vendor.value} value={vendor.value}>
                                                        {vendor.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowThirdPartyVSCModal(true)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <img src={`${import.meta.env.BASE_URL}circle-questionmark--faq--help--questionaire.svg`} alt="Info" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pl-4">
                                    <span className="text-sm text-zinc-500">VSC Price</span>
                                    <CurrencyInput
                                        value={dynamicData.vscData.sellingPrice}
                                        onChange={handleVSCPriceChange}
                                        className="w-32 text-right"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* GAP Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-500">GAP</span>
                            <Switch
                                checked={dynamicData.gapEnabled}
                                onCheckedChange={handleGAPToggle}
                            />
                        </div>

                        {dynamicData.gapEnabled && (
                            <>
                                <div className="flex items-center justify-between pl-4">
                                    <span className="text-sm text-zinc-500">GAP Vendor</span>
                                    <Select
                                        value={dynamicData.gapData.selectedVendor}
                                        onValueChange={handleGAPVendorChange}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Select vendor">
                                                {getSelectedGAPVendorName() || "Select vendor"}
                                            </SelectValue>
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
                                <div className="flex items-center justify-between pl-4">
                                    <span className="text-sm text-zinc-500">GAP Price</span>
                                    <CurrencyInput
                                        value={dynamicData.gapData.sellingPrice}
                                        onChange={handleGAPPriceChange}
                                        className="w-32 text-right"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Other Back End */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Other Back End</span>
                        <CurrencyInput
                            value={dynamicData.dealData.otherBackEnd}
                            onChange={(value) => handleDealFieldChange('otherBackEnd', value)}
                            className="w-32 text-right"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Program Details Card */}
            <Card className="shadow-shadow-base bg-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-zinc-950">
                        {activeProgram === "purchase" ? "Purchase Program" : "Portfolio Program"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Paid to Dealer</span>
                        <span className="font-medium text-zinc-950">
                            ${currentProgram.paidToDealer.toFixed(2)}
                        </span>
                    </div>

                    {activeProgram === "purchase" ? (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-500">Discount Lender Fee</span>
                            <span className="font-medium text-zinc-950">
                                ${currentProgram.discountLenderFee.toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-500">Initial Profit</span>
                                <span className="font-medium text-zinc-950">
                                    ${currentProgram.initialProfit.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-500">Portfolio Profit</span>
                                <span className="font-medium text-zinc-950">
                                    ${currentProgram.portfolioProfit.toFixed(2)}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Flat</span>
                        <span className="font-medium text-zinc-950">
                            ${currentProgram.flat.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Total Back End</span>
                        <span className="font-medium text-zinc-950">
                            ${currentProgram.totalBackEnd.toFixed(2)}
                        </span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Amount Financed</span>
                        <span className="font-medium text-zinc-950">
                            ${currentProgram.amountFinanced.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Monthly Payment</span>
                        <span className="font-medium text-zinc-950">
                            ${currentProgram.monthlyPayment.toFixed(2)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Update Callback Button */}
            <Button
                onClick={handleUpdateCallbackClick}
                className="w-full h-12 bg-[#2c5282] hover:bg-[#2a4f7a] text-white text-base font-medium rounded-lg transition-colors"
            >
                Update Callback
            </Button>

            {/* Modals */}
            <TaxesModal
                isOpen={showTaxesModal}
                onClose={() => setShowTaxesModal(false)}
                onSave={(totalTaxes) => {
                    updateDealData('taxes', totalTaxes);
                    handleUpdateCallback();
                }}
            />

            <FeesModal
                isOpen={showFeesModal}
                onClose={() => setShowFeesModal(false)}
                onSave={(totalFees) => {
                    updateDealData('fees', totalFees);
                }}
            />

            <InterestRateModal
                isOpen={showInterestRateModal}
                onClose={() => setShowInterestRateModal(false)}
                currentRate={`${dynamicData.dealData.interestRate.toFixed(2)}%`}
                onSave={handleInterestRateChange}
            />

            <VSCOptionsModal
                isOpen={showVSCOptionsModal}
                onClose={() => setShowVSCOptionsModal(false)}
            />

            <ThirdPartyVSCModal
                isOpen={showThirdPartyVSCModal}
                onClose={() => setShowThirdPartyVSCModal(false)}
            />

            <UpdateCallbackModal
                isOpen={showUpdateCallbackModal}
                onClose={() => setShowUpdateCallbackModal(false)}
                onProceed={handleProceedCallback}
            />
        </div>
    );
};