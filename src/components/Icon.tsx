export type IconName = "book" | "chart" | "spark" | "lock" | "check" | "user" | "chevron" | "info";

export function Icon({
  name,
  size = 18,
}: {
  name: "book" | "chart" | "spark" | "lock" | "check" | "user" | "chevron" | "info";
  size?: number;
}) {
  const paths = {
    book: (
      <>
        <path d="M4 4.5h5a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H4z" />
        <path d="M20 4.5h-5a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h5z" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19H2" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="m4.22 4.22 2.12 2.12" />
        <path d="m17.66 17.66 2.12 2.12" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
