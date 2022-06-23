const { SQLDataSource } = require('datasource-sql');

class TurmaAPI extends SQLDataSource {
    constructor(dbConfig) {
      super(dbConfig)
      this.message = {
        code: 200,
        message: ""
      }
    }
    async getTurmas() {
        const turmas = await this.db 
          .select('*')
          .from('turmas')
        return turmas
      }
      
      async getTurmaById(id) {
        const turma = await this.db
          .select('*')
          .from('turmas')
          .where({ id: Number(id)})
        return turma[0]
      }
    
      async createTurma(novaTurma) {
        const novaTurmaId = await this.db
          .insert({...novaTurma})
          .returning('id')
          .into('turmas')
      
        const turmaInserida = await this.getTurmaById(novaTurmaId[0])
        return ({ ...turmaInserida })
      }
    
      async updateTurma(id, turma) {
        await this.db
          .update({ ...turma })
          .where({ id: Number(id) })
          .into('turmas')
    
        const turmaAtualizada = await this.getTurmaById(id)
        this.message.message = "dados Atualizados com sucesso"
        return ({...this.message, turma: {
          ...turmaAtualizada
        }})
      }
    
      async deleteTurma(id) {
        await this.db
          .where({ id: Number.parseInt(id) })
          .into('turmas')
          .del()
        this.message.message = "registro deletado"
        return this.message
      }
}

module.exports = TurmaAPI;