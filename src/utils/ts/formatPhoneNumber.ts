export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('010') && digits.length >= 11) {
    return `010-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
  return value;
}

export const addHyphen = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 11);

  if (!digits.startsWith('010')) return digits;

  if (digits.length < 4) return digits;
  if (digits.length < 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};
