/*
  т.к мы знаем то что процессы не умирают сами по себе, 
  нам нужно закрыть все соединения с базой данных и другими ресурсами.
*/
const callbacks: Array<() => Promise<unknown>> = [];

export const onExit = (
    callback: () => Promise<unknown>
): void => {
    callbacks.push(callback);
};

export const listenExit = () => {
    const exit = async () => {
        for await (const callback of callbacks) {
            await callback();
        }

        process.exit(0);
    };

    process.once("SIGINT", exit);
    process.once("SIGTERM", exit);
    process.once("SIGUSR2", exit);
};
