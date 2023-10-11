import { hash } from 'bcryptjs'

import { UserAlreadyExistsError } from '@/use-case/errors/user-already-exists-error'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

const prismaUsersRepository = new PrismaUsersRepository()

const resolvers = {
	Query: {
		users: async () => {
			return await prismaUsersRepository.list()
		},
		user: async (_: any, { id }: { id: string }) => {
			return await prismaUsersRepository.findById(id)
		},
	},
	Mutation: {
		createUser: async (
			_: any,
			{
				name,
				email,
				password,
			}: { name: string; email: string; password: string },
		) => {
			const userExists = await prismaUsersRepository.findByEmail(email)

			if (userExists) throw new UserAlreadyExistsError()

			const { id } = await prismaUsersRepository.create({
				name,
				email,
				password_hash: await hash(password, 6),
			})

			return { id }
		},
	},
}

export { resolvers }
