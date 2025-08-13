import { ShieldCheckIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import { useDynamicData } from "../../../../hooks/useDynamicData";
import { UnifiedProgramView } from "./components/UnifiedProgramView";

export const DealStructureSection = (): JSX.Element => {
  const [activeProgram, setActiveProgram] = React.useState<"purchase" | "portfolio">("purchase");
  const { data, updateDealData, updateVSCData, updateGAPData, handleUpdateCallback, updateAlertData } = useDynamicData();
  const shouldRenderCustomer2 = data.customer2 && data.customer2.name;
  console.log(data)

  return (
      <div className="flex w-full items-start gap-8 relative rounded-[0px_0px_12px_12px] shadow-shadow-base pt-8">
        <div className="flex flex-col items-start justify-center gap-8 relative pl-8 pb-8">
          <Card className="w-[280px] shadow-shadow-base bg-white">
            <CardContent className="flex flex-col items-start gap-3 pt-5 pb-6 px-6">
              <div className="inline-flex items-center gap-2">
                <h2 className="font-semibold text-zinc-950 text-xl tracking-[-0.40px] leading-7">
                  {data.customer1.name}
                </h2>
              </div>

              {/* Primary customer details */}
              <div className="flex flex-col w-full">
                <span className="font-text-extra-small-leading-normal-regular text-zinc-500">
                  Mobile phone
                </span>
                <p className="font-text-small-leading-normal-regular text-zinc-950">
                  {data.customer1.phone}
                </p>
              </div>

              <div className="flex flex-col w-full">
                <span className="font-text-extra-small-leading-normal-regular text-zinc-500">
                  Email
                </span>
                <p className="font-text-small-leading-normal-regular text-zinc-950">
                  {data.customer1.email}
                </p>
              </div>

              <div className="flex flex-col w-full">
                <span className="font-text-extra-small-leading-normal-regular text-zinc-500">
                  Address
                </span>
                <p className="font-text-small-leading-normal-regular text-zinc-950 whitespace-pre-line">
                  {data.customer1.address}
                </p>
                
              </div>

              <div className="flex items-center gap-4 w-full">
                <div className="flex flex-col">
                  <span className="font-text-extra-small-leading-normal-regular text-zinc-500">
                    Credit Score
                  </span>
                  <p className="font-text-small-leading-normal-regular text-zinc-950">
                    {data.customer1.creditScore}
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                 <span className="font-text-extra-small-leading-normal-regular text-zinc-500">
                    Eligibility
                  </span>
                <div className="flex items-center gap-1 w-full">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <p className="font-text-small-leading-normal-regular text-zinc-950">
                    {data.customer1.eligibility}
                  </p>
                </div>
               
              </div>
            </CardContent>
            {shouldRenderCustomer2 && (
                <Separator className="w-full my-1" />
            )}
            {shouldRenderCustomer2 && (
                <CardContent className="flex flex-col items-start gap-3 pt-5 pb-6 px-6">

                  {/* Second signer details */}
                  <>
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex flex-col">
                             <span className="font-text-extra-small-leading-normal-regular text-zinc-500">
                        Second Signer
                      </span>
                        <p className="font-text-small-leading-normal-regular text-zinc-950">
                          {data.customer2.name}
                        </p>
                   
                      </div>
                    </div>

                    <div className="flex flex-col w-full">
                      <span className="font-text-extra-small-leading-normal-regular text-zinc-500">
                        Mobile phone
                      </span>
                      <p className="font-text-small-leading-normal-regular text-zinc-950">
                          {data.customer2.phone}
                      </p>
                    </div>

                    <div className="flex flex-col w-full">
                      <span className="font-text-extra-small-leading-normal-regular text-zinc-500">
                        Email
                      </span>
                      <p className="font-text-small-leading-normal-regular text-zinc-950">
                        {data.customer2.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <div className="flex flex-col">
                        <span className="font-text-extra-small-leading-normal-regular text-zinc-500">
                          Credit Score
                        </span>
                        <p className="font-text-small-leading-normal-regular text-zinc-950">
                          {data.customer2.creditScore}
                        </p>

                      </div>
                    </div>
                  </>
                </CardContent>
            )}
          </Card>
        </div>

        <div className="flex flex-col items-start gap-2.5 flex-1">
          {/* Render the appropriate program view */}
          <UnifiedProgramView
              activeProgram={activeProgram}
              onProgramChange={setActiveProgram}
              updateDealData={updateDealData}
              updateVSCData={updateVSCData}
              updateGAPData={updateGAPData}
              handleUpdateCallback={handleUpdateCallback}
              dynamicData={data}
          />
        </div>
      </div>
  );
};
