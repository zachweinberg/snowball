export const formatMoneyFromNumber = (value: number, noRound: boolean = false): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    maximumFractionDigits: noRound ? 8 : 2,
    currency: 'USD',
  }).format(value);

export const formatPercentageChange = (percentDecimal: number): string => {
  let val = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percentDecimal);

  if (val.endsWith('.00%')) {
    val = val.replace('.00', '');
  }

  return val;
};
