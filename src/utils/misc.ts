import { Address } from '@zachweinberg/obsidian-schema';

export const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const addresstoString = (address: Address): string => {
  let addressString = `${address.street}, ${address.city} ${address.state}${address.zip ? `, ${address.zip}` : ''}`;

  if (address.apt) {
    addressString = `${address.street} APT ${address.apt}, ${address.city} ${address.state}${
      address.zip ? `, ${address.zip}` : ''
    }`;
  }

  return addressString;
};
