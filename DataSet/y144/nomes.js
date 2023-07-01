
var fs = require('fs');
var text = fs.readFileSync('scopecontent.txt','utf8');

// open file for writing


function handle(line){
    line = line.trim()
    var fex = /[Ff]ilia[cç][aã]o:/g
    // remove Filiação: from the beginning
    line = line.split(fex)
    if (line.length < 2)
        l2 = line[0]
    else
        l2 = line[1].split('.')
    first = l2[0]
    ns = []
    for(n of first.split(/\be\b/g)){
        var n1 = n.split(',')
        n1[0] = '<a href="registo/Inquirição de genere de '+n1[0].trim()+'">' + n1[0] + '</nome>'
        ns.push(n1.join(','))
    }
    l2[0] = ns.join('e')
    line[1] = l2.join('.')
    line = line.join('Filiação:')
    return line
}
