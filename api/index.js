const { ApolloServer } = require('apollo-server');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const path = require('path');

const { UserSchema, UserResolver, UserAPI } = require('./user/index.js');
const { TurmaSchema, TurmaResolver, TurmaAPI } = require('./Turmas/index.js');
const { MatriculaSchema, MatriculaResolver, MatriculaAPI }= require('./matriculas/index.js');

const typeDefs = mergeTypeDefs([UserSchema, TurmaSchema, MatriculaSchema])
const resolvers = [UserResolver, TurmaResolver, MatriculaResolver]

const dbConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: path.resolve(__dirname , './data/database.db')
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () =>{
        return {
            UserAPI: new UserAPI(),
            TurmaAPI: new TurmaAPI(dbConfig),
            MatriculasAPI: new MatriculaAPI(dbConfig)
        }
    }
 })

server.listen().then(({url})=>console.log(`Conectado com sucesso na porta ${url}`))