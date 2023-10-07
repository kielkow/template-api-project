const schema = `
  type User {
    id: ID!
    name: String!
    email: String!
		password: String!
		role: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }
`

export { schema }
