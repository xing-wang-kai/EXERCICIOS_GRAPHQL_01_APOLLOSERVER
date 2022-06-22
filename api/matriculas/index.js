module.exports = {
    MatriculaSchema: require('./schema/matriculas.graphql'),
    MatriculaResolver: require('./resolvers/matriculasResolver.js'),
    MatriculaAPI: require('./dataSource/matriculasDataSource.js')
}