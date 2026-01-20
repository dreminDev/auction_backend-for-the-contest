import type { CreateActionIn } from "../../repo/action/dto/create";
import type { ActionService } from "./service";

export async function newAction(
    this: ActionService,
    input: CreateActionIn
) {
    const newAction =
        await this.actionRepo.createAction(input);

    return newAction;
}
