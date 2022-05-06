const { RESTDataSource  } = require("apollo-datasource-rest");

class UsersAPI extends RESTDataSource{
    constructor(){
        super();
        this.baseURL = 'http://localhost:3000';
        this.resposta = {
            code: 200,
            messagem: "Ação Realizada com suscesso"
        }
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
    async editarUser({id, user}){
        const role = await this.get(`/roles?type=${user.role}`)
        await this.put(`/users/${id}`, {...user, role: role[0].id})
        return ({...this.resposta, user: {...user, role: role[0]}})
    }
    async deletarUser(id){
        await this.delete(`/users/${id}`);
        return this.resposta;
    }
}

module.exports = UsersAPI;