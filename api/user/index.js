module.exports = {
    UserSchema: require('./schema/user.graphql'),
    UserResolver: require('./resolvers/userResolvers.js'),
    UserAPI: require('./datasource/User.js')
}