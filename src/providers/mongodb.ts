import { env } from '@/env'

import { MongoClient, ObjectId } from 'mongodb'

class MongoDBProvider {
	client: MongoClient | null

	constructor() {
		this.client = null
	}

	async connect() {
		const client = new MongoClient(env.MONGODB_URL)

		await client.connect()

		return client
	}

	async list(dbName: string, collectionName: string, query: any = {}) {
		if (!this.client) this.client = await this.connect()

		const db = this.client.db(dbName)

		const collection = db.collection(collectionName)

		return await collection.find(query).toArray()
	}

	async findById(dbName: string, collectionName: string, id: string) {
		if (!this.client) this.client = await this.connect()

		const db = this.client.db(dbName)

		const collection = db.collection(collectionName)

		return await collection.findOne({ _id: new ObjectId(id) })
	}

	async testConn() {
		try {
			if (!this.client) this.client = await this.connect()

			console.info({
				status: 'Test connection with MongoDB success.',
				result: true,
			})
		} catch (error) {
			console.error({
				status: 'Test connection with MongoDB fail.',
				error,
			})

			throw error
		}
	}

	async disconnect() {
		if (this.client) {
			await this.client.close()
			this.client = null
		}
	}
}

export const mongodbProvider = new MongoDBProvider()
