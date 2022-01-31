export const VerticalDots: React.FunctionComponent = () => (
  <div className="p-2 rounded-md hover:bg-bordergray">
    <svg
      viewBox="0 0 4 20"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 cursor-pointer fill-current text-darkgray"
    >
      <circle cx="2" cy="18" r="2" fill="#757784" />
      <circle cx="2" cy="10" r="2" fill="#757784" />
      <circle cx="2" cy="2" r="2" fill="#757784" />
    </svg>
  </div>
);
