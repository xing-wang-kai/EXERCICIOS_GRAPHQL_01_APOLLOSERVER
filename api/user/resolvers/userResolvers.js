const { GraphQLScalarType } = require('graphql');

const DateTimeOBJ ={
    name: "DateTime",
    description: "string de data e hora no romato ISO-8601",
    serialize: (value) => value.toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value)
}

const userResolvers ={

    RoleType: {
        DOCENTE: "DOCENTE",
        ESTUDANTE: "ESTUDANTE",
        COORDENACAO: "COORDENACAO"
    },

    DateTime: new GraphQLScalarType(DateTimeOBJ),

    Query:{
        users: async (root, args, {dataSources}, info) => dataSources.usersAPI.getUsers(),
        user: async (root, { id }, {dataSources}, info )=> dataSources.usersAPI.getUserById(id)
    },

    Mutation: {
        adicionarUser: async (root, { user }, {dataSources}, info ) => dataSources.usersAPI.adicionarUser(user),
        editarUser: async (root, novoDados, {dataSources}, info) => dataSources.usersAPI.editarUser(novoDados),
        deletarUser: async (root, { id }, {dataSources}, info) => dataSources.usersAPI.deletarUser(id),
    }
}

module.exports = userResolvers;