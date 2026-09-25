import { useSelector } from 'react-redux';
import { selectIsAuthorized } from '@entities/session';
import { LoginForm } from '@features/login';
import { ChatPanel } from '@widgets/chat-panel';
import { NavigationSidebar } from '@widgets/navigation-sidebar';

export function MainPage() {
  const isAuthorized = useSelector(selectIsAuthorized);

  if (isAuthorized) {
    return (
      <main className="app-background flex min-h-screen">
        <NavigationSidebar />
        <ChatPanel />
      </main>
    );
  }

  return (
    <main className="app-background grid min-h-screen place-items-center px-4 py-10 sm:px-6">
      <LoginForm />
    </main>
  );
}
