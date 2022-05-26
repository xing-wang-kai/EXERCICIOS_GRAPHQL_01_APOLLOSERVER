
const { ApolloServer } = require("apollo-server");
const { mergeTypeDefs } = require('@graphql-tools/merge')
const path = require('path')

const userSchema = require('./user/schema/user.graphql');
const userResolvers = require('./user/resolvers/userResolvers.js');
const usersAPI = require('./user/datasource/User.js');

const turmaSchema = require('./Tumas/schema/turmas.graphql');
const turmaResolvers = require('./Tumas/resolvers/turmasResolver.js');
const TurmasAPI = require('./Tumas/datasource/turmas.js')


//caso seja nescessário informar mais de um tipo de 
const typeDefs = mergeTypeDefs([userSchema, turmaSchema])
const resolvers = [userResolvers, turmaResolvers]

const dbConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: path.resolve(__dirname, './data/database.db')
    }
}

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    dataSources: ()=>{
        return {
            usersAPI: new usersAPI(),
            turmasAPI: new TurmasAPI(dbConfig)
        }
    }})
//caso queira especificara porta pode usar em .listen({port: 4001})
server.listen().then(({url})=>{
    console.log(`Servidor rodadado na porta ${url}`)
})

