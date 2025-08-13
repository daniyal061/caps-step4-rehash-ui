import { useState, useEffect } from 'react';
import { Customer } from '../types/Customer';
import { Vehicle } from '../types/Vehicle';
import { DealData } from '../types/DealData';
import { PurchaseProgram } from '../types/PurchaseProgram';
import { PortfolioProgram } from '../types/PortfolioProgram';
import { ApprovalData } from '../types/ApprovalData';
import { LoanTerms } from '../types/LoanTerms';
import { VSCData } from '../types/VSCData';
import { GAPData } from '../types/GAPData';

const isDev = import.meta.env.MODE === 'development';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    setDealRecalculated?: (value: boolean) => void;
    setGapRecalculated?: (value: boolean) => void;
  }
}

// Default data imports
import { customer1Data as defaultCustomer1 } from '../data/customer1Data';
import { customer2Data as defaultCustomer2 } from '../data/customer2Data';
import { vehicleData as defaultVehicle } from '../data/vehicleData';
import { dealData as defaultDeal } from '../data/dealData';
import { purchaseProgramData as defaultPurchase } from '../data/purchaseProgramData';
import { portfolioProgramData as defaultPortfolio } from '../data/portfolioProgramData';
import { approvalData as defaultApproval } from '../data/approvalData';
import { loanTermsData as defaultLoanTerms } from '../data/loanTermsData';
import { vscData as defaultVSC } from '../data/vscData';
import { gapData as defaultGAP } from '../data/gapData';

// Add AlertData interface
export interface AlertData {
  // Error messages arrays
  allErrorMessages: string[];
  vioList: string[];
  downPaymentAdjustmentMessages: string[];
  twgVioList: string[];
  dealVioList: string[];
  vehCondVioList: string[];
  selErrorMessages: string[];
  vscValMsgList: string[];
  allGapErrorMessages: string[];

  // Info messages arrays (blue colored)
  calertonVioList: string[];

  // Single message fields
  warningGenericMsg: string;
  warningText: string;
  extnWarMsgWithVsc: string;
  extnWarMsgNoVsc: string;
  step4NoVscEli: string;
  vscRemovedForCpoVaries: string;
  step4NoVscEliPowTrCpoCombo: string;
  sidRegStateChange: string;
  driverSidRegStateChange: string;
  mlaCoveredMsg: string;
  incompleteDealerTrainingMsg: string;
  vscNotEligibleDeductible: string;
  aggAppInfoChangedMessage: string;

  // Boolean flags for conditional rendering
  anyPopupOpen: boolean;
  showSellingPriceLink: boolean;
  vehSeriesBSChange: boolean;
  vehDmsCostChange: boolean;
  vehDmsSellingPriceChange: boolean;
  warningExistsOnVeh: boolean;
  vscChangeMsgEnable: boolean;
  extnWarrExists: boolean;
  step4NoVSCEnableMsgFlag: boolean;
  vscRemovedForCpoVariesFlag: boolean;
  step4PowerTrainCpoEnableMsgFlag: boolean;
  step4SidMsgFlag: boolean;
  step4DriverStateSidMsgFlag: boolean;
  step4MLACoveredMsgFlag: boolean;
  newDealerTrainingIncomplete: boolean;
  showVscDeductibleMsg: boolean;
  vscEnable: boolean;
  showAggAppInfoChangedMessage: boolean;
}

// Add FeeData interface
export interface FeeData {
  titleFee: {
    amount: number;
    vendorName: string;
  };
  cvrElectronicFilingFee: {
    amount: number;
    vendorName: string;
  };
  lienFilingFee: {
    amount: number;
    vendorName: string;
  };
  registrationFee: {
    amount: number;
    vendorName: string;
  };
  docFee: {
    amount: number;
    vendorName: string;
  };
  totalFees: number;
}

