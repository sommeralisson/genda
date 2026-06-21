# 💈 Barbearia Premium - Sistema de Agendamentos

Sistema completo para gerenciamento de barbearias, permitindo o controle de clientes, profissionais (barbeiros), catálogo de serviços e um painel inteligente de agendamentos com verificação automatizada de disponibilidade.

## 🏗️ Arquitetura do Projeto

O projeto é dividido em duas partes independentes que se comunicam via API REST:
- **Backend:** Laravel 11.
- **Frontend:** React js + Tailwind CSS v4 rodando no ambiente Linux (WSL).

---

## 🚀 Como Rodar o Projeto em uma Nova Máquina

Siga os passos abaixo para garantir que os ambientes subam sem conflitos de permissão ou caminhos.

### 📋 Pré-requisitos
Antes de começar, certifique-se de ter instalado na máquina hospedeira:
1. **Windows 11 com WSL2 (Ubuntu)** instalado e atualizado.
2. **Docker Desktop** configurado para integrar com o WSL2.
3. **VS Code** com a extensão **WSL** instalada.

---

### 🐳 Passo 1: Configurando e Subindo o Backend (Docker)

1. Abra o terminal do seu **Ubuntu (WSL)** e navegue até a pasta raiz do projeto clonado:
   ```bash
   cd /caminho/do/projeto/genda
Crie o arquivo .env da raiz (utilizado pelo Docker Compose para criar o banco de dados):

Bash
cp .env.example .env
Abra este arquivo e defina as variáveis DB_DATABASE e DB_PASSOWORD.

Entre na pasta backend/ e crie o arquivo .env específico do Laravel:

Bash
cd backend
cp .env.example .env
Certifique-se de que o DB_HOST está apontando para api-db e a senha é idêntica à configurada no .env da raiz.

Volte para a raiz e suba os contêineres do Docker:

Bash
cd ..
docker compose up -d --build
Instale as dependências do PHP e gere a chave criptográfica do Laravel de dentro do contêiner:

Bash
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
O backend estará disponível em: http://localhost:8000

💻 Passo 2: Configurando o Ambiente do Frontend (Linux Isolado)
Para evitar que o Node.js do Windows interfira nos caminhos de rede do WSL (erros de caminhos UNC / CMD.exe), o frontend deve rodar com o Node nativo do Linux.

No terminal do Ubuntu, certifique-se de que possui o Node.js v20+ ou v22+ instalado nativamente:

Bash
# Caso precise instalar/atualizar o Node nativo do Linux:
curl -fsSL [https://deb.nodesource.com/setup_22.x](https://deb.nodesource.com/setup_22.x) | sudo -E bash -
sudo apt install -y nodejs
Navegue até a pasta do frontend:

Bash
cd /caminho/do/projeto/genda/frontend
Instale as dependências de forma nativa e isolada no Linux:

Bash
npm install
Inicie o servidor de desenvolvimento do Vite:

Bash
npm run dev
O frontend estará disponível em: http://localhost:5173