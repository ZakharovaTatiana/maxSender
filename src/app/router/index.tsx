import { Route, Routes } from 'react-router-dom';
import { MainPage } from '@pages/main';
import { NotFoundPage } from '@pages/not-found';
import { routes } from '@shared/config/routes';

export function AppRouter() {
  return (
    <Routes>
      <Route path={routes.home} element={<MainPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
