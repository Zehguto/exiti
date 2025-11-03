# Projeto Exiti - Sistema de Cadastro de Usuários - JOSE AUGUSTO MOREIRA SANTOS

## 1. Visão Geral

O **Projeto Exiti** é um sistema completo para gerenciamento de usuários, desenvolvido com **Spring Boot (backend)** e **Next.js com TypeScript (frontend)**.  
O sistema permite o cadastro, edição, exclusão, listagem e busca de usuários, além da importação e exportação de dados em formatos **CSV** e **XLSX**.

---

## 2. Tecnologias Utilizadas

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Data JPA
- PostgreSQL
- Apache POI (leitura de arquivos Excel)
- Lombok
- Maven

### Frontend
- Next.js 14+
- React 18
- TypeScript
- Tailwind CSS
- Axios 
- Escolhidos devido a um curso que fiz durante a semana de 16.5h.
---

## 3. Funcionalidades Principais

- Cadastro de usuários com nome, e-mail, status e data de criação.  
- Listagem e visualização de todos os usuários cadastrados.  
- Edição de dados do usuário através de um modal interativo.  
- Exclusão de usuários.  
- Importação de usuários a partir de arquivos **CSV** ou **XLSX**.  
- Exportação de usuários em formato **CSV**.  
- Busca de usuários pelo e-mail.  

---

## 4. Estrutura do Projeto

### 4.1. Backend (Spring Boot)

```
projeto-exiti/
 ├── src/main/java/com/example/projeto_exiti/
 │   ├── application/users/
 │   │   ├── UserController.java
 │   │   ├── UserMapper.java
 │   │   └── UserDTO.java
 │   ├── domain/entity/
 │   │   ├── User.java
 │   │   └── StatusUsuario.java
 │   ├── domain/service/
 │   │   └── UserService.java
 │   ├── infra/repository/
 │   │   └── UserRepository.java
 │   └── application/users/
 │       └── UserServiceImp.java
 └── resources/
     └── application.yml
```

### 4.2. Frontend (Next.js)

```
frontexiti/
 ├── src/
 │   ├── app/
 │   │   ├── page.tsx
 │   │   └── components/Template
 │   └── resources/users/
 │       └── users.service.ts
 ├── public/imagens/
 └── package.json
```

---

## 5. Configuração do Banco de Dados

O sistema utiliza o **PostgreSQL** como banco de dados relacional.  
Crie o banco antes de iniciar o projeto:

```sql
CREATE DATABASE users;
```

### Exemplo de configuração (`application.yml`)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/users
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

---

## 6. Execução do Projeto

### 6.1. Backend

No diretório do projeto Spring Boot, execute:

```bash
mvn clean install
mvn spring-boot:run
```

O backend será executado em:  
`http://localhost:8080/v1/users`

---

### 6.2. Frontend

No diretório do projeto Next.js, execute:

```bash
npm install
npm run dev
```

O frontend será executado em:  
`http://localhost:3000`

---

## 7. Endpoints da API

| Método | Endpoint | Descrição |
|--------|-----------|-----------|
| `POST` | `/v1/users` | Cadastra um novo usuário |
| `GET` | `/v1/users` | Retorna todos os usuários cadastrados |
| `GET` | `/v1/users/by-email?email={email}` | Busca usuário pelo e-mail |
| `PUT` | `/v1/users/{email}` | Atualiza dados de um usuário |
| `DELETE` | `/v1/users/{email}` | Exclui um usuário |
| `POST` | `/v1/users/import` | Importa usuários via arquivo CSV/XLSX |
| `GET` | `/v1/users/export` | Exporta usuários em formato CSV |

---

## 8. Formatos de Arquivos

### 8.1. CSV

```
Nome,Email,Status,Data Criacao
João Silva,joao@email.com,ATIVO,22/01/2003
Maria Souza,maria@email.com,INATIVO,01/03/2005
```

### 8.2. XLSX

Colunas esperadas (na primeira linha do arquivo):

| Nome | Email | Status | Data Criacao |
|------|--------|---------|---------------|
| João Silva | joao@email.com | ATIVO | 22/01/2003 |
| Maria Souza | maria@email.com | INATIVO | 01/03/2005 |

> O campo **Data Criacao** deve estar em formato de data ou texto no padrão `dd/MM/yyyy`.

---

## 9. Considerações Técnicas

- As datas importadas de arquivos **XLSX** ou **CSV** são mantidas conforme informadas no arquivo.  
- Caso a célula de data esteja vazia ou inválida, será utilizada a data atual.  
- O sistema evita cadastros duplicados com base no campo **email**.  
- O campo `dataCriacao` é definido manualmente pelo sistema de importação (não é sobrescrito por `@CreationTimestamp`).
