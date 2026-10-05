export const normalizePhoneNumber = (value: string) => value.replace(/\D/g, '');

export function formatPhoneNumber(value: string): string {
  const digits = normalizePhoneNumber(value);
  if (digits.startsWith('010') && digits.length >= 11) {
    return `010-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
  return value;
}

export const addHyphen = (raw: string) => {
  const digits = normalizePhoneNumber(raw).slice(0, 11);

  if (!digits.startsWith('010')) return digits;

  if (digits.length < 4) return digits;
  if (digits.length < 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};
