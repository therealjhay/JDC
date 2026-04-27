const ngnFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
});

export function formatNGN(value: string | number) {
  return ngnFormatter.format(Number(value));
}
