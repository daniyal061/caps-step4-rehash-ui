import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import React from "react";
import { Simulate } from "react-dom/test-utils";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
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
import { AlertsContainer } from "./Alerts";
import { FeesModal } from "./FeesModal";
import { InterestRateModal } from "./InterestRateModal";
import { TaxesModal } from "./TaxesModal";
import { ThirdPartyVSCModal } from "./ThirdPartyVSCModal";
import { VSCOptionsModal } from "./VSCOptionsModal";
import { UpdateCallbackModal } from "./UpdateCallbackModal";
import toggle = Simulate.toggle;

interface UnifiedProgramViewProps {
  activeProgram: "purchase" | "portfolio";
  onProgramChange: (program: "purchase" | "portfolio") => void;
  updateDealData: (field: keyof import("../../../../../types/DealData").DealData, value: number | boolean) => void;
  updateVSCData: (field: keyof import("../../../../../types/VSCData").VSCData, value: string | number) => void;
  updateGAPData: (field: keyof import("../../../../../types/GAPData").GAPData, value: string | number) => void;
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
  const [isTradeInEnabled, setIsTradeInEnabled] = React.useState(dynamicData.dealData.tradeInEnabled);
  const [isVSCEnabled, setIsVSCEnabled] = React.useState(false);
  const [isGAPEnabled, setIsGAPEnabled] = React.useState(false);
  const [isInterestRateModalOpen, setIsInterestRateModalOpen] = React.useState(false);
  const [isVSCOptionsModalOpen, setIsVSCOptionsModalOpen] = React.useState(false);
  const [isThirdPartyVSCModalOpen, setIsThirdPartyVSCModalOpen] = React.useState(false);
  const [isTaxesModalOpen, setIsTaxesModalOpen] = React.useState(false);
  const [isFeesModalOpen, setIsFeesModalOpen] = React.useState(false);
  const [isTotalBackEndExpanded, setIsTotalBackEndExpanded] = React.useState(false);
  const [isUpdateCallbackModalOpen, setIsUpdateCallbackModalOpen] = React.useState(false);
  const [interestRate, setInterestRate] = React.useState(
      `${dynamicData.dealData.interestRate}%`
  );

  // VSC in-house vendor state
  const [vscCoverageTier, setVscCoverageTier] = React.useState("Premium");
  const [vscOptions, setVscOptions] = React.useState<string[]>([]);
  const [vscTerm, setVscTerm] = React.useState("24/24,000");
  const [vscDeductible, setVscDeductible] = React.useState("$100");

  // VSC third-party vendor state
  const [vscTermMonths, setVscTermMonths] = React.useState("");
  const [vscTermMiles, setVscTermMiles] = React.useState("");
  const [unlimitedMonths, setUnlimitedMonths] = React.useState(false);
  const [unlimitedMiles, setUnlimitedMiles] = React.useState(false);

  // Fetch interest rate from HTML elements on component mount
  React.useEffect(() => {
    const fetchInterestRateFromDOM = () => {
      const wholeNumberElement = document.getElementById('step4:interestRateText') as HTMLInputElement | null;
      const fractionElement = document.getElementById('step4:selectInterestRateFraction') as HTMLInputElement | null;

      if (wholeNumberElement && fractionElement) {
        const wholeNumber = wholeNumberElement.value || '0';
        const fraction = fractionElement.value || '00';
        const combinedRate = `${wholeNumber}.${fraction}%`;
        setInterestRate(combinedRate);
      } else {
        // Fallback to dynamic data if elements not found
        setInterestRate(`${dynamicData.dealData.interestRate}%`);
      }
    };

    fetchInterestRateFromDOM();
  }, [dynamicData.dealData.interestRate]);

  // Read VSC and GAP toggle enabled state from DOM
  React.useEffect(() => {
    const vscEnabledEl = document.getElementById('step4:vscIsEnabled') as HTMLInputElement | null;
    const gapEnabledEl = document.getElementById('step4:gapIsEnabled') as HTMLInputElement | null;

    console.log('VSC Enabled Element:', vscEnabledEl);
    console.log('GAP Enabled Element:', gapEnabledEl);

    if (vscEnabledEl) {
      setIsVSCEnabled(vscEnabledEl.value === 'true');
      dynamicData.vscEnabled = true;
    }

    if (gapEnabledEl) {
      dynamicData.gapEnabled = true;
      setIsGAPEnabled(gapEnabledEl.value === 'true');
    }
  }, []);
  // Update trade-in enabled state when dynamic data changes
  React.useEffect(() => {
    setIsTradeInEnabled(dynamicData.dealData.tradeInEnabled);
  }, [dynamicData.dealData.tradeInEnabled]);

  // Update VSC enabled state when vendor is selected
  // React.useEffect(() => {
  //   setIsVSCEnabled(dynamicData.vscData.selectedVendor !== "");
  // }, [dynamicData.vscData.selectedVendor]);

