import { FastifyRequest, FastifyReply } from "fastify";

import { messageProvider } from "@/providers/message-broker";
import { consumeMessage } from "@/use-case/usecases/users/consume-message/consume-message";

export async function consumeMessages(
	request: FastifyRequest,
	reply: FastifyReply
) {
	await messageProvider.consume("create-users", consumeMessage);

	return reply.status(200).send({ message: "Messages consumed." });
}
