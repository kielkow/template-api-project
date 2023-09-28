import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	JWT_SECRET: z.string().default("templateapiproject"),

	PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
	HOST: z.string().default("0.0.0.0"),

	POSTGRESQL_DATABASE: z.string().default("templateapiproject"),
	POSTGRESQL_USERNAME: z.string().default("postgresql"),
	POSTGRESQL_PASSWORD: z.string().default("postgresql"),
	DATABASE_URL: z
		.string()
		.default(
			"postgresql://postgresql:postgresql@postgresql:5432/templateapiproject?schema=public"
		),

	REDIS_PASSWORD: z.string().default("redis"),
	REDIS_URL: z
		.string()
		.default("redis://redis:redis@redis:6379/templateapiproject"),

	RABBITMQ_USERNAME: z.string().default("user"),
	RABBITMQ_PASSWORD: z.string().default("bitnami"),
	RABBITMQ_URL: z.string().default("amqp://user:bitnami@rabbitmq:5672"),

	MONGODB_URL: z.string().default("mongodb://mongodb:27017/templateapiproject"),

	SENTRY_DSN_URL: z
		.string()
		.default("https://{dsn_first_id}.ingest.sentry.io/{dsn_second_id}"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	throw new Error(`INVALID ENV VARS!\n ${JSON.stringify(_env.error.format())}`);
}

export const env = _env.data;