  // Update GAP enabled state when vendor is selected
  // React.useEffect(() => {
  //   setIsGAPEnabled(dynamicData.gapData.selectedVendor !== "");
  // }, [dynamicData.gapData.selectedVendor]);

  // Financial summary data that changes based on program
  const getFinancialSummary = () => {
    if (activeProgram === "purchase") {
      return [
        { label: "Paid to Dealer (Net Check)", value: `$${dynamicData.purchaseProgram.paidToDealer.toLocaleString()}`, isBold: true },
        { label: "Discount", value: `$${dynamicData.purchaseProgram.discountLenderFee.toLocaleString()}` },
        { label: "Flat", value: `$${dynamicData.purchaseProgram.flat.toLocaleString()}` },
        { label: "Total Back End", value: `$${dynamicData.purchaseProgram.totalBackEnd.toLocaleString()}` },
        { label: "Amount Financed", value: `$${dynamicData.purchaseProgram.amountFinanced.toLocaleString()}` },
        {
          label: "Monthly Payment",
          value: `$${dynamicData.purchaseProgram.monthlyPayment.toLocaleString()}`,
        },
      ];
    } else {
      return [
        { label: "Paid to Dealer (Net Check)", value: `$${dynamicData.portfolioProgram.paidToDealer.toLocaleString()}`, isBold: true },
        { label: "Initial Profit", value: `$${dynamicData.portfolioProgram.initialProfit.toLocaleString()}` },
        { label: "Portfolio Profit", value: `$${dynamicData.portfolioProgram.portfolioProfit.toLocaleString()}` },
        { label: "Total Back End", value: `$${dynamicData.portfolioProgram.totalBackEnd.toLocaleString()}` },
        { label: "Amount Financed", value: `$${dynamicData.portfolioProgram.amountFinanced.toLocaleString()}` },
        {
          label: "Monthly Payment",
          value: `$${dynamicData.portfolioProgram.monthlyPayment.toLocaleString()}`,
        },
      ];
    }
  };

  const financialSummary = getFinancialSummary();

