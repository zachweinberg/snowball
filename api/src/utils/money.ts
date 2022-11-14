export const formatMoneyFromNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    maximumFractionDigits: value.toString().includes('.00') ? 8 : 2, // For numbers that are below a penny, show 8 decimals
    currency: 'USD',
  }).format(value);
};
