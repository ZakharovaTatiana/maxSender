import {
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
} from 'react';
import { useSelector } from 'react-redux';
import { selectSession } from '@entities/session';
import { checkAccount } from '../api/checkAccount';
import {
  COUNTRY_OPTIONS,
  getNationalNumberLength,
  isValidNationalPhoneNumber,
  parsePastedPhoneNumber,
  type CountryCode,
} from '../model/phoneNumber';

const DEFAULT_COUNTRY_CODE: CountryCode = '7';

export function ContactSearchForm() {
  const credentials = useSelector(selectSession);
  const [countryCode, setCountryCode] =
    useState<CountryCode>(DEFAULT_COUNTRY_CODE);
  const [phoneNumber, setPhoneNumber] = useState('');
  const hasPhoneNumber = phoneNumber.length > 0;
  const isPhoneNumberValid = isValidNationalPhoneNumber(
    phoneNumber,
    countryCode,
  );
  const nationalNumberLength = getNationalNumberLength(countryCode);

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextCountryCode = event.target.value as CountryCode;

    setCountryCode(nextCountryCode);
    setPhoneNumber((currentNumber) =>
      currentNumber.slice(0, getNationalNumberLength(nextCountryCode)),
    );
  };

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, '');
    setPhoneNumber(digits.slice(0, nationalNumberLength));
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const parsedPhoneNumber = parsePastedPhoneNumber(
      event.clipboardData.getData('text'),
      countryCode,
    );

    if (!parsedPhoneNumber) {
      return;
    }

    setCountryCode(parsedPhoneNumber.countryCode);
    setPhoneNumber(parsedPhoneNumber.nationalNumber);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isPhoneNumberValid) {
      return;
    }

    void checkAccount(credentials, `${countryCode}${phoneNumber}`);
  };

  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      <div className="relative flex">
        <label>
          <span className="sr-only">Код страны</span>
          <select
            className="h-12 rounded-l-2xl border-r border-slate-200 bg-slate-100 px-3 text-sm text-slate-950 outline-none transition focus:relative focus:bg-white focus:ring-2 focus:ring-[#3478f6]"
            name="countryCode"
            onChange={handleCountryChange}
            value={countryCode}
          >
            {COUNTRY_OPTIONS.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Найти по номеру телефона</span>
          <svg
            aria-hidden="true"
            className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 4 4" />
          </svg>
          <input
            className="h-12 w-full rounded-r-2xl bg-slate-100 pr-12 pl-10 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#3478f6]"
            inputMode="numeric"
            maxLength={nationalNumberLength}
            minLength={nationalNumberLength}
            name="phoneSearch"
            onChange={handlePhoneNumberChange}
            onPaste={handlePaste}
            pattern={`\\d{${nationalNumberLength}}`}
            placeholder="Найти по номеру телефона"
            required
            title={`Введите ${nationalNumberLength} цифр номера без кода страны`}
            type="search"
            value={phoneNumber}
          />
        </label>

        {hasPhoneNumber && (
          <button
            aria-label="Найти контакт"
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#3478f6] text-white transition hover:bg-[#2868dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3478f6] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            disabled={!isPhoneNumberValid}
            type="submit"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
