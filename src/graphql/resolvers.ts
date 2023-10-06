interface Sum {
	x: number
	y: number
}

const resolvers = {
	Query: {
		add: async (_: any, { x, y }: Sum) => x + y,
	},
}

export { resolvers }
