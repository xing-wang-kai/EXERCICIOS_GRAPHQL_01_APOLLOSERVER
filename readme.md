# :cherry_blossom: GRAPHQL

## :cherry_blossom: USANDO APOLLO-SERVER

Quando trabalhamos com o "GraphQl" podemos instalar o "Apollo-server": 

- [x] npm install apollo-server
- [ ] npm install graphql

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

## :cherry_blossom: USANDO DATASOURCES

quando usamos dados de alguma origem podemo usar datasources para instanciar as informações dos dados e puxar eles de sua origem com o esquema.
- [x] npm install apollo-datasources-rest

:speech_balloon:

```javascript
const { RESTDatasources } = require('apollo-resources-rest');

class userAPI extends RESTDatasources {
    constructor(){
        super()
        this.baseURL = "http://localhost:3000"
    }
    async getUsers(){
        return this.get('/users')

    }
}

module.exports = userAPI;

```

uma vez definido o datasources então chamamos o mesmo como parametro do apollo server:

```javascript
///imports
const UsersAPI = require('./user/datasource/User.js')

/*demais código*/

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    dataSources: ()=>{
        return {
            UsersAPI: new UsersAPI()
        }
    }})

```

## :cherry_blossom: CRIANDO RESOLVERS FUNCIONAIS

Para fazer a ação dos resolver integrarem com a API confome desejarmos precisamos dizer ao resolver o que ele vai buscar e comparar, lembrando que as queres devem serguir parametros entre resolvers e typeDefs...

:speech_balloon:

```javascript
const userResolver = {
    query: {
        users: (root, args, {dataSources}, info) => dataSources.UserAPI.getUsers(),
    }
}
```

## INTEGRANDO COM DATASOURCES

usando o DataSources podemos integrar ainda mais com uma API banco de dados, json ou demais origens, para isso podemos adicionar outro campo dentro do userSchema chamado Role que retorna outro json..

```javascript
const { gql } = require('apollo-server');

        const userSchema = gql`
            type User {
                id: ID!
                nome: String!
                ativo: Boolean!
                email: String
                role: Role!
            }
            type Role {
                id: ID!
                type: String!
            }
            type Query {
                users: [User]
                user(id: ID!): User!
            }

        `
```

O código acima usamos os Query para definir o tipo de method que sera usado no resolvers..
para envocar este metodo em datasource então executamos.

```javascript

const { RESTDataSources } = require('apollo-datasource-rest');

class UserAPI extends RESTDataSources{
    constructor(){
        super();
        this.baseURL = "http://localhost:3000"
    }
    async getUsers(){
        const user = await this.get('/users');
        return user.map((user)=>({
            id: user.id,
            nome: user.nome,
            ativo: user.ativo,
            email: user.email,
            role: return await this.get(`/roles/${user.role}`) 

        }))
    }
    async getUser(id){
        const user = await get(`/users/${id}`)
        user.role= await get(`/roles/${user.role}`)
        return user
    }
}

```
:speech_balloon:

## :cherry_blossom: USANDO MUTATIONS

Para methods como PUT POST e DELETE Precisamos usar os Mutations e não querys...desta maneira os mutations são designados em para cumprir a função do CRUD sendo que defimos em typeDefs Resolvers e DataSources...

### :cherry_blossom: METHODO POST 

para adicionar novos dados em uma api usamos o mutations para post conforme o exempolo abaixo.
*em typeDefs* 

```javascript
const { gql } = require('apollo-server');

const userSchema = gql`
    type User {
        id: ID!
        nome: String!
        ativo: Boolean!
        email: String
        role: Role!
    }

    type Role {
        id: ID!
        type: String!
    }

    type Query {
        users: [User]
        user(id: ID!): User!
    }
    type Mutation {
        adicionarUser(nome: String!, ativo: Boolean!, email: String, role: String!): User!
        
    }
`

module.exports = userSchema;

```
O role do tipo adicionar usuário... então definimos em datasource a função que será chamada para realizar a execução...

