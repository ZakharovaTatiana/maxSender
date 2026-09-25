interface EyeIconProps {
  crossed?: boolean;
}

export function EyeIcon({ crossed = false }: EyeIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12s3.5-6 9.75-6 9.75 6 9.75 6-3.5 6-9.75 6S2.25 12 2.25 12Z"
      />
      <circle cx="12" cy="12" r="2.75" />
      {crossed && (
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 4 16 16" />
      )}
    </svg>
  );
}
