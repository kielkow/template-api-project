import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

interface GraphQLRequestBody {
	query: string
}

export async function graphQLRoutes(app: FastifyInstance) {
	app.post(
		'/query/graphql',
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { query } = request.body as GraphQLRequestBody

			return reply.graphql(query)
		},
	)
}
