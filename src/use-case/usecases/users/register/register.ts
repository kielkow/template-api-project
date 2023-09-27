import { hash } from 'bcryptjs'
import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '../../../errors/user-already-exists-error'

interface RegisterUseCaseRequest {
	name: string
	email: string
	password: string
}

interface RegisterUseCaseResponse {
	user: User
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(
		data: RegisterUseCaseRequest | string,
	): Promise<RegisterUseCaseResponse> {
		let payload: RegisterUseCaseRequest

		if (typeof data === 'string') payload = JSON.parse(data)
		else payload = data

		const { name, email, password } = payload

		const userExists = await this.usersRepository.findByEmail(email)

		if (userExists) throw new UserAlreadyExistsError()

		const password_hash = await hash(password, 6)

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		})

		return { user }
	}
}