*em DataSources*

```javascript
const { RESTDataSource  } = require("apollo-datasource-rest");

class UsersAPI extends RESTDataSource{
    constructor(){
        super();
        this.baseURL = 'http://localhost:3000';
    }
    async getUsers() {
        const users = await this.get('/users')
        return users.map(async user => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          ativo: user.ativo,
          role: await this.get(`/roles/${user.role}`)
        }))
      }
    async getUserById(id){
        const user = await this.get(`/users/${id}`)
        user.role = await this.get(`/roles/${user.role}`)
        return user
    }
    async adicionarUser(User){
        const users = await this.get('/users');
        User.id = users.length + 1;
        const role = await this.get(`/roles?type=${User.role}`);
        await this.post('/users', {...User, role: role[0].id})
        return ({...User, role: role[0]})

    }
}

module.exports = UsersAPI;
```

Visto que o tipo ROLE é adicionado como uma STRING então precisamos buscar  string associada a aquele valor e jogara a ID para o post.

agora é preciso definir o method post em RESOLVERS.

*em Resolvers*

:speech_balloon:

```javascript
const userResolvers ={
    Query:{
        users: (root, args, {dataSources}, info) => dataSources.usersAPI.getUsers(),
        user: (root, { id }, {dataSources}, info )=> dataSources.usersAPI.getUserById(id)
    },
    Mutation: {
        adicionarUser: (root, User, {dataSources}, info ) => dataSources.usersAPI.adicionarUser(User)
    }
}

module.exports = userResolvers;
```

### :cherry_blossom: METHODS PUT E DELETE.

mehod put é similiar ao que realizamos em POST porém ele também recebe o id nos parametros e ele não gera novo id para o usuário...
já o method delete e só recebe o ID do usuário nos parametros em typeDefs e retorna somente ID deletado.

```javascript
const { gql } = require('apollo-server');

const userSchema = gql`
    scalar DateTime

    type User {
        id: ID!
        nome: String!
        ativo: Boolean!
        email: String
        role: Role!
        createdAt: DateTime
    }

    type Role {
        id: ID!
        type: String!
    }

    type Query {
        users: [User]
        user(id: ID!): User!
    }
    type Mutation {
        adicionarUser(nome: String!, ativo: Boolean!, email: String, role: String! createdAt: DateTime): User!
        editarUser(id: ID!, nome: String!, ativo: Boolean!, email: String, role: String!): User!
        deletarUser(id: ID!): ID!
    }
`
module.exports = userSchema;
```

```javascript
const { RESTDataSource  } = require("apollo-datasource-rest");

class UsersAPI extends RESTDataSource{
    constructor(){
        super();
        this.baseURL = 'http://localhost:3000';
    }
    async getUsers() {
        const users = await this.get('/users')
        return users.map(async user => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          ativo: user.ativo,
          role: await this.get(`/roles/${user.role}`)
        }))
      }
    async getUserById(id){
        const user = await this.get(`/users/${id}`)
        user.role = await this.get(`/roles/${user.role}`)
        return user
    }
    async adicionarUser(dados){
        const users = await this.get('/users');
        dados.id = users.length + 1;
        const role = await this.get(`/roles?type=${dados.role}`);
        await this.post('/users', {...dados, role: role[0].id})
        return ({...dados, role: role[0]})

    }
    async editarUser(dados){
        const role = await this.get(`/roles?type=${dados.role}`)
        await this.put(`/users/${dados.id}`, {...dados, role: role[0].id})
        return {...dados, role: role[0]}
    }
    async deletarUser(id){
        await this.delete(`/users/${id}`);
        return id;
    }
}

module.exports = UsersAPI;
```

