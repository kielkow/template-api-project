import { env } from '@/env'
import amqplib, { Connection } from 'amqplib'

class MessageProvider {
	connection: Connection | null

	constructor() {
		this.connection = null
	}

	async connect() {
		return await amqplib.connect(env.RABBITMQ_URL)
	}

	async publish(queue: string, message: string) {
		if (!this.connection) this.connection = await this.connect()

		const channel = await this.connection.createChannel()

		await channel.assertQueue(queue, { durable: true })

		channel.sendToQueue(queue, Buffer.from(message))

		await channel.close()
	}

	async consume(queue: string, method: Function) {
		if (!this.connection) this.connection = await this.connect()

		const channel = await this.connection.createChannel()

		const { queue: name, messageCount } = await channel.assertQueue(queue, {
			durable: true,
		})
		console.log('QUEUE INFO:', { name, messageCount })

		await channel.consume(
			queue,
			async (msg) => {
				if (msg) {
					try {
						method(msg.content.toString())
						channel.ack(msg)
					} catch (error) {
						channel.reject(msg, false)
					}
				}
			},
			{ noAck: false },
		)

		await channel.close()
	}

	async testConn() {
		try {
			if (!this.connection) this.connection = await this.connect()

			const channel = await this.connection.createChannel()

			await channel.assertQueue('test-conn')

			await channel.close()

			console.info({
				status: 'Test connection with RabbitMQ success.',
				result: true,
			})
		} catch (error) {
			console.error({
				status: 'Test connection with Rabbit fail.',
				error,
			})

			throw error
		}
	}
}

export const messageProvider = new MessageProvider()
