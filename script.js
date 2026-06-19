// Configuração da API DeepSeek
const DEEPSEEK_API_KEY = 'sk-934213f8c61d4e5bb781640ddf9675fd'; // Substitua pela sua API key do DeepSeek
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Configuração da API Hugging Face (gratuita)
const HUGGINGFACE_API_KEY = ''; // Vazio para usar modelo público gratuito
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCBnJNCy5ZSwytghpCjSVJz_tXCWrcJgZI",
    authDomain: "ia-compare.firebaseapp.com",
    projectId: "ia-compare",
    storageBucket: "ia-compare.firebasestorage.app",
    messagingSenderId: "1017161644505",
    appId: "1:1017161644505:web:9919c93a75d2706f3041c8",
    measurementId: "G-N39NTG1JKZ"
};

// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    console.log('Firebase inicializado com sucesso');
} catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
    console.log('Firebase não configurado. Login não estará disponível.');
}

// Função para chamar a API do Hugging Face (gratuita)
async function callHuggingFaceAPI(query, priceFilter = 'all', categoryFilter = 'all') {
    // Converter filtro de preço para instrução
    let priceInstruction = '';
    if (priceFilter === 'cheap') {
        priceInstruction = 'FILTRO DE PREÇO: Forneça APENAS produtos baratos, com preço até R$ 1.000. Não inclua produtos mais caros.';
    } else if (priceFilter === 'medium') {
        priceInstruction = 'FILTRO DE PREÇO: Forneça APENAS produtos na faixa de preço médio, entre R$ 1.000 e R$ 5.000. Não inclua produtos fora dessa faixa.';
    } else if (priceFilter === 'expensive') {
        priceInstruction = 'FILTRO DE PREÇO: Forneça APENAS produtos caros/premium, com preço acima de R$ 5.000. Não inclua produtos mais baratos.';
    }

    // Converter filtro de categoria para instrução
    let categoryInstruction = '';
    if (categoryFilter !== 'all') {
        const categoryNames = {
            'carros': 'carros/veículos',
            'celulares': 'celulares/smartphones',
            'notebooks': 'notebooks/laptops',
            'cameras': 'câmeras/fotografia',
            'games': 'games/consoles',
            'eletrodomesticos': 'eletrodomésticos/TVs',
            'audio': 'áudio/fones de ouvido/colunas',
            'fitness': 'fitness/smartwatches'
        };
        categoryInstruction = `FILTRO DE CATEGORIA: Forneça APENAS produtos da categoria ${categoryNames[categoryFilter] || categoryFilter}. Não inclua produtos de outras categorias.`;
    }

    try {
        const response = await fetch(HUGGINGFACE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': HUGGINGFACE_API_KEY !== 'SUA_API_KEY_HUGGINGFACE' ? `Bearer ${HUGGINGFACE_API_KEY}` : undefined
            },
            body: JSON.stringify({
                inputs: `Você é um assistente de comparação de produtos especializado em buscar informações de lojas e sites reais do mercado brasileiro.

INSTRUÇÕES IMPORTANTES:
1. Use seu conhecimento treinado sobre produtos atuais, preços de mercado brasileiro e especificações
2. Forneça informações de produtos que realmente existem e estão disponíveis no mercado
3. Inclua preços aproximados em Reais (R$) baseados no mercado atual brasileiro
4. Para links, use URLs de sites de busca como Google Shopping, Mercado Livre, Amazon Brasil, ou sites oficiais
5. Entenda gírias e linguagem informal do brasileiro (ex: "top", "chique", "bom e barato", "luxo")
6. Se o usuário pedir algo vago, forneça produtos populares e bem avaliados na categoria

${priceInstruction}
${categoryInstruction}

Para cada produto, forneça:
- Nome do produto (modelo específico, não genérico)
- Categoria (carros, celulares, notebooks, câmeras, games, eletrodomésticos, áudio, fitness)
- Preço aproximado em Reais (R$) - seja realista
- Avaliação média (0-5)
- Especificações principais (detalhadas)
- Prós (3-5 pontos específicos)
- Contras (3-5 pontos específicos)
- Melhor para quem (público alvo)
- Link de referência (use Google Shopping, Mercado Livre, Amazon Brasil ou site oficial)

Busque informações reais sobre: "${query}". Forneça 10-20 produtos específicos que existem no mercado brasileiro atual, com preços realistas e detalhes completos.

Retorne APENAS o JSON válido, sem texto adicional. Se não encontrar produtos relevantes, retorne um array vazio [].

Formatato de resposta esperado:
[
    {
        "name": "Nome específico do produto/modelo",
        "category": "categoria",
        "price": "Preço em R$ (ex: R$ 2.500)",
        "rating": 4.5,
        "specs": {"especificação": "valor específico"},
        "pros": ["pró específico 1", "pró específico 2"],
        "cons": ["contra específico 1", "contra específico 2"],
        "bestFor": "Público alvo específico",
        "link": "https://shopping.google.com/..."
    }
]`,
                parameters: {
                    max_new_tokens: 4000,
                    temperature: 0.8,
                    return_full_text: false
                }
            })
        });

        const data = await response.json();
        
        if (data && data[0] && data[0].generated_text) {
            const content = data[0].generated_text;
            try {
                // Tentar extrair JSON da resposta
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return parsed;
                }
                return null;
            } catch (e) {
                console.error('Erro ao parsear resposta da IA Hugging Face:', e);
                console.error('Conteúdo da resposta:', content);
                return null;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Erro ao chamar API do Hugging Face:', error);
        return null;
    }
}

// Função para chamar a API do DeepSeek
async function callDeepSeekAPI(query, priceFilter = 'all', categoryFilter = 'all') {
    if (DEEPSEEK_API_KEY === 'SUA_API_KEY_AQUI') {
        console.warn('API key do DeepSeek não configurada. Usando busca local.');
        return null;
    }

    // Converter filtro de preço para instrução
    let priceInstruction = '';
    if (priceFilter === 'cheap') {
        priceInstruction = 'FILTRO DE PREÇO: Forneça APENAS produtos baratos, com preço até R$ 1.000. Não inclua produtos mais caros.';
    } else if (priceFilter === 'medium') {
        priceInstruction = 'FILTRO DE PREÇO: Forneça APENAS produtos na faixa de preço médio, entre R$ 1.000 e R$ 5.000. Não inclua produtos fora dessa faixa.';
    } else if (priceFilter === 'expensive') {
        priceInstruction = 'FILTRO DE PREÇO: Forneça APENAS produtos caros/premium, com preço acima de R$ 5.000. Não inclua produtos mais baratos.';
    }

    // Converter filtro de categoria para instrução
    let categoryInstruction = '';
    if (categoryFilter !== 'all') {
        const categoryNames = {
            'carros': 'carros/veículos',
            'celulares': 'celulares/smartphones',
            'notebooks': 'notebooks/laptops',
            'cameras': 'câmeras/fotografia',
            'games': 'games/consoles',
            'eletrodomesticos': 'eletrodomésticos/TVs',
            'audio': 'áudio/fones de ouvido/colunas',
            'fitness': 'fitness/smartwatches'
        };
        categoryInstruction = `FILTRO DE CATEGORIA: Forneça APENAS produtos da categoria ${categoryNames[categoryFilter] || categoryFilter}. Não inclua produtos de outras categorias.`;
    }

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `Você é um assistente de comparação de produtos especializado em buscar informações de lojas e sites reais do mercado brasileiro.

                        INSTRUÇÕES IMPORTANTES:
                        1. Use seu conhecimento treinado sobre produtos atuais, preços de mercado brasileiro e especificações
                        2. Forneça informações de produtos que realmente existem e estão disponíveis no mercado
                        3. Inclua preços aproximados em Reais (R$) baseados no mercado atual brasileiro
                        4. Para links, use URLs de sites de busca como Google Shopping, Mercado Livre, Amazon Brasil, ou sites oficiais
                        5. Entenda gírias e linguagem informal do brasileiro (ex: "top", "chique", "bom e barato", "luxo")
                        6. Se o usuário pedir algo vago, forneça produtos populares e bem avaliados na categoria

                        ${priceInstruction}
                        ${categoryInstruction}

                        Para cada produto, forneça:
                        - Nome do produto (modelo específico, não genérico)
                        - Categoria (carros, celulares, notebooks, câmeras, games, eletrodomésticos, áudio, fitness)
                        - Preço aproximado em Reais (R$) - seja realista
                        - Avaliação média (0-5)
                        - Especificações principais (detalhadas)
                        - Prós (3-5 pontos específicos)
                        - Contras (3-5 pontos específicos)
                        - Melhor para quem (público alvo)
                        - Link de referência (use Google Shopping, Mercado Livre, Amazon Brasil ou site oficial)

                        Retorne APENAS o JSON válido, sem texto adicional. Se não encontrar produtos relevantes, retorne um array vazio [].

                        Formato de resposta esperado:
                        [
                            {
                                "name": "Nome específico do produto/modelo",
                                "category": "categoria",
                                "price": "Preço em R$ (ex: R$ 2.500)",
                                "rating": 4.5,
                                "specs": {"especificação": "valor específico"},
                                "pros": ["pró específico 1", "pró específico 2"],
                                "cons": ["contra específico 1", "contra específico 2"],
                                "bestFor": "Público alvo específico",
                                "link": "https://shopping.google.com/..."
                            }
                        ]`
                    },
                    {
                        role: 'user',
                        content: `Busque informações reais sobre: "${query}". Forneça 10-20 produtos específicos que existem no mercado brasileiro atual, com preços realistas e detalhes completos.`
                    }
                ],
                temperature: 0.8,
                max_tokens: 4000
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const content = data.choices[0].message.content;
            try {
                // Remover markdown code blocks se existirem
                const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                const parsed = JSON.parse(cleanContent);
                return parsed;
            } catch (e) {
                console.error('Erro ao parsear resposta da IA:', e);
                console.error('Conteúdo da resposta:', content);
                return null;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Erro ao chamar API do DeepSeek:', error);
        // Se erro 402 (sem créditos), tentar Hugging Face
        if (error.message.includes('402') || error.message.includes('Payment Required')) {
            console.log('DeepSeek sem créditos. Tentando Hugging Face (gratuito)...');
            return await callHuggingFaceAPI(query, priceFilter);
        }
        return null;
    }
}

