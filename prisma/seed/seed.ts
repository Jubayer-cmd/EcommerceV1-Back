import { PrismaClient } from "@prisma/client";
const products=require("./Data/products")


const prisma = new PrismaClient();

async function main() {
    for (let product of products) {
        const { variations, ...productData } = product;

        const createData = {
            ...productData,
            variations: {
                createMany: {
                    data: variations,
                },
            },
        };

        await prisma.product.create({
            data: createData,
        });
    }
}

main()
    .catch((e) => {
        console.error(`There was an error while seeding: ${e}`);
        process.exit(1);
    })
    .finally(() => {
        
        console.log('Successfully seeded database. Closing connection.');
        prisma.$disconnect();
    });
