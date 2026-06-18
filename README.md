# 🤖 AIC - AI Compare - Compare QUALQUER Coisa com IA

Site de comparação de produtos usando IA com sistema de assinatura PRO. Compare carros, celulares, notebooks, câmeras, games, eletrodomésticos e muito mais!

## 🚀 Como Hospedar no GitHub Pages

### Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no **+** no canto superior direito
3. Selecione **"New repository"**
4. Dê um nome (ex: `aic` ou `ia-compare`)
5. Marque **"Public"** (para GitHub Pages grátis)
6. Clique em **"Create repository"**

### Passo 2: Fazer Upload dos Arquivos

1. No seu repositório, clique em **"uploading an existing file"**
2. Arraste os 4 arquivos para a área de upload:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
3. Clique em **"Commit changes"**

### Passo 3: Ativar GitHub Pages

1. No seu repositório, clique em **Settings** (engrenagem)
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione **Deploy from a branch**
4. Em **Branch**, selecione `main` (ou `master`)
5. Clique em **Save**

### Passo 4: Aguardar Deploy

1. Aguarde 1-3 minutos
2. A página vai atualizar e mostrar um link (ex: `https://seu-usuario.github.io/aic/`)
3. Clique no link para ver seu site online! 🎉

## � Como Mudar URL para ai-compare.github.io

Para ter a URL `https://ai-compare.github.io`, você tem 2 opções:

### **Opção 1: Criar Organização (Recomendado)**
1. Vá em GitHub → crie nova organização chamada `ai-compare`
2. Crie o repositório dentro da organização
3. A URL será `https://ai-compare.github.io/`
4. **Vantagem**: Não afeta seu usuário pessoal

### **Opção 2: Mudar Nome de Usuário**
1. Vá em GitHub Settings → Account
2. Mude seu nome de usuário para `ai-compare`
3. A URL do seu repositório muda automaticamente
4. **Problema**: Muda TODOS os seus repositórios

## �🎯 O Que o Site Faz

### Busca com IA
- Digite qualquer produto (ex: "iPhone", "Civic", "MacBook")
- A IA pesquisa no banco de dados
- Mostra especificações, prós, contras e preços

### Comparação Rápida
- Digite 2 produtos (ex: "iPhone 15" vs "Samsung S24")
- A IA compara lado a lado
- Indica o vencedor com 🏆

### Sistema de Assinatura PRO
- **Grátis**: 5 buscas por dia, 8 categorias
- **PRO (R$29/mês)**: Buscas ilimitadas, IA avançada, histórico
- **Enterprise (R$99/mês)**: API access, multi-usuário, suporte dedicado

### 8 Categorias de Produtos
- 🚗 **Carros** (Honda Civic, Toyota Corolla, VW Jetta)
- 📱 **Celulares** (iPhone, Samsung, Xiaomi)
- 💻 **Notebooks** (MacBook, Dell, Lenovo)
- 📷 **Câmeras** (Sony, Canon, Fujifilm)
- 🎮 **Games** (PlayStation, Xbox, Nintendo)
- 📺 **Eletrodomésticos** (TVs, Geladeiras)
- 🎧 **Áudio** (Fones, Caixas)
- 💪 **Fitness** (Smartwatches, Trackers)

## � Como Ganhar Dinheiro com Assinatura PRO

### 1. Configurar Pagamento com Stripe

