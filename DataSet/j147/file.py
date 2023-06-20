import csv
import pandas as pd

with open('julinho.csv', 'r') as csvfile:
    lines = csv.reader(csvfile)
    #cabeçalho = lines[1:]
    #cabeçalho2 = lines[1]
    #print(cabeçalho)
    #print(cabeçalho2)
    boole = False
    for row in lines:
        print(row)
        if boole == True:
            exit()
        boole = True