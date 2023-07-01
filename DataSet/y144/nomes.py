import re
with open('scopecontent.txt', 'r') as f:
    text = f.readlines()
    f.close()

def handle(line):
    line = line.strip()
    fex = r'[Ff]ilia[cç][aã]o:'
    # remove Filiação: from the beginning
    line = re.sub(fex, '', line)
    line = line.split('.')[0]
    ns = []
    for n in re.split(r'\be\b', line):
        n = n
        n = n.split(',')
        n[0] = '<a href="registo/Inquirição de genere de'+n[0]+'">' + n[0] + '</nome>'
        ns.append(','.join(n))
    return ' e '.join(ns)+'\n'


fo = open('SCout.txt', 'w')
flag = True
text = ['Filiação: Gracia Maria,Solteira. Natural e/ou residente em ARCOZELO,Sao Mamede, actual concelho de BARCELOS e distrito (ou país) Braga.']
for l in text:
    if l != '\n':
        fo.write(handle(l))
        #fo.write(handle(l))