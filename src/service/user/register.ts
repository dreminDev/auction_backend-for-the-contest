import type {
    RegisterUserIn,
    RegisterUserOut,
} from "./dto/register";
import type { UserService } from "./service";

export async function registerUser(
    this: UserService,
    input: RegisterUserIn
): Promise<RegisterUserOut> {
    const [fetchUser, fetchUserBalance] = await Promise.all(
        [
            this.userRepo.fetchUserById({
                userId: input.userId,
            }),
            this.balanceService.fetchBalanceByIdAndType({
                userId: input.userId,
                type: "stars",
            }),
        ]
    );

    const out: RegisterUserOut = {
        isNewUser: false,
        user: null,
        balance: null,
    };

    if (fetchUser && fetchUserBalance) {
        out.isNewUser = false;
        out.user = fetchUser;
        out.balance = fetchUserBalance;

        return out;
    }

    if (!fetchUser) {
        out.isNewUser = true;
        out.user = await this.userRepo.createUser({
            userId: input.userId,
            username: null,
            first_name: null,
            last_name: null,
        });
    }

    // дефолтный баланс для пользователя, поэтому создаем его вместе с регистрацией.
    if (!fetchUserBalance) {
        // так как мы не используем уникальность баланса, т.к это физически невозможно ограничить на уровне бд, мы используем транзакцию, дабы избежать race condition.
        await this.balanceRepo.db.$transaction(
            async (tx) => {
                out.balance = await tx.balance.create({
                    data: {
                        userId: input.userId,
                        type: "stars",
                        balance: 0,
                    },
                });
            }
        );
    }

    // собираем статистику действий пользователя для метрик бизнеса/графаны
    // в метадату можно записать условно айпи юзера, устройство и данные какие либо по которым можно создавать метрики.
    if (out.isNewUser) {
        await this.actionService.newAction({
            userId: input.userId,
            action: "register",
        });
    }

    return out;
}
