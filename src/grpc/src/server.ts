import '@/env'

import {
	ServerUnaryCall,
	sendUnaryData,
	Server,
	ServerCredentials,
	ServerErrorResponse,
	StatusObject,
} from '@grpc/grpc-js'
import { Status } from '@grpc/grpc-js/build/src/constants'

import { makeRegisterUsecase } from '@/use-case/factories/users/make-register-usecase'

// Import proto definition and service
import {
	CreateUserRequest,
	CreateUserResponse,
} from './proto/service/v1/create_user_pb'
import { CreateUserService } from './proto/service/v1/create_user_grpc_pb'

// Handle response function errors
function handleResponse(error: unknown) {
	if (error instanceof Error) {
		const serverErrorResponse: ServerErrorResponse = {
			code: Status.INTERNAL,
			name: error.name,
			message: error.message,
		}

		return serverErrorResponse
	} else if (error instanceof Object) {
		const { code, details, metadata } = error as StatusObject

		const statusObject: Partial<StatusObject> = {
			code,
			details,
			metadata,
		}

		return statusObject
	} else {
		return null
	}
}

// Declare function signature for the createUser method
const createUser = async (
	call: ServerUnaryCall<CreateUserRequest, CreateUserResponse>,
	callback: sendUnaryData<CreateUserResponse>,
) => {
	const response = new CreateUserResponse()

	console.log(`Request name: ${call.request.getName()}`)
	const name = call.request.getName()

	console.log(`Request email: ${call.request.getEmail()}`)
	const email = call.request.getEmail()

	console.log(`Request password: ${call.request.getPassword()}`)
	const password = call.request.getPassword()

	try {
		const registerUseCase = makeRegisterUsecase()
		const { user } = await registerUseCase.execute({ name, email, password })

		response.setId(user.id)

		callback(null, response)
	} catch (error) {
		console.error('Server - Error to process createUser request:', error)

		const errorResponse = handleResponse(error)

		callback(errorResponse, null)
	}
}

// Start gRPC server and expose the proto definition and service
const server = new Server()

server.addService(CreateUserService, { createUser })

server.bindAsync('0.0.0.0:4000', ServerCredentials.createInsecure(), () => {
	server.start()

	console.log('server is running on 0.0.0.0:4000')
})