**Passo 1: Criar conta no Stripe**
1. Acesse [stripe.com](https://stripe.com)
2. Crie conta (grátis)
3. Configure sua conta para receber pagamentos no Brasil

**Passo 2: Criar Produto e Preço**
1. No Dashboard do Stripe, vá em Products
2. Crie um produto chamado "AIC PRO"
3. Crie um preço recorrente de R$29/mês
4. Copie o link de checkout

**Passo 3: Integrar no Site**
No arquivo `script.js`, substitua a função `openCheckout`:

```javascript
function openCheckout(plan) {
    if (plan === 'pro') {
        window.location.href = 'https://checkout.stripe.com/SEU_LINK_DE_CHECKOUT';
    } else if (plan === 'enterprise') {
        alert('Para plano Enterprise, entre em contato:\n\nEmail: contato@aicompare.com');
    }
}
```

### 2. Alternativa: Hotmart (Mais Fácil para Brasil)

**Passo 1: Criar conta no Hotmart**
1. Acesse [hotmart.com](https://hotmart.com)
2. Crie conta como produtor
3. Crie um produto de assinatura

**Passo 2: Configurar Produto**
1. Nome: "AIC PRO - Assinatura Mensal"
2. Preço: R$29,90
3. Tipo: Assinatura recorrente
4. Copie o link de checkout

**Passo 3: Integrar no Site**
No arquivo `script.js`:

```javascript
function openCheckout(plan) {
    if (plan === 'pro') {
        window.location.href = 'https://pay.hotmart.com/SEU_LINK';
    }
}
```

### 3. Potencial de Lucro com Assinatura

- **100 assinaturas PRO a R$29/mês** = R$2.900/mês
- **500 assinaturas PRO a R$29/mês** = R$14.500/mês
- **1000 assinaturas PRO a R$29/mês** = R$29.000/mês

**Taxas:**
- Stripe: ~2.9% + R$0,30 por transação
- Hotmart: ~9.9% por venda

## �📝 Como Adicionar Novos Produtos

Edite o arquivo `script.js` e adicione no objeto `productDatabase`:

```javascript
categoria: [
    {
        name: "Nome do Produto",
        price: "R$ X.000 - R$ Y.000",
        rating: 4.5,
        specs: {
            especificacao1: "valor",
            especificacao2: "valor"
        },
        pros: ["Pró 1", "Pró 2"],
        cons: ["Contra 1", "Contra 2"],
        bestFor: "Melhor para...",
        link: "https://site-do-produto.com"
    }
]
```

## 🎨 Personalização

### Mudar o Nome

No arquivo `index.html`, mude:

```html
<div class="logo">🤖 AIC</div>
```

### Mudar Preços dos Planos

No arquivo `index.html`, mude os preços:

```html
<div class="plan-price">R$ 29</div>
```

### Mudar Cores

No arquivo `style.css`, mude:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📈 Como Atrair Visitantes

### SEO (Google)

- O site já está otimizado para SEO
- As pessoas buscam "iPhone vs Samsung", "Civic vs Corolla", etc.
- Adicione mais produtos para mais buscas

### Redes Sociais

- **TikTok**: Crie vídeos comparando produtos
- **YouTube Shorts**: "Melhor celular até 5k"
- **Instagram**: Poste especificações e dicas
- **Twitter/X**: Compartilhe comparações

### Grupos

- Compartilhe em grupos de carros, tecnologia, games
- Seja útil, responda perguntas com seu site

## 🔧 Tecnologias Usadas

- **HTML5**: Estrutura do site
- **CSS3**: Estilos e design responsivo com glassmorphism
- **JavaScript**: Busca, comparação, limite de buscas e checkout
- **GitHub Pages**: Hospedagem grátis
- **Stripe/Hotmart**: Processamento de pagamentos

## 📱 Responsivo

O site funciona em:
- Desktop
- Tablet
- Celular

## 📄 Licença

Este site é livre para usar e modificar.

## 🤝 Contribuindo

Sinta-se livre para:
- Adicionar novos produtos
- Melhorar o design
- Corrigir erros
- Adicionar novas categorias

## ❓ Suporte

Se tiver dúvidas, pode:
- Abrir uma issue no GitHub
- Procurar tutoriais de GitHub Pages
- Pedir ajuda em comunidades de desenvolvimento

---

**Feito com ❤️ para ajudar você a comparar QUALQUER produto e ganhar dinheiro com assinaturas!**
