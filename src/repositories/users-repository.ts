import { Prisma, User } from "@prisma/client";

export interface UserUpdate {
	id: string;
	name: string;
	email: string;
	password_hash: string;
}

export interface UsersRepository {
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;

	create(data: Prisma.UserCreateInput): Promise<User>;

	update(data: UserUpdate): Promise<User | null>;
}
