import { IUserDocument } from "../database/models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: IUserDocument;
    }
  }
}
