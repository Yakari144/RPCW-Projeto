
module.exports.splitOR = (txt,s1,s2,join='depois') => {
    var entradas = txt;
    s1 = "/("+s1+")/g";
    s2 = "/("+s2+")/g";
    if(join == 'antes'){
        entradas = entradas.replace(eval(s1),"$1MyOwnSpecialSplitToken");
        entradas = entradas.replace(eval(s2),"$1MyOwnSpecialSplitToken");
    }else{
        entradas = entradas.replace(eval(s1),"MyOwnSpecialSplitToken$1");
        entradas = entradas.replace(eval(s2),"MyOwnSpecialSplitToken$1");
    }
    entradas = entradas.split("MyOwnSpecialSplitToken");
    entradas = entradas.filter(function(e){return e});
    return entradas;
}

module.exports.handleNrProcesso = (entries) =>{
    var s2 = []
    for(e in entries){
        // equivalent to s.strip()
        e2 = entries[e].trim()
        e2 = e2.replace(/^\s+|\s+$/g, '')
        var ss = this.splitOR(e2,'Proc.\\d+\\.','n.\\s*º\\s+\\d+',join='antes')
        for(s in ss){
            s1 = ss[s]
            var reg = new RegExp('Proc.(\\d+)\\.','g')
            var m1 = reg.exec(s1)
            if(m1)
                s2.push('<a href="/registo/'+m1[1]+'">'+s1+'</a>')
            else{
                var reg = new RegExp('n.\\s*º\\s+(\\d+)','g')
                var m2 = reg.exec(s1)
                if(m2)
                    s2.push('<a href="/registo/'+m2[1]+'">'+s1+'</a>')
                else
                    s2.push(s1)
            }
        }
    }
    return s2
}

module.exports.handleMaterial = (line) => {
    if(line == null){
        return ''
    }
    line = line.toString()
    line = line.replace(/^"+|"+$/g, '')
    rg = '[Ss][ée]rie [Ii]nquiri[cç][oôõ]es de [Gg][ée]nere:'
    rp = '[Ss][ée]rie [Pp]rocessos de [Pp]atrim[óôo]nio,'
    entradas = this.splitOR(line,rg,rp)
    saidas = []
    for(e in entradas){
        e2 = entradas[e]
        if(e2.match(eval('/('+rg+')/g'))){
            var spO = this.splitOR(e2,rg,'\\0',join='antes')
            saidas.push(this.handleNrProcesso(spO))
        }else if(e2.match(eval('/('+rp+')/g'))){
            var spO = this.splitOR(e2,rp,'\\0',join='antes')
            saidas.push(this.handleNrProcesso(spO))
        }else
            saidas.push(this.handleNrProcesso([e2]))
        
    }
    
    saidas = saidas.map(s => s.join(' '))
    saidas = saidas.join(' ')
    
    return saidas
}

module.exports.handleScopeContent = (line) => {
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
        n1[0] = '<a href="Inquirição de genere de '+n1[0].trim()+'">' + n1[0] + '</a>'
        ns.push(n1.join(','))
    }
    l2[0] = ns.join('e')
    line[1] = l2.join('.')
    line = line.join('Filiação:')
    return line
}