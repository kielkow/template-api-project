import { env } from '@/env'
import redisMock from 'redis-mock'
import { createClient } from 'redis'

class CacheProvider {
	client: any

	constructor() {
		this.client = null
	}

	async connect() {
		if (process.env.NODE_ENV === 'test') {
			const client = redisMock.createClient()
			client.disconnect = () => client.quit()
			return client
		}

		const client = createClient({ url: env.REDIS_URL })

		client.on('error', (error) => {
			console.log(error)
			throw new Error('Fail to connect with Redis.')
		})

		await client.connect()

		return client
	}

	async set(key: string, value: string) {
		if (!this.client) this.client = await this.connect()
		await this.client.set(key, value)
	}

	async get(key: string) {
		if (!this.client) this.client = await this.connect()
		const value = await this.client.get(key)
		return value
	}

	async testConn() {
		try {
			if (!this.client) this.client = await this.connect()

			await this.client.setEx('test-connection', 60, '1')

			const result = await this.client.get('test-connection')
			console.info({
				status: 'Test connection with Redis success.',
				result,
			})
		} catch (error) {
			console.error({
				status: 'Test connection with Redis fail.',
				error,
			})

			throw error
		}
	}

	async disconnect() {
		if (this.client) {
			await this.client.disconnect()
			this.client = null
		}
	}
}

export const cacheProvider = new CacheProvider()
