
export const TermsAndConditionsSection = (): JSX.Element => {
  return (
    <footer className="flex flex-col items-center justify-center py-3 w-full bg-[#214361] color-white">
      <div className="text-[14.4px] text-center text-white">
        <span className="text-[#eb7722] font-text-extra-small-leading-normal-underlined cursor-pointer">
          Terms{' '}
        </span>
        <span className="text-white">
          under which the CAPS system is provided for your use. <br />
          ©2012 - {new Date().getFullYear()} Copyright Credit Acceptance Corporation. All Rights
          Reserved.
        </span>
      </div>
    </footer>
  );
};
