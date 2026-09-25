import { useDispatch } from 'react-redux';
import { clearCredentials } from '@entities/session';

export function NavigationSidebar() {
  const dispatch = useDispatch();

  return (
    <aside className="flex w-[72px] shrink-0 flex-col border-r border-slate-200 bg-white sm:w-20">
      <button
        className="mt-auto flex min-h-18 flex-col items-center justify-center gap-1 border-t border-slate-200 px-1 text-[11px] text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-500"
        onClick={() => dispatch(clearCredentials())}
        type="button"
      >
        <LogoutIcon />
        <span>Выход</span>
      </button>
    </aside>
  );
}

function LogoutIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
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
