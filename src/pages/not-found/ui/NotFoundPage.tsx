import { Link } from 'react-router-dom';
import { routes } from '@shared/config/routes';

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center px-6 py-16">
      <p className="mb-3 text-sm font-semibold tracking-widest text-indigo-600">
        404
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Страница не найдена
      </h1>
      <p className="mt-5 text-lg text-slate-600">
        Проверьте адрес или вернитесь на главную страницу.
      </p>
      <Link
        to={routes.home}
        className="mt-8 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
      >
        На главную
      </Link>
    </main>
  );
}
