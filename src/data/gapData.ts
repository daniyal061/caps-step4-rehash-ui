import { GAPData } from '../types/GAPData';

export const gapData: GAPData = {
    availableVendors: [
        { code: "WYNGP", name: "WYNNS-GAP", defaultVendor: true, vendorType: "CAC" },
        { code: "SPP08", name: "SWRE-SPP08", defaultVendor: false, vendorType: "TPAP" },
        { code: "20000", name: "Ally Financial", defaultVendor: false, vendorType: "TPAP" },
        { code: "20352", name: "Allstate", defaultVendor: false, vendorType: "TPAP" },
    ],
    selectedVendor: "WYNGP",
    sellingPrice: 0,
};