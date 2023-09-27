import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateUseCase } from '../../usecases/users/update/update'

export function makeUpdateUsecase() {
	const prismaUsersRepository = new PrismaUsersRepository()
	const updateUseCase = new UpdateUseCase(prismaUsersRepository)

	return updateUseCase
}
