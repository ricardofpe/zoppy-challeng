
# 🧾 Zoppy - Sistema de Pedidos e Produtos

Este projeto é um CRUD completo desenvolvido como parte do desafio técnico da Zoppy para a vaga de Desenvolvedor Jr. Ele implementa as funcionalidades de gerenciamento de **Pedidos** e **Produtos**, com backend em **NestJS**, frontend em **Angular**, banco de dados **MySQL** e estilização com **Tailwind CSS** (mobile first).

---

## 🚀 Tecnologias Utilizadas

### Backend:
- [NestJS](https://nestjs.com/)
- [MySQL](https://www.mysql.com/)  
- [Sequelize](https://sequelize.org/)  
- [Jest](https://jestjs.io/) (para testes unitários)  
- [Docker](https://www.docker.com/) (para banco de dados)

### Frontend:
- [Angular](https://angular.io/) v19  
- [RxJS](https://rxjs.dev/)  
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🧠 Funcionalidades Implementadas

### Backend:
- CRUD completo para **Pedidos**
- CRUD completo para **Produtos**
- Paginação na rota de busca de pedidos
- Testes automatizados com cobertura Jest (50%)
- Integração com banco MySQL via Docker

### Frontend:
- Listagem, criação, edição e remoção de Pedidos e Produtos
- Filtro na listagem (frontend)
- Estilização responsiva com abordagem mobile first
- Consumo de API usando **Observables do RxJS**

---

## 🐳 Como rodar o projeto

### Pré-requisitos
- Node.js >= 18
- Angular CLI
- Docker

---

### 🧱 1. Subindo o banco de dados com Docker

```bash
docker run --name zoppy-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=zoppy_database -e MYSQL_USER=zoppy_user -e MYSQL_PASSWORD=password_zoppy -p 3306:3306 -d mysql:latest
```

---

### 🔧 2. Backend (NestJS)

```bash
cd backend
npm install
```

> Crie um arquivo `.env` com a variável de conexão ao banco:

```env
DATABASE_URL=mysql://zoppy_user:password_zoppy@localhost:3306/zoppy_database
```

```bash
npm start
```


---

### 💻 3. Frontend (Angular)

```bash
cd zoppy_frontend
npm install
npm start
```

A aplicação ficará disponível em: [http://localhost:4200](http://localhost:4200)

---

---

## ✅ Desafios Extras Implementados

- [x] CRUD adicional de Produtos
- [x] TailwindCSS com abordagem mobile-first
- [x] Observables do RxJS
- [x] Filtro no frontend
- [x] Testes unitários com Jest (50%)
- [x] Paginação no backend
- [x] Banco de dados em container Docker

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/4f91833d-7f9e-45fe-a98d-100138976f69)
![image](https://github.com/user-attachments/assets/5be14c80-fa83-445f-945b-045e172bf53e)
![image](https://github.com/user-attachments/assets/e4d1a4f1-cc72-4481-bd01-ef8ed9ca2613)


---

## 👨‍💻 Autor

Desenvolvido por **Ricardo Pereira** para o processo seletivo da [Zoppy](https://zoppy.com.br).
