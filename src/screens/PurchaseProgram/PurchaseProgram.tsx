import { ApprovalHeaderSection } from "./sections/ApprovalHeaderSection";
import { DealStructureSection } from "./sections/DealStructureSection";
import { TermsAndConditionsSection } from "./sections/TermsAndConditionsSection";

export const PurchaseProgram = (): JSX.Element => {
    return (
        <main className="flex flex-col w-full mx-auto bg-zinc-100">
            <ApprovalHeaderSection/>
            <DealStructureSection />
            <TermsAndConditionsSection />
        </main>
    );
};