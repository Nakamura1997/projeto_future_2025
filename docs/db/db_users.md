// Ctrl + Shift + V

# 🛡️ Sistema de Gestão de Usuários e Relatórios

Este projeto implementa um sistema de autenticação e gerenciamento de usuários com diferentes papéis (roles), além de permitir a criação e gerenciamento de relatórios de segurança.

## 📚 Modelos

### 🔐 CustomUserManager

Gerenciador personalizado para o modelo `CustomUser`, que utiliza o **e-mail como identificador principal**.

#### Métodos:

- `create_user(email, password=None, **extra_fields)`  
  Cria um usuário comum no sistema.

- `create_superuser(email, password=None, **extra_fields)`  
  Cria um superusuário com permissões administrativas.

---

### 👤 CustomUser

Modelo de usuário personalizado, baseado em `AbstractUser`, com autenticação via e-mail e suporte a múltiplos papéis.

#### Campos:

| Campo              | Tipo                     | Descrição                                                           |
| ------------------ | ------------------------ | ------------------------------------------------------------------- |
| `username`         | `CharField`              | Nome de usuário (único).                                            |
| `nome`             | `CharField`              | Nome completo do usuário.                                           |
| `email`            | `EmailField`             | E-mail (único), usado para login.                                   |
| `role`             | `CharField`              | Papel do usuário: `cliente`, `subcliente`, `funcionario`, `gestor`. |
| `cliente`          | `ForeignKey(CustomUser)` | Cliente associado, apenas se o usuário for `subcliente`.            |
| `groups`           | `ManyToManyField`        | Grupos do Django.                                                   |
| `user_permissions` | `ManyToManyField`        | Permissões do Django.                                               |

#### Autenticação:

- `USERNAME_FIELD = 'email'`
- `REQUIRED_FIELDS = ['username', 'nome']`

#### Permissões personalizadas:

- `view_user` – Pode ver usuários
- `change_user` – Pode alterar usuários
- `delete_user` – Pode excluir usuários
- `view_report` – Pode ver relatórios de segurança
- `create_report` – Pode criar relatórios de segurança
- `delete_report` – Pode excluir relatórios de segurança

---

### 📋 Report

Modelo responsável por armazenar relatórios criados por usuários.

#### Campos:

| Campo        | Tipo                     | Descrição                               |
| ------------ | ------------------------ | --------------------------------------- |
| `title`      | `CharField`              | Título do relatório.                    |
| `content`    | `TextField`              | Conteúdo detalhado do relatório.        |
| `created_at` | `DateTimeField`          | Data/hora de criação (auto preenchido). |
| `created_by` | `ForeignKey(CustomUser)` | Usuário autor do relatório.             |

---

## 🛠️ Tecnologias

- Django 4+
- Django REST Framework (opcional para API)
- PostgreSQL (ou outro banco compatível)
- Autenticação customizada via e-mail

---

## 📎 Observações

- O sistema permite associar subclientes a clientes via campo `cliente`.
- As permissões podem ser expandidas facilmente para atender diferentes regras de negócio.
- Usuários são classificados por `role`, o que facilita a aplicação de regras específicas por tipo.
