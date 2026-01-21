/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db: any, client: any) => {
    await db.collection("gift_collections").insertOne({
        collection: "plush_pepe",
        supplyCount: 100,
        addedAt: new Date(),
    });
    await db.collection("gift_collections").insertOne({
        collection: "plush_fox",
        supplyCount: 100,
        addedAt: new Date(),
    });
};

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async (db: any, client: any) => {
    await db.collection("gift_collections").deleteMany({
        collection: {
            $in: ["plush_pepe", "plush_fox"],
        },
    });
};
