import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { UserAlreadyExistsError } from "@/use-case/errors/user-already-exists-error";
import { makeUpdateUsecase } from "@/use-case/factories/users/make-update-usecase";
import { ResourceNotFoundError } from "@/use-case/errors/resource-not-found-error";

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const updateParamsSchema = z.object({ id: z.string().uuid() });
	const updateBodySchema = z.object({
		name: z.string().optional(),
		email: z.string().email().optional(),
		password: z.string().min(6).optional(),
	});

	const { id } = updateParamsSchema.parse(request.params);
	const { name, email, password } = updateBodySchema.parse(request.body);

	try {
		const updateUseCase = makeUpdateUsecase();

		await updateUseCase.execute({ id, name, email, password });
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(409).send({ message: error.message });
		}

		if (error instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: error.message });
		}

		throw error;
	}

	return reply.status(204).send();
}
