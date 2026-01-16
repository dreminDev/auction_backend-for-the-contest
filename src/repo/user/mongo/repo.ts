import type { Connection, Model } from "mongoose";
import type { User } from "../../../model/user";
import { DatabaseError, DatabaseErrorType } from "../../../error/database";

export class UserRepo {
    readonly db: Connection;

    constructor(db: Connection) {
        this.db = db;
    }

    protected get userModel(): Model<User> {
        if (this.db.models["users"]) {
            return this.db.models["users"];
        }

        throw new DatabaseError(
            DatabaseErrorType.MODEL_NOT_FOUND,
            "User model not found in database"
        );
    }
}
