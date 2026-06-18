# 🚀 TUTORIAL COMPLETO - AIC

Tutorial passo a passo completo para configurar o site AIC, mudar a URL e começar a ganhar dinheiro com assinaturas.

---

## 📋 ÍNDICE

1. [Criar Organização no GitHub](#1-criar-organização-no-github)
2. [Hospedar Site no GitHub Pages](#2-hospedar-site-no-github-pages)
3. [Configurar Pagamento com Stripe](#3-configurar-pagamento-com-stripe)
4. [Configurar Pagamento com Hotmart](#4-configurar-pagamento-com-hotmart)
5. [Integrar Pagamento no Site](#5-integrar-pagamento-no-site)
6. [Testar e Lançar](#6-testar-e-lançar)
7. [Promover o Site](#7-promover-o-site)

---

## 1. CRIAR ORGANIZAÇÃO NO GITHUB

### Por que criar organização?
- Para ter a URL `https://ai-compare.github.io`
- Não afeta seu usuário pessoal
- Pode ter múltiplos repositórios

### Passo a Passo:

1. **Acesse o GitHub**
   - Vá para [github.com](https://github.com)
   - Faça login na sua conta

2. **Crie a Organização**
   - Clique no seu avatar no canto superior direito
   - Selecione "Your organizations" → "New organization"
   - Escolha "Free" (grátis)
   - Nome da organização: `ai-compare`
   - Email: seu email
   - Clique em "Create organization"

3. **Crie o Repositório**
   - Dentro da organização, clique em "New repository"
   - Nome do repositório: `aic` ou deixe em branco (será o nome da org)
   - **IMPORTANTE**: Marque "Public" (GitHub Pages só é grátis para repositórios públicos)
   - Se marcar "Private", precisará pagar para usar GitHub Pages
   - Clique em "Create repository"

4. **URL Final**
   - Seu site estará em: `https://ai-compare.github.io/`

---

## 2. HOSPEDAR SITE NO GITHUB PAGES

### Passo a Passo:

1. **Prepare os Arquivos**
   - Certifique-se que você tem os 4 arquivos:
     - `index.html`
     - `style.css`
     - `script.js`
     - `README.md`

2. **Faça Upload dos Arquivos**
   - No repositório da organização, clique em "uploading an existing file"
   - Arraste os 4 arquivos para a área de upload
   - Adicione uma mensagem de commit: "Initial commit"
   - Clique em "Commit changes"

3. **Ative GitHub Pages**
   - No repositório, clique em "Settings" (engrenagem)
   - No menu lateral, clique em "Pages"
   - Em "Source", selecione "Deploy from a branch"
   - Em "Branch", selecione `main` (ou `master`)
   - Clique em "Save"

4. **Aguarde o Deploy**
   - Aguarde 1-3 minutos
   - A página vai atualizar e mostrar o link
   - Clique no link para ver seu site online!

---

## 3. CONFIGURAR PAGAMENTO COM STRIPE

### Por que Stripe?
- Taxas menores (2.9% + R$0,30)
- Internacional
- Checkout profissional
- Recorrência automática

### Passo a Passo:

1. **Crie Conta no Stripe**
   - Acesse [stripe.com](https://stripe.com)
   - Clique em "Start now"
   - Preencha seu email e senha
   - Confirme seu email

2. **Configure sua Conta**
   - Complete seu perfil (nome, endereço, telefone)
   - Adicione dados bancários brasileiros
   - Stripe vai pedir documentos (CNH, RG, etc.)
   - Aguarde aprovação (geralmente 1-2 dias úteis)

3. **Crie o Produto**
   - No Dashboard do Stripe, vá em "Products"
   - Clique em "Add product"
   - Nome: `AIC PRO - Assinatura Mensal`
   - Descrição: `Acesso ilimitado ao AIC PRO`
   - Clique em "Add product"

4. **Crie o Preço**
   - No produto criado, clique em "Add pricing"
   - Tipo: `Recurring`
   - Preço: `R$ 29`
   - Intervalo: `Monthly`
   - Moeda: `BRL`
   - Clique em "Add price"

5. **Copie o Link de Checkout**
   - No produto, clique em "Create payment link"
   - Copie o link gerado (começa com `https://checkout.stripe.com/`)
   - Guarde esse link para usar no site

---

## 4. CONFIGURAR PAGAMENTO COM HOTMART

### Por que Hotmart?
- Mais fácil para Brasil
- Suporte em português
- Aceita PIX
- Conhecido no Brasil

### Passo a Passo:

1. **Crie Conta no Hotmart**
   - Acesse [hotmart.com](https://hotmart.com)
   - Clique em "Criar conta"
   - Escolha "Produtor"
   - Preencha seus dados
   - Confirme seu email

2. **Complete seu Perfil**
   - Adicione dados bancários
   - Adicione documentos (CPF, RG)
   - Configure para receber pagamentos
   - Aguarde aprovação (geralmente 1 dia útil)

3. **Crie o Produto**
   - No Dashboard, clique em "Criar produto"
   - Tipo: "Assinatura"
   - Nome: `AIC PRO - Assinatura Mensal`
   - Preço: `R$ 29,90`
   - Recorrência: Mensal
   - Descrição: `Acesso ilimitado ao AIC PRO`

4. **Configure a Página de Vendas**
   - Adicione descrição do produto
   - Adicione imagens (print do site)
   - Configure o checkout
   - Ative o produto

5. **Copie o Link de Checkout**
   - No produto, copie o link de checkout
   - Começa com `https://pay.hotmart.com/`
   - Guarde esse link para usar no site

---

## 5. INTEGRAR PAGAMENTO NO SITE

### Com Stripe:

1. **Abra o arquivo `script.js`**
2. **Encontre a função `openCheckout`**
3. **Substitua por:**

```javascript
function openCheckout(plan) {
    if (plan === 'pro') {
        window.location.href = 'https://checkout.stripe.com/SEU_LINK_DE_CHECKOUT';
    } else if (plan === 'enterprise') {
        alert('Para plano Enterprise, entre em contato:\n\nEmail: contato@aicompare.com\nWhatsApp: +55 11 99999-9999\n\nResponderemos em até 24 horas.');
    }
}
```

4. **Substitua `SEU_LINK_DE_CHECKOUT` pelo seu link real do Stripe**

### Com Hotmart:

1. **Abra o arquivo `script.js`**
2. **Encontre a função `openCheckout`**
3. **Substitua por:**

```javascript
function openCheckout(plan) {
    if (plan === 'pro') {
        window.location.href = 'https://pay.hotmart.com/SEU_LINK';
    } else if (plan === 'enterprise') {
        alert('Para plano Enterprise, entre em contato:\n\nEmail: contato@aicompare.com\nWhatsApp: +55 11 99999-9999\n\nResponderemos em até 24 horas.');
    }
}
```

4. **Substitua `SEU_LINK` pelo seu link real do Hotmart**

---

## 6. TESTAR E LANÇAR

### Testar o Site:

1. **Teste a Busca**
   - Digite "iPhone" e clique em "Pesquisar com IA"
   - Verifique se mostra resultados
   - Teste até atingir o limite de 5 buscas

2. **Teste o Limite**
   - Após 5 buscas, deve aparecer alerta para upgrade
   - Clique em "OK" para ir para a página de preços

3. **Teste o Checkout**
   - Clique em "Assinar PRO"
   - Deve redirecionar para o checkout (Stripe ou Hotmart)
   - Não complete a compra (é só teste)

4. **Teste Responsividade**
   - Abra o site no celular
   - Verifique se tudo funciona bem
   - Teste no tablet também

### Lançar:

1. **Faça Upload dos Arquivos Atualizados**
   - No GitHub, faça upload do `script.js` atualizado
   - Aguarde o deploy (1-3 minutos)
   - Verifique se o site está funcionando

2. **Compartilhe o Link**
   - URL: `https://ai-compare.github.io/`
   - Compartilhe com amigos e família
   - Peça feedback

---

## 7. PROMOVER O SITE

### SEO (Google):

1. **O site já está otimizado**
   - Títulos e descrições estão configurados
   - As pessoas buscam "iPhone vs Samsung", "Civic vs Corolla"
   - Adicione mais produtos para mais buscas

2. **Adicione Mais Produtos**
   - No `script.js`, adicione mais produtos
   - Mais produtos = mais buscas = mais tráfego

### Redes Sociais:

1. **TikTok**
   - Crie vídeos: "Melhor celular até 5k"
   - Mostre o site funcionando
   - Link na bio para o site
   - Poste 1-2 vídeos por dia

2. **YouTube Shorts**
   - Mesmo conteúdo do TikTok
   - Links na descrição
   - Use thumbnails chamativos

3. **Instagram**
   - Poste especificações de produtos
   - Use stories para engajar
   - Link na bio

4. **Twitter/X**
   - Compartilhe comparações
   - Use hashtags relevantes
   - Interaja com a comunidade

### Grupos:

1. **Grupos de Tecnologia**
   - Compartilhe em grupos de carros, celulares, notebooks
   - Seja útil, responda perguntas
   - Não spam, apenas quando relevante

2. **Grupos de Compras**
   - Grupos de "Melhor compra"
   - Compartilhe quando alguém pergunta sobre produtos
   - Use seu site para responder

### Anúncios (Opcional):

1. **Google AdSense**
   - Quando tiver tráfego consistente
   - Cadastre-se em [adsense.google.com](https://adsense.google.com)
   - Adicione código no site

2. **Facebook/Instagram Ads**
   - Quando tiver orçamento
   - Segmente para interessados em tecnologia
   - Use criativos chamativos

---

## 💡 DICAS IMPORTANTES

### 1. Comece Pequeno
- Não espere milhares de visitantes no primeiro dia
- Foque em criar conteúdo de qualidade
- O tráfego vai crescer com o tempo

### 2. Seja Consistente
- Poste conteúdo regularmente
- Responda comentários e perguntas
- Adicione novos produtos semanalmente

### 3. Melhore Constantemente
- Ouça feedback dos usuários
- Adicione funcionalidades pedidas
- Corrija bugs rapidamente

### 4. Analise os Dados
- Use Google Analytics (grátis)
- Veja quais produtos são mais buscados
- Foque no que as pessoas querem

### 5. Seja Paciente
- Leva 3-6 meses para ganhar tráfego consistente
- Leva 6-12 meses para ganhar dinheiro real
- Não desista no primeiro mês

---

## 📊 EXPECTATIVAS REALISTAS

### Mês 1-3:
- Visitantes: 50-200/dia
- Assinaturas PRO: 0-5
- Lucro: R$0-150/mês

### Mês 4-6:
- Visitantes: 200-800/dia
- Assinaturas PRO: 5-20
- Lucro: R$150-600/mês

### Mês 7-12:
- Visitantes: 800-3000/dia
- Assinaturas PRO: 20-100
- Lucro: R$600-3000/mês

### Ano 2+:
- Visitantes: 3000-10000/dia
- Assinaturas PRO: 100-500+
- Lucro: R$3000-15000/mês

---

## ❓ PERGUNTAS FREQUENTES

### Q: Preciso de empresa (CNPJ)?
A: Não, pode usar CPF. Mas se ganhar muito, vale a pena abrir.

### Q: Quanto tempo para aprovação no Stripe/Hotmart?
A: Stripe: 1-2 dias úteis. Hotmart: 1 dia útil.

### Q: Posso mudar os preços depois?
A: Sim, pode mudar a qualquer momento no Stripe/Hotmart.

### Q: Como cancelar assinatura?
A: O cliente cancela no próprio Stripe/Hotmart.

### Q: Preciso de servidor?
A: Não, GitHub Pages é gratuito e suficiente.

### Q: Posso usar outro método de pagamento?
A: Sim, pode usar Pagar.me, Mercado Pago, etc.

---

## 🆘 SUPORTE

Se tiver problemas:

1. **GitHub Pages não funciona**
   - Verifique se o repositório é público
   - Verifique se o branch está correto
   - Aguarde mais alguns minutos

2. **Pagamento não funciona**
   - Verifique se a conta está aprovada
   - Verifique se o link está correto
   - Entre em contato com suporte do Stripe/Hotmart

3. **Site não aparece no Google**
   - Leva 1-3 meses para aparecer
   - Use Google Search Console
   - Crie mais conteúdo

---

## 🎉 PRONTO!

Agora você tem:
- ✅ Site online em `https://ai-compare.github.io/`
- ✅ Sistema de assinatura PRO configurado
- ✅ Pagamento integrado (Stripe ou Hotmart)
- ✅ Limite de buscas para incentivar upgrade
- ✅ Design moderno e responsivo
- ✅ Tutorial completo de como promover

**Boa sorte! 🚀**

---

**Feito com ❤️ para ajudar você a ganhar dinheiro com seu site!**
