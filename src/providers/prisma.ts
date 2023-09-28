import { env } from "@/env";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
	log: env.NODE_ENV === "dev" ? ["query"] : [],
});

export async function testConn() {
	try {
		const result = await prisma.$executeRawUnsafe("SELECT 1");
		console.info({
			status: "Test connection with Database success.",
			result,
		});
	} catch (error) {
		console.error({
			status: "Test connection with Database fail.",
			error,
		});

		throw error;
	}
}
