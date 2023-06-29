"""
Módulo que trata os nomes e apelidos, sendo obtidos a partir de Web Scraping.
Os nomes e apelidos são apenas os considerados válidos em Portugal.
"""

import requests
import bs4
import os
import subprocess
import re
import spacy
import unidecode

conf = {
    "url_apelidos" : "https://pt.wikipedia.org/wiki/Lista_de_apelidos_de_família_da_língua_portuguesa",
    "apelidos" : "dados/apelidos.txt",
    "url_nomes" : "https://www.dn.pt/DNMultimedia/DOCS+PDFS/nomes.pdf",
    "nomes" : "dados/nomes.txt",
    "moradas" : "dados/codigos_postais.csv"
}

path = os.path.dirname(os.path.abspath(__file__))

def limpa(txt):
    """
    Função que limpa o texto de caracteres indesejados
    """
    regex = r'(\[\d+\])|(\(.*\))'
    regex += r'|(\d)'
    regex += r'|(.+\s+)+'
    t = re.sub(regex, '', txt.strip())
    return unidecode.unidecode(t)

def runcmd(cmd, verbose = False, *args, **kwargs):
    """
    Função que executa um comando de terminal
    """
    process = subprocess.Popen(
        cmd,
        stdout = subprocess.PIPE,
        stderr = subprocess.PIPE,
        text = True,
        shell = True
    )
    std_out, std_err = process.communicate()
    if verbose:
        print(std_out.strip(), std_err)
    pass

def guarda_apelidos(conf):
    """
    
    Função que guarda a lista de apelidos portugueses retirados da web
    Url usado definido no ficheiro de configuração
    """
    response = requests.get(conf["url_apelidos"])
    soup = bs4.BeautifulSoup(response.text, "html.parser")

    soup = soup.find_all("table", {"class": "wikitable"})
    with open(path + "/" + conf["apelidos"], "w") as f:
        # entrar nas tabelas
        for table in soup:
            lines = table.find_all("tr")
            
            # entrar nas linhas
            for line in lines[1:]:
                columns = line.find_all("td")
                if len(columns) == 6:
                    f.write(limpa(columns[1].text)+ "\n")
                    if len(columns[3].text.strip()) > 0:
                        for apelido in columns[3].text.split(","):
                            f.write(limpa(apelido) + "\n")

def guarda_nomes(conf):
    """
    Função que guarda a lista de nomes portugueses retirados da web
    Url usado definido no ficheiro de configuração
    """

    runcmd("wget -O dados/nomes.pdf " + conf["url_nomes"])
    runcmd("pdftotext dados/nomes.pdf dados/nomes.txt")

    nomes_limpos = ""
    with open(path + "/" + conf["nomes"],"r") as f:
        for line in f:
            line = limpa(line)
            if len(line) > 0:
                nomes_limpos += line + "\n" 

    with open(path + "/" + conf["nomes"], "w") as f:
        f.write(nomes_limpos)

def get_apelidos(apelidos):
    """
    Função que atualiza o dicionario de apelidos
    """
    conf = {
    "url_apelidos" : "https://pt.wikipedia.org/wiki/Lista_de_apelidos_de_família_da_língua_portuguesa",
    "apelidos" : "dados/apelidos.txt",
    "url_nomes" : "https://www.dn.pt/DNMultimedia/DOCS+PDFS/nomes.pdf",
    "nomes" : "dados/nomes.txt",
    "moradas" : "dados/codigos_postais.csv"
}
    with open(path + "/" + conf["apelidos"], "r") as f:
        for line in f:
            line = line.strip()
            if len(line) > 0:
                nome = line[0].upper() + line[1:]
                letra_inicial = nome[0] 
                if letra_inicial in apelidos.keys():
                    apelidos[letra_inicial].append(line)
                else:
                    apelidos[letra_inicial] = [line] 

    return apelidos

def get_nomes(nomes):
    """
    Função que atualiza o dicionario de nomes
    """
    conf = {
    "url_apelidos" : "https://pt.wikipedia.org/wiki/Lista_de_apelidos_de_família_da_língua_portuguesa",
    "apelidos" : "dados/apelidos.txt",
    "url_nomes" : "https://www.dn.pt/DNMultimedia/DOCS+PDFS/nomes.pdf",
    "nomes" : "dados/nomes.txt",
    "moradas" : "dados/codigos_postais.csv"
}
    with open(path + "/" + conf["nomes"], "r") as f:
        for line in f:
            line = line.strip()
            if len(line) > 0:
                nome = line[0].upper() + line[1:]
                letra_inicial = nome[0] 
                if letra_inicial in nomes.keys():
                    nomes[letra_inicial].append(line)
                else:
                    nomes[letra_inicial] = [line]

    return nomes

def spacy(texto):
    nlp = spacy.load('pt_core_news_lg') # 'en_core_web_sm' 'pt_core_news_lg
    doc = nlp(texto)
    for w in doc:
        print(w.text, # conteudo em texto
              w.pos_, # parte do discurso, por exemplo, VERB, NOUN, ADJ, ADV, PRON, DET, ADP, NUM, etc
              w.lemma_, # lema do token, palavra base, por exemplo, "be" para "is", "are", "was", "were"
            )
    for w in doc.ents:
        print(w.text, # conteudo em texto
              w.start_char, # posicao inicial do token no texto
              w.end_char, # posicao final do token no texto
              w.label_, # tipo de entidade, por exemplo, PERSON, NORP, FAC, ORG, GPE, LOC, PRODUCT, EVENT, WORK_OF_ART, LAW, LANGUAGE, DATE, TIME, PERCENT, MONEY, QUANTITY, ORDINAL, CARDINAL
              )

def handleLinha(line,nomes,apelidos):
    # unicode
    line = unidecode.unidecode(line)
    # remove "Filiacao:"
    line = re.sub(r'Filiacao:', '', line)
    # get words
    wExp = r'\b[^\d\W]+\b'
    words = re.findall(wExp, line)
    seq = []
    ns = []
    ant = False
    for w in words:
        if w in nomes[w[0].upper()] or (w in apelidos[w[0].upper()] and ant):
            seq.append(w)
            ant = True
        else:
            ant = False
            if len(seq) > 0:
                ns.append(" ".join(seq))
                seq = []
    for n in ns:
        line = re.sub(n, "<nome>"+n+ "</nome>", line)
    return line

def handleNomes(texto,nomes,apelidos):
    if type(texto) != str:
        texto = ""
    linhas = []
    for linha in texto.split("\n"):
        #ts = spacy(linha)
        th = handleLinha(linha, nomes,apelidos)
        linhas.append(th)
    return "\n".join(linhas)
        