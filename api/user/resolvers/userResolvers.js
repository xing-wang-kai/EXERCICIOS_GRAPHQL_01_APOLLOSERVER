

const userResolvers ={
    Query:{
        users: (root, args, {dataSources}, info) => dataSources.usersAPI.getUsers()

    }
}

module.exports = userResolvers;