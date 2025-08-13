import React from "react";
import { Alert, AlertDescription } from "../../../../../components/ui/alert";
import { AlertData } from "../../../../../hooks/useDynamicData";

export const AlertsContainer: React.FC<{ alertData: AlertData }> = ({ alertData }) => {
    return <Alerts alertData={alertData} />;
};

const Alerts: React.FC<{
    alertData: AlertData;
}> = ({ alertData }) => {
    const {
        allErrorMessages,
        vioList,
        downPaymentAdjustmentMessages,
        calertonVioList,
        twgVioList,
        dealVioList,
        vehCondVioList,
        selErrorMessages,
        vscValMsgList,
        allGapErrorMessages,
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
    } = alertData;

    // Filter down payment messages to only show those containing the specific text
    const filteredDownPaymentMessages = downPaymentAdjustmentMessages.filter(msg =>
        msg.toLowerCase().includes('the cash down payment has been increased from')
    );

    // Check if any alerts should be displayed at all
    const hasAnyAlerts = () => {
        const hasArrayMessages =
            (!anyPopupOpen && allErrorMessages.length > 0) ||
            vioList.length > 0 ||
            filteredDownPaymentMessages.length > 0 ||
            calertonVioList.length > 0 ||
            twgVioList.length > 0 ||
            dealVioList.length > 0 ||
            vehCondVioList.length > 0 ||
            (showSellingPriceLink && selErrorMessages.length > 0) ||
            (!vscEnable && vscValMsgList.length > 0) ||
            allGapErrorMessages.length > 0;

        const hasSingleMessages =
            ((vehSeriesBSChange || vehDmsCostChange || vehDmsSellingPriceChange) && warningGenericMsg) ||
            (warningExistsOnVeh && warningText) ||
            (vscChangeMsgEnable && extnWarrExists && extnWarMsgWithVsc) ||
            (vscChangeMsgEnable && !extnWarrExists && extnWarMsgNoVsc) ||
            (step4NoVSCEnableMsgFlag && step4NoVscEli) ||
            (vscRemovedForCpoVariesFlag && vscRemovedForCpoVaries) ||
            (step4PowerTrainCpoEnableMsgFlag && step4NoVscEliPowTrCpoCombo) ||
            (step4SidMsgFlag && sidRegStateChange) ||
            (step4DriverStateSidMsgFlag && driverSidRegStateChange) ||
            (step4MLACoveredMsgFlag && mlaCoveredMsg) ||
            (newDealerTrainingIncomplete && incompleteDealerTrainingMsg) ||
            (showVscDeductibleMsg && vscNotEligibleDeductible) ||
            (showAggAppInfoChangedMessage && aggAppInfoChangedMessage);

        return hasArrayMessages || hasSingleMessages;
    };

    // Return null if no alerts should be displayed
    if (!hasAnyAlerts()) {
        return null;
    }

    return (
        <div className="w-full max-w-[850px]">
            {/* Error Messages Section */}
            {(!anyPopupOpen && allErrorMessages.length > 0) && (
                <div className="alert-section-error-messages">
                    {allErrorMessages.map((msg, idx) => (
                        <MessageAlert key={`error-${idx}`} message={msg} type="error" />
                    ))}
                </div>
            )}

            {/* GAP Error Messages Section */}
            {allGapErrorMessages.length > 0 && (
                <div className="alert-section-gap-error-messages">
                    {allGapErrorMessages.map((msg, idx) => (
                        <MessageAlert key={`error-${idx}`} message={msg} type="error" />
                    ))}
                </div>
            )}

            {/* Violation Messages Section */}
            {vioList.length > 0 && (
                <div className="alert-section-violations">
                    {vioList.map((msg, idx) => (
                        <MessageAlert key={`vio-${idx}`} message={msg} type="error" />
                    ))}
                </div>
            )}

            {/* Down Payment Adjustment Section */}
            {filteredDownPaymentMessages.length > 0 && (
                <div className="alert-section-down-payment">
                    {filteredDownPaymentMessages.map((msg, idx) => (
                        <MessageAlert key={`down-payment-${idx}`} message={msg} type="error" />
                    ))}
                </div>
            )}

            {/* Info Messages Section */}
            {calertonVioList.length > 0 && (
                <div className="alert-section-carleton-info">
                    {calertonVioList.map((msg, idx) => (
                        <MessageAlert key={`carleton-${idx}`} message={msg} type="info" />
                    ))}
                </div>
            )}

            {/* TWG Violations Section */}
            {twgVioList.length > 0 && (
                <div className="alert-section-twg-violations">
                    {twgVioList.map((msg, idx) => (
                        <MessageAlert key={`twg-${idx}`} message={msg} type="error" />
                    ))}
                </div>
            )}

            {/* Deal Violations Section */}
            {dealVioList.length > 0 && (
                <div className="alert-section-deal-violations">
                    {dealVioList.map((msg, idx) => (
                        <MessageAlert key={`deal-${idx}`} message={msg} type="error" />
                    ))}
                </div>
            )}

            {/* Vehicle Condition Section */}
            {vehCondVioList.length > 0 && (
                <div className="alert-section-vehicle-condition">
                    {vehCondVioList.map((msg, idx) => (
                        <MessageAlert key={`veh-cond-${idx}`} message={msg} type="info" />
                    ))}
                </div>
            )}

            {/* Selling Price Errors Section */}
            {(showSellingPriceLink && selErrorMessages.length > 0) && (
                <div className="alert-section-selling-price">
                    {selErrorMessages.map((msg, idx) => (
                        <MessageAlert key={`sel-error-${idx}`} message={msg} type="error" />
                    ))}
                </div>
            )}

            {/* Warning Messages Section */}
            {((vehSeriesBSChange || vehDmsCostChange || vehDmsSellingPriceChange) && warningGenericMsg) && (
                <div className="alert-section-generic-warning">
                    <MessageAlert message={warningGenericMsg} type="warning" />
                </div>
            )}

            {(warningExistsOnVeh && warningText) && (
                <div className="alert-section-vehicle-warning">
                    <MessageAlert message={warningText} type="warning" />
                </div>
            )}

            {/* VSC Messages Section */}
            {vscChangeMsgEnable && (
                <div className="alert-section-vsc-messages">
                    {(extnWarrExists && extnWarMsgWithVsc) && (
                        <MessageAlert message={extnWarMsgWithVsc} type="warning" />
                    )}
                    {(!extnWarrExists && extnWarMsgNoVsc) && (
                        <MessageAlert message={extnWarMsgNoVsc} type="warning" />
                    )}
                </div>
            )}

            {/* VSC Eligibility Messages Section */}
            {(step4NoVSCEnableMsgFlag && step4NoVscEli) && (
                <div className="alert-section-vsc-eligibility">
                    <MessageAlert message={step4NoVscEli} type="info" />
                </div>
            )}

            {(vscRemovedForCpoVariesFlag && vscRemovedForCpoVaries) && (
                <div className="alert-section-vsc-cpo">
                    <MessageAlert message={vscRemovedForCpoVaries} type="info" />
                </div>
            )}

            {(step4PowerTrainCpoEnableMsgFlag && step4NoVscEliPowTrCpoCombo) && (
                <div className="alert-section-powertrain-cpo">
                    <MessageAlert message={step4NoVscEliPowTrCpoCombo} type="info" />
                </div>
            )}

            {/* Registration State Messages Section */}
            {((step4SidMsgFlag && sidRegStateChange) || (step4DriverStateSidMsgFlag && driverSidRegStateChange)) && (
                <div className="alert-section-registration-state">
                    {(step4SidMsgFlag && sidRegStateChange) && (
                        <MessageAlert message={sidRegStateChange} type="info" />
                    )}
                    {(step4DriverStateSidMsgFlag && driverSidRegStateChange) && (
                        <MessageAlert message={driverSidRegStateChange} type="info" />
                    )}
                </div>
            )}

            {/* MLA Messages Section */}
            {(step4MLACoveredMsgFlag && mlaCoveredMsg) && (
                <div className="alert-section-mla">
                    <MessageAlert message={mlaCoveredMsg} type="info" />
                </div>
            )}

            {/* Dealer Training Section */}
            {(newDealerTrainingIncomplete && incompleteDealerTrainingMsg) && (
                <div className="alert-section-dealer-training">
                    <MessageAlert message={incompleteDealerTrainingMsg} type="error" />
                </div>
            )}

            {/* VSC Deductible Section */}
            {(showVscDeductibleMsg && vscNotEligibleDeductible) && (
                <div className="alert-section-vsc-deductible">
                    <MessageAlert message={vscNotEligibleDeductible} type="info" />
                </div>
            )}

            {/* VSC Validation Messages Section */}
            {(!vscEnable && vscValMsgList.length > 0) && (
                <div className="alert-section-vsc-validation">
                    {vscValMsgList.map((msg, idx) => (
                        <MessageAlert key={`vsc-val-${idx}`} message={msg} type="info" />
                    ))}
                </div>
            )}

            {/* App Info Changed Section */}
            {(showAggAppInfoChangedMessage && aggAppInfoChangedMessage) && (
                <div className="alert-section-app-info-changed">
                    <MessageAlert message={aggAppInfoChangedMessage} type="info" />
                </div>
            )}
        </div>
    );
};

const MessageAlert: React.FC<{
    message: string;
    type: "error" | "warning" | "info";
}> = ({ message, type }) => {
    const styles = {
        error: {
            bg: "bg-[#ffe9ec]",
            border: "border-[#d6031d]",
            text: "text-[#d6031d]",
            icon: "icon---circlealert.svg",
        },
        warning: {
            bg: "bg-[#fffdf9]",
            border: "border-amber-600",
            text: "text-amber-600",
            icon: "icon---trianglealert.svg",
        },
        info: {
            bg: "bg-[#f0f9ff]",
            border: "border-blue-600",
            text: "text-blue-600",
            icon: "icon---info.svg",
        },
    };

    const { bg, border, text, icon } = styles[type];

    return (
        <Alert className={`${bg} ${border} ${text} mb-2`} hidden={message.length == 0}>
            <div className="flex items-start gap-3 w-full">
                <img
                    className="w-4 h-4 mt-0.5"
                    alt={`Icon ${type}`}
                    src={`${import.meta.env.BASE_URL}${icon}`}
                />
                <AlertDescription className={`font-text-small-leading-normal-medium ${text}`}>
                    {message}
                </AlertDescription>
            </div>
        </Alert>
    );
};