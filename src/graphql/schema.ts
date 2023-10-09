const schema = `
  type User {
    id: ID!
    name: String!
    email: String!
		password: String!
		role: String!
  }

	type UserID {
    id: ID!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

	type Mutation {
		createUser(name: String!, email: String!, password: String!): UserID!
	}
`

export { schema }
