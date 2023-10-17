import { defineConfig } from 'tsup'

export default defineConfig({
	entry: [
		'src',

		'!src/grpc/proto',
		'!src/grpc/src/proto',

		'!src/**/*.spec.*',
		'!src/**/*.yaml.*',
		'!src/**/*.proto.*',
	],
	loader: {
		'.proto': 'text',
		'.yaml': 'text',
	},
})
