import type { BalanceType } from "@prisma/client";

import type { BalanceService } from "./service";

export type AddBalanceIn = {
    userId: number;
    type: BalanceType;
    amount: number;
};

export async function addBalance(this: BalanceService, input: AddBalanceIn) {
    // Получаем текущий баланс пользователя
    const currentBalance = await this.balanceRepo.fetchBalanceByIdAndType({
        userId: input.userId,
        type: input.type,
    });

    if (currentBalance) {
        // Если баланс существует, увеличиваем его
        const newBalance = currentBalance.balance + input.amount;
        await this.balanceRepo.updateBalance({
            id: currentBalance.id,
            balance: newBalance,
        });
        return {
            id: currentBalance.id,
            userId: input.userId,
            type: input.type,
            balance: newBalance,
        };
    } else {
        // Если баланса нет, создаем новый
        const newBalance = await this.balanceRepo.createBalance({
            userId: input.userId,
            type: input.type,
            balance: input.amount,
        });
        return newBalance;
    }
}
