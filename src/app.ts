import fastify from 'fastify'
import { ZodError } from 'zod'
import mercurius from 'mercurius'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'

import { env } from './env'

import { usersRoutes } from './http/controllers/users/routes'
import { healthcheckRoutes } from './http/controllers/healthcheck/routes'

import { schema } from './graphql/schema'
import { resolvers } from './graphql/resolvers'
import { graphQLRoutes } from './graphql/routes'

export const app = fastify()

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	sign: {
		expiresIn: '1d',
	},
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
})

app.register(fastifyCookie)

app.register(fastifyCors, {
	origin: true,
	credentials: true,
})

app.register(mercurius, {
	schema,
	resolvers,
})

app.register(usersRoutes)
app.register(healthcheckRoutes)
app.register(graphQLRoutes)

if (env.NODE_ENV === 'prod') {
	Sentry.init({
		dsn: env.SENTRY_DSN_URL,
		integrations: [new ProfilingIntegration()],
		tracesSampleRate: 1.0,
		profilesSampleRate: 1.0,
	})
}

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: 'Validation error', issues: error.format() })
	}

	if (env.NODE_ENV !== 'prod') {
		console.error(error)
	} else {
		const transaction = Sentry.startTransaction({
			op: 'ERROR-API',
			name: 'INTERNAL-SERVER-ERROR',
		})

		Sentry.captureException(error)

		transaction.finish()
	}

	return reply.status(500).send({ message: 'Internal server error' })
})
