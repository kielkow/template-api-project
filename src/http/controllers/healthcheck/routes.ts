import { FastifyInstance } from 'fastify'

import { healthcheck } from './healthcheck'

export async function healthcheckRoutes(app: FastifyInstance) {
	// Not Authenticated
	app.get('/healthcheck', healthcheck)
}
