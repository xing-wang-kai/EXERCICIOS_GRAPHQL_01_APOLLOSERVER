
const { ApolloServer } = require("apollo-server")
const userSchema = require('./user/schema/user.graphql')
const userResolvers = require('./user/resolvers/userResolvers.js')
const usersAPI = require('./user/datasource/User.js')


//caso seja nescessário informar mais de um tipo de 
const typeDefs = [userSchema]
const resolvers = [userResolvers]

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    dataSources: ()=>{
        return {
            usersAPI: new usersAPI()
        }
    }})
//caso queira especificara porta pode usar em .listen({port: 4001})
server.listen().then(({url})=>{
    console.log(`Servidor rodadado na porta ${url}`)
})

