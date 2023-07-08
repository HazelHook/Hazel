import { IconProps } from "./types";

export const DangerIcon = (props: IconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M10.3 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5.4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
      <path d="M5 10a7 7 0 0 1 14 0v4.419c0 .944-.604 1.782-1.5 2.081a2.194 2.194 0 0 0-1.5 2.081v.094A2.325 2.325 0 0 1 13.675 21h-3.35A2.325 2.325 0 0 1 8 18.675v-.094c0-.944-.604-1.782-1.5-2.081A2.194 2.194 0 0 1 5 14.419V10Z" />
    </g>
    <title>dangerIcon</title>
  </svg>
);
