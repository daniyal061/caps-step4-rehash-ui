import React from "react";
import { Button } from "../../../../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../../../../components/ui/dialog";

interface UpdateCallbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: () => void;
}

export const UpdateCallbackModal = ({
                                        isOpen,
                                        onClose,
                                        onProceed
                                    }: UpdateCallbackModalProps): JSX.Element => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[600px] bg-white rounded-2xl shadow-lg p-0 border border-gray-200">
                <DialogHeader className="px-8 py-6 border-b-0">
                    <DialogTitle className="text-3xl font-bold text-gray-900 mb-6">
                        Update Callback
                    </DialogTitle>
                </DialogHeader>

                <div className="px-8 pb-8">
                    {/* Reminder Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Reminder: Check Taxes & Fees!
                        </h3>
                        <p className="text-lg text-gray-900 leading-relaxed mb-6">
                            All taxes and fees must be updated manually before sending the deal back to RouteOne.
                        </p>
                    </div>

                    {/* Instructions Section */}
                    <div className="mb-8">
                        <p className="text-lg text-gray-900 leading-relaxed">
                            Click Proceed to send the deal structure to RouteOne, and return to RouteOne to complete the contract validations. If changes are required, you may return to Credit Acceptance.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        {/* Go Back Button */}
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full h-12 text-lg font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Go Back
                        </Button>

                        {/* Proceed Button */}
                        <Button
                            onClick={onProceed}
                            className="w-full h-12 text-lg font-medium rounded-lg bg-[#2c5282] hover:bg-[#2a4f7a] text-white transition-colors"
                        >
                            Proceed
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};