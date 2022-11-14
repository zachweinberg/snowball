interface Props {
  width: number;
}

const WatchlistIcon: React.FunctionComponent<Props> = ({ width }: Props) => {
  return (
    <svg
      width={`${width}px`}
      height={`${width}px`}
      className="w-32 mb-8 fill-current"
      viewBox="0 0 150 150"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="75" cy="75" r="75" fill="#F9FAFF" />
      <path
        d="M90.9254 95.676C90.9254 97.3846 90.2694 98.9733 89.0785 100.149C87.8625 101.35 86.1825 102.024 84.4646 102.004C82.7582 101.983 81.2357 101.333 80.0611 100.126L70.4627 90.2625L60.8643 100.126C59.698 101.325 58.1791 101.974 56.4713 102.004C56.4339 102.005 56.3963 102.005 56.3589 102.005C54.6747 102.005 53.0345 101.34 51.8431 100.169C50.6546 99.0014 50 97.4187 50 95.7127V56.4382C50 51.7854 53.7854 48 58.4382 48H82.4872C87.14 48 90.9254 51.7854 90.9254 56.4382C90.9254 57.6033 89.9809 58.5478 88.8158 58.5478C87.6507 58.5478 86.7063 57.6033 86.7063 56.4382C86.7063 54.1118 84.8136 52.2191 82.4872 52.2191H58.4382C56.1118 52.2191 54.2191 54.1118 54.2191 56.4382V95.7128C54.2191 96.2942 54.4147 96.7809 54.8001 97.1597C55.2097 97.5621 55.8035 97.7963 56.397 97.7858C56.9843 97.7755 57.4565 97.5787 57.8406 97.184L68.9509 85.7664C69.3481 85.3583 69.8934 85.1281 70.4628 85.1281C71.0322 85.1281 71.5775 85.3583 71.9747 85.7664L83.0849 97.184C83.4717 97.5816 83.9404 97.7783 84.5179 97.7857C85.1091 97.7945 85.7017 97.5545 86.1141 97.1472C86.5071 96.7591 86.7063 96.2642 86.7063 95.6761C86.7063 94.511 87.6507 93.5665 88.8158 93.5665C89.9809 93.5665 90.9254 94.5109 90.9254 95.676Z"
        fill="black"
      />
      <path
        d="M102.479 75.8459C102.479 83.6976 96.0912 90.0854 88.2395 90.0854C80.3878 90.0854 74 83.6976 74 75.8459C74 67.9943 80.3878 61.6064 88.2395 61.6064C96.0912 61.6064 102.479 67.9943 102.479 75.8459ZM98.2599 75.8459C98.2599 70.3207 93.7647 65.8256 88.2395 65.8256C82.7143 65.8256 78.2191 70.3207 78.2191 75.8459C78.2191 81.3712 82.7143 85.8663 88.2395 85.8663C93.7647 85.8663 98.2599 81.3712 98.2599 75.8459ZM92.4586 73.7364H90.3491V71.6268C90.3491 70.4617 89.4046 69.5173 88.2395 69.5173C87.0744 69.5173 86.1299 70.4617 86.1299 71.6268V73.7364H84.0204C82.8553 73.7364 81.9108 74.6808 81.9108 75.8459C81.9108 77.0111 82.8553 77.9555 84.0204 77.9555H86.1299V80.0651C86.1299 81.2302 87.0744 82.1746 88.2395 82.1746C89.4046 82.1746 90.3491 81.2302 90.3491 80.0651V77.9555H92.4586C93.6237 77.9555 94.5682 77.0111 94.5682 75.8459C94.5682 74.6808 93.6237 73.7364 92.4586 73.7364Z"
        fill="#00565B"
      />
    </svg>
  );
};

export default WatchlistIcon;
