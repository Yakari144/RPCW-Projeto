# script de python para tratar o dataset removendo colunas e renomeando colunas
import pandas as pd

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

# salvando o dataset
df.to_csv('tratado.csv',sep=';', index=False)

with open('colunas.txt', 'w') as f:
    for item in df.columns:
        f.write("%s\n" % item)
    f.close()