import { hash } from "bcryptjs";

import { beforeEach, describe, expect, it } from "vitest";

import { AuthenticateUseCase } from "./authenticate";

import { UsersRepository } from "@/repositories/users-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { InvalidCredentialsError } from "../../../errors/invalid-credentials-error";

describe("AUTHENTICATE USE CASE", () => {
	let inMemoryUsersRepository: UsersRepository, sut: AuthenticateUseCase;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(inMemoryUsersRepository);
	});

	it("should be able authenticate an user", async () => {
		await inMemoryUsersRepository.create({
			name: "John Doe",
			email: "jonhdoe@example.com",
			password_hash: await hash("123456", 6),
		});

		const { user } = await sut.execute({
			email: "jonhdoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should not be able authenticate with wrong e-mail", async () => {
		await expect(() =>
			sut.execute({
				email: "jonhdoe@example.com",
				password: "123456",
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not be able authenticate with wrong password", async () => {
		await inMemoryUsersRepository.create({
			name: "John Doe",
			email: "jonhdoe@example.com",
			password_hash: await hash("123456", 6),
		});

		await expect(() =>
			sut.execute({
				email: "jonhdoe@example.com",
				password: "wrong-password",
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
