export interface GAPVendorItem {
    code: string;
    name: string;
    defaultVendor: boolean;
    vendorType: string;
    disabled?: boolean;
    noSelectionOption?: boolean;
}

export interface GAPData {
    availableVendors: GAPVendorItem[];
    selectedVendor: string;
    sellingPrice: number;
}