export interface VSCVendorItem {
    value: string;
    label: string;
    disabled?: boolean;
    noSelectionOption?: boolean;
}

export interface VSCData {
    availableVendors: VSCVendorItem[];
    selectedVendor: string;
    sellingPrice: number;
}