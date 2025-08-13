import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../../../../components/ui/dialog";

interface VSCOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const VSCOptionsModal = ({
                                    isOpen,
                                    onClose
                                }: VSCOptionsModalProps): JSX.Element => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[600px] bg-white rounded-2xl shadow-lg p-0 border border-gray-200">
                <DialogHeader className="px-8 py-6">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Options
                    </DialogTitle>
                </DialogHeader>

                <div className="px-8 pb-8">
                    {/* VSC Coverage Tiers Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            VSC Coverage Tiers
                        </h3>
                        <ul className="space-y-3 text-base text-gray-900 leading-relaxed">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>
                  <strong>Powertrain:</strong> Stated component coverage ($385 dealer profit). Not available for new or CPO vehicles.
                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>
                  <strong>Base:</strong> Powertrain plus additional listed components ($535 daler profit)
                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>
                  <strong>Premium:</strong> Exclusionary maximum coverage ($885 dealer profit). Available only for vehicles under 10 years and 100,000 miles.
                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Oversized/Undersized Tires Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Oversized/Undersized Tires
                        </h3>
                        <p className="text-base text-gray-900 leading-relaxed">
                            Provides coverage for breakdowns caused by Oversized/Undersized tires that are within +/- 20% of OEM size.
                        </p>
                    </div>

                    {/* Ride Share/Food Delivery Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Ride Share/Food Delivery
                        </h3>
                        <p className="text-base text-gray-900 leading-relaxed">
                            Provides coverage for Ride Share/Food Delivery vehicles. Unlimited mileage not available when selected.
                        </p>
                    </div>

                    {/* Unlimited Mileage Term Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Unlimited Mileage Term
                        </h3>
                        <p className="text-base text-gray-900 leading-relaxed">
                            Eligible for vehicles less than 8 years old and less than 80,000 miles. Not available for Ride Share / Food Delivery vehicles.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};