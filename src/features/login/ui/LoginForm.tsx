import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@entities/session';
import { EyeIcon } from './EyeIcon';

const DEFAULT_API_URL = 'https://3100.api.green-api.com';

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function LoginForm() {
  const dispatch = useDispatch();
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [isTokenVisible, setIsTokenVisible] = useState(false);

  const handleIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIdInstance(event.target.value.replace(/\D/g, ''));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidHttpUrl(apiUrl)) {
      return;
    }

    dispatch(setCredentials({ idInstance, apiTokenInstance, apiUrl }));
  };

  const canSubmit =
    idInstance.length > 0 &&
    apiTokenInstance.length > 0 &&
    isValidHttpUrl(apiUrl);

  return (
    <form
      className="w-full max-w-[420px] rounded-[32px] bg-white px-6 py-8 shadow-[0_18px_60px_rgba(35,92,158,0.18)] sm:px-10 sm:py-10"
      onSubmit={handleSubmit}
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Вход в MaxSender
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Введите данные вашего инстанса
        </p>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            idInstance
          </span>
          <input
            autoComplete="off"
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#3478f6] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            inputMode="numeric"
            name="idInstance"
            onChange={handleIdChange}
            pattern="[0-9]*"
            placeholder="Введите ID"
            required
            type="text"
            value={idInstance}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            apiTokenInstance
          </span>
          <span className="relative block">
            <input
              autoComplete="off"
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-base text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#3478f6] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              name="apiTokenInstance"
              onChange={(event) => setApiTokenInstance(event.target.value)}
              placeholder="Введите токен"
              required
              type={isTokenVisible ? 'text' : 'password'}
              value={apiTokenInstance}
            />
            <button
              aria-label={isTokenVisible ? 'Скрыть токен' : 'Показать токен'}
              aria-pressed={isTokenVisible}
              className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#3478f6]"
              onClick={() => setIsTokenVisible((isVisible) => !isVisible)}
              type="button"
            >
              <EyeIcon crossed={isTokenVisible} />
            </button>
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            apiUrl
          </span>
          <input
            autoComplete="url"
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#3478f6] focus:bg-white focus:ring-4 focus:ring-blue-500/10 invalid:border-red-400 invalid:focus:ring-red-500/10"
            name="apiUrl"
            onChange={(event) => setApiUrl(event.target.value)}
            placeholder="https://example.com"
            required
            type="url"
            value={apiUrl}
          />
        </label>
      </div>

      <button
        className="mt-7 h-13 w-full rounded-2xl bg-[#3478f6] px-5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#2569e8] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#3478f6] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        disabled={!canSubmit}
        type="submit"
      >
        Войти
      </button>
    </form>
  );
}
