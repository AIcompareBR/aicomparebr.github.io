// Configuração da API DeepSeek
const DEEPSEEK_API_KEY = 'sk-934213f8c61d4e5bb781640ddf9675fd'; // Substitua pela sua API key do DeepSeek
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

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

// Função para chamar a API do DeepSeek
async function callDeepSeekAPI(query) {
    if (DEEPSEEK_API_KEY === 'SUA_API_KEY_AQUI') {
        console.warn('API key do DeepSeek não configurada. Usando busca local.');
        return null;
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
                        content: `Busque informações reais sobre: "${query}". Forneça 3-5 produtos específicos que existem no mercado brasileiro atual, com preços realistas e detalhes completos.`
                    }
                ],
                temperature: 0.8,
                max_tokens: 3500
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
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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
    if (!query) {
        alert('Digite algo para buscar!');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultados').style.display = 'none';
    
    // Tentar usar API do DeepSeek primeiro
    let results = [];
    const aiResults = await callDeepSeekAPI(query);
    
    if (aiResults && Array.isArray(aiResults) && aiResults.length > 0) {
        // Usar resultados da IA
        results = aiResults;
    } else {
        // Fallback para busca local se API falhar ou não estiver configurada
        console.log('Usando busca local para:', query);
        const searchTerms = query.split(' ').filter(term => term.length > 2);
        
        for (const category in productDatabase) {
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
                
                // Só adiciona se tiver match suficiente
                if (matchScore >= 5) {
                    match = true;
                    results.push({ ...product, category, matchScore });
                }
            }
        }
        
        // Ordenar por relevância (matchScore)
        results.sort((a, b) => b.matchScore - a.matchScore);
        
        console.log('Resultados encontrados:', results.length);
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
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Carregar tema salvo
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        if (themeIcon) themeIcon.textContent = '🌙';
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