// Dados de produtos para comparação
const productDatabase = {
    carros: [
        {
            name: "Honda Civic 2024",
            price: "R$ 130.000 - R$ 180.000",
            rating: 4.5,
            specs: {
                motor: "2.0L Turbo",
                potencia: "173 cv",
                consumo: "10-12 km/l",
                "0-100": "8.5s"
            },
            pros: ["Confiável", "Econômico", "Alta revenda", "Tecnologia"],
            cons: ["Preço elevado", "Manutenção cara", "Espaço interno médio"],
            bestFor: "Quem busca confiabilidade e economia",
            link: "https://www.honda.com.br"
        },
        {
            name: "Toyota Corolla 2024",
            price: "R$ 140.000 - R$ 190.000",
            rating: 4.6,
            specs: {
                motor: "2.0L",
                potencia: "177 cv",
                consumo: "11-13 km/l",
                "0-100": "9.0s"
            },
            pros: ["Muito confiável", "Alta durabilidade", "Bom consumo", "Reserva de valor"],
            cons: ["Design conservador", "Tecnologia básica", "Preço alto"],
            bestFor: "Quem quer durabilidade e baixa manutenção",
            link: "https://www.toyota.com.br"
        },
        {
            name: "Volkswagen Jetta 2024",
            price: "R$ 120.000 - R$ 160.000",
            rating: 4.3,
            specs: {
                motor: "1.4L Turbo",
                potencia: "150 cv",
                consumo: "12-14 km/l",
                "0-100": "9.5s"
            },
            pros: ["Design moderno", "Bom acabamento", "Espaçoso", "Preço justo"],
            cons: ["Manutenção VW", "Turbo exige cuidado", "Reserva de valor menor"],
            bestFor: "Quem quer design e conforto",
            link: "https://www.vw.com.br"
        },
        {
            name: "Chevrolet Onix 2024",
            price: "R$ 70.000 - R$ 90.000",
            rating: 4.2,
            specs: {
                motor: "1.0L Turbo",
                potencia: "116 cv",
                consumo: "13-15 km/l",
                "0-100": "11.0s"
            },
            pros: ["Econômico", "Barato", "Tecnologia boa", "Popular"],
            cons: ["Acabamento básico", "Espaço limitado", "Pouco potente", "Reserva de valor baixa"],
            bestFor: "Quem quer economia e custo-benefício",
            link: "https://www.chevrolet.com.br"
        },
        {
            name: "Hyundai HB20 2024",
            price: "R$ 65.000 - R$ 85.000",
            rating: 4.1,
            specs: {
                motor: "1.0L Turbo",
                potencia: "120 cv",
                consumo: "12-14 km/l",
                "0-100": "10.5s"
            },
            pros: ["Design moderno", "Econômico", "Garantia longa", "Tecnologia"],
            cons: ["Espaço interno pequeno", "Acabamento básico", "Pouco potente", "Reserva de valor média"],
            bestFor: "Quem quer carro hatch moderno e econômico",
            link: "https://www.hyundai.com.br"
        },
        {
            name: "Fiat Toro 2024",
            price: "R$ 110.000 - R$ 150.000",
            rating: 4.3,
            specs: {
                motor: "1.3L Turbo",
                potencia: "185 cv",
                consumo: "10-12 km/l",
                "0-100": "9.8s"
            },
            pros: ["Versátil", "Design robusto", "Boa altura", "Tecnologia"],
            cons: ["Consumo médio", "Espaço interno médio", "Manutenção Fiat", "Preço alto"],
            bestFor: "Quem quer SUV compacto versátil",
            link: "https://www.fiat.com.br"
        },
        {
            name: "Jeep Compass 2024",
            price: "R$ 140.000 - R$ 180.000",
            rating: 4.4,
            specs: {
                motor: "2.0L Turbo",
                potencia: "200 cv",
                consumo: "9-11 km/l",
                "0-100": "8.2s"
            },
            pros: ["Potente", "SUV completo", "Imagem forte", "Tecnologia"],
            cons: ["Caro", "Consumo alto", "Manutenção cara", "Espaço interno médio"],
            bestFor: "Quem quer SUV médio potente",
            link: "https://www.jeep.com.br"
        },
        {
            name: "Renault Kwid 2024",
            price: "R$ 50.000 - R$ 65.000",
            rating: 4.0,
            specs: {
                motor: "1.0L",
                potencia: "71 cv",
                consumo: "14-16 km/l",
                "0-100": "14.0s"
            },
            pros: ["Muito barato", "Econômico", "Fácil estacionar", "Manutenção barata"],
            cons: ["Pouco potente", "Acabamento básico", "Sem tecnologia avançada", "Espaço pequeno"],
            bestFor: "Quem quer o carro mais barato possível",
            link: "https://www.renault.com.br"
        },
        {
            name: "Toyota Yaris 2024",
            price: "R$ 80.000 - R$ 100.000",
            rating: 4.2,
            specs: {
                motor: "1.5L",
                potencia: "110 cv",
                consumo: "13-15 km/l",
                "0-100": "10.8s"
            },
            pros: ["Confiável", "Econômico", "Compacto", "Boa tecnologia"],
            cons: ["Espaço limitado", "Design peculiar", "Preço médio", "Pouco potente"],
            bestFor: "Quem quer carro compacto confiável",
            link: "https://www.toyota.com.br"
        },
        {
            name: "Nissan Versa 2024",
            price: "R$ 75.000 - R$ 95.000",
            rating: 4.1,
            specs: {
                motor: "1.6L",
                potencia: "111 cv",
                consumo: "12-14 km/l",
                "0-100": "11.5s"
            },
            pros: ["Espaçoso", "Econômico", "Design moderno", "Preço justo"],
            cons: ["Pouco potente", "Acabamento básico", "Tecnologia limitada", "Reserva de valor média"],
            bestFor: "Quem quer sedan espaçoso e econômico",
            link: "https://www.nissan.com.br"
        }
    ],
    celulares: [
        {
            name: "iPhone 15 Pro",
            price: "R$ 7.500 - R$ 9.000",
            rating: 4.8,
            specs: {
                tela: "6.1\" OLED",
                processador: "A17 Pro",
                camera: "48MP",
                bateria: "3274 mAh"
            },
            pros: ["Melhor câmera", "Sistema otimizado", "Alta durabilidade", "Reserva de valor"],
            cons: ["Muito caro", "Bateria fraca", "Sem carregador na caixa", "iOS fechado"],
            bestFor: "Quem quer o melhor ecossistema Apple",
            link: "https://www.apple.com/br/iphone-15-pro"
        },
        {
            name: "Samsung Galaxy S24 Ultra",
            price: "R$ 8.000 - R$ 10.000",
            rating: 4.7,
            specs: {
                tela: "6.8\" AMOLED",
                processador: "Snapdragon 8 Gen 3",
                camera: "200MP",
                bateria: "5000 mAh"
            },
            pros: ["Câmera incrível", "Tela enorme", "S-Pen inclusa", "Android personalizável"],
            cons: ["Muito caro", "Grande e pesado", "Bloatware Samsung", "Atualizações lentas"],
            bestFor: "Quem quer o melhor Android",
            link: "https://www.samsung.com/br/smartphones/galaxy-s24-ultra"
        },
        {
            name: "Xiaomi 14",
            price: "R$ 5.000 - R$ 6.000",
            rating: 4.5,
            specs: {
                tela: "6.36\" AMOLED",
                processador: "Snapdragon 8 Gen 3",
                camera: "50MP Leica",
                bateria: "4610 mAh"
            },
            pros: ["Custo-benefício", "Câmera Leica", "Carregamento rápido", "Design premium"],
            cons: ["MIUI tem bugs", "Suporte no Brasil", "Menos conhecido", "Bloatware"],
            bestFor: "Quer qualidade por preço menor",
            link: "https://www.mi.com/br"
        },
        {
            name: "Motorola Edge 40",
            price: "R$ 2.500 - R$ 3.500",
            rating: 4.3,
            specs: {
                tela: "6.55\" OLED",
                processador: "Snapdragon 7+ Gen 2",
                camera: "50MP",
                bateria: "4400 mAh"
            },
            pros: ["Custo-benefício", "Android puro", "Carregamento rápido", "Design fino"],
            cons: ["Câmera média", "Sem estabilização ótica", "Bateria média", "Atualizações lentas"],
            bestFor: "Quem quer Android puro e bom preço",
            link: "https://www.motorola.com.br"
        },
        {
            name: "Poco X6 Pro",
            price: "R$ 2.000 - R$ 2.800",
            rating: 4.2,
            specs: {
                tela: "6.67\" AMOLED",
                processador: "Snapdragon 8 Gen 2",
                camera: "64MP",
                bateria: "5000 mAh"
            },
            pros: ["Performance top", "Preço baixo", "Bateria grande", "Tela 120Hz"],
            cons: ["MIUI pesada", "Câmera média", "Plástico", "Sem IP68"],
            bestFor: "Gamer com orçamento limitado",
            link: "https://www.mi.com/br/poco-x6-pro"
        },
        {
            name: "Samsung Galaxy A55",
            price: "R$ 1.800 - R$ 2.500",
            rating: 4.1,
            specs: {
                tela: "6.6\" AMOLED",
                processador: "Exynos 1480",
                camera: "50MP",
                bateria: "5000 mAh"
            },
            pros: ["Preço justo", "Samsung confiável", "Bateria boa", "Tela AMOLED"],
            cons: ["Processador médio", "Bloatware", "Sem carregador rápido", "Câmera básica"],
            bestFor: "Quem quer Samsung intermediário",
            link: "https://www.samsung.com/br/smartphones/galaxy-a55"
        },
        {
            name: "iPhone 13",
            price: "R$ 4.000 - R$ 5.000",
            rating: 4.4,
            specs: {
                tela: "6.1\" OLED",
                processador: "A15 Bionic",
                camera: "12MP",
                bateria: "3240 mAh"
            },
            pros: ["iOS", "Câmera boa", "Atualizações longas", "Reserva de valor"],
            cons: ["60Hz apenas", "Design antigo", "Bateria média", "Sem USB-C"],
            bestFor: "Quem quer iPhone mais barato",
            link: "https://www.apple.com/br/iphone-13"
        },
        {
            name: "Realme 12 Pro+",
            price: "R$ 2.200 - R$ 3.000",
            rating: 4.0,
            specs: {
                tela: "6.7\" AMOLED",
                processador: "Snapdragon 7s Gen 2",
                camera: "50MP",
                bateria: "5000 mAh"
            },
            pros: ["Câmera periscópio", "Preço baixo", "Carregamento rápido", "Design curvo"],
            cons: ["Processador médio", "RealmeUI pesada", "Bloatware", "Atualizações"],
            bestFor: "Quem quer câmera zoom por preço baixo",
            link: "https://www.realme.com/br"
        },
        {
            name: "Google Pixel 8",
            price: "R$ 4.500 - R$ 5.500",
            rating: 4.5,
            specs: {
                tela: "6.2\" OLED",
                processador: "Tensor G3",
                camera: "50MP",
                bateria: "4575 mAh"
            },
            pros: ["Android puro", "IA incrível", "Câmera excelente", "Atualizações 7 anos"],
            cons: ["Não oficial no Brasil", "Bateria média", "Sem carregador", "Preço alto"],
            bestFor: "Entusiasta de Android e IA",
            link: "https://store.google.com/product/pixel_8"
        },
        {
            name: "Asus Zenfone 10",
            price: "R$ 4.000 - R$ 5.000",
            rating: 4.3,
            specs: {
                tela: "5.9\" AMOLED",
                processador: "Snapdragon 8 Gen 2",
                camera: "50MP",
                bateria: "4300 mAh"
            },
            pros: ["Compacto", "Performance top", "Gimbal estabilização", "Android puro"],
            cons: ["Tela pequena", "Bateria pequena", "Preço alto", "Sem IP68"],
            bestFor: "Quem quer compacto potente",
            link: "https://www.asus.com/br/phones/zenfone-series/zenfone-10"
        }
    ],
    notebooks: [
        {
            name: "MacBook Pro 14\" M3",
            price: "R$ 18.000 - R$ 25.000",
            rating: 4.9,
            specs: {
                processador: "M3 Pro/Max",
                ram: "18GB - 36GB",
                armazenamento: "512GB - 1TB",
                tela: "14\" Liquid Retina XDR"
            },
            pros: ["Performance incrível", "Bateria excepcional", "Tela perfeita", "Silencioso"],
            cons: ["Muito caro", "Sem upgrade", "Portas limitadas", "macOS fechado"],
            bestFor: "Profissionais criativos e desenvolvedores",
            link: "https://www.apple.com/br/macbook-pro"
        },
        {
            name: "Dell XPS 15",
            price: "R$ 12.000 - R$ 20.000",
            rating: 4.6,
            specs: {
                processador: "Intel i7/i9",
                ram: "16GB - 32GB",
                armazenamento: "512GB - 1TB SSD",
                tela: "15.6\" OLED"
            },
            pros: ["Tela OLED", "Build premium", "Windows completo", "Bom teclado"],
            cons: ["Caro", "Aquece", "Bateria média", "Peso elevado"],
            bestFor: "Profissionais que precisam de Windows",
            link: "https://www.dell.com/br/xps"
        },
        {
            name: "Lenovo ThinkPad X1 Carbon",
            price: "R$ 10.000 - R$ 15.000",
            rating: 4.7,
            specs: {
                processador: "Intel i7",
                ram: "16GB - 32GB",
                armazenamento: "512GB - 1TB SSD",
                tela: "14\" IPS"
            },
            pros: ["Leve e resistente", "Teclado melhor", "Bateria excelente", "Portas completas"],
            cons: ["Tela básica", "Design corporativo", "Preço alto", "Sem GPU dedicada"],
            bestFor: "Empresários e trabalhadores remotos",
            link: "https://www.lenovo.com/br/thinkpad"
        },
        {
            name: "Asus ROG Zephyrus G14",
            price: "R$ 8.000 - R$ 12.000",
            rating: 4.5,
            specs: {
                processador: "AMD Ryzen 9",
                ram: "16GB - 32GB",
                armazenamento: "1TB SSD",
                tela: "14\" 165Hz"
            },
            pros: ["Gaming potente", "Portátil", "Tela 165Hz", "Design elegante"],
            cons: ["Aquece", "Bateria curta", "Caro", "Fan barulhento"],
            bestFor: "Gamers que precisam de portabilidade",
            link: "https://www.asus.com/br/gaming-laptops/rog-zephyrus-g14"
        },
        {
            name: "Acer Nitro 5",
            price: "R$ 4.000 - R$ 6.000",
            rating: 4.2,
            specs: {
                processador: "Intel i5/i7",
                ram: "8GB - 16GB",
                armazenamento: "512GB SSD",
                tela: "15.6\" 144Hz"
            },
            pros: ["Custo-benefício", "Gaming decente", "Preço baixo", "Upgrade fácil"],
            cons: ["Build plástico", "Bateria ruim", "Pesado", "Tela básica"],
            bestFor: "Gamers com orçamento limitado",
            link: "https://www.acer.com/br/nitro-5"
        },
        {
            name: "Samsung Galaxy Book2",
            price: "R$ 3.000 - R$ 5.000",
            rating: 4.3,
            specs: {
                processador: "Intel i5",
                ram: "8GB - 16GB",
                armazenamento: "256GB - 512GB SSD",
                tela: "15.6\" AMOLED"
            },
            pros: ["Tela AMOLED", "Leve", "Bateria boa", "Design fino"],
            cons: ["Sem GPU dedicada", "Portas limitadas", "Bloatware", "Performance média"],
            bestFor: "Uso geral e estudantes",
            link: "https://www.samsung.com/br/computing/galaxy-book/"
        },
        {
            name: "Lenovo IdeaPad Gaming 3",
            price: "R$ 3.500 - R$ 5.000",
            rating: 4.1,
            specs: {
                processador: "AMD Ryzen 5/7",
                ram: "8GB - 16GB",
                armazenamento: "512GB SSD",
                tela: "15.6\" 120Hz"
            },
            pros: ["Preço bom", "AMD eficiente", "Tela 120Hz", "Teclado gamer"],
            cons: ["Build médio", "Bateria ruim", "Pesado", "Fan barulhento"],
            bestFor: "Gamers iniciantes",
            link: "https://www.lenovo.com/br/laptops/ideapad/gaming"
        },
        {
            name: "MacBook Air M2",
            price: "R$ 8.000 - R$ 12.000",
            rating: 4.6,
            specs: {
                processador: "M2",
                ram: "8GB - 16GB",
                armazenamento: "256GB - 512GB",
                tela: "13.6\" Liquid Retina"
            },
            pros: ["Leve", "Bateria excepcional", "Silencioso", "Tela boa"],
            cons: ["Sem风扇", "Portas limitadas", "Sem upgrade", "Preço alto"],
            bestFor: "Estudantes e profissionais móveis",
            link: "https://www.apple.com/br/macbook-air"
        },
        {
            name: "HP Pavilion 15",
            price: "R$ 3.000 - R$ 4.500",
            rating: 4.0,
            specs: {
                processador: "Intel i5",
                ram: "8GB - 16GB",
                armazenamento: "256GB - 512GB SSD",
                tela: "15.6\" IPS"
            },
            pros: ["Preço justo", "Design bonito", "Bateria média", "Confiável"],
            cons: ["Performance básica", "Build plástico", "Bloatware HP", "Sem GPU"],
            bestFor: "Uso geral e escritório",
            link: "https://www.hp.com/br/pavilion"
        },
        {
            name: "Dell Inspiron 15",
            price: "R$ 2.500 - R$ 4.000",
            rating: 3.9,
            specs: {
                processador: "Intel i3/i5",
                ram: "8GB - 16GB",
                armazenamento: "256GB - 512GB SSD",
                tela: "15.6\" IPS"
            },
            pros: ["Barato", "Confiável", "Suporte Dell", "Upgrade fácil"],
            cons: ["Performance básica", "Design básico", "Bateria ruim", "Pesado"],
            bestFor: "Orçamento limitado e uso básico",
            link: "https://www.dell.com/br/inspiron"
        }
    ],
    cameras: [
        {
            name: "Sony A7 IV",
            price: "R$ 18.000 - R$ 22.000",
            rating: 4.8,
            specs: {
                sensor: "Full-frame 33MP",
                video: "4K 60fps",
                autofocus: "759 pontos",
                estabilizacao: "5 eixos"
            },
            pros: ["Melhor autofocus", "Video excelente", "Lentes Sony", "Ecossistema"],
            cons: ["Caro", "Menu complexo", "Sem carregador", "Bateria média"],
            bestFor: "Fotógrafos e videografos profissionais",
            link: "https://www.sony.com/br/electronics/interchangeable-lens-cameras/ilce-7m4"
        },
        {
            name: "Canon EOS R6 Mark II",
            price: "R$ 16.000 - R$ 20.000",
            rating: 4.7,
            specs: {
                sensor: "Full-frame 24MP",
                video: "4K 60fps",
                autofocus: "1053 pontos",
                estabilizacao: "5 eixos"
            },
            pros: ["Excelente vídeo", "Autofocus rápido", "Lentes Canon", "Ergonomia"],
            cons: ["Menos megapixels", "Preço alto", "Sem 8K", "Bateria"],
            bestFor: "Híbridos foto e vídeo",
            link: "https://www.canon.com.br/cameras/eos-r6-mark-ii"
        },
        {
            name: "Fujifilm X-T5",
            price: "R$ 12.000 - R$ 15.000",
            rating: 4.6,
            specs: {
                sensor: "APS-C 40MP",
                video: "6.2K 30fps",
                autofocus: "425 pontos",
                estabilizacao: "7 eixos"
            },
            pros: ["Cores incríveis", "Design retrô", "Simulações filme", "Leve"],
            cons: ["Sensor APS-C", "Video limitado", "Autofocus médio", "Lentes caras"],
            bestFor: "Fotógrafos que amam cores e design",
            link: "https://fujifilm-x.com/pt-br/products/x-t5/"
        },
        {
            name: "Sony ZV-E10",
            price: "R$ 4.000 - R$ 5.000",
            rating: 4.3,
            specs: {
                sensor: "APS-C 24MP",
                video: "4K 30fps",
                autofocus: "425 pontos",
                estabilizacao: "3 eixos"
            },
            pros: ["Focado em vídeo", "Preço bom", "Lentes Sony", "Compacto"],
            cons: ["Sem visor", "Estabilização básica", "Menu Sony", "Bateria curta"],
            bestFor: "Criadores de conteúdo iniciantes",
            link: "https://www.sony.com/br/electronics/interchangeable-lens-cameras/zv-e10"
        },
        {
            name: "Canon EOS R50",
            price: "R$ 3.500 - R$ 4.500",
            rating: 4.2,
            specs: {
                sensor: "APS-C 24MP",
                video: "4K 30fps",
                autofocus: "651 pontos",
                estabilizacao: "Digital"
            },
            pros: ["Preço baixo", "Autofocus bom", "Leve", "Interface simples"],
            cons: ["Sem estabilização", "Bateria pequena", "Portas limitadas", "Build plástico"],
            bestFor: "Iniciantes em fotografia",
            link: "https://www.canon.com.br/cameras/eos-r50"
        },
        {
            name: "DJI Pocket 3",
            price: "R$ 3.500 - R$ 4.500",
            rating: 4.4,
            specs: {
                sensor: "1/1.7\" 9MP",
                video: "4K 120fps",
                estabilizacao: "3 eixos mecânico",
                tela: "Tela touch"
            },
            pros: ["Estabilização perfeita", "Compacto", "4K 120fps", "Fácil usar"],
            cons: ["Sensor pequeno", "Sem lentes", "Preço alto", "Bateria curta"],
            bestFor: "Vloggers e vídeos handheld",
            link: "https://www.dji.com/br/pocket-3"
        },
        {
            name: "GoPro Hero 12",
            price: "R$ 3.000 - R$ 4.000",
            rating: 4.3,
            specs: {
                sensor: "1/1.9\" 27MP",
                video: "5.3K 60fps",
                estabilizacao: "HyperSmooth 6.0",
                resistencia: "À prova d'água"
            },
            pros: ["Resistente", "Estabilização top", "5.3K", "Compacto"],
            cons: ["Sensor pequeno", "Preço alto", "Bateria curta", "Sem visor"],
            bestFor: "Ação e esportes",
            link: "https://gopro.com/br/hero12-black"
        },
        {
            name: "Nikon Z30",
            price: "R$ 4.500 - R$ 5.500",
            rating: 4.2,
            specs: {
                sensor: "APS-C 20MP",
                video: "4K 30fps",
                autofocus: "209 pontos",
                estabilizacao: "Digital"
            },
            pros: ["Focado em vídeo", "Preço justo", "Lentes Nikon", "Bateria boa"],
            cons: ["Sem estabilização", "Sem visor", "Autofocus médio", "4K cropado"],
            bestFor: "Criadores de conteúdo Nikon",
            link: "https://www.nikon.com.br/mirrorless/z30"
        },
        {
            name: "Insta360 X4",
            price: "R$ 4.000 - R$ 5.000",
            rating: 4.4,
            specs: {
                sensor: "1/2\" 8MP",
                video: "8K 30fps",
                estabilizacao: "360°",
                resistencia: "À prova d'água"
            },
            pros: ["360°", "8K", "Invisível selfie stick", "Estabilização"],
            cons: ["Sensor pequeno", "Preço alto", "Bateria curta", "Complexo editar"],
            bestFor: "Ação 360° e criativos",
            link: "https://www.insta360.com/product/insta360-x4"
        },
        {
            name: "Sony A6700",
            price: "R$ 7.000 - R$ 9.000",
            rating: 4.5,
            specs: {
                sensor: "APS-C 26MP",
                video: "4K 120fps",
                autofocus: "759 pontos",
                estabilizacao: "5 eixos"
            },
            pros: ["Autofocus top", "4K 120fps", "Lentes Sony", "Compacto"],
            cons: ["Preço alto", "Sem visor", "Bateria média", "Menu Sony"],
            bestFor: "Criadores de conteúdo avançados",
            link: "https://www.sony.com/br/electronics/interchangeable-lens-cameras/ilce-6700"
        }
    ],
    games: [
        {
            name: "PlayStation 5",
            price: "R$ 3.500 - R$ 4.500",
            rating: 4.7,
            specs: {
                cpu: "AMD Zen 2 8-core",
                gpu: "AMD RDNA 2 10.28 TFLOPS",
                armazenamento: "825GB SSD",
                saida: "4K 120Hz"
            },
            pros: ["Exclusivos incríveis", "DualSense inovador", "4K nativo", "SSD rápido"],
            cons: ["Caro no Brasil", "Sem retrocompatibilidade total", "Design grande", "Sem Game Pass"],
            bestFor: "Quem quer exclusivos Sony e experiência premium",
            link: "https://www.playstation.com/ps5"
        },
        {
            name: "Xbox Series X",
            price: "R$ 3.000 - R$ 4.000",
            rating: 4.6,
            specs: {
                cpu: "AMD Zen 2 8-core",
                gpu: "AMD RDNA 2 12 TFLOPS",
                armazenamento: "1TB SSD",
                saida: "4K 120Hz"
            },
            pros: ["Game Pass", "Power mais forte", "Retrocompatibilidade", "Quick Resume"],
            cons: ["Menos exclusivos", "Design grande", "Controle básico", "Sem inovação"],
            bestFor: "Quem quer Game Pass e melhor custo-benefício",
            link: "https://www.xbox.com/pt-BR/consoles/xbox-series-x"
        },
        {
            name: "Nintendo Switch OLED",
            price: "R$ 2.000 - R$ 2.500",
            rating: 4.5,
            specs: {
                cpu: "NVIDIA Tegra X1",
                gpu: "NVIDIA Tegra X1",
                armazenamento: "64GB",
                tela: "7\" OLED"
            },
            pros: ["Portátil", "Exclusivos Nintendo", "Tela OLED", "Joy-Con"],
            cons: ["Hardware fraco", "720p handheld", "Caro", "Sem 4K"],
            bestFor: "Quem quer portabilidade e jogos Nintendo",
            link: "https://www.nintendo.com/switch"
        },
        {
            name: "Xbox Series S",
            price: "R$ 2.000 - R$ 2.500",
            rating: 4.3,
            specs: {
                cpu: "AMD Zen 2 8-core",
                gpu: "AMD RDNA 2 4 TFLOPS",
                armazenamento: "512GB SSD",
                saida: "1080p 120Hz"
            },
            pros: ["Barato", "Game Pass", "Compacto", "Digital only"],
            cons: ["Sem disco", "1080p apenas", "Armazenamento pequeno", "Power menor"],
            bestFor: "Orçamento limitado com Game Pass",
            link: "https://www.xbox.com/pt-BR/consoles/xbox-series-s"
        },
        {
            name: "PlayStation 5 Digital",
            price: "R$ 3.200 - R$ 4.000",
            rating: 4.6,
            specs: {
                cpu: "AMD Zen 2 8-core",
                gpu: "AMD RDNA 2 10.28 TFLOPS",
                armazenamento: "825GB SSD",
                saida: "4K 120Hz"
            },
            pros: ["Mais barato", "Exclusivos Sony", "4K nativo", "SSD rápido"],
            cons: ["Sem drive de disco", "Depende de digital", "Preço ainda alto", "Design grande"],
            bestFor: "Quem quer PS5 e só compra digital",
            link: "https://www.playstation.com/ps5"
        },
        {
            name: "Nintendo Switch Lite",
            price: "R$ 1.200 - R$ 1.500",
            rating: 4.2,
            specs: {
                cpu: "NVIDIA Tegra X1",
                gpu: "NVIDIA Tegra X1",
                armazenamento: "32GB",
                tela: "5.5\" LCD"
            },
            pros: ["Muito barato", "Portátil", "Leve", "Exclusivos Nintendo"],
            cons: ["Sem dock", "Sem Joy-Con removíveis", "Tela pequena", "Hardware fraco"],
            bestFor: "Orçamento limitado e portabilidade",
            link: "https://www.nintendo.com/switch/lite"
        },
        {
            name: "Steam Deck OLED",
            price: "R$ 3.500 - R$ 4.500",
            rating: 4.4,
            specs: {
                cpu: "AMD Zen 2 4-core",
                gpu: "AMD RDNA 2 8 TFLOPS",
                armazenamento: "512GB - 1TB SSD",
                tela: "7.4\" OLED"
            },
            pros: ["PC portátil", "Steam", "Tela OLED", "Upgrade SSD"],
            cons: ["Caro", "Bateria curta", "Pesado", "Linux"],
            bestFor: "Gamers PC que quer portabilidade",
            link: "https://www.steamdeck.com"
        },
        {
            name: "ASUS ROG Ally",
            price: "R$ 3.000 - R$ 4.000",
            rating: 4.3,
            specs: {
                cpu: "AMD Zen 4 4-core",
                gpu: "AMD RDNA 3 8 TFLOPS",
                armazenamento: "512GB SSD",
                tela: "7\" IPS 120Hz"
            },
            pros: ["Windows", "120Hz", "Power forte", "Compacto"],
            cons: ["Bateria curta", "Aquece", "Preço alto", "Windows no handheld"],
            bestFor: "Gamers Windows portáteis",
            link: "https://www.asus.com/br/gaming-handhelds/rog-ally"
        },
        {
            name: "PlayStation 4 Pro",
            price: "R$ 1.800 - R$ 2.200",
            rating: 4.1,
            specs: {
                cpu: "AMD Jaguar 8-core",
                gpu: "AMD GCN 4.2 TFLOPS",
                armazenamento: "1TB HDD",
                saida: "4K 30fps"
            },
            pros: ["Barato", "Exclusivos Sony", "4K", "Biblioteca grande"],
            cons: ["Hardware antigo", "30fps apenas", "Sem SSD", "Geração antiga"],
            bestFor: "Orçamento limitado com exclusivos Sony",
            link: "https://www.playstation.com/ps4"
        },
        {
            name: "Xbox One X",
            price: "R$ 1.500 - R$ 2.000",
            rating: 4.0,
            specs: {
                cpu: "AMD Jaguar 8-core",
                gpu: "AMD GCN 6 TFLOPS",
                armazenamento: "1TB HDD",
                saida: "4K 30fps"
            },
            pros: ["Barato", "4K", "Game Pass", "Retrocompatibilidade"],
            cons: ["Hardware antigo", "30fps apenas", "Sem SSD", "Geração antiga"],
            bestFor: "Orçamento limitado com Game Pass",
            link: "https://www.xbox.com/pt-BR/consoles/xbox-one-x"
        }
    ],
    eletrodomesticos: [
        {
            name: "Samsung Neo QLED 8K 75\"",
            price: "R$ 25.000 - R$ 35.000",
            rating: 4.6,
            specs: {
                tela: "75\" 8K",
                tecnologia: "QLED",
                hdr: "HDR10+",
                smart: "Tizen"
            },
            pros: ["8K impressionante", "Cores vibrantes", "Smart TV bom", "Design fino"],
            cons: ["Muito caro", "Pouco conteúdo 8K", "Consumo alto", "Remoto complexo"],
            bestFor: "Quem quer a melhor qualidade de imagem",
            link: "https://www.samsung.com/br/tv/qled/"
        },
        {
            name: "LG OLED C3 65\"",
            price: "R$ 8.000 - R$ 12.000",
            rating: 4.8,
            specs: {
                tela: "65\" 4K",
                tecnologia: "OLED",
                hdr: "Dolby Vision",
                smart: "webOS"
            },
            pros: ["Preto perfeito", "Cores precisas", "Design fino", "webOS excelente"],
            cons: ["Burn-in risco", "Preço alto", "Brilho menor", "Não 8K"],
            bestFor: "Cinemófilos e gamers",
            link: "https://www.lg.com/br/tvs/lg-oled-tv-c3"
        },
        {
            name: "Samsung Galaxy Book3 Pro",
            price: "R$ 8.000 - R$ 12.000",
            rating: 4.5,
            specs: {
                processador: "Intel i7",
                ram: "16GB",
                armazenamento: "512GB SSD",
                tela: "16\" AMOLED"
            },
            pros: ["Tela AMOLED", "Leve", "Bateria boa", "Design elegante"],
            cons: ["Caro", "Sem GPU dedicada", "Portas limitadas", "Bloatware"],
            bestFor: "Profissionais móveis",
            link: "https://www.samsung.com/br/computing/galaxy-book/"
        },
        {
            name: "LG G3 OLED 55\"",
            price: "R$ 6.000 - R$ 8.000",
            rating: 4.7,
            specs: {
                tela: "55\" 4K",
                tecnologia: "OLED evo",
                hdr: "Dolby Vision",
                smart: "webOS"
            },
            pros: ["Brilho melhor", "Preto perfeito", "Design wireless", "webOS"],
            cons: ["Caro", "Burn-in risco", "Sem 8K", "Preço alto"],
            bestFor: "Quem quer OLED com mais brilho",
            link: "https://www.lg.com/br/tvs/lg-oled-tv-g3"
        },
        {
            name: "Samsung QLED 65\" Q80C",
            price: "R$ 4.000 - R$ 6.000",
            rating: 4.4,
            specs: {
                tela: "65\" 4K",
                tecnologia: "QLED",
                hdr: "HDR10+",
                smart: "Tizen"
            },
            pros: ["Preço bom", "Brilho alto", "Sem burn-in", "Smart TV"],
            cons: ["Preto não perfeito", "Cores menos precisas", "Design médio", "Bloatware"],
            bestFor: "Quem quer QLED com bom preço",
            link: "https://www.samsung.com/br/tv/qled/"
        },
        {
            name: "Philips OLED 55\" 808",
            price: "R$ 5.000 - R$ 7.000",
            rating: 4.5,
            specs: {
                tela: "55\" 4K",
                tecnologia: "OLED",
                hdr: "Dolby Vision",
                smart: "Google TV"
            },
            pros: ["Ambilight", "Preto perfeito", "Google TV", "Preço bom"],
            cons: ["Ambilight não para todos", "Menos brilho", "Suporte Philips", "Menu básico"],
            bestFor: "Quem quer Ambilight e OLED",
            link: "https://www.philips.com.br/tvs"
        },
        {
            name: "TCL 55\" C845",
            price: "R$ 3.000 - R$ 4.500",
            rating: 4.2,
            specs: {
                tela: "55\" 4K",
                tecnologia: "Mini LED",
                hdr: "Dolby Vision",
                smart: "Google TV"
            },
            pros: ["Preço baixo", "Mini LED", "Google TV", "144Hz"],
            cons: ["Qualidade de imagem média", "Suporte TCL", "Bloatware", "Build básico"],
            bestFor: "Orçamento limitado",
            link: "https://www.tcl.com.br/tvs"
        },
        {
            name: "Sony Bravia XR 65\" A95L",
            price: "R$ 12.000 - R$ 15.000",
            rating: 4.9,
            specs: {
                tela: "65\" 4K",
                tecnologia: "QD-OLED",
                hdr: "Dolby Vision",
                smart: "Google TV"
            },
            pros: ["Melhor imagem", "QD-OLED", "Processador XR", "Cores perfeitas"],
            cons: ["Muito caro", "Burn-in risco", "Brilho médio", "Preço premium"],
            bestFor: "Quem quer a melhor TV possível",
            link: "https://www.sony.com.br/tvs"
        },
        {
            name: "Hisense 55\" U8K",
            price: "R$ 3.500 - R$ 5.000",
            rating: 4.3,
            specs: {
                tela: "55\" 4K",
                tecnologia: "Mini LED",
                hdr: "Dolby Vision",
                smart: "Google TV"
            },
            pros: ["Preço bom", "Mini LED", "144Hz", "Google TV"],
            cons: ["Qualidade inconsistente", "Suporte Hisense", "Bloatware", "Menu básico"],
            bestFor: "Gamer com orçamento",
            link: "https://www.hisense.com.br/tvs"
        },
        {
            name: "Samsung Frame 55\"",
            price: "R$ 4.000 - R$ 6.000",
            rating: 4.4,
            specs: {
                tela: "55\" 4K",
                tecnologia: "QLED",
                hdr: "HDR10+",
                smart: "Tizen"
            },
            pros: ["Design arte", "Matte screen", "Ambiente mode", "Thin"],
            cons: ["Preço alto", "Performance básica", "Preto não perfeito", "Caro"],
            bestFor: "Decoração e ambiente",
            link: "https://www.samsung.com/br/tv/the-frame"
        }
    ],
    audio: [
        {
            name: "Sony WH-1000XM5",
            price: "R$ 2.500 - R$ 3.000",
            rating: 4.8,
            specs: {
                tipo: "Over-ear",
                cancelamento: "Ativo",
                bateria: "30 horas",
                bluetooth: "5.2"
            },
            pros: ["Melhor ANC", "Som excelente", "Confortável", "Design premium"],
            cons: ["Caro", "Sem dobrar", "Plástico", "Não resistente à água"],
            bestFor: "Viajantes e escritório",
            link: "https://www.sony.com/br/electronics/headphones/wh-1000xm5"
        },
        {
            name: "AirPods Pro 2",
            price: "R$ 2.000 - R$ 2.500",
            rating: 4.7,
            specs: {
                tipo: "In-ear",
                cancelamento: "Ativo",
                bateria: "6 horas",
                bluetooth: "5.3"
            },
            pros: ["ANC excelente", "Integração Apple", "Som bom", "Compacto"],
            cons: ["Caro", "Bateria curta", "Não Android", "Cabo Lightning"],
            bestFor: "Usuários Apple",
            link: "https://www.apple.com/br/airpods-pro"
        },
        {
            name: "JBL Flip 6",
            price: "R$ 500 - R$ 700",
            rating: 4.4,
            specs: {
                tipo: "Portátil",
                potencia: "30W",
                bateria: "12 horas",
                bluetooth: "5.3"
            },
            pros: ["Portátil", "Resistente à água", "Preço bom", "Som decente"],
            cons: ["Sem ANC", "Bateria média", "Sem app bom", "Grave fraco"],
            bestFor: "Uso outdoor e casual",
            link: "https://www.jbl.com/br/portable-speakers/jbl-flip-6"
        },
        {
            name: "Bose QuietComfort Ultra",
            price: "R$ 2.800 - R$ 3.500",
            rating: 4.7,
            specs: {
                tipo: "Over-ear",
                cancelamento: "Ativo",
                bateria: "24 horas",
                bluetooth: "5.3"
            },
            pros: ["ANC excelente", "Conforto top", "Som imersivo", "Design premium"],
            cons: ["Muito caro", "Bateria média", "Sem dobrar", "App Bose básico"],
            bestFor: "Quem quer o melhor ANC",
            link: "https://www.bose.com/br/headphones"
        },
        {
            name: "Sennheiser Momentum 4",
            price: "R$ 2.000 - R$ 2.500",
            rating: 4.5,
            specs: {
                tipo: "Over-ear",
                cancelamento: "Ativo",
                bateria: "60 horas",
                bluetooth: "5.2"
            },
            pros: ["Som excelente", "Bateria incrível", "Design elegante", "Confortável"],
            cons: ["ANC médio", "Caro", "Sem dobrar", "App básico"],
            bestFor: "Audiófilos e conforto",
            link: "https://www.sennheiser.com/br"
        },
        {
            name: "Marshall Emberton II",
            price: "R$ 800 - R$ 1.000",
            rating: 4.4,
            specs: {
                tipo: "Portátil",
                potencia: "20W",
                bateria: "30 horas",
                bluetooth: "5.1"
            },
            pros: ["Design retrô", "Som quente", "Bateria boa", "IP67"],
            cons: ["Sem ANC", "Grave médio", "Caro", "Sem app"],
            bestFor: "Quem quer design retrô",
            link: "https://www.marshallheadphones.com/br"
        },
        {
            name: "JBL Charge 5",
            price: "R$ 600 - R$ 800",
            rating: 4.3,
            specs: {
                tipo: "Portátil",
                potencia: "40W",
                bateria: "20 horas",
                bluetooth: "5.3"
            },
            pros: ["Powerbank", "Grave forte", "Resistente à água", "Preço bom"],
            cons: ["Grande", "Bateria média", "Sem ANC", "Grave distorcido no máximo"],
            bestFor: "Festas e outdoor",
            link: "https://www.jbl.com/br/portable-speakers/jbl-charge-5"
        },
        {
            name: "Anker Soundcore Motion+",
            price: "R$ 300 - R$ 400",
            rating: 4.1,
            specs: {
                tipo: "Portátil",
                potencia: "15W",
                bateria: "13 horas",
                bluetooth: "5.0"
            },
            pros: ["Barato", "Som decente", "Compacto", "Bateria boa"],
            cons: ["Grave fraco", "Build básico", "Sem app bom", "Sem IP"],
            bestFor: "Orçamento limitado",
            link: "https://www.anker.com/br/speakers"
        },
        {
            name: "Sony LinkBuds S",
            price: "R$ 600 - R$ 800",
            rating: 4.2,
            specs: {
                tipo: "In-ear",
                cancelamento: "Ativo",
                bateria: "6 horas",
                bluetooth: "5.2"
            },
            pros: ["Leve", "ANC bom", "Preço justo", "App Sony"],
            cons: ["Bateria curta", "Sem wireless charging", "Design peculiar", "Grave fraco"],
            bestFor: "Uso diário e corrida",
            link: "https://www.sony.com/br/electronics/headphones/linkbuds-s"
        },
        {
            name: "Samsung Galaxy Buds2 Pro",
            price: "R$ 700 - R$ 900",
            rating: 4.3,
            specs: {
                tipo: "In-ear",
                cancelamento: "Ativo",
                bateria: "5 horas",
                bluetooth: "5.3"
            },
            pros: ["ANC bom", "Som decente", "Compacto", "Samsung ecosystem"],
            cons: ["Bateria curta", "App Samsung", "Grave médio", "Fit pode ser desconfortável"],
            bestFor: "Usuários Samsung",
            link: "https://www.samsung.com/br/audio/galaxy-buds"
        }
    ],
    fitness: [
        {
            name: "Apple Watch Series 9",
            price: "R$ 4.000 - R$ 5.000",
            rating: 4.7,
            specs: {
                tela: "1.9\" OLED",
                bateria: "18 horas",
                gps: "Sim",
                resistencia: "50m"
            },
            pros: ["Melhor smartwatch", "Integração Apple", "Sensores avançados", "Design bonito"],
            cons: ["Caro", "Bateria curta", "Só iOS", "Carregador proprietário"],
            bestFor: "Usuários iPhone",
            link: "https://www.apple.com/br/apple-watch-series-9"
        },
        {
            name: "Garmin Forerunner 265",
            price: "R$ 2.500 - R$ 3.000",
            rating: 4.6,
            specs: {
                tela: "1.3\" AMOLED",
                bateria: "13 dias",
                gps: "Dual-band",
                resistencia: "50m"
            },
            pros: ["Bateria excelente", "GPS preciso", "Dados corrida", "Resistente"],
            cons: ["Design esportivo", "Caro", "App básico", "Sem smart features"],
            bestFor: "Corredores e triatletas",
            link: "https://www.garmin.com/br/product/forerunner-265"
        },
        {
            name: "Xiaomi Band 8",
            price: "R$ 300 - R$ 400",
            rating: 4.3,
            specs: {
                tela: "1.62\" AMOLED",
                bateria: "16 dias",
                gps: "Não",
                resistencia: "50m"
            },
            pros: ["Muito barato", "Bateria incrível", "Leve", "Funcionalidades básicas"],
            cons: ["Sem GPS", "Tela pequena", "App básico", "Qualidade construção"],
            bestFor: "Quem quer tracker básico barato",
            link: "https://www.mi.com/global/product/mi-smart-band-8/"
        },
        {
            name: "Samsung Galaxy Watch 6",
            price: "R$ 1.500 - R$ 2.000",
            rating: 4.4,
            specs: {
                tela: "1.5\" AMOLED",
                bateria: "40 horas",
                gps: "Sim",
                resistencia: "50m"
            },
            pros: ["Ecosystem Samsung", "Tela bonita", "Rotating bezel", "Android"],
            cons: ["Bateria curta", "Só Samsung", "App limitado", "Preço alto"],
            bestFor: "Usuários Samsung",
            link: "https://www.samsung.com/br/watches/galaxy-watch6"
        },
        {
            name: "Garmin Fenix 7",
            price: "R$ 4.000 - R$ 5.000",
            rating: 4.8,
            specs: {
                tela: "1.3\" MIP",
                bateria: "18 dias",
                gps: "Multi-band",
                resistencia: "100m"
            },
            pros: ["Bateria incrível", "Ultra resistente", "GPS topo", "Dados avançados"],
            cons: ["Muito caro", "Tela básica", "Design grande", "App complexo"],
            bestFor: "Aventureiros e atletas extremos",
            link: "https://www.garmin.com/br/product/fenix-7"
        },
        {
            name: "Fitbit Charge 6",
            price: "R$ 400 - R$ 500",
            rating: 4.2,
            specs: {
                tela: "1.04\" AMOLED",
                bateria: "7 dias",
                gps: "Sim",
                resistencia: "50m"
            },
            pros: ["Preço bom", "GPS integrado", "App Fitbit", "Leve"],
            cons: ["Bateria curta", "Sem smart features", "Tela pequena", "Limitado"],
            bestFor: "Iniciantes em fitness",
            link: "https://www.fitbit.com/br/charge6"
        },
        {
            name: "Amazfit GTS 4",
            price: "R$ 600 - R$ 800",
            rating: 4.1,
            specs: {
                tela: "1.65\" AMOLED",
                bateria: "14 dias",
                gps: "Sim",
                resistencia: "50m"
            },
            pros: ["Preço bom", "Bateria excelente", "Tela bonita", "GPS"],
            cons: ["App básico", "Qualidade construção", "Atualizações", "Suporte"],
            bestFor: "Orçamento com GPS",
            link: "https://www.amazfit.com/br/gts-4"
        },
        {
            name: "Polar Vantage V3",
            price: "R$ 3.000 - R$ 4.000",
            rating: 4.5,
            specs: {
                tela: "1.3\" AMOLED",
                bateria: "7 dias",
                gps: "Dual-band",
                resistencia: "50m"
            },
            pros: ["Dados precisos", "Bateria boa", "Design elegante", "GPS topo"],
            cons: ["Caro", "App Polar", "Sem smart features", "Suporte limitado"],
            bestFor: "Atletas sérios",
            link: "https://www.polar.com/br/vantage-v3"
        },
        {
            name: "Huawei Watch GT 4",
            price: "R$ 1.000 - R$ 1.500",
            rating: 4.2,
            specs: {
                tela: "1.43\" AMOLED",
                bateria: "14 dias",
                gps: "Sim",
                resistencia: "50m"
            },
            pros: ["Bateria excelente", "Design elegante", "Preço bom", "GPS"],
            cons: ["App Huawei", "Limitado Android", "Sem NFC no Brasil", "Suporte"],
            bestFor: "Quem quer elegante com bateria",
            link: "https://www.huawei.com/br/watches/gt-4"
        },
        {
            name: "Coros Pace 3",
            price: "R$ 1.800 - R$ 2.500",
            rating: 4.4,
            specs: {
                tela: "1.3\" AMOLED",
                bateria: "24 dias",
                gps: "Dual-band",
                resistencia: "50m"
            },
            pros: ["Bateria incrível", "GPS preciso", "Preço bom", "Dados corrida"],
            cons: ["App básico", "Design esportivo", "Sem smart features", "Suporte"],
            bestFor: "Corredores com orçamento",
            link: "https://www.coros.com/br/pace-3"
        }
    ]
};

