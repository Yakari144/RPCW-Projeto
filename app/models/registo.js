//Import the mongoose module
var mongoose = require('mongoose');

var registoSchema = new mongoose.Schema({
    "ID":String,
    "ProcessoFull":String,
    "IdProcesso":Number,
    "TituloProcesso":String,
    "Data":String,
    "Arquivo":String,
    "ScopeContent":String,
    "AcessoRestrito":String,
    "LocalizacaoFisica":String,
    "LocalizacaoAnterior":String,
    "AnotacoesLinguagem":String,
    "AnotacoesTecnicas":String,
    "MaterialRelacionado":String
},{versionKey: false })


module.exports = mongoose.model('registo',registoSchema)
