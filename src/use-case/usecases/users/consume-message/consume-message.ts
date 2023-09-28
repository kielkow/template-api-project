import { hash } from "bcryptjs";

import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export async function consumeMessage(message: string): Promise<void> {
	try {
		const prismaUsersRepository = new PrismaUsersRepository();

		const { name, email, password } = JSON.parse(message);

		const userExists = await prismaUsersRepository.findByEmail(email);

		if (userExists) throw new Error(`User ${email} already exists`);

		const password_hash = await hash(password, 6);

		await prismaUsersRepository.create({
			name,
			email,
			password_hash,
		});
	} catch (error) {
		console.error(error);
	}
}
