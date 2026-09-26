import { useEffect, type Dispatch, type SetStateAction } from 'react';

interface ErrorTooltipProps {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
}

export function ErrorTooltip({ message, setMessage }: ErrorTooltipProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMessage(''), 5000);

    return () => window.clearTimeout(timeoutId);
  }, [message, setMessage]);

  return (
    <div
      className="absolute right-0 bottom-full left-0 z-20 mb-2 rounded-lg bg-red-300 px-3 py-2 text-center text-sm text-slate-950 shadow-sm"
      role="alert"
    >
      {message}
      <span
        aria-hidden="true"
        className="absolute top-full left-1/2 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-red-300"
      />
    </div>
  );
}
