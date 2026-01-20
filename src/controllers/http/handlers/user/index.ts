import type { FastifyInstance } from "fastify";
import type { UserService } from "../../../../service/user/service";
import { fetchByUser } from "./fetch";

export class HttpUserController {
    protected app: FastifyInstance;
    protected userService: UserService;

    constructor(app: FastifyInstance, userService: UserService) {
        this.app = app;
        this.userService = userService;
    }

    fetchByUser = fetchByUser;

    async setup() {
        await this.app.register(
            async (fastify) => {
                fastify.get("/", async (req, res) =>
                    this.fetchByUser(req, res)
                );
            },
            { prefix: "/user" }
        );
    }
}
