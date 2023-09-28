import { hash } from "bcryptjs";

import { beforeEach, describe, expect, it } from "vitest";

import { GetUserProfileUseCase } from "./get-user-profile";

import { UsersRepository } from "@/repositories/users-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { ResourceNotFoundError } from "@/use-case/errors/resource-not-found-error";

describe("GET USER PROFILE USE CASE", () => {
	let inMemoryUsersRepository: UsersRepository, sut: GetUserProfileUseCase;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(inMemoryUsersRepository);
	});

	it("should be able get user profile", async () => {
		const { id: userId } = await inMemoryUsersRepository.create({
			name: "John Doe",
			email: "jonhdoe@example.com",
			password_hash: await hash("123456", 6),
		});

		const { user } = await sut.execute({ userId });

		expect(user.id).toEqual(userId);
	});

	it("should not be able get user profile with wrong id", async () => {
		await expect(() =>
			sut.execute({ userId: "invalid-id" })
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
