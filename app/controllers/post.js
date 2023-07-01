var Post = require('../models/post')

// Post list
module.exports.list = () => {
    return Post.find()
        .sort({title:1})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.list = (id) => {
    return Post.find({IdProcesso:id})
        .sort({title:1})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.getPost = id => {
        return Post.findOne({_id:id})
            .then(docs => {
                return docs
            })
            .catch(erro => {
                    return erro
            })
    }

module.exports.addPost = a => {
    return Post.create(a)
        .then(post => {
                return post
        })
        .catch(erro => {
                return erro
        })
}

module.exports.updatePost = (id,a) => {
    return Post.updateOne({_id: id},a)
        .then(post => {
                return a
        })
        .catch(erro => {
                return erro
        })
}

module.exports.deletePost = id => {
    return Post.deleteOne({_id:id})
        .then(post => {
                return post
        })
        .catch(erro => {
                return erro
        })
}
