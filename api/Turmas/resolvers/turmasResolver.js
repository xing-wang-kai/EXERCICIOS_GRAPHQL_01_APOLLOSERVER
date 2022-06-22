const { GraphQLScalarType } = require('graphql');

const scalarTypeOptions = {
  name: 'DateTime',
   description: 'string de data e hora no formato ISO-8601',
   serialize: (value) => new Date(value).toISOString(),
   parseValue: (value) => new Date(value),
   parseLiteral: (ast) => new Date(ast.value).toISOString()
}

const TurmaResolver = {
  DateTime: new GraphQLScalarType(scalarTypeOptions),
  Query:{
    turmas: async (root, args, { dataSources }, info) => dataSources.TurmaAPI.getTurmas(),
    turma: async (root, { id }, {dataSources}, info) => dataSources.TurmaAPI.getTurmaById(id)
  },
  Mutation: {
    createTurma: async (root, {turma}, {dataSources}, info) => dataSources.TurmaAPI.createTurma(turma),
    updateTurma: async (root, {id, turma}, {dataSources}, info) => dataSources.TurmaAPI.updateTurma(id, turma),
    deleteTurma: async (root, id, {dataSources}, info) => dataSources.TurmaAPI.deleteTurma(id)
  }
}

module.exports = TurmaResolver;