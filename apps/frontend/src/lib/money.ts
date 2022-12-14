export const formatMoneyFromNumber = (value: number, condense: boolean = false): string => {
  if (condense && value >= 1000000000000) {
    return `~${(value / 1000000000000).toFixed(2)}T`;
  } else if (condense && value >= 1000000000) {
    return `~${(value / 1000000000).toFixed(2)}B`;
  } else if (condense && value >= 1000000) {
    return `~${(value / 1000000).toFixed(2)}M`;
  } else if (condense && value >= 10000 && value < 1000000) {
    return `~${(value / 1000).toFixed(2)}K`;
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      maximumFractionDigits: value.toString().includes('.00') ? 8 : 2, // For numbers that are below a penny, show 8 decimals
      currency: 'USD',
    }).format(value);
  }
};

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

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