// Default alert data
const defaultAlertData: AlertData = {
  // Error messages arrays
  allErrorMessages: [],
  vioList: [],
  downPaymentAdjustmentMessages: [],
  twgVioList: [],
  dealVioList: [],
  vehCondVioList: [],
  selErrorMessages: [],
  vscValMsgList: [],
  allGapErrorMessages: [],

  // Info messages arrays (blue colored)
  calertonVioList: [],

  // Single message fields
  warningGenericMsg: "",
  warningText: "",
  extnWarMsgWithVsc: "",
  extnWarMsgNoVsc: "",
  step4NoVscEli: "",
  vscRemovedForCpoVaries: "",
  step4NoVscEliPowTrCpoCombo: "",
  sidRegStateChange: "",
  driverSidRegStateChange: "",
  mlaCoveredMsg: "",
  incompleteDealerTrainingMsg: "",
  vscNotEligibleDeductible: "",
  aggAppInfoChangedMessage: "",

  // Boolean flags for conditional rendering
  anyPopupOpen: false,
  showSellingPriceLink: false,
  vehSeriesBSChange: false,
  vehDmsCostChange: false,
  vehDmsSellingPriceChange: false,
  warningExistsOnVeh: false,
  vscChangeMsgEnable: false,
  extnWarrExists: false,
  step4NoVSCEnableMsgFlag: false,
  vscRemovedForCpoVariesFlag: false,
  step4PowerTrainCpoEnableMsgFlag: false,
  step4SidMsgFlag: false,
  step4DriverStateSidMsgFlag: false,
  step4MLACoveredMsgFlag: false,
  newDealerTrainingIncomplete: false,
  showVscDeductibleMsg: false,
  vscEnable: true,
  showAggAppInfoChangedMessage: false,
};

export interface DynamicDataState {
  customer1: Customer;
  customer2: Customer;
  vehicle: Vehicle;
  dealData: DealData;
  purchaseProgram: PurchaseProgram;
  portfolioProgram: PortfolioProgram;
  approval: ApprovalData;
  loanTerms: LoanTerms;
  vscData: VSCData;
  gapData: GAPData;
  alertData: AlertData;
  vscEnabled: boolean;
  gapEnabled: boolean;
}

