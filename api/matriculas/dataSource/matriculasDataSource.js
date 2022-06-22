const { SQLDataSource } = require('datasource-sql');

class MatriculasAPI extends SQLDataSource{
    constructor(dbConfig){
        super(dbConfig);
        this.message = {
            code: 0,
            message: ""
        }
    }
    getMatriculas = async () => {
        return await this.db
                        .select("*")
                        .from('matriculas')                
    }
    getMatriculasById = async (id) => {
        const matricula = await this.db
                                .select("*")
                                .from("matriculas")
                                .where({id: Number.parseInt(id)});
        return matricula[0]

    }
    createMatriculas = async (dados) => {
        const novaMatriculaID = await this.db
                                    .insert(...dados)
                                    .into('matriculas')
                                    .returning('id')
        const novaMatricula = await this.getMatriculasById(novaMatriculaID[0])
        return {...novaMatricula}
    }
    updateMatriculas = async (id, matricula) => {
        await this.db
            .update(matricula)
            .into('matriculas')
            .where({id: Number.parseInt(id)})
        const matriculaAtualizada = await this.getMatriculasById(id)
        this.message.code = 202
        this.message.message = "matricula atualizada com sucesso!!"
        return {...this.message, matricula: {...matriculaAtualizada}}

    }
    deleteMatriculas = async (id) => {
        await this.db
                .del()
                .where({id:Number.parseInt(id)})
                .into('matriculas')
        this.message.code = 200;
        this.message.message = "matricula deletada com sucesso!!";
        return this.message;
    }
}

module.exports = MatriculasAPI;