// Comparação rápida
async function quickCompare() {
    const item1 = document.getElementById('item1').value.toLowerCase();
    const item2 = document.getElementById('item2').value.toLowerCase();
    
    if (!item1 || !item2) {
        alert('Digite os dois produtos para comparar!');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultados').style.display = 'none';
    
    // Simular delay da IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Buscar produtos
    let product1 = null;
    let product2 = null;
    
    for (const category in productDatabase) {
        const products = productDatabase[category];
        for (const product of products) {
            if (product.name.toLowerCase().includes(item1) && !product1) {
                product1 = { ...product, category };
            }
            if (product.name.toLowerCase().includes(item2) && !product2) {
                product2 = { ...product, category };
            }
        }
    }
    
    // Esconder loading
    document.getElementById('loading').style.display = 'none';
    
    // Mostrar resultados
    const resultsDiv = document.getElementById('aiResults');
    const resultsSection = document.getElementById('resultados');
    
    if (!product1 || !product2) {
        resultsDiv.innerHTML = `
            <div class="ai-result">
                <h3>Produtos não encontrados</h3>
                <p>Tente buscar por: iPhone, Samsung, Civic, MacBook, PlayStation, etc.</p>
            </div>
        `;
    } else {
        const winner = product1.rating > product2.rating ? product1 : product2;
        
        let html = `
            <div class="ai-result" style="${product1 === winner ? 'border-left: 4px solid #28a745;' : ''}">
                <h3>${product1.name} ${product1 === winner ? '🏆' : ''}</h3>
                <p><strong>Categoria:</strong> ${product1.category.charAt(0).toUpperCase() + product1.category.slice(1)}</p>
                <p><strong>Preço:</strong> ${product1.price}</p>
                <p><strong>Nota:</strong> ${'★'.repeat(Math.floor(product1.rating))} ${product1.rating}/5</p>
                <div class="specs">
                    <strong>Especificações:</strong><br>
                    ${Object.entries(product1.specs).map(([key, value]) => 
                        `<strong>${key}:</strong> ${value}`
                    ).join('<br>')}
                </div>
                <p style="margin-top: 1rem;"><strong>Prós:</strong> ${product1.pros.join(', ')}</p>
                <p><strong>Contras:</strong> ${product1.cons.join(', ')}</p>
                <a href="${product1.link}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: bold;">Ver mais →</a>
            </div>
            <div class="ai-result" style="${product2 === winner ? 'border-left: 4px solid #28a745;' : ''}">
                <h3>${product2.name} ${product2 === winner ? '🏆' : ''}</h3>
                <p><strong>Categoria:</strong> ${product2.category.charAt(0).toUpperCase() + product2.category.slice(1)}</p>
                <p><strong>Preço:</strong> ${product2.price}</p>
                <p><strong>Nota:</strong> ${'★'.repeat(Math.floor(product2.rating))} ${product2.rating}/5</p>
                <div class="specs">
                    <strong>Especificações:</strong><br>
                    ${Object.entries(product2.specs).map(([key, value]) => 
                        `<strong>${key}:</strong> ${value}`
                    ).join('<br>')}
                </div>
                <p style="margin-top: 1rem;"><strong>Prós:</strong> ${product2.pros.join(', ')}</p>
                <p><strong>Contras:</strong> ${product2.cons.join(', ')}</p>
                <a href="${product2.link}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: bold;">Ver mais →</a>
            </div>
            <div class="ai-result" style="background: #d4edda; border-left: 4px solid #28a745;">
                <h3>🏆 Vencedor: ${winner.name}</h3>
                <p>Com base nas especificações e avaliações, <strong>${winner.name}</strong> é a melhor opção.</p>
                <p><strong>Motivo:</strong> Nota mais alta (${winner.rating}/5) e melhor equilíbrio de características.</p>
            </div>
        `;
        resultsDiv.innerHTML = html;
    }
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Mostrar categoria
function showCategory(category) {
    const products = productDatabase[category];
    if (!products) return;
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    let html = `<h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>`;
    
    products.forEach(product => {
        html += `
            <div class="ai-result">
                <h3>${product.name}</h3>
                <p><strong>Preço:</strong> ${product.price}</p>
                <p><strong>Nota:</strong> ${'★'.repeat(Math.floor(product.rating))} ${product.rating}/5</p>
                <p><strong>Melhor para:</strong> ${product.bestFor}</p>
                <div class="specs">
                    <strong>Especificações:</strong><br>
                    ${Object.entries(product.specs).map(([key, value]) => 
                        `<strong>${key}:</strong> ${value}`
                    ).join('<br>')}
                </div>
                <p style="margin-top: 1rem;"><strong>Prós:</strong> ${product.pros.join(', ')}</p>
                <p><strong>Contras:</strong> ${product.cons.join(', ')}</p>
                <a href="${product.link}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: bold;">Ver mais →</a>
            </div>
        `;
    });
    
    modalBody.innerHTML = html;
    modal.style.display = 'block';
}

// Fechar modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Função para abrir checkout
function openCheckout(plan) {
    if (plan === 'pro') {
        // Redirecionar para Stripe ou plataforma de pagamento
        // Você pode usar Stripe, Pagar.me, Hotmart, etc.
        alert('Redirecionando para checkout do plano PRO...\n\nPara implementar pagamento real, você precisa:\n1. Criar conta no Stripe (stripe.com)\n2. Criar produto e preço no Stripe\n3. Adicionar o link de checkout aqui\n\nPor enquanto, isso é apenas uma demonstração.');
        
        // Exemplo de como seria com Stripe:
        // window.location.href = 'https://checkout.stripe.com/SEU_LINK_DE_CHECKOUT';
        
        // Exemplo com Hotmart:
        // window.location.href = 'https://pay.hotmart.com/SEU_LINK';
    } else if (plan === 'enterprise') {
        alert('Para plano Enterprise, entre em contato:\n\nEmail: contato@aicompare.com\nWhatsApp: +55 11 99999-9999\n\nResponderemos em até 24 horas.');
    }
}

// Limitar buscas para plano grátis
let searchCount = 0;
const MAX_FREE_SEARCHES = 50;

async function aiSearch() {
    // Verificar limite de buscas (simulação)
    if (searchCount >= MAX_FREE_SEARCHES) {
        const upgrade = confirm('Você atingiu o limite de 50 buscas diárias no plano grátis.\n\nQuer fazer upgrade para o plano PRO e ter buscas ilimitadas?');
        if (upgrade) {
            document.getElementById('precos').scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }
    
    searchCount++;

    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const priceFilter = document.getElementById('priceFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    if (!query) {
        alert('Digite algo para buscar!');
        return;
    }

    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultados').style.display = 'none';

    // Tentar usar API do DeepSeek primeiro
    let results = [];
    const aiResults = await callDeepSeekAPI(query, priceFilter, categoryFilter);

    if (aiResults && Array.isArray(aiResults) && aiResults.length > 0) {
        // Usar resultados da IA
        results = aiResults;
    } else {
        // Tentar Hugging Face como fallback se DeepSeek falhar
        console.log('DeepSeek falhou. Tentando Hugging Face...');
        const hfResults = await callHuggingFaceAPI(query, priceFilter, categoryFilter);

        if (hfResults && Array.isArray(hfResults) && hfResults.length > 0) {
            // Usar resultados do Hugging Face
            results = hfResults;
        } else {
            // Fallback para busca local se ambas as APIs falharem
            console.log('Hugging Face falhou. Usando busca local para:', query);
            const searchTerms = query.split(' ').filter(term => term.length > 2);

        for (const category in productDatabase) {
            // Aplicar filtro de categoria se selecionado
            if (categoryFilter !== 'all' && category !== categoryFilter) {
                continue;
            }
            const products = productDatabase[category];
            for (const product of products) {
                let match = false;
                let matchScore = 0;
                
                // Busca por nome exato ou parcial (prioridade alta)
                if (product.name.toLowerCase().includes(query)) {
                    matchScore += 10;
                    console.log('Match por nome:', product.name);
                }
                
                // Busca por categoria (prioridade média)
                if (category.toLowerCase().includes(query)) {
                    matchScore += 5;
                    console.log('Match por categoria:', category);
                }
                
                // Busca por especificações (prioridade baixa)
                for (const spec in product.specs) {
                    if (String(product.specs[spec]).toLowerCase().includes(query)) {
                        matchScore += 2;
                        console.log('Match por especificação:', spec, product.specs[spec]);
                    }
                }
                
                // Busca por termos múltiplos (AND - todos os termos devem estar presentes)
                if (searchTerms.length > 0) {
                    const allTermsMatch = searchTerms.every(term => 
                        product.name.toLowerCase().includes(term) ||
                        category.toLowerCase().includes(term) ||
                        Object.values(product.specs).some(spec => String(spec).toLowerCase().includes(term))
                    );
                    if (allTermsMatch) {
                        matchScore += 8;
                        console.log('Match por termos múltiplos (AND):', product.name);
                    }
                }
                
                // Só adiciona se tiver match suficiente (reduzido de 5 para 1 para ser mais inclusivo)
                if (matchScore >= 1) {
                    match = true;
                    results.push({ ...product, category, matchScore });
                }
            }
        }
        
        // Ordenar por relevância (matchScore)
        results.sort((a, b) => b.matchScore - a.matchScore);

        // Aplicar filtro de preço na busca local
        if (priceFilter !== 'all') {
            results = results.filter(product => {
                const priceStr = product.price;
                const priceMatch = priceStr.match(/R\$\s*([\d.,]+)/);
                if (!priceMatch) return true; // Se não conseguir extrair preço, inclui

                const price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'));
                const priceRange = priceStr.match(/R\$\s*([\d.,]+)\s*-\s*R\$\s*([\d.,]+)/);

                if (priceRange) {
                    const minPrice = parseFloat(priceRange[1].replace(/\./g, '').replace(',', '.'));
                    const maxPrice = parseFloat(priceRange[2].replace(/\./g, '').replace(',', '.'));
                    const avgPrice = (minPrice + maxPrice) / 2;

                    if (priceFilter === 'cheap') return avgPrice <= 1000;
                    if (priceFilter === 'medium') return avgPrice >= 1000 && avgPrice <= 5000;
                    if (priceFilter === 'expensive') return avgPrice > 5000;
                } else {
                    if (priceFilter === 'cheap') return price <= 1000;
                    if (priceFilter === 'medium') return price >= 1000 && price <= 5000;
                    if (priceFilter === 'expensive') return price > 5000;
                }

                return true;
            });
            console.log('Resultados após filtro de preço:', results.length);
        }

        // Limitar a 50 resultados (aumentado de 20)
        results = results.slice(0, 50);

        console.log('Resultados encontrados:', results.length);
        }
    }
    
    // Esconder loading
    document.getElementById('loading').style.display = 'none';
    
    // Mostrar resultados
    const resultsDiv = document.getElementById('aiResults');
    const resultsSection = document.getElementById('resultados');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="ai-result">
                <h3>Nenhum resultado encontrado para "${query}"</h3>
                <p>Tente buscar por:</p>
                <ul style="margin-left: 20px; margin-top: 10px;">
                    <li>Nome do produto: <strong>iPhone</strong>, <strong>Samsung</strong>, <strong>Civic</strong></li>
                    <li>Categoria: <strong>carros</strong>, <strong>celulares</strong>, <strong>notebooks</strong></li>
                    <li>Marca: <strong>Apple</strong>, <strong>Sony</strong>, <strong>Toyota</strong></li>
                </ul>
            </div>
        `;
    } else {
        let html = `<p style="margin-bottom: 1rem;"><strong>${results.length}</strong> resultado(s) encontrado(s) para "${query}"</p>`;
        if (searchCount >= MAX_FREE_SEARCHES - 1) {
            html += `<p style="color: #ffc107; margin-bottom: 1rem;">⚠️ Última busca gratuita do dia. Faça upgrade para PRO para buscas ilimitadas!</p>`;
        }
        results.forEach(product => {
            html += `
                <div class="ai-result">
                    <h3>${product.name}</h3>
                    <p><strong>Categoria:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <p><strong>Preço:</strong> ${product.price}</p>
                    <p><strong>Nota:</strong> ${'★'.repeat(Math.floor(product.rating))} ${product.rating}/5</p>
                    <p><strong>Melhor para:</strong> ${product.bestFor}</p>
                    <div class="specs">
                        <strong>Especificações:</strong><br>
                        ${Object.entries(product.specs).map(([key, value]) => 
                            `<strong>${key}:</strong> ${value}`
                        ).join('<br>')}
                    </div>
                    <p style="margin-top: 1rem;"><strong>Prós:</strong> ${product.pros.join(', ')}</p>
                    <p><strong>Contras:</strong> ${product.cons.join(', ')}</p>
                    <a href="${product.link}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: bold;">Ver mais →</a>
                </div>
            `;
        });
        resultsDiv.innerHTML = html;
    }
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Toggle Dark/Light Mode
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        // Ícone de sol para dark mode
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        localStorage.setItem('theme', 'dark');
    } else {
        // Ícone de lua para light mode
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        localStorage.setItem('theme', 'light');
    }
}

// Carregar tema salvo
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        }
    } else {
        if (themeIcon) {
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    }
}

// Carregar tema quando a página carregar
document.addEventListener('DOMContentLoaded', loadTheme);

// Funções de Login/Registro
let isLoginMode = true;

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('authError').style.display = 'none';
    document.getElementById('authLoading').style.display = 'none';
    document.getElementById('authSuccess').style.display = 'none';
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('loginForm').style.display = isLoginMode ? 'block' : 'none';
    document.getElementById('registerForm').style.display = isLoginMode ? 'none' : 'block';
    document.getElementById('authError').style.display = 'none';
}

function showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showAuthError('Por favor, preencha todos os campos.');
        return;
    }

    try {
        if (typeof firebase === 'undefined') {
            showAuthError('Firebase não configurado. Configure o Firebase no script.js.');
            return;
        }

        // Mostrar loading
        document.getElementById('authLoading').style.display = 'block';
        document.getElementById('authError').style.display = 'none';

        const auth = firebase.auth();
        await auth.signInWithEmailAndPassword(email, password);
        
        // Buscar plano do usuário
        const plan = await getUserPlan();
        
        // Esconder loading e mostrar sucesso
        document.getElementById('authLoading').style.display = 'none';
        document.getElementById('authSuccess').style.display = 'block';
        document.getElementById('authSuccessMessage').textContent = `Login realizado com sucesso! Plano: ${plan === 'pro' ? 'Pro' : 'Free'}`;
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
            closeLoginModal();
            updateLoginButton();
        }, 2000);
    } catch (error) {
        document.getElementById('authLoading').style.display = 'none';
        showAuthError('Erro ao fazer login: ' + error.message);
    }
}

async function handleRegister() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const plan = document.getElementById('registerPlan').value;

    if (!email || !password) {
        showAuthError('Por favor, preencha todos os campos.');
        return;
    }

    if (password.length < 6) {
        showAuthError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    try {
        if (typeof firebase === 'undefined') {
            showAuthError('Firebase não configurado. Configure o Firebase no script.js.');
            return;
        }

        // Mostrar loading
        document.getElementById('authLoading').style.display = 'block';
        document.getElementById('authError').style.display = 'none';

        const auth = firebase.auth();
        const db = firebase.firestore();

        // Criar usuário
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Salvar plano do usuário no Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            plan: plan,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Esconder loading e mostrar sucesso
        document.getElementById('authLoading').style.display = 'none';
        document.getElementById('authSuccess').style.display = 'block';
        document.getElementById('authSuccessMessage').textContent = `Cadastro realizado com sucesso! Plano: ${plan === 'pro' ? 'Pro' : 'Free'}`;
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
            closeLoginModal();
            updateLoginButton();
        }, 2000);
    } catch (error) {
        document.getElementById('authLoading').style.display = 'none';
        showAuthError('Erro ao fazer cadastro: ' + error.message);
    }
}

function updateLoginButton() {
    const auth = firebase.auth();
    const loginBtn = document.getElementById('loginBtn');

    auth.onAuthStateChanged((user) => {
        if (user) {
            loginBtn.textContent = 'Sair';
            loginBtn.onclick = handleLogout;
        } else {
            loginBtn.textContent = 'Entrar';
            loginBtn.onclick = openLoginModal;
        }
    });
}

async function handleLogout() {
    try {
        const auth = firebase.auth();
        await auth.signOut();
        updateLoginButton();
        // Logout realizado silenciosamente
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Verificar plano do usuário
async function getUserPlan() {
    try {
        if (typeof firebase === 'undefined') {
            return 'free';
        }

        const auth = firebase.auth();
        const user = auth.currentUser;

        if (!user) {
            return 'free';
        }

        const db = firebase.firestore();
        const doc = await db.collection('users').doc(user.uid).get();

        if (doc.exists) {
            return doc.data().plan;
        }

        return 'free';
    } catch (error) {
        console.error('Erro ao verificar plano:', error);
        return 'free';
    }
}

// Inicializar verificação de login
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    updateLoginButton();
});
