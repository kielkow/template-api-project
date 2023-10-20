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

request.setName('John Doe')
request.setEmail('jonhdoe@email.com')
request.setPassword('123456')

client.createUser(request, (error: any, response: CreateUserResponse) => {
	if (error) {
		console.error('Error to process createUser request:', error)
		process.exit(1)
	}

	console.info(`User ID: ${response.getId()}`)
})
