import { cacheProvider } from "@/providers/cache";
import { messageProvider } from "@/providers/message-broker";
import { testConn as prismaTestConn } from "@/providers/prisma";

interface HealthcheckUseCaseResponse {
	message: string;
}

export class HealthcheckUseCase {
	constructor() {}

	async execute(): Promise<HealthcheckUseCaseResponse> {
		await prismaTestConn();
		await cacheProvider.testConn();
		await messageProvider.testConn();

		return { message: "Server is up." };
	}
}
