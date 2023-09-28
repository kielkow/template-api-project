import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfileUseCase } from "../../usecases/users/get-user-profile/get-user-profile";

export function makeGetUserProfileUsecase() {
	const prismaUsersRepository = new PrismaUsersRepository();
	const getUserProfileUseCase = new GetUserProfileUseCase(
		prismaUsersRepository
	);

	return getUserProfileUseCase;
}
