export interface LoanTermItem {
    value: number;
    label: string;
}

export interface LoanTerms {
    availableTerms: LoanTermItem[];
    selectedTerm: number;
}