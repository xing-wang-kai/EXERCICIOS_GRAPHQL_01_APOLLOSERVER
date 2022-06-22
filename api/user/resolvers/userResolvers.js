const { GraphQLScalarType } = require("graphql");

const ScalarTypeConfig = {
    name: 'DateTime',
    description: "Adequar a data retornada nas normas ISO-8601",
    serialize: (value) => new Date(value).toISOString(),
    parseValue: (value) => new Date(value),
    ParseLiteral: (ast) => new Date(ast.value)
}

const userResolver = {
    DateTime: new GraphQLScalarType(ScalarTypeConfig),
    RoleEnum: {DOCENTE: 'DOCENTE', ESTUDANTE: 'ESTUDANTE', COORDENACAO: 'COORDENACAO'},
    Query: {
        users: async (root, args, { dataSources }, info) => dataSources.UserAPI.getUsers(),
        user: async (root, { id }, { dataSources }, info) => dataSources.UserAPI.getUser(id)
    },
    Mutation: {
        createUser: async (root, {user}, { dataSources }, info )=> dataSources.UserAPI.createUser(user),
        editarUser: async (root, {id, user}, { dataSources }, info) => dataSources.UserAPI.editarUser(id, user),
        deletarUser: async (root, {id}, { dataSources }, info) => dataSources.UserAPI.deletarUser(id)
    }
}

module.exports = userResolver;