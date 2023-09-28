import { randomUUID } from "crypto";
import { Prisma, Role, User } from "@prisma/client";

import { UserUpdate, UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = [];

	async findById(id: string) {
		const user = this.users.find((user) => user.id === id);

		if (!user) return null;

		return user;
	}

	async findByEmail(email: string) {
		const user = this.users.find((user) => user.email === email);

		if (!user) return null;

		return user;
	}

	async create(data: Prisma.UserCreateInput) {
		const { name, email, password_hash } = data;

		const user = {
			id: randomUUID(),
			name,
			email,
			password_hash,
			role: Role.MEMBER,
			created_at: new Date(),
		};

		this.users.push(user);

		return user;
	}

	async update(data: UserUpdate) {
		const { id, name, email, password_hash } = data;

		let user = this.users.find((user) => user.id === id);

		if (!user) return null;

		user = { ...user, name, email, password_hash };

		return user;
	}
}
