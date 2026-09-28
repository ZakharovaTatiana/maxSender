import { LogoutButton } from '@features/logout';

export function NavigationSidebar() {
  return (
    <aside className="hidden w-20 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <LogoutButton variant="sidebar" />
    </aside>
  );
}