export const useDynamicData = () => {
  const [data, setData] = useState<DynamicDataState>({
    customer1: defaultCustomer1,
    customer2: defaultCustomer2,
    vehicle: defaultVehicle,
    dealData: defaultDeal,
    purchaseProgram: defaultPurchase,
    portfolioProgram: defaultPortfolio,
    approval: defaultApproval,
    loanTerms: defaultLoanTerms,
    vscData: defaultVSC,
    gapData: defaultGAP,
    alertData: defaultAlertData,
    vscEnabled: false,
    gapEnabled: false,
    feeData: { // Initialize fee data
      titleFee: {
        amount: 0,
        vendorName: "",
      },
      cvrElectronicFilingFee: {
        amount: 0,
        vendorName: "",
      },
      lienFilingFee: {
        amount: 0,
        vendorName: "",
      },
      registrationFee: {
        amount: 0,
        vendorName: "",
      },
      docFee: {
        amount: 0,
        vendorName: "",
      },
      totalFees: 0,
    },
  });

  // To ensure the rehash flow is set correctly
  useEffect(() => {
    console.log("Setting up rehash flow button click");
    const jsfButton = document.getElementById('rehashForm:step4RehashFlow') as HTMLButtonElement;
    console.log("Rehash button element:", jsfButton);
    if (jsfButton) {
        console.log("Clicking rehash button");
      jsfButton.click();
    }
  }, []);
  const [dealRecalculated, setDealRecalculated] = useState(true);
  const [gapRecalculated, setGapRecalculated] = useState(false);

  useEffect(() => {
    window.setDealRecalculated = setDealRecalculated;
  }, []);

  useEffect(() => {
    window.setGapRecalculated = setGapRecalculated;
  }, []);

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

  // Helper functions for alert data parsing
  const getValueFromInput = (id: string): string[] => {
    const el = document.getElementById("step4:" + id) as HTMLInputElement | null;
    const rawValue = el?.value?.trim();

    if (!rawValue || rawValue === "[]" || rawValue === "{}") return [];

    try {
      const parsed = JSON.parse(rawValue);

      if (Array.isArray(parsed)) {
        return parsed
        .map(item => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean); // remove empty strings
      }

      if (typeof parsed === "string") {
        return [parsed.trim()];
      }

      // If it's an object or something else, discard
      return [];
    } catch (_) {
      // Not JSON — treat as a regular string
      return rawValue ? [rawValue] : [];
    }
  };

  const getStringFromInput = (id: string): string => {
    const el = document.getElementById("step4:" + id) as HTMLInputElement | null;
    return el?.value?.trim() || "";
  };

  // Load customer data from DOM
  useEffect(() => {
    const customer1Name = getDOMValue('step4:customer1Name', isDev ? defaultCustomer1.name : undefined);
    const customer1Phone = getDOMValue('step4:customer1Phone', isDev ? defaultCustomer1.phone : undefined);
    const customer1Email = getDOMValue('step4:customer1Email', isDev ? defaultCustomer1.email: undefined);
    const customer1Address = getDOMValue('step4:customer1Address', isDev ? defaultCustomer1.address || '' : undefined);
    const customer1CreditScore = getDOMValue('step4:customer1CreditScore', isDev ? defaultCustomer1.creditScore : undefined);
    const customer1Eligibility = getDOMValue('step4:customer1Eligibility', isDev ? defaultCustomer1.eligibility || '' : undefined);

    const customer2Name = getDOMValue('step4:customer2Name', isDev ? defaultCustomer2.name : undefined);
    const customer2Phone = getDOMValue('step4:customer2Phone', isDev ? defaultCustomer2.phone : undefined);
    const customer2Email = getDOMValue('step4:customer2Email', isDev ? defaultCustomer2.email : undefined);
    const customer2CreditScore = getDOMValue('step4:customer2CreditScore', isDev ? defaultCustomer2.creditScore : undefined);

    setData(prev => ({
      ...prev,
      customer1: {
        name: customer1Name,
        phone: customer1Phone,
        email: customer1Email,
        address: customer1Address,
        creditScore: customer1CreditScore,
        eligibility: customer1Eligibility,
      },
      customer2: {
        name: customer2Name,
        phone: customer2Phone,
        email: customer2Email,
        creditScore: customer2CreditScore,
      },
    }));
  }, []);

  // Load vehicle data from DOM
  useEffect(() => {
    const vehicleSummary = getDOMValue('step4:carYearMakeModelTrim', defaultVehicle.summary);
    const vehicleId = getDOMValue('step4:vehicleId', defaultVehicle.id);

    setData(prev => ({
      ...prev,
      vehicle: {
        id: vehicleId,
        summary: vehicleSummary,
      },
    }));
  }, []);

  // Load deal data from DOM
  useEffect(() => {
    const sellingPrice = parseNumber(getDOMValue('step4:sellingPrice'), defaultDeal.sellingPrice);
    const taxes = parseNumber(getDOMValue('step4:totalTaxAmount'), defaultDeal.taxes);
    const fees = parseNumber(getDOMValue('step4:fees'), defaultDeal.fees);
    const term = parseNumber(getDOMValue('step4:term'), defaultDeal.term);

    let interestRateWholeNumber = getDOMValue('step4:interestRateText');
    let interestRateFraction = getDOMValue('step4:selectInterestRateFraction');
    const interestRate = parseNumber(interestRateWholeNumber + '.' + interestRateFraction, defaultDeal.interestRate);
    const cashDown = parseNumber(getDOMValue('step4:cashDown'), defaultDeal.cashDown);
    const grossTradeIn = parseNumber(getDOMValue('step4:grossTradeIn'), defaultDeal.grossTradeIn);
    const tradeInPayoff = parseNumber(getDOMValue('step4:tradeInPayoff'), defaultDeal.tradeInPayoff);
    const vsc = parseNumber(getDOMValue('step4:vsc'), defaultDeal.vsc);
    const gap = parseNumber(getDOMValue('step4:gap'), defaultDeal.gap);
    const otherBackEnd = parseNumber(getDOMValue('step4:otherBackEnd'), defaultDeal.otherBackEnd);

    // Determine if trade-in is enabled based on values
    const tradeInEnabled = grossTradeIn > 0 || tradeInPayoff > 0;

    setData(prev => ({
      ...prev,
      dealData: {
        sellingPrice,
        taxes,
        fees,
        term,
        interestRate,
        cashDown,
        tradeInEnabled,
        grossTradeIn,
        tradeInPayoff,
        vsc,
        gap,
        otherBackEnd,
      },
    }));
  }, []);

  // Load approval data from DOM
  useEffect(() => {
    const approvalId = getDOMValue('step4:approvalId', defaultApproval.approvalId);
    const firstPaymentDate = getDOMValue('step4:firstPaymentDate', defaultApproval.firstPaymentDate);

    setData(prev => ({
      ...prev,
      approval: {
        approvalId,
        firstPaymentDate,
      },
    }));
  }, []);

  // Load loan terms data from DOM
  useEffect(() => {
    const termItemsEl = document.getElementById("step4:termItemsJson") as HTMLInputElement | null;
    const selectedTermEl = document.getElementById("step4:selectedTerm") as HTMLInputElement | null;
    console.log('Term items element:', termItemsEl);
    console.log('Selected term element:', selectedTermEl);

    let availableTerms = defaultLoanTerms.availableTerms;
    let selectedTerm = defaultLoanTerms.selectedTerm;

    // Helper function to extract numeric value from term string like "72 ($0.0)"
    const extractTermValue = (termString: string): number => {
      const match = termString.match(/^(\d+)/);
      return match ? parseInt(match[1]) : 0;
    };

    console.log('Extracted term value function:', extractTermValue);

    // Parse available terms from JSON
    if (termItemsEl && termItemsEl.value) {
      console.log('Parsing term items JSON:', termItemsEl.value);
      try {
        const parsedTerms = JSON.parse(termItemsEl.value);
        console.log('Parsed terms:', parsedTerms);
        if (Array.isArray(parsedTerms)) {
          availableTerms = parsedTerms
          .filter(term => !term.disabled && !term.noSelectionOption)
          .map(term => {
            const numericValue = extractTermValue(term.value);
            return {
              value: numericValue,
              label: `${numericValue}`
            };
          });
        }
      } catch (error) {
        console.warn('Failed to parse loan terms JSON:', error);
      }
    }

    // Get selected term
    if (selectedTermEl && selectedTermEl.value) {
      console.log('Selected term element value:', selectedTermEl.value);
      const selectedValue = extractTermValue(selectedTermEl.value);
      if (selectedValue > 0) {
        selectedTerm = selectedValue;
      }
    }

    console.log('Parsed loan terms:', { availableTerms, selectedTerm });

    setData(prev => ({
      ...prev,
      loanTerms: {
        availableTerms,
        selectedTerm,
      },
    }));
  }, []);

  // Load VSC vendor data from DOM
  useEffect(() => {
    // Only load VSC data if VSC is enabled
    if (!data.vscEnabled) {
      setData(prev => ({
        ...prev,
        vscData: {
          ...prev.vscData,
          selectedVendor: '',
          sellingPrice: defaultVSC.sellingPrice,
        },
      }));
      return;
    }

    const parseVSCVendorItems = (jsonString: string, defaultVendors: any[]) => {
      try {
        const parsedVendors = JSON.parse(jsonString);
        if (Array.isArray(parsedVendors)) {
          return parsedVendors
          .filter(vendor => !vendor.disabled && !vendor.noSelectionOption)
          .map(vendor => ({
            value: vendor.value,
            label: vendor.label,
          }));
        }
      } catch (error) {
        console.warn('Failed to parse vendor JSON:', error);
      }
      return defaultVendors;
    };

    const vscVendorItemsEl = document.getElementById('step4:vscVendorList') as HTMLInputElement | null;
    console.log('VSC vendor items element:', vscVendorItemsEl);
    const vscSelectedVendorEl = document.getElementById('step4:vscSelectedVendorCode') as HTMLInputElement | null;
    console.log('VSC selected vendor element:', vscSelectedVendorEl);
    const vscSellingPriceEl = document.getElementById('step4:vscSelectedVendorSellingPrice') as HTMLInputElement | null;
    console.log('VSC selling price element:', vscSellingPriceEl);

    let vscVendors = defaultVSC.availableVendors;
    let vscSelectedVendor = defaultVSC.selectedVendor;
    let vscSellingPrice = defaultVSC.sellingPrice;

    if (vscVendorItemsEl && vscVendorItemsEl.value) {
      console.log('Parsing VSC vendor items JSON:', vscVendorItemsEl.value);
      vscVendors = parseVSCVendorItems(vscVendorItemsEl.value, defaultVSC.availableVendors);
    }

    if (vscSelectedVendorEl && vscSelectedVendorEl.value) {
      console.log('VSC selected vendor element value:', vscSelectedVendorEl.value);
      vscSelectedVendor = vscSelectedVendorEl.value;
    }

    if (vscSellingPriceEl && vscSellingPriceEl.value) {
      console.log('VSC selling price element value:', vscSellingPriceEl.value);
      vscSellingPrice = parseNumber(vscSellingPriceEl.value, 0);
    } else {
      vscSellingPrice = 0;
    }

    console.log('Parsed VSC data:', {
      vendors: vscVendors,
      selected: vscSelectedVendor,
      price: vscSellingPrice
    });

    setData(prev => ({
      ...prev,
      vscData: {
        availableVendors: vscVendors,
        selectedVendor: vscSelectedVendor,
        sellingPrice: vscSellingPrice,
      },
    }));
  }, [data.vscEnabled]);

  useEffect(() => {
    console.log("Gap recalculated effect, gapRecalculated:", gapRecalculated);
    const gapInHouseVendorErrorsList = getValueFromInput("gapInHouseVendorErrorsList");
    console.log('GAP in-house vendor errors element:', gapInHouseVendorErrorsList);
    const gapTPAPVendorErrorsList = getValueFromInput("gapTPAPVendorErrorsList");
    console.log('GAP TPAP vendor errors element:', gapTPAPVendorErrorsList);
    if(gapRecalculated){
      if ((gapInHouseVendorErrorsList && gapInHouseVendorErrorsList.length > 0) || (gapTPAPVendorErrorsList && gapTPAPVendorErrorsList.length > 0)) {
        console.log("GAP errors found, skipping apply button click");
      }else{
        const selectedGapVendorEl  = document.getElementById('step4:mainGapVendors') as HTMLInputElement | null;
        console.log('Selected GAP vendor element:', selectedGapVendorEl);
        const mainGapSellingPriceEl = document.getElementById('step4:mainGapSellingPriceReact') as HTMLInputElement | null;
        console.log('Main GAP selling price element:', mainGapSellingPriceEl);
        if(selectedGapVendorEl && selectedGapVendorEl.value && mainGapSellingPriceEl && mainGapSellingPriceEl.value){
          console.log("Triggering GAP apply button");
          const jsfButton = document.getElementById('gapForm:mainGapSaveBtn') as HTMLButtonElement;
          if (jsfButton) {
            jsfButton.click();
          }
          console.log("GAP apply button clicked");
        }else{
          console.log("GAP elements not found or empty, skipping apply button click");
        }
      }
      setGapRecalculated(false);
    }
    setData(prev => ({
      ...prev,
      alertData: {
        ...prev.alertData,
        allGapErrorMessages: [
            ...gapInHouseVendorErrorsList,
            ...gapTPAPVendorErrorsList
        ],
      },
    }));
  }, [gapRecalculated]);

// Load GAP vendor data from DOM
  useEffect(() => {
    // Only load GAP data if GAP is enabled
    if (!data.gapEnabled) {
      setData(prev => ({
        ...prev,
        gapData: {
          ...prev.gapData,
          selectedVendor: '',
          sellingPrice: defaultGAP.sellingPrice,
        },
      }));
      return;
    }

    if(dealRecalculated){
      const parseGAPVendorItems = (jsonString: string, defaultVendors: any[]) => {
        try {
          const parsedVendors = JSON.parse(jsonString);
          if (Array.isArray(parsedVendors)) {
            return parsedVendors
            .filter(vendor => !vendor.disabled && !vendor.noSelectionOption)
            .map(vendor => ({
              code: vendor.code,
              name: vendor.name,
              defaultVendor: vendor.defaultVendor || false,
              vendorType: vendor.vendorType || 'UNKNOWN',
            }));
          }
        } catch (error) {
          console.warn('Failed to parse GAP vendor JSON:', error);
        }
        return defaultVendors;
      };

      // GAP Vendor Data
      const gapVendorItemsEl = document.getElementById('step4:gapVendorList') as HTMLInputElement | null;
      const gapSelectedVendorEl = document.getElementById('step4:gapSelectedVendorCode') as HTMLInputElement | null;
      const gapSellingPriceEl = document.getElementById('step4:gapSelectedVendorSellingPrice') as HTMLInputElement | null;

      console.log('GAP vendor items element:', gapVendorItemsEl);
      console.log('GAP selected vendor element:', gapSelectedVendorEl);
      console.log('GAP selling price element:', gapSellingPriceEl);

      let gapVendors = defaultGAP.availableVendors;
      let gapSelectedVendor = defaultGAP.selectedVendor;
      let gapSellingPrice = defaultGAP.sellingPrice;

      if (gapVendorItemsEl && gapVendorItemsEl.value) {
        gapVendors = parseGAPVendorItems(gapVendorItemsEl.value, defaultGAP.availableVendors);
      }

      if (gapSelectedVendorEl && gapSelectedVendorEl.value) {
        gapSelectedVendor = gapSelectedVendorEl.value;
      }

      if (gapSellingPriceEl && gapSellingPriceEl.value) {
        gapSellingPrice = parseNumber(gapSellingPriceEl.value, 0);
      } else {
        gapSellingPrice = 0;
      }

      console.log('Parsed GAP data:', {
        vendors: gapVendors,
        selected: gapSelectedVendor,
        price: gapSellingPrice
      });

      setData(prev => ({
        ...prev,
        gapData: {
          availableVendors: gapVendors,
          selectedVendor: gapSelectedVendor,
          sellingPrice: gapSellingPrice,
        },
      }));

      setDealRecalculated(false);
    }
  }, [data.gapEnabled, dealRecalculated]);

  // Load program data from DOM
  useEffect(() => {
    if (dealRecalculated) {
      // Purchase Program
      const purchasePaidToDealer = parseNumber(getDOMValue('step4:purchaseProgramAmountPaidToDealer'), defaultPurchase.paidToDealer);
      const purchaseDiscountLenderFee = parseNumber(getDOMValue('step4:purchaseProgramDiscountLenderFee'), defaultPurchase.discountLenderFee);
      const purchaseFlat = parseNumber(getDOMValue('step4:purchaseProgramFlat'), defaultPurchase.flat);

      const purchaseTotalBackEndGap = parseNumber(getDOMValue('step4:purchaseProgramTotalBackEndGapCommission'), defaultPurchase.totalBackEnd);
      const purchaseTotalBackEndVsc = parseNumber(getDOMValue('step4:purchaseProgramTotalBackEndVscCommission'), defaultPurchase.totalBackEnd);
      const purchaseTotalBackEnd = purchaseTotalBackEndGap + purchaseTotalBackEndVsc;

      const purchaseAmountFinanced = parseNumber(getDOMValue('step4:purchaseProgramAmountFinanced'), defaultPurchase.amountFinanced);
      const purchaseMonthlyPayment = parseNumber(getDOMValue('step4:purchaseProgramMonthlyPayment'), defaultPurchase.monthlyPayment);

      // Portfolio Program
      const portfolioPaidToDealer = parseNumber(getDOMValue('step4:portfolioProgramAmountPaidToDealer'), defaultPortfolio.paidToDealer);
      const portfolioInitialProfit = parseNumber(getDOMValue('step4:portfolioProgramInitialProfit'), defaultPortfolio.initialProfit);
      const portfolioPortfolioProfit = parseNumber(getDOMValue('step4:portfolioProgramPortfolioProfit'), defaultPortfolio.portfolioProfit);
      const portfolioFlat = parseNumber(getDOMValue('step4:portfolioProgramFlat'), defaultPortfolio.flat);

      const portfolioTotalBackEndGap = parseNumber(getDOMValue('step4:portfolioProgramTotalBackEndGapCommission'), defaultPortfolio.totalBackEnd);
      const portfolioTotalBackEndVsc = parseNumber(getDOMValue('step4:portfolioProgramTotalBackEndVscCommission'), defaultPortfolio.totalBackEnd);
      const portfolioTotalBackEnd = portfolioTotalBackEndGap + portfolioTotalBackEndVsc;

      const portfolioAmountFinanced = parseNumber(getDOMValue('step4:portfolioProgramAmountFinanced'), defaultPortfolio.amountFinanced);
      const portfolioMonthlyPayment = parseNumber(getDOMValue('step4:portfolioProgramMonthlyPayment'), defaultPortfolio.monthlyPayment);

      console.log("SETTING ALERT DATA");
      // Get all the arrays
      const allErrorMessages = getValueFromInput("allErrorMessages");
      const vioList = getValueFromInput("vioList");
      const downPaymentAdjustmentMessages = getValueFromInput("downPaymentAdjustmentMessages");
      const calertonVioList = getValueFromInput("calertonVioList");
      const twgVioList = getValueFromInput("twgVioList");
      const dealVioList = getValueFromInput("dealVioList");
      const vehCondVioList = getValueFromInput("vehCondVioList");
      const selErrorMessages = getValueFromInput("selErrorMessages");
      const vscValMsgList = getValueFromInput("vscValMsgList");

      // Get single message strings
      const warningGenericMsg = getStringFromInput("warningGenericMsg");
      const warningText = getStringFromInput("warningText");
      const extnWarMsgWithVsc = getStringFromInput("extnWarMsgWithVsc");
      const extnWarMsgNoVsc = getStringFromInput("extnWarMsgNoVsc");
      const step4NoVscEli = getStringFromInput("step4NoVscEli");
      const vscRemovedForCpoVaries = getStringFromInput("vscRemovedForCpoVaries");
      const step4NoVscEliPowTrCpoCombo = getStringFromInput("step4NoVscEliPowTrCpoCombo");
      const sidRegStateChange = getStringFromInput("sidRegStateChange");
      const driverSidRegStateChange = getStringFromInput("driverSidRegStateChange");
      const mlaCoveredMsg = getStringFromInput("mlaCoveredMsg");
      const incompleteDealerTrainingMsg = getStringFromInput("incompleteDealerTrainingMsg");
      const vscNotEligibleDeductible = getStringFromInput("vscNotEligibleDeductible");
      const aggAppInfoChangedMessage = getStringFromInput("aggAppInfoChangedMessage");

      // Get boolean flags
      const anyPopupOpen = getBooleanFromInput("anyPopupOpen");
      const showSellingPriceLink = getBooleanFromInput("showSellingPriceLink");
      const vehSeriesBSChange = getBooleanFromInput("vehSeriesBSChange");
      const vehDmsCostChange = getBooleanFromInput("vehDmsCostChange");
      const vehDmsSellingPriceChange = getBooleanFromInput("vehDmsSellingPriceChange");
      const warningExistsOnVeh = getBooleanFromInput("warningExistsOnVeh");
      const vscChangeMsgEnable = getBooleanFromInput("vscChangeMsgEnable");
      const extnWarrExists = getBooleanFromInput("extnWarrExists");
      const step4NoVSCEnableMsgFlag = getBooleanFromInput("step4NoVSCEnableMsgFlag");
      const vscRemovedForCpoVariesFlag = getBooleanFromInput("vscRemovedForCpoVariesFlag");
      const step4PowerTrainCpoEnableMsgFlag = getBooleanFromInput("step4PowerTrainCpoEnableMsgFlag");
      const step4SidMsgFlag = getBooleanFromInput("step4SidMsgFlag");
      const step4DriverStateSidMsgFlag = getBooleanFromInput("step4DriverStateSidMsgFlag");
      const step4MLACoveredMsgFlag = getBooleanFromInput("step4MLACoveredMsgFlag");
      const newDealerTrainingIncomplete = getBooleanFromInput("newDealerTrainingIncomplete");
      const showVscDeductibleMsg = getBooleanFromInput("showVscDeductibleMsg");
      const vscEnable = getBooleanFromInput("vscEnable");
      const showAggAppInfoChangedMessage = getBooleanFromInput("showAggAppInfoChangedMessage");

      console.log("ON RECALCULATED DEAL COMPLETE");
      setData(prev => ({
        ...prev,
        purchaseProgram: {
          paidToDealer: purchasePaidToDealer,
          discountLenderFee: purchaseDiscountLenderFee,
          flat: purchaseFlat,
          totalBackEnd: purchaseTotalBackEnd,
          amountFinanced: purchaseAmountFinanced,
          monthlyPayment: purchaseMonthlyPayment,
        },
        portfolioProgram: {
          paidToDealer: portfolioPaidToDealer,
          initialProfit: portfolioInitialProfit,
          portfolioProfit: portfolioPortfolioProfit,
          flat: portfolioFlat,
          totalBackEnd: portfolioTotalBackEnd,
          amountFinanced: portfolioAmountFinanced,
          monthlyPayment: portfolioMonthlyPayment,
        },
        alertData: {
          allErrorMessages,
          vioList,
          downPaymentAdjustmentMessages,
          calertonVioList,
          twgVioList,
          dealVioList,
          vehCondVioList,
          selErrorMessages,
          vscValMsgList,
          allGapErrorMessages: [],
          warningGenericMsg,
          warningText,
          extnWarMsgWithVsc,
          extnWarMsgNoVsc,
          step4NoVscEli,
          vscRemovedForCpoVaries,
          step4NoVscEliPowTrCpoCombo,
          sidRegStateChange,
          driverSidRegStateChange,
          mlaCoveredMsg,
          incompleteDealerTrainingMsg,
          vscNotEligibleDeductible,
          aggAppInfoChangedMessage,
          anyPopupOpen,
          showSellingPriceLink,
          vehSeriesBSChange,
          vehDmsCostChange,
          vehDmsSellingPriceChange,
          warningExistsOnVeh,
          vscChangeMsgEnable,
          extnWarrExists,
          step4NoVSCEnableMsgFlag,
          vscRemovedForCpoVariesFlag,
          step4PowerTrainCpoEnableMsgFlag,
          step4SidMsgFlag,
          step4DriverStateSidMsgFlag,
          step4MLACoveredMsgFlag,
          newDealerTrainingIncomplete,
          showVscDeductibleMsg,
          vscEnable,
          showAggAppInfoChangedMessage,
        },
      }));

      setDealRecalculated(false);
    }
  }, [dealRecalculated]);

  // Update deal data
  const updateDealData = (field: keyof DealData, value: number | boolean) => {
    setData(prev => {
      const updatedDealData = {
        ...prev.dealData,
        [field]: value
      };

      // If toggling off trade-in, reset values
      if (field === 'tradeInEnabled' && value === false) {
        updatedDealData.grossTradeIn = 0;
        updatedDealData.tradeInPayoff = 0;
      }

      return {
        ...prev,
        dealData: updatedDealData,
      };
    });
  };

  // Update VSC data
  const updateVSCData = (field: keyof VSCData, value: string | number) => {
    setData(prev => ({
      ...prev,
      vscData: {
        ...prev.vscData,
        [field]: value,
      },
    }));
  };

  // Update GAP data
  const updateGAPData = (field: keyof GAPData, value: string | number) => {
    setData(prev => ({
      ...prev,
      gapData: {
        ...prev.gapData,
        [field]: value,
      },
    }));
  };

  // Update alert data
  const updateAlertData = (field: keyof AlertData, value: any) => {
    console.log("UPDATE ALERT DATA")
    setData(prev => ({
      ...prev,
      alertData: {
        ...prev.alertData,
        [field]: value,
      },
    }));
  };

  // Handle update callback - triggers deal recalculation
  const handleUpdateCallback = () => {
    console.log("Triggering deal recalculation...");
    // Trigger the deal recalculation by setting the flag
    setDealRecalculated(true);

    // If there's a JSF form submit method available, call it
    const form = document.getElementById('calculateDealForm') as HTMLFormElement;
    if (form) {
      // Look for a submit button or action that triggers deal calculation
      const submitButton = form.querySelector('[type="submit"], [onclick*="calculate"], [onclick*="submit"]') as HTMLElement;
      if (submitButton) {
        submitButton.click();
      } else {
        // Fallback: dispatch a custom event that JSF might be listening for
        form.dispatchEvent(new CustomEvent('dealUpdate', { bubbles: true }));
      }
    }
  };

  return {
    data,
    updateDealData,
    updateVSCData,
    updateGAPData,
    updateAlertData, // Export the new update function
    handleUpdateCallback, // Export the handleUpdateCallback function
  };
};

export const onRecalculatedDeal = () => {
  window.setDealRecalculated(true);
  console.log("ON RECALCULATED DEAL");
};

export const onRecalculatedDealError = (error) => {
  console.log("ON RECALCULATED DEAL ERROR: " + error?.errorMessage);
};

export const onRecalculatedGap = () => {
  window.setGapRecalculated(true);
  console.log("ON GAP RECALCULATED");
}

export const onRecalculatedGapError = (error) => {
  console.log("ON GAP RECALCULATED ERROR: " + error?.errorMessage);
};

export const getBooleanFromInput = (id: string): boolean => {
  const el = document.getElementById("step4:" + id) as HTMLInputElement | null;
  const value = el?.value?.trim().toLowerCase();
  console.log(`getBooleanFromInput(${id}):`, {
    element: el,
    rawValue: el?.value,
    trimmedValue: value,
    result: value === "true" || value === "1"
  });
  return value === "true" || value === "1";
};


