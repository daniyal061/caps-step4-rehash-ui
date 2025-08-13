import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../../../../components/ui/dialog";

interface ThirdPartyVSCModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ThirdPartyVSCModal = ({
                                       isOpen,
                                       onClose
                                   }: ThirdPartyVSCModalProps): JSX.Element => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[800px] bg-white rounded-2xl shadow-lg p-0 border border-gray-200">
                <DialogHeader className="px-8 py-6">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Vehicle Service Contract
                    </DialogTitle>
                </DialogHeader>

                <div className="px-8 pb-8">
                    {/* VSC Terms Warning */}
                    <div className="mb-6">
                        <p className="text-base text-gray-900 leading-relaxed">
                            VSC Terms entered into CAPS must match terms on VSC Certificate.
                            Funding may be delayed if items do not match.
                        </p>
                    </div>

                    {/* Manufacturer's Warranty Info */}
                    <div className="mb-8">
                        <p className="text-base text-gray-900 leading-relaxed">
                            Manufacturer's Warranty remains on Vehicle. VSC Terms cannot be less
                            than 64 months/64,00 miles.
                        </p>
                    </div>

                    {/* VSC Amount Financed Limits Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            VSC Amount Financed Limits by Book Value
                        </h3>
                        <p className="text-base text-gray-900 leading-relaxed mb-6">
                            Book Value of current vehicle: $22,484.00
                        </p>

                        {/* Table */}
                        <div className="border border-gray-300 rounded-lg overflow-auto">
                            {/* Table Header */}
                            <div className="bg-gray-200 flex">
                                <div className="flex-1 px-4 py-3 font-semibold text-gray-900 border-r border-gray-300">
                                    Book value of vehicle (Standard and Silver deals)
                                </div>
                                <div className="w-40 px-4 py-3 font-semibold text-gray-900 text-right">
                                    VSC Max Limit
                                </div>
                            </div>

                            {/* Table Rows */}
                            <div className="bg-white">
                                <div className="flex border-b border-gray-200">
                                    <div className="flex-1 px-4 py-3 text-gray-900 border-r border-gray-300">
                                        $0 - $9,999
                                    </div>
                                    <div className="w-40 px-4 py-3 text-gray-900 text-right">
                                        $3,000
                                    </div>
                                </div>

                                <div className="flex border-b border-gray-200">
                                    <div className="flex-1 px-4 py-3 text-gray-900 border-r border-gray-300">
                                        $10,000 - $14,999
                                    </div>
                                    <div className="w-40 px-4 py-3 text-gray-900 text-right">
                                        $3,200
                                    </div>
                                </div>

                                <div className="flex border-b border-gray-200">
                                    <div className="flex-1 px-4 py-3 text-gray-900 border-r border-gray-300">
                                        $15,000 - $19,999
                                    </div>
                                    <div className="w-40 px-4 py-3 text-gray-900 text-right">
                                        $3,400
                                    </div>
                                </div>

                                <div className="flex border-b border-gray-200">
                                    <div className="flex-1 px-4 py-3 text-gray-900 border-r border-gray-300">
                                        $20,000 - $24,999
                                    </div>
                                    <div className="w-40 px-4 py-3 text-gray-900 text-right">
                                        $3,600
                                    </div>
                                </div>

                                <div className="flex border-b border-gray-200">
                                    <div className="flex-1 px-4 py-3 text-gray-900 border-r border-gray-300">
                                        $25,000 - $29,999
                                    </div>
                                    <div className="w-40 px-4 py-3 text-gray-900 text-right">
                                        $3,800
                                    </div>
                                </div>

                                <div className="flex border-b border-gray-200">
                                    <div className="flex-1 px-4 py-3 text-gray-900 border-r border-gray-300">
                                        $30,000 or more
                                    </div>
                                    <div className="w-40 px-4 py-3 text-gray-900 text-right">
                                        $4,000
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-1 px-4 py-3 text-gray-900 border-r border-gray-300">
                                        Gold and Platinum deals
                                    </div>
                                    <div className="w-40 px-4 py-3 text-gray-900 text-right">
                                        $4,000
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};