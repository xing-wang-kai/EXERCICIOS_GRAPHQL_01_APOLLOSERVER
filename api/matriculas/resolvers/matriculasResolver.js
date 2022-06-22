const { GraphQLScalarType } = require('graphql');

const ScalarTypeOptions = {
    name: 'DateTime',
    description: 'Data retorna com formado ISO-8601',
    serialize: (value) => new Date(value).toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value).toISOString()
}

const MatriculasResolver = {
    DateTime: new GraphQLScalarType(ScalarTypeOptions),
    
    Query: {
        matriculas: async (root, args, { dataSources }, info ) => dataSources.MatriculasAPI.getMatriculas(),
        matricula: (root, { id }, { dataSources }, info ) => dataSources.MatriculasAPI.getMatriculasById(id)
    },
    Mutation: {
        createMatriculas: async (root, dados, { dataSources }, info ) => dataSources.MatriculasAPI.createMatriculas(dados),
        updateMatriculas: async (root, {id, matricula}, { dataSources }, info ) => dataSources.MatriculasAPI.updateMatriculas(id, matricula),
        deleteMatriculas: async (root, {id}, { dataSources }, info ) => dataSources.MatriculasAPI.deleteMatriculas(id)
    }
}

module.exports = MatriculasResolver;