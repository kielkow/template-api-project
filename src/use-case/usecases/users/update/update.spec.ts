import { compare, hash } from 'bcryptjs'

import { beforeEach, describe, it, expect } from 'vitest'

import { UpdateUseCase } from './update'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

describe('USER UPDATE USE CASE', () => {
	let inMemoryUsersRepository: InMemoryUsersRepository, sut: UpdateUseCase

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new UpdateUseCase(inMemoryUsersRepository)
	})

	it('should be able update an user', async () => {
		const { id } = await inMemoryUsersRepository.create({
			name: 'John Doe',
			email: 'jonhdoe@example.com',
			password_hash: await hash('123456', 6),
		})

		const { user } = await sut.execute({
			id,
			name: 'John Doe Jr.',
			email: 'johndoejr@email.com',
			password: '123457',
		})

		const isPasswordCorrectlyHashed = await compare(
			'123457',
			user.password_hash,
		)

		expect(user.id).toEqual(id)
		expect(user.name).toEqual('John Doe Jr.')
		expect(user.email).toEqual('johndoejr@email.com')
		expect(isPasswordCorrectlyHashed).toBeTruthy()
	})
})