  const handleInterestRateSave = (newRate: string) => {
    setInterestRate(newRate);
    console.log('IR save');
    const numericRate = parseFloat(newRate.replace('%', ''));
    const wholeNumber = Math.floor(numericRate);
    const fraction = numericRate - wholeNumber;
    const wholeNumberElement = document.getElementById('step4:interestRateText') as HTMLInputElement;
    const fractionElement = document.getElementById('step4:selectInterestRateFraction') as HTMLInputElement;

    if (wholeNumberElement && fractionElement) {
        wholeNumberElement.value = wholeNumber.toLocaleString();
        fractionElement.value = fraction.toLocaleString();
        wholeNumberElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleUpdateCallbackClick = () => {
    setIsUpdateCallbackModalOpen(true);
  };

  const handleUpdateCallbackProceed = () => {
    const jsfButton = document.getElementById('submitDealForm:updateCallbackButton') as HTMLButtonElement;
    if (jsfButton) {
      jsfButton.click();
    }
    setIsUpdateCallbackModalOpen(false);
  };

  const handleTaxesSave = (totalTaxes: number) => {
    updateDealData('taxes', totalTaxes);
  };

  const handleFeesSave = (totalFees: number, feeItems: any[]) => {
    updateDealData('fees', totalFees);

    // Save individual fee amounts to DOM elements and update application state
    feeItems.forEach((item) => {
      if (item.domId) {
        calculateDeal(item.domId, item.amount);
      }
      if (item.vendorDomId && item.vendorName) {
        calculateDeal(item.vendorDomId, item.vendorName);
      }
    });
  };

  const handleTradeInToggle = (enabled: boolean) => {
    setIsTradeInEnabled(enabled);
    updateDealData('tradeInEnabled', enabled);
  };

  // Helper function to format currency with $ prefix
  const formatCurrency = (value: number): string => {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const unformatCurrency = (value: string): number => {
    // Remove everything except digits, decimal point, and minus sign
    const numericString = value.replace(/[^0-9.-]+/g, '');
    return parseFloat(numericString);
  };

  const calculateDeal = (
      id: string,
      newValue: string | number | boolean,
      options?: { unformatCurrency?: boolean }
  ) => {
      console.log(`Updating element ${id} with value:`, newValue);
      const element = document.getElementById(id) as HTMLInputElement | null;
      console.log("Checking if element is null or not");
      if (element) {
        console.log(`Element ${id} found, updating value...`);

        let oldValue = element.value;
        if (options?.unformatCurrency) {
          oldValue = unformatCurrency(oldValue).toString();
        }

        if (oldValue !== newValue.toString()) {
          console.log(`Updating element ${id} from "${oldValue}" to "${newValue}"`);
          element.value = newValue.toString();
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }else{
          console.log(`No change needed for element ${id}, current value is "${oldValue}"`);
        }
      }else{
        console.warn(`Element ${id} not found in the DOM.`);
      }
  };

  const handleVSCToggle = (enabled: boolean) => {
    setIsVSCEnabled(enabled);
    dynamicData.vscEnabled = enabled;
    if (!enabled) {
      // Clear VSC vendor selection when disabled
      updateVSCData('selectedVendor', '');
    }else{
      updateVSCData('selectedVendor', 'WYN08');
    }
  };

  const handleGAPToggle = (enabled: boolean) => {
    setIsGAPEnabled(enabled);
    dynamicData.gapEnabled = enabled;
    if (!enabled) {
      // Clear GAP vendor selection when disabled
      updateGAPData('selectedVendor', '');
    }else{
      updateGAPData('selectedVendor', 'WYNNS-GAP');
    }
  };

  // Check if VSC vendor is in-house
  const isVSCInHouseVendor = (vendor: string) => {
    return vendor === "WYNNS-WYN08" || vendor === "SWRE-SPP08";
  };

  // Check if VSC vendor is third party
  const isVSCThirdPartyVendor = (vendor: string) => {
    return vendor && !isVSCInHouseVendor(vendor);
  };

  // Check if GAP vendor is in-house
  const isGAPInHouseVendor = (vendor: string) => {
    const selectedVendor = dynamicData.gapData.availableVendors.find(v => v.code === vendor);
    return selectedVendor?.vendorType === "CAC";
  };

  // Check if GAP vendor is third party
  const isGAPThirdPartyVendor = (vendor: string) => {
    return vendor && !isGAPInHouseVendor(vendor);
  };

  // Generate Total Back End breakdown content
  const getTotalBackEndContent = () => {
    const content = [];

    // VSC content
    if (isVSCInHouseVendor(dynamicData.vscData.selectedVendor)) {
      content.push(
          <div key="vsc-inhouse" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-text-small-leading-normal-regular text-zinc-950">VSC Selling Price</span>
              <span className="font-text-small-leading-normal-regular text-zinc-950">${dynamicData.vscData.sellingPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-text-small-leading-normal-regular text-zinc-950">VSC Net Dealer Cost</span>
              <span className="font-text-small-leading-normal-regular text-zinc-950">(${dynamicData.vscData.sellingPrice.toFixed(2)})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-text-small-leading-normal-semibold text-zinc-950">VSC Profit</span>
              <span className="font-text-small-leading-normal-semibold text-zinc-950">${dynamicData.vscData.sellingPrice.toFixed(2)}</span>
            </div>
          </div>
      );
    } else if (isVSCThirdPartyVendor(dynamicData.vscData.selectedVendor)) {
      content.push(
          <div key="vsc-thirdparty" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-text-small-leading-normal-regular text-zinc-950">TPVSC Selling Price</span>
              <span className="font-text-small-leading-normal-regular text-zinc-950">${dynamicData.vscData.sellingPrice.toFixed(2)}</span>
            </div>
          </div>
      );
    }

    // Add separator if both VSC and GAP have content
    const hasVSCContent = dynamicData.vscData.selectedVendor !== "";
    const hasGAPContent = dynamicData.gapData.selectedVendor !== "";

    if (hasVSCContent && hasGAPContent) {
      content.push(
          <div key="separator" className="w-full h-px bg-zinc-300" />
      );
    }

    // GAP content
    if (isGAPInHouseVendor(dynamicData.gapData.selectedVendor)) {
      content.push(
          <div key="gap-inhouse" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-text-small-leading-normal-regular text-zinc-950">GAP Selling Price</span>
              <span className="font-text-small-leading-normal-regular text-zinc-950">${dynamicData.gapData.sellingPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-text-small-leading-normal-regular text-zinc-950">GAP Net Dealer Cost</span>
              <span className="font-text-small-leading-normal-regular text-zinc-950">(${dynamicData.gapData.sellingPrice.toFixed(2)})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-text-small-leading-normal-semibold text-zinc-950">GAP Profit</span>
              <span className="font-text-small-leading-normal-semibold text-zinc-950">${dynamicData.gapData.sellingPrice.toFixed(2)}</span>
            </div>
          </div>
      );
    } else if (isGAPThirdPartyVendor(dynamicData.gapData.selectedVendor)) {
      content.push(
          <div key="gap-thirdparty" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-text-small-leading-normal-regular text-zinc-950">TPGAP Selling Price</span>
              <span className="font-text-small-leading-normal-regular text-zinc-950">${dynamicData.gapData.sellingPrice.toFixed(2)}</span>
            </div>
          </div>
      );
    }

    return content;
  };

  // Handle VSC option toggle
  const handleVSCOptionToggle = (option: string) => {
    setVscOptions(prev =>
        prev.includes(option)
            ? prev.filter(o => o !== option)
            : [...prev, option]
    );
  };
  // @ts-ignore
  return (
      <>
        {/* Warning alerts - show for both programs */}
        <AlertsContainer alertData={dynamicData.alertData}/>

        <Card className="w-full">
          <CardContent className="flex flex-col items-start justify-center gap-6 pt-6 pb-8 px-8 bg-white">
            {/* Vehicle header */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-zinc-950 text-2xl tracking-[-0.40px] leading-8">
                  {/*{dynamicData.vehicle.year} {dynamicData.vehicle.make} {dynamicData.vehicle.model} {dynamicData.vehicle.trim} | #{dynamicData.vehicle.id}*/}
                  {dynamicData.vehicle.summary} | #{dynamicData.vehicle.id}
                </h2>
              {/*  <span className="font-normal text-[#546982] text-base tracking-[-0.40px] leading-6 underline">*/}
              {/*  Change Vehicle*/}
              {/*</span>*/}
              </div>

              <div className="inline-flex h-9 items-center p-1 bg-zinc-100 rounded-lg">
                <button
                    className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-md transition-colors ${
                        activeProgram === "purchase"
                            ? "bg-[#546982] shadow-shadow-base"
                            : "hover:bg-zinc-200"
                    }`}
                    onClick={() => onProgramChange("purchase")}
                >
                <span className={`font-text-small-leading-normal-medium text-center whitespace-nowrap ${
                    activeProgram === "purchase" ? "text-white" : "text-zinc-500"
                }`}>
                  Purchase Program
                </span>
                </button>
                <button
                    className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-md transition-colors ${
                        activeProgram === "portfolio"
                            ? "bg-[#546982] shadow-shadow-base"
                            : "hover:bg-zinc-200"
                    }`}
                    onClick={() => onProgramChange("portfolio")}
                >
                <span className={`font-text-small-leading-normal-medium text-center whitespace-nowrap ${
                    activeProgram === "portfolio" ? "text-white" : "text-zinc-500"
                }`}>
                  Portfolio Program
                </span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-8 w-full">
              <div className="flex flex-col items-start gap-6 flex-1">
                <div className="flex flex-col items-start gap-4 w-full">
                  {/* Price and taxes row */}
                  <div className="flex items-start gap-4 w-full">
                    <div className="flex flex-col items-start gap-2 flex-1">
                      <div className="flex w-full items-center gap-2">
                        <label className="flex-1 font-medium text-sm text-zinc-950">
                          Selling Price
                        </label>
                      </div>
                      <div className="w-full">
                        <CurrencyInput
                            className="h-10 px-3 py-1 bg-white rounded-md border-zinc-400 shadow-shadow-sm"
                            value={dynamicData.dealData.sellingPrice}
                            onChange={(value) => updateDealData('sellingPrice', value)}
                            onBlur={() => calculateDeal('step4:sellingPrice', dynamicData.dealData.sellingPrice, { unformatCurrency: true })}

                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 flex-1">
                      <label className="font-medium text-zinc-950 text-sm leading-5">
                        Taxes
                      </label>
                      <div className="flex h-10 items-center justify-between w-full bg-white rounded-md border border-zinc-400 shadow-shadow-sm px-3 py-2 relative">
                      <span className="font-text-small-leading-normal-regular text-zinc-950 text-sm">
                        ${dynamicData.dealData.taxes.toFixed(2)}
                      </span>
                        <img
                            onClick={() => setIsTaxesModalOpen(true)}
                            className="w-4 h-4 cursor-pointer hover:opacity-70"
                            alt="Pencil line"
                            src={`${import.meta.env.BASE_URL}pencil-line.svg`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 flex-1">
                      <label className="font-medium text-zinc-950 text-sm leading-5">
                        Fees
                      </label>
                      <div className="flex h-10 items-center justify-between w-full bg-white rounded-md border border-zinc-400 shadow-shadow-sm px-3 py-2 relative">
                      <span className="font-text-small-leading-normal-regular text-zinc-950 text-sm">
                        ${dynamicData.dealData.fees.toFixed(2)}
                      </span>
                        <img
                            onClick={() => setIsFeesModalOpen(true)}
                            className="w-4 h-4 cursor-pointer hover:opacity-70"
                            alt="Pencil line"
                            src={`${import.meta.env.BASE_URL}pencil-line.svg`}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="w-full" />

                  {/* Cash down row */}
                  <div className="flex items-start gap-4 w-full">
                    <div className="flex flex-col items-start gap-2 flex-1">
                      <div className="flex w-full items-center gap-2">
                        <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                          Cash Down
                        </label>
                      </div>
                      <div className="w-full">
                        <CurrencyInput
                            className="h-10 px-3 py-1 bg-white rounded-md border-zinc-400 shadow-shadow-sm"
                            value={dynamicData.dealData.cashDown}
                            onChange={(value) => updateDealData('cashDown', value)}
                            onBlur={() => calculateDeal('step4:cashDown', dynamicData.dealData.cashDown, { unformatCurrency: true })}
                        />
                      </div>
                    </div>
                    <div className="flex-1" />
                  </div>

                  {/* Trade-in toggle */}
                  <div className="flex h-9 items-center gap-2 w-full py-2">
                    <div className="flex items-center gap-2">
                      <Switch
                          className="w-9 h-5 bg-[#d6d9de] rounded-full border-2 border-transparent"
                          checked={isTradeInEnabled}
                          onCheckedChange={handleTradeInToggle}
                      />
                      <label className="font-medium text-zinc-950 text-sm leading-5">
                        Trade-in
                      </label>
                    </div>
                  </div>

                  {/* Trade-in fields - only show when toggle is enabled */}
                  {isTradeInEnabled && (
                      <>
                        <div className="flex items-start gap-4 w-full">
                          <div className="flex flex-col items-start gap-2 flex-1">
                            <div className="flex w-full items-center gap-2">
                              <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                Gross Trade-in
                              </label>
                            </div>
                            <div className="w-full">
                              <CurrencyInput
                                  className="h-10 px-3 py-1 bg-white rounded-md border-zinc-400 shadow-shadow-sm"
                                  value={dynamicData.dealData.grossTradeIn}
                                  onChange={(value) => updateDealData('grossTradeIn', value)}
                                  onBlur={() => calculateDeal('step4:grossTradeIn', dynamicData.dealData.grossTradeIn, { unformatCurrency: true })}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col items-start gap-2 flex-1">
                            <div className="flex w-full items-center gap-2">
                              <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                Trade-in Payoff
                              </label>
                            </div>
                            <div className="w-full">
                              <CurrencyInput
                                  className="h-10 px-3 py-1 bg-white rounded-md border-zinc-400 shadow-shadow-sm"
                                  value={dynamicData.dealData.tradeInPayoff}
                                  onChange={(value) => updateDealData('tradeInPayoff', value)}
                                  onBlur={() => calculateDeal('step4:tradeInPayoff', dynamicData.dealData.tradeInPayoff, { unformatCurrency: true })}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                  )}

                  <Separator className="w-full" />

                  {/* VSC Section */}
                  <div className="flex flex-col items-start gap-4 w-full">
                    {/* VSC toggle */}
                    <div className="flex h-9 items-center gap-2 w-full py-2">
                      <div className="flex items-center gap-2">
                        <Switch
                            className="w-9 h-5 bg-[#d6d9de] rounded-full border-2 border-transparent"
                            checked={isVSCEnabled}
                            onCheckedChange={(enabled) => {
                              handleVSCToggle(enabled);
                              calculateDeal('step4:vscIsEnabled', enabled)
                            }}
                        />
                        <label className="font-medium text-zinc-950 text-sm leading-5">
                          VSC
                        </label>
                      </div>
                    </div>

                    {/* VSC fields - only show when toggle is enabled */}
                    {isVSCEnabled && (
                        <>
                          <div className="flex items-start gap-4 w-full">
                            <div className="flex flex-col items-start gap-2 flex-1">
                              <div className="flex w-full items-center gap-2">
                                <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                  Vendor
                                </label>
                              </div>
                              <Select
                                  value={dynamicData.vscData.selectedVendor}
                                  onValueChange={(value) => {
                                    updateVSCData('selectedVendor', value);
                                    calculateDeal('step4:vscVendor', dynamicData.vscData.selectedVendor);
                                  }}
                              >
                                <SelectTrigger className="h-10 bg-white rounded-md border-zinc-400">
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

                            <div className="flex flex-col items-start gap-2 flex-1">
                              <div className="flex w-full items-center gap-2">
                                <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                  Selling Price
                                </label>
                                {isVSCThirdPartyVendor(dynamicData.vscData.selectedVendor) && (
                                    <img
                                        onClick={() => setIsThirdPartyVSCModalOpen(true)}
                                        className="w-4 h-4 cursor-pointer hover:opacity-70"
                                        alt="Circle questionmark"
                                        src={`${import.meta.env.BASE_URL}circle-questionmark--faq--help--questionaire.svg`}
                                    />
                                )}
                              </div>
                              <div className="w-full">
                                <CurrencyInput
                                    className="h-10 px-3 py-1 bg-white rounded-md border-zinc-400 shadow-shadow-sm"
                                    value={dynamicData.vscData.sellingPrice}
                                    onChange={(value) => {updateVSCData('sellingPrice', value)}}
                                    onBlur={() => calculateDeal('step4:vscSellingPrice', dynamicData.vscData.sellingPrice, { unformatCurrency: true })}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Third-party VSC fields */}
                          {isVSCThirdPartyVendor(dynamicData.vscData.selectedVendor) && (
                              <>
                                {/* Term - Months and Term - Miles */}
                                <div className="flex items-start gap-4 w-full">
                                  <div className="flex flex-col items-start gap-2 flex-1">
                                    <div className="flex w-full items-center gap-2">
                                      <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                        Term - Months (Optional)
                                      </label>
                                    </div>
                                    <Input
                                        type="text"
                                        value={vscTermMonths}
                                        onChange={(e) => setVscTermMonths(e.target.value)}
                                        className="h-10 px-3 py-1 bg-white rounded-md border-zinc-400 shadow-shadow-sm"
                                        placeholder=""
                                    />
                                  </div>

                                  <div className="flex flex-col items-start gap-2 flex-1">
                                    <div className="flex w-full items-center gap-2">
                                      <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                        Term - Miles (Optional)
                                      </label>
                                    </div>
                                    <Input
                                        type="text"
                                        value={vscTermMiles}
                                        onChange={(e) => setVscTermMiles(e.target.value)}
                                        className="h-10 px-3 py-1 bg-white rounded-md border-zinc-400 shadow-shadow-sm"
                                        placeholder=""
                                    />
                                  </div>
                                </div>

                                {/* Unlimited checkboxes */}
                                <div className="flex items-start gap-4 w-full">
                                  <div className="flex flex-col items-start gap-2 flex-1">
                                    <div className="flex items-center gap-3">
                                      <input
                                          type="checkbox"
                                          id="unlimited-months"
                                          checked={unlimitedMonths}
                                          onChange={(e) => setUnlimitedMonths(e.target.checked)}
                                          className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                      />
                                      <label
                                          htmlFor="unlimited-months"
                                          className="font-text-small-leading-normal-regular text-zinc-950 cursor-pointer"
                                      >
                                        Unlimited Months
                                      </label>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-start gap-2 flex-1">
                                    <div className="flex items-center gap-3">
                                      <input
                                          type="checkbox"
                                          id="unlimited-miles"
                                          checked={unlimitedMiles}
                                          onChange={(e) => setUnlimitedMiles(e.target.checked)}
                                          className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                      />
                                      <label
                                          htmlFor="unlimited-miles"
                                          className="font-text-small-leading-normal-regular text-zinc-950 cursor-pointer"
                                      >
                                        Unlimited Miles
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </>
                          )}

                          {/* Additional VSC fields for in-house vendors */}
                          {isVSCInHouseVendor(dynamicData.vscData.selectedVendor) && (
                              <>
                                {/* Coverage Tier */}
                                <div className="flex items-start gap-4 w-full">
                                  <div className="flex flex-col items-start gap-2 flex-1">
                                    <div className="flex w-full items-center gap-2">
                                      <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                        Coverage Tier
                                      </label>
                                    </div>
                                    <Select value={vscCoverageTier}
                                            onValueChange={(value) => {
                                              setVscCoverageTier(value);
                                              calculateDeal('step4:vscTier', value);
                                            }}
                                    >
                                      <SelectTrigger className="h-10 bg-white rounded-md border-zinc-400">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Premium">Premium</SelectItem>
                                        <SelectItem value="Base">Base</SelectItem>
                                        <SelectItem value="Powertrain">Powertrain</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex-1" />
                                </div>

                                {/* Options */}
                                <div className="flex flex-col items-start gap-3 w-full">
                                  <div className="flex w-full items-center gap-2">
                                    <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                      Options
                                    </label>
                                    <img
                                        onClick={() => setIsVSCOptionsModalOpen(true)}
                                        className="w-4 h-4 cursor-pointer hover:opacity-70"
                                        alt="Circle questionmark"
                                        src={`${import.meta.env.BASE_URL}circle-questionmark--faq--help--questionaire.svg`}
                                    />
                                  </div>
                                  <div className="flex flex-col gap-3 w-full">
                                    {[
                                      { id: "roadside", label: "Roadside Assistance (+$95.00)", element: "step4:vscRoadside"},
                                      { id: "tires", label: "Oversized/Undersized Tires", element: "step4:vscTireOption"},
                                      { id: "rideshare", label: "Ride Share/Food Delivery", element: "step4:vscCommercialVehicleOption"},
                                      { id: "mileage", label: "Unlimited Mileage Term", element: "step4:vscUnlimitedMileageOption"}
                                    ].map((option) => (
                                        <div key={option.id} className="flex items-center gap-3">
                                          <input
                                              type="checkbox"
                                              id={`vsc-${option.id}`}
                                              checked={vscOptions.includes(option.id)}
                                              onChange={() => {
                                                handleVSCOptionToggle(option.id);
                                                calculateDeal(option.element, vscOptions.includes(option.id));
                                              }
                                          }
                                              className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                          />
                                          <label
                                              htmlFor={`vsc-${option.id}`}
                                              className="font-text-small-leading-normal-regular text-zinc-950 cursor-pointer"
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                    ))}
                                  </div>
                                </div>

                                {/* VSC Term and Deductible */}
                                <div className="flex items-start gap-4 w-full">
                                  <div className="flex flex-col items-start gap-2 flex-1">
                                    <div className="flex w-full items-center gap-2">
                                      <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                        VSC Term - (Extended)
                                      </label>
                                    </div>
                                    <Select value={vscTerm}
                                            onValueChange={(value) => {
                                              setVscTerm(value);
                                              calculateDeal('step4:vscSelectedMileageAndTerm', value);
                                            }}>
                                      <SelectTrigger className="h-10 bg-white rounded-md border-zinc-400">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="12/12,000">12/12,000</SelectItem>
                                        <SelectItem value="24/24,000">24/24,000</SelectItem>
                                        <SelectItem value="36/36,000">36/36,000</SelectItem>
                                        <SelectItem value="48/48,000">48/48,000</SelectItem>
                                        <SelectItem value="60/60,000">60/60,000</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex flex-col items-start gap-2 flex-1">
                                    <div className="flex w-full items-center gap-2">
                                      <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                        VSC Deductible
                                      </label>
                                    </div>
                                    <Select value={vscDeductible}
                                            onValueChange={(value) => {
                                              setVscDeductible(value);
                                              calculateDeal('step4:vscDeductable', value);
                                            }
                                    }>
                                      <SelectTrigger className="h-10 bg-white rounded-md border-zinc-400">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="$0">$0</SelectItem>
                                        <SelectItem value="$50">$50</SelectItem>
                                        <SelectItem value="$100">$100</SelectItem>
                                        <SelectItem value="$200">$200</SelectItem>
                                        <SelectItem value="$500">$500</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </>
                          )}
                        </>
                    )}
                  </div>

                  <Separator className="w-full" />

                  {/* GAP Section */}
                  <div className="flex flex-col items-start gap-4 w-full">
                    {/* GAP toggle */}
                    <div className="flex h-9 items-center gap-2 w-full py-2">
                      <div className="flex items-center gap-2">
                        <Switch
                            className="w-9 h-5 bg-[#d6d9de] rounded-full border-2 border-transparent"
                            checked={isGAPEnabled}
                            onCheckedChange={(enabled) => {
                              handleGAPToggle(enabled);
                              calculateDeal('step4:gap', enabled)
                            }}

                        />
                        <label className="font-medium text-zinc-950 text-sm leading-5">
                          GAP
                        </label>
                      </div>
                    </div>

                    {/* GAP fields - only show when toggle is enabled */}
                    {isGAPEnabled && (
                        <div className="flex items-start gap-4 w-full">
                          <div className="flex flex-col items-start gap-2 flex-1">
                            <div className="flex w-full items-center gap-2">
                              <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                Vendor
                              </label>
                            </div>
                            <Select
                                value={dynamicData.gapData.selectedVendor}
                                onValueChange={(value) => {
                                  updateGAPData('selectedVendor', value);
                                  calculateDeal('step4:mainGapVendors', dynamicData.gapData.selectedVendor);
                                }}
                            >
                              <SelectTrigger className="h-10 bg-white rounded-md border-zinc-400">
                                <SelectValue placeholder="Select vendor" />
                              </SelectTrigger>
                              <SelectContent>
                                {dynamicData.gapData.availableVendors.map((vendor) => (
                                    <SelectItem key={vendor.value} value={vendor.value}>
                                      {vendor.name}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex flex-col items-start gap-2 flex-1">
                            <div className="flex w-full items-center gap-2">
                              <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                                Selling Price
                              </label>
                            </div>
                            <div className="w-full">
                              <CurrencyInput
                                  className="h-10 px-3 py-1 bg-white rounded-md border-zinc-400 shadow-shadow-sm"
                                  value={dynamicData.gapData.sellingPrice}
                                  onChange={(value) => updateGAPData('sellingPrice', value)}
                                  onBlur={() => calculateDeal('step4:mainGapSellingPriceReact', dynamicData.gapData.sellingPrice, { unformatCurrency: true })}

                              />
                            </div>
                          </div>
                        </div>
                    )}
                  </div>

                  <Separator className="w-full" />

                  {/* Loan Term and Interest Rate row */}
                  <div className="flex items-start gap-4 w-full">
                    <div className="flex flex-col items-start gap-2 flex-1">
                      <div className="flex w-full items-center gap-2">
                        <label className="flex-1 font-text-small-leading-normal-medium text-zinc-950">
                          <span>Term</span>
                        </label>
                      </div>
                      <Select
                          defaultValue={dynamicData.loanTerms.selectedTerm.toString()}
                          onValueChange={(value) => {
                            updateDealData('term', parseInt(value));
                            calculateDeal('step4:term', value.toString());
                          }}
                      >
                        <SelectTrigger className="h-10 bg-white rounded-md border-zinc-400">
                          <SelectValue placeholder="Select term" />
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

                    <div className="flex flex-col items-start gap-2 flex-1">
                      <div className="flex w-full items-center gap-2">
                        <label className="flex-1 font-medium text-zinc-950 text-sm leading-5">
                          Interest Rate
                        </label>
                      </div>
                      <div className="flex h-10 items-center justify-between w-full bg-white rounded-md border border-zinc-400 shadow-shadow-sm px-3 py-2 relative">
                      <span className="font-text-small-leading-normal-regular text-zinc-950">
                        {interestRate}
                      </span>
                        <img
                            onClick={() => setIsInterestRateModalOpen(true)}
                            className="w-4 h-4 cursor-pointer hover:opacity-70"
                            alt="Pencil line"
                            src={`${import.meta.env.BASE_URL}pencil-line.svg`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial summary card */}
              <div className="flex flex-col w-[400px]">
                <Card className="bg-zinc-200 rounded-xl">
                  <CardContent className="flex flex-col items-start gap-6 px-6 py-7">
                    <div className="flex flex-col items-start gap-3 pb-6 w-full">
                      {financialSummary.map((item, index) => (
                          <React.Fragment key={index}>
                            <div
                                className={`flex items-${index === financialSummary.length - 1 ? "start" : "center"} justify-between w-full ${index === financialSummary.length - 1 ? "pt-0" : ""}`}
                            >
                              {/* Special handling for Total Back End row */}
                              {((activeProgram === "purchase" && index === 3) || (activeProgram === "portfolio" && index === 3)) ? (
                                  <div className="w-full">
                                    {/* Check if any vendor is selected before showing collapsible functionality */}
                                    {dynamicData.vscData.selectedVendor || dynamicData.gapData.selectedVendor ? (
                                        <>
                                          <button
                                              onClick={() => setIsTotalBackEndExpanded(!isTotalBackEndExpanded)}
                                              className="flex items-center justify-between w-full py-2 hover:bg-zinc-100 rounded transition-colors"
                                          >
                                            <div className="flex items-center gap-2">
                                              {isTotalBackEndExpanded ? (
                                                  <ChevronUpIcon className="w-4 h-4 text-zinc-500" />
                                              ) : (
                                                  <ChevronDownIcon className="w-4 h-4 text-zinc-500" />
                                              )}
                                              <span className={`font-text-small-leading-normal-${item.isBold ? "semibold" : "regular"} text-zinc-950`}>
                                       {item.label}
                                     </span>
                                            </div>
                                            <span className={`font-text-small-leading-normal-${item.isBold ? "semibold" : "regular"} text-zinc-950 whitespace-nowrap`}>
                                     {item.value}
                                   </span>
                                          </button>

                                          {isTotalBackEndExpanded && (
                                              <div className="mt-3 p-4 bg-white rounded-lg border border-zinc-200 space-y-3">
                                                {getTotalBackEndContent()}
                                              </div>
                                          )}
                                        </>
                                    ) : (
                                        /* Show non-clickable Total Back End when no vendors selected */
                                        <div className="flex items-center justify-between w-full py-2">
                                 <span className={`font-text-small-leading-normal-${item.isBold ? "semibold" : "regular"} text-zinc-950`}>
                                   {item.label}
                                 </span>
                                          <span className={`font-text-small-leading-normal-${item.isBold ? "semibold" : "regular"} text-zinc-950 whitespace-nowrap`}>
                                   {item.value}
                                 </span>
                                        </div>
                                    )}
                                  </div>
                              ) : (
                                  <>
                                    <div
                                        className={`${index === financialSummary.length - 1 ? "flex flex-col" : ""} w-[232px] font-text-small-leading-normal-${item.isBold ? "semibold" : "regular"} text-zinc-950`}
                                    >
                                      {item.label}

                                    </div>
                                    <div className="flex items-center justify-end flex-1">
                                <span
                                    className={`font-text-small-leading-normal-${item.isBold ? "semibold" : "regular"} text-zinc-950 whitespace-nowrap`}
                                >
                                  {item.value}
                                </span>
                                    </div>
                                  </>
                              )}
                            </div>
                            {/* Purchase Program: separators after Paid to Dealer, Discount (Lender Fee), and Total Back End */}
                            {activeProgram === "purchase" && (index === 0 || index === 1 || index === 3) && (
                                <Separator className="w-full bg-zinc-300 h-px" />
                            )}
                            {/* Portfolio Program: separators after Paid to Dealer, Portfolio Profit, and Total Back End */}
                            {activeProgram === "portfolio" && (index === 0 || index === 2 || index === 3) && (
                                <Separator className="w-full bg-zinc-300 h-px" />
                            )}
                          </React.Fragment>
                      ))}
                    </div>

                    <Button className="h-12 w-full bg-[#214361] text-white rounded shadow-shadow-base">
                      <span onClick={handleUpdateCallbackClick}>Update Callback</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <InterestRateModal
            isOpen={isInterestRateModalOpen}
            onClose={() => setIsInterestRateModalOpen(false)}
            currentRate={interestRate}
            onSave={handleInterestRateSave}
        />

        <UpdateCallbackModal
            isOpen={isUpdateCallbackModalOpen}
            onClose={() => setIsUpdateCallbackModalOpen(false)}
            onProceed={handleUpdateCallbackProceed}
        />

        <VSCOptionsModal
            isOpen={isVSCOptionsModalOpen}
            onClose={() => setIsVSCOptionsModalOpen(false)}
        />

        <ThirdPartyVSCModal
            isOpen={isThirdPartyVSCModalOpen}
            onClose={() => setIsThirdPartyVSCModalOpen(false)}
        />

        <TaxesModal
            isOpen={isTaxesModalOpen}
            onClose={() => setIsTaxesModalOpen(false)}
            onSave={handleTaxesSave}
        />

        <FeesModal
            isOpen={isFeesModalOpen}
            onClose={() => setIsFeesModalOpen(false)}
            onSave={handleFeesSave}
        />
      </>
  );
};