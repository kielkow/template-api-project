import { hash } from 'bcryptjs'
import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '../../../errors/user-already-exists-error'
import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'

interface UpdateUseCaseRequest {
	id: string
	name?: string
	email?: string
	password?: string
}

interface UpdateUseCaseResponse {
	user: User
}

export class UpdateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		id,
		name,
		email,
		password,
	}: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
		const userExists = await this.usersRepository.findById(id)
		if (!userExists) throw new ResourceNotFoundError()

		if (email) {
			const userEmailExists = await this.usersRepository.findByEmail(email)

			if (userEmailExists && userEmailExists.id !== id) {
				throw new UserAlreadyExistsError()
			}
		}

		const password_hash = password
			? await hash(password, 6)
			: userExists.password_hash

		const user = await this.usersRepository.update({
			id,
			name: name || userExists.name,
			email: email || userExists.email,
			password_hash,
		})
		if (!user) throw new ResourceNotFoundError()

		return { user }
	}
}
