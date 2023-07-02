# script de python para tratar o dataset removendo colunas e renomeando colunas
import pandas as pd
import re

# lendo o dataset
df = pd.read_csv('dataset.csv', sep=';',low_memory=False,on_bad_lines='skip')

# Eliminar todas as colunas (axis=1) que tem todos (how='all') os valores como missing values
df = df.dropna(axis=1, how='all')

cols_same_value = []

# passar por todas as colunas e guardar o nome das que apenas tem 1 valor em todo
for c in df.columns:
    if len(df[c].unique()) == 1:
        cols_same_value.append(c)

# Retirar 'Repository' da lista
cols_same_value.remove('Repository')

# Apagar todas as colunas (axis=1) presentes em cols_same_value
df = df.drop(cols_same_value, axis=1)

# removendo colunas
sair=['DescriptionLevel',
      'UnitTitleType',
      'AllowUnitDatesInference',
      'Dimensions',
      'AllowExtentsInference',
      'Note',
      'Available',
      'Creator',
      'Created',
      'Username',
      'ProcessInfoDate',
      'ProcessInfo',
      'UnitDateFinal']

# remover as colunas cujos nomes estão na lista sair do dataset
df = df.drop(columns=df.columns[df.columns.isin(sair)])

# renomeando colunas
rename = {
    'CompleteUnitId' : 'ProcessoFull',
    'UnitId' : 'IdProcesso',
    'UnitTitle' : 'TituloProcesso',
    'UnitDateInitial' : 'Data',
    'Repository' : 'Arquivo',
    'AccessRestrict' : 'AcessoRestrito',
    'PhysLoc' : 'LocalizacaoFisica',
    'PreviousLoc' : 'LocalizacaoAnterior',
    'LangMaterial' : 'AnotacoesLinguagem',
    'PhysTech' : 'AnotacoesTecnicas',
    'RelatedMaterial' : 'MaterialRelacionado'
}

df = df.rename(columns=rename)

# remove first line
df = df.iloc[1:]

# Match uppercase portuguese words
# exp = r'([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚ][a-záàâãéèêíïóôõöúçñ]+)'

def handleScope():
    # Filiação: Antonio Pereira Silva e Francisca Campos Silva. Natural e/ou residente em GUIMARAES-SAO SEBASTIAO, actual concelho de GUIMARAES e distrito (ou país) Braga.
    exp = r'Filia[cç][aã]o:\s*(([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚ][a-záàâãéèêíïóôõöúçñ]*\s+)+)e\s+(([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚ][a-záàâãéèêíïóôõöúçñ]*\s*)+)\.\s*[N]atural\s+e/ou\s+residente\s+em\s+(.+?)\s*actual\s+concelho\s+de\s+(.+?)\s*e\s+distrito\s+(\(ou\s+país\)\s+)?(.+?)\.'
    counter = 0
    other = []
    for index, row in df.iterrows():
        match = re.search(exp, row['ScopeContent'])
        if match:
            if counter == 0:
                print('Pai', match.group(1))
                print('Mae', match.group(3))
                print('Paróquia', match.group(5))
                print('Concelho', match.group(6))
                print('Distrito', match.group(8))
            counter += 1
        else:
            other.append(row['ScopeContent'])
    print('Total de processos com filiação:', counter)
    print('Total de processos em que o ScopeContent existe:', len(df[df['ScopeContent'].notnull()]))
    print('Total de processos:', len(df)    )
    with open('other.txt', 'w') as f:
        for item in other:
            f.write("%s\n" % item)
        f.close()

def saveNomes(nomes):
    pessoas=[]
    for nome in nomes:
        # ask if the name is a person
        print(nome)
        person = input('É uma pessoa? (s/n)')
        if person == 's':
            pessoas.append(nome)
    with open('pessoas.txt', 'w') as f:
        for item in pessoas:
            f.write("%s\n" % item)
        f.close()

def handleMaterial():
    exp = r'(\d+)'
    nome = r'([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚ][a-záàâãéèêíïóôõöúçñ]+)'
    counter = 0
    other = []
    nomes= []
    for index, row in df.iterrows():
        if 'MaterialRelacionado' not in row or pd.isnull(row['MaterialRelacionado']):
            df.at[index, 'MaterialRelacionado'] = ''
        elif re.search(exp, row['MaterialRelacionado']):
            counter +=1
            df.at[index, 'MaterialRelacionado'] = re.sub(exp, '<nrprocesso>\1</nrprocesso>', row['MaterialRelacionado'])
        else:
            nomes.append(re.findall(nome, row['MaterialRelacionado']))
            new = re.sub(nome, r'<nome>\1</nome>', row['MaterialRelacionado'])
            other.append(new)
    nomes = [item for sublist in nomes for item in sublist]
    nomes = set(nomes)
    saveNomes(nomes)
    # get the unique values from other
    unicos = set(other)
    print('Valores únicos:', unicos)
    print('Total de processos com material relacionado:', counter)
    print('Total de processos em que o MaterialRelacionado existe:', len(df[df['MaterialRelacionado'].notnull()]))
    print('Total de processos:', len(df))
    with open('other.txt', 'w') as f:
        for item in unicos:
            f.write("%s\n" % item)
        f.close()

# write to json with utf-8 encoding where the records are elements of a list
df.to_json('../mongo/tratado.json', orient='records', force_ascii=False)