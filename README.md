# Inquirições de Génere

## Autores
* João Santos - pg50477
* Júlio Gonçalves - pg50537

## Introdução
Este trabalho tem como intuito a criação de uma interface web de navegação nos registos de inquirição de género, disponibilizados pelo docente. Para tal, foi necessário a criação de uma base de dados, a qual foi preenchida com os dados fornecidos pelo docente, posteriormente a serem tratados, e a criação de uma aplicação web, que permite a navegação nestes mesmos dados.

## Análise e Tratamento dos Dados
Inicialmente, analisamos os dados fornecidos pelo docente, verificando colunas vazias, colunas que apenas possuem um valor, igual em todas as linhas. Estas colunas foram removidas do dataset.
De seguida, renomeamos as colunas para português, para uma melhor compreensão dos dados, e removemos a primeira linha, que apenas continha o nome das colunas.
Por fim, guardamos o dataset em formato json pronto a ser importado para a base de dados.

## Base de Dados
Neste projeto utilizamos o MongoDB como base de dados e neste criamos uma base de dados chamada "api" na qual criamos 4 coleções: registos, users, posts e comentarios.
Importamos o dataset para a coleção registos, e temos um ficheiro com 2 users, um com permissões de admin e outro sem.

## Docker
Para a isolar os serviços da nossa aplicação web, utilizamos o Docker, onde criamos um container para a base de dados e outro para a aplicação web.
Isto permite-nos ter uma maior segurança, pois os serviços estão isolados, e permite-nos também uma maior facilidade na instalação e execução da aplicação web, pois apenas é necessário executar o comando `docker-compose up` na pasta do projeto.

## ScopeContent
Conforme sugerido pelo docente, a nossa aplicação web permite o estabelecimento de relações genealógicas entre os registos de inquirição de género, onde criamos relações entre os registos de inquirição de género.

## Material Relacionado
Esta também foi uma coluna do dataset à qual prestamos especial atenção, pois também representa relações entre registos. Nesta, mais uma vez, estabelencemos relações entre registos de inquirição de género.

## Funcionalidades
A nossa aplicação web permite a navegação nos dados, através de uma interface web, onde é possível visualizar os registos de inquirição de género. Podemos também pesquisar por registos, através do nome, lugar ou data. Esta navegação nos dados é feita através de uma tabela, onde cada linha representa um registo de inquirição de género e possui páginas dada a quantidade de registos.
Nesta navegação, é possível ordenar os mesmos pelo nome (índice antroponímico), por lugar (índice toponímico) e data (índice cronológico).
Permitimos a criação de novos registos de inquirição de género, bem como a edição e remoção dos mesmos. No entanto, estas funcionalidades apenas estão disponíveis para utilizadores com permissões de admin.
Os utilizadores podem também fazer um Post acerca de qualquer registo existente, bem como comentar os mesmos. Estas funcionalidades estão disponíveis para todos os utilizadores.

## Utilizadores
Quanto aos utilizadores da nossa aplicação estes necessitam de se registar e de efetuar login para a utilizar.
Qualquer utilizador se pode registar. No entanto, utilizadores com permissões de admin podem criar novos utilizadores, sejam estes com permissões de admin ou não.


## Como utilizar
### Instalação de dependências
Para utilizar a nossa aplicação, é necessário ter o Node.js instalado.
Por forma a instalar as dependências, executar o comando `npm install` na pasta do projeto.
### Popular a base de dados
Quanto a popular a base de dados utilizamos o ficheiro `DataSet/limpeza144.py` que limpa o dataset e o transforma em json, gerando o ficheiro `mongo/tratado.json`.
Para popular a base de dados é necessário comentar a linha 21 do ficheiro docker-compose.yml, descomentando a linha 22, e executar o comando `docker-compose up` na pasta do projeto.
De seguida, executar o comando `docker exec -it mongodb bash` para entrar no container da base de dados e populamos os registos com o comando `mongoimport --db api --collection registos --file tratado.json --jsonArray` e os users com o comando `mongoimport --db api --collection users --file users.json --jsonArray`.

### Execução da aplicação
Para executar a aplicação basta ceder permissoes de execução ao ficheiro `exec.sh` e executar o mesmo com o comando `./exec.sh` na pasta do projeto.

### Utilização da aplicação
Para utilizar a aplicação, basta aceder ao endereço `localhost:7024` no browser.

## Conclusão
Em suma, este trabalho permitiu-nos aprofundar os nossos conhecimentos em bases de dados, bem como a sua utilização em aplicações web, especificamente a utilizar o MongoDB, bem como a sua integração com o Node.js, o express e o pug.
Mais ainda, permitiu-nos aprofundar os nossos conhecimentos em HTML, CSS e JavaScript, e em manipulação de dados.


