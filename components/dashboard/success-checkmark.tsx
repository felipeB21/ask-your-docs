export function SuccessCheckmark() {
  return (
    <div className="relative flex size-20 items-center justify-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-50 motion-safe:duration-500">
      <div className="absolute inset-0 rounded-full bg-primary/10 motion-safe:animate-in motion-safe:zoom-in-0 motion-safe:duration-700" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-10 text-primary"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4L19 7" className="checkmark-path" />
      </svg>
    </div>
  );
}
