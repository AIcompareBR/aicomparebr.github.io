# Como Configurar Firebase para Login

## Passo 1: Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto (ex: "ia-compare")
4. Siga as instruções e clique em "Criar projeto"

## Passo 2: Habilitar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Na aba "Método de login", habilite "Email/Senha"
4. Clique em "Salvar"

## Passo 3: Habilitar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha a localização (recomendado: southamerica-east1)
4. Escolha "Modo de produção" ou "Modo de teste"
5. Clique em "Criar"

## Passo 4: Obter Credenciais

1. No menu lateral, clique no ícone de engrenagem (Configurações do projeto)
2. Clique em "Configurações do projeto"
3. Role até a seção "Seus apps"
4. Clique no ícone `</>` (Web)
5. Dê um nome ao app (ex: "ia-compare")
6. Clique em "Registrar app"
7. **NÃO** habilite o Firebase Hosting (desmarque a opção)
8. Clique em "Continuar"
9. Clique em "Continuar" novamente
10. Clique em "Concluir"

## Passo 5: Copiar Credenciais

Você verá um código como este:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Passo 6: Configurar no script.js

1. Abra o arquivo `script.js`
2. Encontre a seção de configuração do Firebase (linhas 5-13)
3. Substitua os valores pelos seus:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_REAL",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

## Passo 7: Configurar Regras do Firestore

1. No Firebase Console, vá para "Firestore Database"
2. Clique na aba "Regras"
3. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Clique em "Publicar"

**IMPORTANTE:** Se você estiver testando localmente ou o Firebase não estiver configurado, o app funcionará normalmente com login desabilitado. As funções de login só funcionarão após configurar o Firebase corretamente.

## Passo 8: Testar

1. Faça upload dos arquivos atualizados no GitHub
2. Aguarde o deploy
3. Abra o site
4. Clique em "Entrar"
5. Clique em "Cadastrar"
6. Preencha email e senha
7. Escolha o plano (Free ou Pro)
8. Clique em "Cadastrar"

## Notas Importantes

- O Firebase é gratuito para uso moderado
- O plano Free do Firebase tem limites de leitura/escrita
- Para produção, considere atualizar para o plano Blaze
- As credenciais do Firebase ficam visíveis no código JavaScript, mas isso é normal para apps web
- Certifique-se de habilitar as regras de segurança adequadas no Firestore

## Solução de Problemas

### Erro: "Firebase não configurado"
- Verifique se você substituiu as credenciais no `script.js`
- Verifique se o Firebase SDK está carregando corretamente

### Erro: "Email já em uso"
- O usuário já existe, tente fazer login em vez de cadastrar

### Erro: "Permissão negada"
- Verifique as regras do Firestore
- Certifique-se de que o usuário está autenticado

### Erro: "Senha fraca"
- A senha deve ter pelo menos 6 caracteres
