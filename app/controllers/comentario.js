var Comentario = require('../models/comentario')

// Comentario list
module.exports.list = () => {
    return Comentario.find()
        .sort({title:1})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.list = (id) => {
    return Comentario.find({idRef:id})
        .sort({title:1})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.getComentario = id => {
        return Comentario.findOne({_id:id})
            .then(docs => {
                return docs
            })
            .catch(erro => {
                    return erro
            })
}

module.exports.addComentario = a => {
    return Comentario.create(a)
        .then(comentario => {
                return comentario
        })
        .catch(erro => {
                return erro
        })
}

module.exports.updateComentario = (id,a) => {
    return Comentario.updateOne({_id: id},a)
        .then(comentario => {
                return a
        })
        .catch(erro => {
                return erro
        })
}

module.exports.deleteComentario = id => {
    return Comentario.deleteOne({_id:id})
        .then(comentario => {
                return comentario
        })
        .catch(erro => {
                return erro
        })
}
