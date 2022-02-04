import { User } from '@zachweinberg/obsidian-schema';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
