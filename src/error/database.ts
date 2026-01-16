export enum DatabaseErrorType {
    MODEL_NOT_FOUND = "MODEL_NOT_FOUND",
}

export class DatabaseError extends Error {
    readonly type: DatabaseErrorType;

    constructor(type: DatabaseErrorType, message: string) {
        super(message);
        this.name = `DatabaseError: ${type.toString()}: ${message}`;
        this.type = type;
    }
}
