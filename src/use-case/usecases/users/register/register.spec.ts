import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

import { RegisterUseCase } from "./register";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { UserAlreadyExistsError } from "../../../errors/user-already-exists-error";

describe("REGISTER USE CASE", () => {
	let inMemoryUsersRepository, sut: RegisterUseCase;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(inMemoryUsersRepository);
	});

	it("should be able register a new user", async () => {
		const { user } = await sut.execute({
			name: "Jonh Doe",
			email: "jonhdoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should hash user password upon registration", async () => {
		const { user } = await sut.execute({
			name: "Jonh Doe",
			email: "jonhdoe@example.com",
			password: "123456",
		});

		const isPasswordCorrectlyHashed = await compare(
			"123456",
			user.password_hash
		);

		expect(isPasswordCorrectlyHashed).toBeTruthy();
	});

	it("should not be able to register with same email twice", async () => {
		await sut.execute({
			name: "First Jonh Doe",
			email: "jonhdoe@example.com",
			password: "123456",
		});

		await expect(() =>
			sut.execute({
				name: "Second Jonh Doe",
				email: "jonhdoe@example.com",
				password: "123456",
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
