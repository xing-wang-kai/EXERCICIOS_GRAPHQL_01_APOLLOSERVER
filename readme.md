# :cherry_blossom: GRAPHQL

## :cherry_blossom: USANDO APOLLO-SERVER

Quando trabalhamos com o "GraphQl" podemos instalar o "Apollo-server": 

- [x] npm install apollo-server
- [x] npm install graphql

estão dentro do cógigo importamos o Apollo-server e executamos um novo apolloServer com as definições typeDefs e resolvers.

:speech_balloon:

```javascript

    const { ApolloServer } = require("apollo-server") 
    const server = new ApolloServer({typeDefs, resolvers})

```

## :cherry_blossom: CRIANDO typeDefs

Em um novo arquivo com extensão .graphql podemos criar os typeDefs que serão definidos para nosso schema.
os types podem ser do tipo String Boolean Int ID etc; e nesses types podemos definir "!" que informa que o type é obrigatório. 
Para demarcar o type no GraphQl precisamos importar do "apolloServer" o gql para instanciar os dados.

:speech_balloon: 

```javascript

const { gql } = require('apollo-server');

        const userSchema = gql`
            type User {
                nome: String!
                ativo: Boolean!
                email: String
            }

        `

module.exports = userSchema;

```
## :cherry_blossom: USANDO MAIS DE UM TYPEDEFS E RESOLVERS


GraphQl pode ser usado com qualquer dados e auxiliar o programador em sua manipulação.

Para usar mais de um resolver em graphql podemos usar da seguinte forma.

:speech_balloon:

```javascript

const resolvers = [userResolver, produtosResolvers]

```

porém esta tática não funcionar em "typeDefs".
Casos precisarmos usar mais de um "typeDefs" em nosso projeto com GraphQl, para solucionar isso e usar mais de uma vez o schema é possivel usar GraphQl-tools;

- [x] npm install graphql-tools

Após importa o código informamos o mesmo da seguinte maneira.

:speech_balloon:

```javascript
    const { mergeTypeDefs } = require('graphql-tools')

    const typeDefs = mergeTypeDefs[userTypeDefs, produtosTypeDefs]
```
:speech_balloon: