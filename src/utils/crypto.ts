import Cryptr from 'cryptr';

const cryptr = new Cryptr('MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2');

export const encrypt = (text: string) => {
  return cryptr.encrypt(text);
};

export const decrypt = (encryptedValue: string) => {
  return cryptr.decrypt(encryptedValue);
};
