import { Address } from '@zachweinberg/obsidian-schema';

export const formatAddresstoString = (address: Address): string => {
  if (address.apt) {
    return `${address.street} APT ${address.apt}, ${address.city} ${address.state}, ${address.zip}`;
  }

  return `${address.street}, ${address.city} ${address.state}, ${address.zip}`;
};
