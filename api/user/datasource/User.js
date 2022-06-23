const { RESTDataSource } = require("apollo-datasource-rest");

class UserAPI extends RESTDataSource{
    constructor(){
        super();
        this.baseURL = 'http://localhost:3000';
        this.resposta = {code: 0, message: ""}
    }
    getUsers = async ({page=1, limit=0}) => {
        const query = limit 
        ? `/users?_page=${page}&_limit=${limit}`
        :`/users?_page=${page}`;

        const users = await this.get(query);
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
        try{
            let user = await this.getUser(dados.id)
            while( user.id === dados.id){
                dados.id ++
                user = await this.getUser(dados.id)
            }
        }catch(err){}finally{
            const role = await this.get(`/roles?type=${dados.role}`);
            await this.post('/users', {...dados, role: role[0].id} );
            return {...dados, role: role[0] }
        }  
    }
    editarUser = async (id, user) => {
        const role = await this.get(`/roles/?type=${user.role}` );
        await this.put(`/users/${id}`, {...user, role: role[0].id} );
        this.resposta.code = 201
        this.resposta.message = `Update no usuário de id = ${id} realizado com sucesso!!`
        return {...this.resposta, user: {...user, role: role[0]} };
    }
    deletarUser = async (id) => {
        console.log(id)
        await this.delete(`/users/${Number.parseInt(id)}`);
        this.resposta.code = 200
        this.resposta.message = `Usuário de id = ${id} deletado com sucesso!!`
        return this.resposta;
    }
}

module.exports = UserAPI;