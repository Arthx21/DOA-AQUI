# Plano de testes de software

<span style="color:red">Pré-requisitos: <a href="02-Especificacao.md"> Especificação do projeto</a></span>, <a href="04-Projeto-interface.md"> Projeto de interface</a>

O plano de testes de software é gerado a partir da especificação do sistema e consiste em casos de teste que deverão ser executados quando a implementação estiver parcial ou totalmente pronta. Apresente os cenários de teste utilizados na realização dos testes da sua aplicação. Escolha cenários de teste que demonstrem os requisitos sendo satisfeitos.

Enumere quais cenários de testes foram selecionados para teste. Neste tópico, o grupo deve detalhar quais funcionalidades foram avaliadas, o grupo de usuários que foi escolhido para participar do teste e as ferramentas utilizadas.

Não deixe de enumerar os casos de teste de forma sequencial e garantir que o(s) requisito(s) associado(s) a cada um deles esteja(m) correto(s) — de acordo com o que foi definido na <a href="02-Especificacao.md">Especificação do projeto</a>.

Por exemplo:

| **Caso de teste**  | **CT-001 – Cadastrar perfil**  |
|:---: |:---: |
| Requisito associado | RF-00X - A aplicação deve apresentar, na página principal, a funcionalidade de cadastro de usuários para que estes consigam criar e gerenciar seu perfil. |
| Objetivo do teste | Verificar se o usuário consegue se cadastrar na aplicação. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Clicar em "Criar conta" <br> - Preencher os campos obrigatórios (e-mail, nome, sobrenome, celular, CPF, senha, confirmação de senha) <br> - Aceitar os termos de uso <br> - Clicar em "Registrar" |
| Critério de êxito | - O cadastro foi realizado com sucesso. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

<br>

| **Caso de teste**  | **CT-002 – Efetuar login**  |
|:---: |:---: |
| Requisito associado | RF-00Y - A aplicação deve possuir opção de fazer login, sendo o login o endereço de e-mail. |
| Objetivo do teste | Verificar se o usuário consegue realizar login. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Clicar no botão "Entrar" <br> - Preencher o campo de e-mail <br> - Preencher o campo de senha <br> - Clicar em "Login" |
| Critério de êxito | - O login foi realizado com sucesso. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

<br>

| **Caso de teste**  | **CT-003 – Filtrar roupas por gênero**  |
|:---: |:---: |
| Requisito associado | RF-00X - Verificar se o filtro de gênero exibe corretamente apenas as roupas correspondentes à categoria selecionada. |
| Objetivo do teste | Verificar se o usuário consegue se cadastrar na aplicação. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Localizar a seção de roupas <br> - Clicar na opção “Masculino” <br> - Verificar se são exibidas apenas roupas masculinas <br> - Clicar na opção “Feminino” <br> Verificar se são exibidas apenas roupas femininas |
| Critério de êxito | - As roupas exibidas correspondem corretamente ao gênero selecionado. Nenhum item incorreto é mostrado. |
| Responsável pela elaboração do caso de teste | Raphael Gustavo de Oliveira Silva |

<br>

| **Caso de teste**  | **CT-004 – Armazenar os dados das roupas em um banco de dados**  |
|:---: |:---: |
| Requisito associado | RF-006 - O sistema deve armazenar os dados de usuários, roupas e Ongs em um banco de dados. |
| Objetivo do teste | Verificar se o sistema está armazenando os dados no banco de dados. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Clicar no botão "Quero doar" <br> - Preencher os campo necessários <br> - Clicar em "Enviar" <br> - Abrir MySQL WorkBench <br> - Entrar no banco de dados "DoaAqui" <br> - Fazer uma query de "SELECT * FROM Roupas" |
| Critério de êxito | - Aparecer todas as roupas cadastradas até o momento. |
| Responsável pela elaboração do caso de teste | Arthur Souza Carvalho. |

<br>

| **Caso de teste**  | **CT-005 – Armazenar os dados ONG em um banco de dados**  |
|:---: |:---: |
| Requisito associado | RF-006 - O sistema deve armazenar os dados de usuários, roupas e Ongs em um banco de dados. |
| Objetivo do teste | Verificar se o sistema está armazenando os dados no banco de dados. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Clicar no botão "Entrar" <br> - Selecionar opção ONG <br> - Preencher os campos necessários <br> - Clicar em "Enviar" <br> - Abrir MySQL WorkBench <br> - Entrar no banco de dados "DoaAqui" <br> - Fazer uma query de "SELECT * FROM ONG" |
| Critério de êxito | - Aparecer todas as ONGS cadastradas até o momento junto com sua latitude e longitude. |
| Responsável pela elaboração do caso de teste | Arthur Souza Carvalho. |

<br>

| **Caso de teste**  | **CT-006  – Armazenar os dados de Pessoa(Doador,Receptor) em um banco de dados**  |
|:---: |:---: | 
| Requisito associado | RF-006 - O sistema deve armazenar os dados de usuários, roupas e Ongs em um banco de dados. |
| Objetivo do teste | Verificar se o sistema está armazenando os dados no banco de dados. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Clicar no botão "Entrar" <br> - Selecionar uma das opções "Doador/Receptor" <br> - Preencher os campos necessários (Nome, telefone, email, senha) <br> - Clicar em "Enviar" <br> - Abrir MySQL WorkBench <br> - Entrar no banco de dados "DoaAqui" <br> - Fazer uma query de "SELECT d.* , r.* FROM Doador d, Receptor r" |
| Critério de êxito | - Aparecer todas as Pessoas cadastradas até o momento. |
| Responsável pela elaboração do caso de teste | Arthur Souza Carvalho. |

<br>

| **Caso de teste**  | **CT-007 – Recuperar senha**  |
|:---: |:---: |
| Requisito associado | RF-009 - 	O sistema deve permitir que os usuários recuperem a senha em caso de esquecimento. |
| Objetivo do teste | Verificar se o sistema está efetuando a alteração de senha com email válido. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Clicar no botão "Entrar" <br> - Clicar na opção "Esqueci minha senha" <br> - <br> - Informar o email da conta na qual deseja recuperar <br> - Clicar em "Enviar" <br> - Acessar a conta do email <br> - Clicar na mensagem de "Recuperar senha" <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/RedefinirSenha.html <br> - Digitar a nova senha desejada <br> - Clicar em "Enviar" |
| Critério de êxito | - Senha alterada com sucesso. |
| Responsável pela elaboração do caso de teste | Arthur Souza Carvalho. |




## Ferramentas de testes (opcional)

> MySQL Workbench - Utilizado para poder visualizar o banco de dados com facilidades e efetuar as querys.

Comente sobre as ferramentas de testes utilizadas.
 
> **Links úteis**:
> - [IBM - criação e geração de planos de teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Práticas e técnicas de testes ágeis](http://assiste.serpro.gov.br/serproagil/Apresenta/slides.pdf)
> - [Teste de software: conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)
> - [Criação e geração de planos de teste de software](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Ferramentas de teste para JavaScript](https://geekflare.com/javascript-unit-testing/)
> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)
