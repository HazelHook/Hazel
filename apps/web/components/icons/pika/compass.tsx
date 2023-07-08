import { IconProps } from "./types";

export const CompassIcon = (props: IconProps) => (
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
      <path d="M21.15 12a9.15 9.15 0 1 1-18.3 0 9.15 9.15 0 0 1 18.3 0Z" />
      <path d="M9.587 15.498a6.332 6.332 0 0 0 5.91-5.91 1.021 1.021 0 0 0-1.084-1.086 6.332 6.332 0 0 0-5.91 5.91c-.04.616.47 1.125 1.084 1.086Z" />
    </g>
    <title>compassIcon</title>
  </svg>
);
