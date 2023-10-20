import { credentials } from '@grpc/grpc-js'

import {
	CreateUserRequest,
	CreateUserResponse,
} from './proto/service/v1/create_user_pb'
import { CreateUserClient } from './proto/service/v1/create_user_grpc_pb'

const client = new CreateUserClient(
	'localhost:4000',
	credentials.createInsecure(),
)

const request = new CreateUserRequest()

// TODO: Get vars from gRPC request
request.setName('John Doe')
request.setEmail('johndoe@example.com')
request.setPassword('password123')

client.createUser(request, (error: any, response: CreateUserResponse) => {
	if (error) {
		console.error('Client - Error to process createUser request:', error)
		process.exit(1)
	}

	console.info(`Created User ID: ${response.getId()}`)
})
