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
}

export { resolvers }
