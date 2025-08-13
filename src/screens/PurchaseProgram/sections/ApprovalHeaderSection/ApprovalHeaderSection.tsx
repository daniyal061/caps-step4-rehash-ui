import React from "react";
import {getBooleanFromInput, useDynamicData} from "../../../../hooks/useDynamicData";

export const ApprovalHeaderSection = (): JSX.Element => {
  const { data} = useDynamicData();
  const [activeTab, setActiveTab] = React.useState<string>("Deal Structure");
  const [isNavigating, setIsNavigating] = React.useState<boolean>(false);

  console.log("Header Section: " + data)

  // Function to poll sessionStorage for the dealSaved flag
  const waitForDealSaved = async (maxAttempts: number = 60): Promise<boolean> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const dealSaved = sessionStorage.getItem('dealSaved');
      if (dealSaved === 'true') {
        // Clear the flag after reading it
        sessionStorage.removeItem('dealSaved');
        return true;
      }
      // Wait 500ms before next check (adjust as needed)
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return false; // Timeout after maxAttempts
  };

  const handleTabClick = React.useCallback(async (tabLabel: string) => {
    if (tabLabel === "Stipulations") {
      setIsNavigating(true);

      try {
        // Clear any existing flag before starting
        sessionStorage.removeItem('dealSaved');
        const dealChanged = getBooleanFromInput('dealChanged');
        const stipsEle = document.getElementById("step4:stipulationsUrl") as HTMLInputElement | null;
        const stipulationsUrl = stipsEle?.value || import.meta.env.VITE_STIPULATIONS_BASE_URL;

        if (dealChanged) {

          const jsfButton = document.getElementById('submitDealForm:updateCallbackButton') as HTMLButtonElement;
          if (jsfButton) {
            jsfButton.click();
          }

          const isComplete = await waitForDealSaved();
          if (isComplete) {
            const url = `${stipulationsUrl}${data.approval.approvalId}`;
            window.location.href = url;
          } else {
            console.error('Backend operation timed out');
            alert('Operation is taking longer than expected. Please try again.');
            setIsNavigating(false);
          }
        } else {
          const url = `${stipulationsUrl}${data.approval.approvalId}`;
          window.location.href = url;
        }
      } catch (error) {
        console.error('Error during backend operation:', error);
        alert('An error occurred. Please try again.');
        setIsNavigating(false);
      }
    } else {
      setActiveTab(tabLabel);
    }
  }, [data.approval.approvalId]);

  // Navigation items data
  const navItems = [
    { id: 1, label: "Deal Structure" },
    { id: 2, label: "Stipulations" },
  ];

  return (
      <header className="flex flex-col w-full items-start relative bg-transparent">
        {/* Top logo bar */}
        <div className="flex h-[46px] items-center justify-center gap-3 px-6 py-0 relative self-stretch w-full bg-white">
          <div className="flex items-center justify-between relative flex-1 grow">
            <img
                className="relative w-[205px] h-7 object-cover"
                alt="Logo"
                src={`${import.meta.env.BASE_URL}logo.png`}
            />
          </div>
        </div>

        {/* Navigation bar */}
        <nav className="flex h-[47px] items-center justify-center gap-3 px-6 py-0 relative self-stretch w-full bg-[#214361]">
          <div className="flex items-center justify-between relative flex-1 grow self-stretch">
            {/* Approval ID */}
            <div className="relative font-text-large-leading-normal-semibold font-[number:var(--text-large-leading-normal-semibold-font-weight)] text-white text-[length:var(--text-large-leading-normal-semibold-font-size)] tracking-[var(--text-large-leading-normal-semibold-letter-spacing)] leading-[var(--text-large-leading-normal-semibold-line-height)] [font-style:var(--text-large-leading-normal-semibold-font-style)]">
              Approval ID: {data.approval.approvalId}
            </div>

            {/* Navigation tabs */}
              <nav aria-label="Main Navigation" className="h-full">
                  <ul className="flex items-stretch h-full list-none m-0 p-0">
                      {navItems.map((item) => (
                          <li
                              key={item.id}
                              onClick={() => !isNavigating && handleTabClick(item.label)}
                              className={`flex items-center justify-center gap-2 px-4 py-0 h-full w-32 ${
                                  activeTab === item.label
                                      ? "bg-[#ffffff4c] border-b-[4px] border-solid border-[#e76e50]"
                                      : "border-b-[4px] border-solid border-transparent"
                              } ${isNavigating ? "cursor-wait opacity-75" : "cursor-pointer hover:bg-[#ffffff20]"}`}
                              role="tab"
                              aria-selected={activeTab === item.label}
                              tabIndex={0}
                          >
                      <span
                          className={`relative w-fit ${
                              activeTab === item.label
                                  ? "font-text-base-leading-normal-bold font-[number:var(--text-base-leading-normal-bold-font-weight)] text-[length:var(--text-base-leading-normal-bold-font-size)] tracking-[var(--text-base-leading-normal-bold-letter-spacing)] leading-[var(--text-base-leading-normal-bold-line-height)] [font-style:var(--text-base-leading-normal-bold-font-style)]"
                                  : "font-text-base-leading-normal-regular font-[number:var(--text-base-leading-normal-regular-font-weight)] text-[length:var(--text-base-leading-normal-regular-font-size)] tracking-[var(--text-base-leading-normal-regular-letter-spacing)] leading-[var(--text-base-leading-normal-regular-line-height)] [font-style:var(--text-base-leading-normal-regular-font-style)]"
                          } text-white whitespace-nowrap`}
                      >
                        {item.label}
                      </span>
                          </li>
                      ))}
                  </ul>
              </nav>
          </div>
        </nav>
      </header>
  );
};