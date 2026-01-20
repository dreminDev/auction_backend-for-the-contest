import type { CreateActionIn } from "../dto/create";
import type { ActionRepo } from "./repo";

export async function createAction(
    this: ActionRepo,
    input: CreateActionIn
) {
    const newAction = await this.db.action.create({
        data: input,
    });

    return newAction;
}
