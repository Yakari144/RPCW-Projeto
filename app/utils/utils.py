#handleMaterial()
apelidos = get_apelidos({})
nomes = get_nomes({})
material = df['MaterialRelacionado'].dropna().to_list()

def splitOR(txt,s1,s2,join='depois'):
    entradas = txt
    s1 = r'('+s1+')'
    s2 = r'('+s2+')'
    if join == 'antes':
        # sub where it matches with the match and the separato
        entradas = re.sub(s1,r'\1SEPARADORespecialMEU',entradas)
        entradas = re.sub(s2,r'\1SEPARADORespecialMEU',entradas)
    else:
        entradas = re.sub(s1,r'SEPARADORespecialMEU\1',entradas)
        entradas = re.sub(s2,r'SEPARADORespecialMEU\1',entradas)
    entradas = re.split('SEPARADORespecialMEU',entradas)
    if '' in entradas:
        entradas.remove('')
    return entradas

def handleNrProcesso(entries):
    s2 = []
    for s in entries:
        s = s.strip()
        ss = splitOR(s,r'Proc.\d+\.',r'n.\s*º\s+\d+',join='antes')
        for s in ss:
            m1 = re.search(r'Proc\.(\d+)\.',s)
            if m1:
                s2.append('<nrprocesso='+m1.group(1)+'>'+s+'</nrprocesso>')
            else:
                m2 = re.search(r'n\.\s*º\s+(\d+)',s)
                if m2:
                    s2.append('<nrprocesso='+m2.group(1)+'>'+s+'</nrprocesso>')
                else:
                    s2.append(s)
    return s2

def handleMaterial(line):
    if pd.isnull(line):
        return ''
    line = str(line)
    line = line.strip('"')
    rg = r'[Ss][ée]rie [Ii]nquiri[cç][oôõ]es de [Gg][ée]nere:'
    rp = r'[Ss][ée]rie [Pp]rocessos de [Pp]atrim[óôo]nio,'
    # split by rg and rp without removing them
    # given "Série Inquirições de genere: Clemente Morim Sousa,Sobrinho Paterno. Proc.5615. Série Processos de património, processo n.º 4787"
    # the result should be:
    # ['Série Inquirições de genere: Clemente Morim Sousa,Sobrinho Paterno. Proc.5615. ','Série Processos de património, processo n.º 4787']
    entradas = splitOR(line,rg,rp)
    saidas = []
    for e in entradas:
        if re.search(rg,e):
            saidas.append(handleNrProcesso(splitOR(e,rg,r'\0',join='antes')))
        elif re.search(rp,e):
            saidas.append(handleNrProcesso(splitOR(e,rp,r'\0',join='antes')))
    saidas = ''.join([' '.join(s) for s in saidas])
    return saidas
