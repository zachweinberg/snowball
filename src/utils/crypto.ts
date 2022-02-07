import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

export const encrypt = (val) => cryptr.encrypt(val);

export const decrypt = (encrypted) => cryptr.decrypt(encrypted);
