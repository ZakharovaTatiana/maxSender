import { useDispatch } from 'react-redux';
import { clearCredentials } from '@entities/session';

interface LogoutButtonProps {
  variant: 'header' | 'sidebar';
}

export function LogoutButton({ variant }: LogoutButtonProps) {
  const dispatch = useDispatch();

  if (variant === 'header') {
    return (
      <button
        aria-label="Выйти"
        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 lg:hidden"
        onClick={() => dispatch(clearCredentials())}
        type="button"
      >
        <LogoutIcon className="size-7" />
      </button>
    );
  }

  return (
    <button
      className="mt-auto flex min-h-18 flex-col items-center justify-center gap-1 border-t border-slate-200 px-1 text-[11px] text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-500"
      onClick={() => dispatch(clearCredentials())}
      type="button"
    >
      <LogoutIcon className="size-6" />
      <span>Выход</span>
    </button>
  );
}

interface LogoutIconProps {
  className: string;
}

function LogoutIcon({ className }: LogoutIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
    </svg>
  );
}
