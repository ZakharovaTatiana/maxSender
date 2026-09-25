export const COUNTRY_OPTIONS = [
  { code: '7', label: '+7', nationalNumberLength: 10 },
  { code: '375', label: '+375', nationalNumberLength: 9 },
] as const;

export type CountryCode = (typeof COUNTRY_OPTIONS)[number]['code'];

const nationalNumberPatterns: Record<CountryCode, RegExp> = {
  '7': /^\d{10}$/,
  '375': /^\d{9}$/,
};

export function getNationalNumberLength(countryCode: CountryCode) {
  return COUNTRY_OPTIONS.find(({ code }) => code === countryCode)!
    .nationalNumberLength;
}

export function isValidNationalPhoneNumber(
  value: string,
  countryCode: CountryCode,
) {
  return nationalNumberPatterns[countryCode].test(value);
}

export function parsePastedPhoneNumber(
  value: string,
  selectedCountryCode: CountryCode,
) {
  const normalizedValue = value.trim();

  if (!/^\+?\d+$/.test(normalizedValue)) {
    return null;
  }

  const valueWithoutPlus = normalizedValue.replace(/^\+/, '');
  const belarusNumber = valueWithoutPlus.match(/^375(\d{9})$/);

  if (belarusNumber) {
    return { countryCode: '375' as const, nationalNumber: belarusNumber[1] };
  }

  const russianNumber = valueWithoutPlus.match(/^7(\d{10})$/);

  if (russianNumber) {
    return { countryCode: '7' as const, nationalNumber: russianNumber[1] };
  }

  if (isValidNationalPhoneNumber(valueWithoutPlus, selectedCountryCode)) {
    return {
      countryCode: selectedCountryCode,
      nationalNumber: valueWithoutPlus,
    };
  }

  return null;
}
