import { graphql } from 'graphql'
import { FastifyInstance } from 'fastify'

import { schema } from './schema'
import { resolvers } from './resolver'

interface GraphQLRequestBody {
	query: string
	variables?: Record<string, any>
}

export async function graphQLRoutes(app: FastifyInstance) {
	app.post('/graphql', async (req, reply) => {
		const { query, variables } = req.body as GraphQLRequestBody

		const result = await graphql({
			schema,
			source: query,
			rootValue: resolvers,
			variableValues: variables,
		})

		reply.send(result)
	})
}