```javascript
const { GraphQLScalarType } = require('graphql');

const DateTimeOBJ ={
    name: "DateTime",
    description: "string de data e hora no romato ISO-8601",
    serialize: (value) => value.toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value)
}

const userResolvers ={
    DateTime: new GraphQLScalarType(DateTimeOBJ),
    Query:{
        users: async (root, args, {dataSources}, info) => dataSources.usersAPI.getUsers(),
        user: async (root, { id }, {dataSources}, info )=> dataSources.usersAPI.getUserById(id)
    },
    Mutation: {
        adicionarUser: async (root, User, {dataSources}, info ) => dataSources.usersAPI.adicionarUser(User),
        editarUser: async (root, dados, {dataSources}, info) => dataSources.usersAPI.editarUser(dados),
        deletarUser: async (root, {id}, {dataSources}, info) => dataSources.usersAPI.deletarUser(id),
    }
}

module.exports = userResolvers;
```

## :cherry_blossom: scalar

O method scalar em graphql constroe um novo type que pode ser adicionado. neste projeto criamos o tipo scalar DateTime para adicionar ao createdAt de nossa base de dados em json...

No arquivo do SCHEMA com terminação .graphql adicionar os arquivo.
```javascript
scalar DateTime
type User{
    nome: String!
    ativo: Boolean!
    emai: String
    role: Role
    createdAt: DateTime
}
```

para definir a criação do scalar vamos em resolvers e então definmos o scalar...
dentro do Resolver adicionamos o código... (navegue pelo código deste repositório para saber mais.)

```javascript
const { GraphQLScalarType } = require('graphql');

    const DateTimeObj = {
        name: 'DateTime', //O nome do objeto que vamos usar em scalar
        description: "string de data e hora no romato ISO-8601", //descrição do escalar...
        serialize: (value) => value.toISOString(),
        parseValue: (value) => new Date(value),
        parseLiteral: (ast) => new Date(ast.value)
    }


const userResolver = {

    DateTime: new GraphQLScalarType(DateTimeOBJ),

    ///...Demais códigos ...
}

```

## :cherry_blossom: CRIANDO ENUM

Os Enum defimem valores unicos que serão usados dentro do graphql, como exemplo dentro do arquivo SCHEMA para o typeDefs vamos definir o ENUM para o role que receberá somente 3 parametros.

ex...

```javascript
\\Este código dentro de gql`...`

enum RoleType {
    DOCENTE
    ESTUDANTE
    COORDENACAO
}
```

Apos criar este type dentro de SCHEMA precisamos criar a definição dele dentro do Resolver...

```javascript

\\Este código dentro do RESOLVER em const userResolver = {...}

RoleType: {DOCENTE: "DOCENTE", ESTUDANTE: "ESTUDANTE", COORDENACAO: "COORDENACAO"},
\\demais códigos.

```

## :cherry_blossom: DEFINIR INPUT

OS valor input são usados apra aprimorar os dadods em definições.. dentro do schema criamos um novo tipo chamado input

```javascript
\\Este código dentro de const UserSchema = gql`...`

input UserInput {
    nome: String
    ativo: Boolean
    email: String
    role: RoleType
}
```
este código é usado em Mutations dentro de schema...

```javascript
mutations{
    editarUser(id: ID!, user: UserInput): User!
}

```

Em resolver é necessário prestar atenção porque o valor de USER é um objeto, caso adicione somente o valor de user colocar { } caso queira valor com o id precisa ser aberto o objeto e seperado o user do ID para implementar na api. Esta implementação pode ser feita em datasource...

```javascript
async editarUser({id, user}){
        const role = await this.get(`/roles?type=${user.role}`)
        await this.put(`/users/${id}`, {...user, role: role[0].id})
        return {...user, role: role[0]}
    }
```

## :cherry_blossom: CRIANDO mergeTypeDefs

Quando usamos o GraphQl e queremos adicionar mais de um schema precisamos usar o MergeTypeDefs importdos de GraphQl-tools
- [x] npm install graphql-tools

:coffee:

```javascript
const { mergeTypeDefs } = require('@graphql-tools/merge');

const UserTypeDefs = mergeTypeDefs([userSchema, turmaSchema])
```