const { RESTDataSource } = require("apollo-datasource-rest");

class UserAPI extends RESTDataSource{
    constructor(){
        super();
        this.baseURL = 'http://localhost:3000';
        this.message = {code: 200, message: "sucesso!"}
    }
    getUsers = async () => {
        const users = await this.get('/users');
        return users.map(async (user) => ({
            id: user.id,
            nome: user.nome,
            ativo: user.ativo,
            email: user.email,
            role: await this.get(`/roles/${user.role}`),
            createdAt: user.createdAt
        }))
    }
    getUser = async (id) => {
        const user = await this.get(`/users/${id}`);
        user.role = await this.get(`/roles/${user.role}`);
        return user;
    }
    createUser = async (dados) => {
        const users = await this.get('/users');
        dados.id = users.length + 1;
        const role = await this.get(`/roles?type=${dados.role}`);
        await this.post('/users', {...dados, role: role[0].id} );
        return {...dados, role: role[0] }
    }
    editarUser = async (id, user) => {
        const role = await this.get(`/roles/?type=${user.role}` );
        await this.put(`/users/${id}`, {...user, role: role[0].id} );
        return {...this.message, user: {...user, role: role[0]} };
    }
    deletarUser = async (id) => {
        console.log(id)
        await this.delete(`/users/${Number.parseInt(id)}`);
        return this.message;
    }
}

module.exports = UserAPI;