import type { CreateWinnerActionIn } from "../../repo/action/dto/create";
import type { ActionService } from "./service";

export async function createManyWinnerActions(
    this: ActionService,
    input: CreateWinnerActionIn[]
) {
    const repo = this.tx ? this.actionRepo.withTx(this.tx) : this.actionRepo;
    await repo.createManyWinnerActions(input);
}
