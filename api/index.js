
const { ApolloServer } = require("apollo-server")
const userSchema = require('./user/schema/user.graphql')

const user = [
    {
        nome: "Ana",
        ativo: true
    },
    {
        nome: "Marcia",
        ativo: false
    }
]
//caso seja nescessário informar mais de um tipo de 
const typeDefs = [userSchema]
const resolvers = {}

const server = new ApolloServer({typeDefs, resolvers})
//caso queira especificara porta pode usar em .listen({port: 4001})
server.listen().then(({url})=>{
    console.log(`Servidor rodadado na porta ${url}`)
})