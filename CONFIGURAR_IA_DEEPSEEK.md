# 🤖 Como Configurar IA Real (DeepSeek)

## 1. Obter API Key do DeepSeek

### Passo 1: Criar conta no DeepSeek
1. Acesse [platform.deepseek.com](https://platform.deepseek.com)
2. Clique em "Sign Up" ou "Register"
3. Crie conta com email ou GitHub
4. Confirme seu email

### Passo 2: Obter API Key
1. Faça login no DeepSeek
2. Vá em "API Keys" no menu
3. Clique em "Create new API key"
4. Dê um nome (ex: "AIC")
5. Copie a API key (começa com `sk-`)

### Passo 3: Configurar no Site
1. Abra o arquivo `script.js`
2. Encontre a linha no topo do arquivo:
   ```javascript
   const DEEPSEEK_API_KEY = 'SUA_API_KEY_AQUI';
   ```
3. Substitua `SUA_API_KEY_AQUI` pela sua API key
4. Salve o arquivo

### Passo 4: Fazer Upload
1. Faça upload do `script.js` atualizado no GitHub
2. Aguarde o deploy (1-3 minutos)

## 2. Como Funciona a IA

- A IA do DeepSeek busca na base de dados do site
- Se a API falhar ou não estiver configurada, usa busca local
- A IA é mais inteligente e encontra produtos melhor
- A API do DeepSeek é gratuita para uso básico

## 3. Custo da API DeepSeek

- **Grátis**: Até 1 milhão de tokens/mês (suficiente para começar)
- **Pago**: R$0,14 por 1 milhão de tokens (se precisar mais)
- Para um site pequeno, o plano grátis é suficiente

## 4. Alternativas ao DeepSeek

Se preferir usar outra API de IA:

### OpenAI (GPT)
1. Crie conta em [openai.com](https://openai.com)
2. Obtenha API key
3. Substitua a URL e modelo no `script.js`

### Anthropic (Claude)
1. Crie conta em [anthropic.com](https://anthropic.com)
2. Obtenha API key
3. Substitua a URL e modelo no `script.js`

## 5. Testando a IA

Após configurar:
1. Abra o site
2. Digite "iPhone" na busca
3. Clique em "Pesquisar com IA"
4. Verifique no console do navegador (F12) se há erros
5. Se funcionar, a IA vai buscar produtos de forma mais inteligente

## 6. Solução de Problemas

### API não funciona:
- Verifique se a API key está correta
- Verifique se há saldo no DeepSeek (plano grátis tem limite)
- Verifique o console do navegador para erros

### Busca local não funciona:
- Verifique se os produtos estão no `script.js`
- Verifique se os nomes dos produtos estão corretos
- Tente buscar por nomes exatos (ex: "iPhone 15 Pro")

---

**Feito com ❤️ para ajudar você a configurar IA real no seu site!**
