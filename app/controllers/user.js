var User = require('../models/user')

// User list
module.exports.list = () => {
    return User.find()
        .sort({nome:1})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.getUser = id => {
    return User.findOne({_id:id})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.getUserName = id =>{
        return User.findOne({username:id})
                .then(docs => {
                        return docs
                })
                .catch(erro =>{
                        return erro
                })
}

module.exports.login = (user,pass) => {
    return User.findOne({username:user})
        .then(docs => {
            if(docs==null){return 1}
            if(docs.password!=pass){return 2}
            else{
                // get current date to format YYYY-MM-DD
                var date = new Date().toISOString().substring(0,10)
                // update last access
                return User.updateOne({_id: docs._id},{"dateLastLogin": date})
                        .then(User => {
                                return docs
                        })
                        .catch(erro => {
                                return erro
                        })
            }
        })
        .catch(erro => {
                return erro
        })
}

module.exports.add = a => {
    return User.create(a)
        .then(User => {
                return User
        })
        .catch(erro => {
                return erro
        })
}

module.exports.update = (id,a) => {
    return User.updateOne({_id: id},a)
        .then(User => {
                return a
        })
        .catch(erro => {
                return erro
        })
}

module.exports.delete = id => {
    return User.deleteOne({_id:id})
        .then(User => {
                return User
        })
        .catch(erro => {
                return erro
        })
}