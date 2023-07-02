# Inquirições de Génere

## Introdução
Este trabalho tem como intuito a criação de uma interface web de navegação nos registos de inquirição de género, disponibilizados pelo docente. Para tal, foi necessário a criação de uma base de dados, a qual foi preenchida com os dados fornecidos pelo docente, posteriormente a serem tratados, e a criação de uma aplicação web, que permite a navegação nestes mesmos dados.

## Análise e Tratamento dos Dados
Inicialmente, analisamos os dados fornecidos pelo docente, verificando colunas vazias, colunas que apenas possuem um valor, igual em todas as linhas. Estas colunas foram removidas do dataset.
De seguida, renomeamos as colunas para português, para uma melhor compreensão dos dados, e removemos a primeira linha, que apenas continha o nome das colunas.
Por fim, guardamos o dataset em formato json pronto a ser importado para a base de dados.

## Base de Dados
Neste projeto utilizamos o MongoDB como base de dados e neste criamos uma base de dados chamada "api" na qual criamos 4 coleções: registos, users, posts e comentarios.
Importamos o dataset para a coleção registos, e temos um ficheiro com 2 users, um com permissões de admin e outro sem.

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

## Conclusão
Em suma, este trabalho permitiu-nos aprofundar os nossos conhecimentos em bases de dados, bem como a sua utilização em aplicações web, especificamente a utilizar o MongoDB, bem como a sua integração com o Node.js, o express e o pug.
Mais ainda, permitiu-nos aprofundar os nossos conhecimentos em HTML, CSS e JavaScript, e em manipulação de dados.


