var Registo = require('../models/registo')
var Utils = require('../utils/utils')

// Registo list
module.exports.list = () => {
    return Registo.find()
        .sort({nome:1})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.list = (page,limit,sort,ord,local,data) => {
        // limit represents the page size
        limit = limit ? parseInt(limit) : 10
        // page represents the page number
        page = page ? parseInt(page) : 1
        // sort represents the column to sort
        sort = sort ? sort : "TituloProcesso"
        // ord represents the sorting order
        ord = ord ? ord : "asc"
        ord = ord=="asc" ? 1 : -1
        sortObj = {}
        sortObj[sort] = ord
        // local represents the local to filter
        local = local ? local : ""
        // data represents the data to filter
        data = data ? data : ""
        // query represents the query to be performed
        var query = {}
        // if local is not empty, add it to the query
        if(local != ""){
                query.LocalizacaoFisica = local
        }
        // if data is not empty, add it to the query
        if(data != ""){
                query.Data = data
        }
        console.log('query:',query,'sort:',sort,'ord:',ord,'page:',page,'limit:',limit)
        // if page is not empty, add it to the query
        if(page != null){
                // get the total number of pages
                return Registo.countDocuments(query)
                        .then(total => {
                                console.log('total:',total)
                                // calculate the total number of pages
                                var pages = Math.ceil(total/limit)
                                // if page is greater than the total number of pages
                                if(page > pages){
                                        page = pages
                                }
                                // if page is less than 1
                                if(page < 1){
                                        page = 1
                                }
                                return Registo.find(query)
                                        .sort(sortObj)
                                        .skip((page-1)*limit)
                                        .limit(limit)
                                        .then(docs => {
                                                r = {}
                                                r.docs = docs
                                                r.pages = pages
                                                return r
                                        })
                                        .catch(erro => {
                                                return erro
                                        })
                                })
                        .catch(erro => {
                                return erro
                        })
        }else{
                return Registo.find(query)
                        .sort(sortObj)
                        .then(docs => {
                                return docs
                        })
                        .catch(erro => {
                                return erro
                        })
        }
}

module.exports.getRegisto = id => {
        id = parseInt(id)
        return Registo.findOne({"IdProcesso":id})
            .then(docs => {
                console.log('>'+docs.MaterialRelacionado+'<')
                docs.MaterialRelacionado = Utils.handleMaterial(docs.MaterialRelacionado)
                docs.ScopeContent = Utils.handleScopeContent(docs.ScopeContent)
                return docs
            })
            .catch(erro => {
                    return erro
            })
    }

module.exports.getRegistoTitle = id => {
    return Registo.findOne({TituloProcesso:id})
        .then(docs => {
                docs.MaterialRelacionado = Utils.handleMaterial(docs.MaterialRelacionado)
                docs.ScopeContent = Utils.handleScopeContent(docs.ScopeContent)
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.addRegisto = a => {
    return Registo.create(a)
        .then(Registo => {
                return Registo
        })
        .catch(erro => {
                return erro
        })
}

module.exports.updateRegisto = (id,a) => {
    return Registo.updateOne({_id: id},a)
        .then(Registo => {
                return a
        })
        .catch(erro => {
                return erro
        })
}

module.exports.updateRegistoTitle = (id,a) => {
        return Registo.updateOne({TituloProcesso: id},a)
            .then(Registo => {
                    return a
            })
            .catch(erro => {
                    return erro
            })
    }

module.exports.deleteRegisto = id => {
    return Registo.deleteOne({_id:id})
        .then(Registo => {
                return Registo
        })
        .catch(erro => {
                return erro
        })
}

module.exports.deleteRegistoTitle = id => {
        return Registo.deleteOne({TituloProcesso:id})
            .then(Registo => {
                    return Registo
            })
            .catch(erro => {
                    return erro
            })
    }