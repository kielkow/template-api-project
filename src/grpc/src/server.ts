import { randomUUID } from 'crypto'
import {
	ServerUnaryCall,
	sendUnaryData,
	Server,
	ServerCredentials,
} from '@grpc/grpc-js'

// Import proto definition and service
import {
	CreateUserRequest,
	CreateUserResponse,
} from './proto/service/v1/create_user_pb'
import { CreateUserService } from './proto/service/v1/create_user_grpc_pb'

// Declare function signature for the createUser method
const createUser = (
	call: ServerUnaryCall<CreateUserRequest, CreateUserResponse>,
	callback: sendUnaryData<CreateUserResponse>,
) => {
	const response = new CreateUserResponse()

	console.log(`Request name: ${call.request.getName()}`)
	console.log(`Request email: ${call.request.getEmail()}`)
	console.log(`Request password: ${call.request.getPassword()}`)

	response.setId(randomUUID())

	callback(null, response)
}

// Start gRPC server and expose the proto definition and service
const server = new Server()

server.addService(CreateUserService, { createUser })

server.bindAsync('0.0.0.0:4000', ServerCredentials.createInsecure(), () => {
	server.start()

	console.log('server is running on 0.0.0.0:4000')
})
