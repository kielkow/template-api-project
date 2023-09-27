import 'redis-mock'

declare module 'redis-mock' {
	export interface RedisClient {
		disconnect: () => void
	}
}
