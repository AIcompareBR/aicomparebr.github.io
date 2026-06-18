// Configuração da API DeepSeek
const DEEPSEEK_API_KEY = 'sk-934213f8c61d4e5bb781640ddf9675fd'; // Substitua pela sua API key do DeepSeek
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Função para chamar a API do DeepSeek
async function callDeepSeekAPI(query) {
    if (DEEPSEEK_API_KEY === 'sk-934213f8c61d4e5bb781640ddf9675fd') {
        console.warn('API key do DeepSeek não configurada. Usando busca local.');
        return null;
    }

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sk-934213f8c61d4e5bb781640ddf9675fd}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `Você é um assistente de comparação de produtos. O usuário vai buscar por produtos e você deve retornar informações relevantes em formato JSON.
                        
                        Base de dados disponível:
                        ${JSON.stringify(productDatabase, null, 2)}
                        
                        Se encontrar produtos correspondentes, retorne apenas o JSON com os produtos encontrados.
                        Se não encontrar, retorne null.
                        
                        Formato de resposta esperado:
                        [
                            {
                                "name": "Nome do produto",
                                "category": "categoria",
                                "price": "Preço",
                                "rating": 4.5,
                                "specs": {...},
                                "pros": [...],
                                "cons": [...],
                                "bestFor": "Melhor para...",
                                "link": "URL"
                            }
                        ]`
                    },
                    {
                        role: 'user',
                        content: `Busque por: ${query}`
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const content = data.choices[0].message.content;
            try {
                const parsed = JSON.parse(content);
                return parsed;
            } catch (e) {
                console.error('Erro ao parsear resposta da IA:', e);
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
            price: "R$ 4.000 - R$ 5.000",
            rating: 4.7,
            specs: {
                armazenamento: "825GB SSD",
                resolucao: "4K/8K",
                fps: " até 120fps",
                exclusivos: "God of War, Spider-Man"
            },
            pros: ["Exclusivos incríveis", "DualSense inovador", "Design bonito", "SSD rápido"],
            cons: ["Caro no Brasil", "Sem retrocompatibilidade total", "Grande", "Jogos caros"],
            bestFor: "Quem quer exclusivos PlayStation",
            link: "https://www.playstation.com/pt-br/ps5"
        },
        {
            name: "Xbox Series X",
            price: "R$ 4.500 - R$ 5.500",
            rating: 4.5,
            specs: {
                armazenamento: "1TB SSD",
                resolucao: "4K",
                fps: " até 120fps",
                exclusivos: "Halo, Forza"
            },
            pros: ["Game Pass", "Retrocompatibilidade total", "Potência bruta", "Design compacto"],
            cons: ["Menos exclusivos", "Caro", "Serviços limitados no Brasil", "Controle básico"],
            bestFor: "Quem quer Game Pass e retrocompatibilidade",
            link: "https://www.xbox.com/pt-BR/consoles/xbox-series-x"
        },
        {
            name: "Nintendo Switch OLED",
            price: "R$ 2.500 - R$ 3.000",
            rating: 4.4,
            specs: {
                tela: "7\" OLED",
                resolucao: "720p",
                bateria: "4.5-9 horas",
                exclusivos: "Zelda, Mario, Pokemon"
            },
            pros: ["Portátil", "Exclusivos únicos", "Preço menor", "Família"],
            cons: ["Gráficos fracos", "720p only", "Joycon drift", "Online ruim"],
            bestFor: "Famílias e jogadores casuais",
            link: "https://www.nintendo.com/switch-oled-model"
        }
    ],
    eletro: [
        {
            name: "Samsung Neo QLED 8K",
            price: "R$ 15.000 - R$ 25.000",
            rating: 4.6,
            specs: {
                tela: "75\" 8K",
                tecnologia: "QLED",
                hdr: "HDR10+",
                smart: "Tizen"
            },
            pros: ["8K impressionante", "Cores vibrantes", "Smart TV bom", "Design fino"],
            cons: ["Muito caro", "Conteúdo 8K raro", "Consumo energia", "Tizen limitado"],
            bestFor: "Quem quer o melhor em qualidade de imagem",
            link: "https://www.samsung.com/br/tv"
        },
        {
            name: "LG OLED C3",
            price: "R$ 8.000 - R$ 15.000",
            rating: 4.8,
            specs: {
                tela: "55\"-65\" 4K",
                tecnologia: "OLED",
                hdr: "Dolby Vision",
                smart: "webOS"
            },
            pros: ["Preto perfeito", "Cores precisas", "Dolby Vision", "webOS excelente"],
            cons: ["Risco de burn-in", "Caro", "Brilho menor que QLED", "Reflexos"],
            bestFor: "Cinefilos e gamers",
            link: "https://www.lg.com/br/tv"
        },
        {
            name: "Geladeira Samsung Inverter",
            price: "R$ 4.000 - R$ 7.000",
            rating: 4.5,
            specs: {
                capacidade: "500L",
                tecnologia: "Inverter",
                frost: "Frost Free",
                consumo: "A++"
            },
            pros: ["Econômica", "Silenciosa", "Frost Free", "Design moderno"],
            cons: ["Caro", "Manutenção cara", "Peças Samsung", "Tamanho grande"],
            bestFor: "Famílias que quer economia e espaço",
            link: "https://www.samsung.com/br/home-appliances"
        }
    ],
    audio: [
        {
            name: "Sony WH-1000XM5",
            price: "R$ 2.000 - R$ 2.500",
            rating: 4.8,
            specs: {
                tipo: "Over-ear",
                cancelamento: "Ativo",
                bateria: "30 horas",
                bluetooth: "5.2"
            },
            pros: ["Melhor cancelamento", "Som excelente", "Confortável", "Multiponto"],
            cons: ["Caro", "Não dobrável", "Plástico barato", "Sem aux 3.5mm"],
            bestFor: "Quem quer o melhor cancelamento de ruído",
            link: "https://www.sony.com/br/headphones"
        },
        {
            name: "AirPods Pro 2",
            price: "R$ 1.800 - R$ 2.200",
            rating: 4.7,
            specs: {
                tipo: "In-ear",
                cancelamento: "Ativo",
                bateria: "6 horas",
                bluetooth: "5.3"
            },
            pros: ["Ecossistema Apple", "Cancelamento bom", "Som claro", "Compacto"],
            cons: ["Caro", "Bateria curta", "Só iOS", "Cabo Lightning"],
            bestFor: "Usuários iPhone",
            link: "https://www.apple.com/br/airpods-pro"
        },
        {
            name: "JBL Flip 6",
            price: "R$ 600 - R$ 800",
            rating: 4.4,
            specs: {
                tipo: "Portátil",
                potencia: "30W",
                bateria: "12 horas",
                resistencia: "IP67"
            },
            pros: ["Preço justo", "Resistente à água", "Som potente", "Portátil"],
            cons: ["Sem cancelamento", "Bateria média", "Bass fraco", "Sem app bom"],
            bestFor: "Quer caixa portátil resistente",
            link: "https://www.jbl.com/br"
        }
    ],
    fitness: [
        {
            name: "Apple Watch Ultra 2",
            price: "R$ 6.000 - R$ 7.000",
            rating: 4.8,
            specs: {
                tela: "1.92\" Retina",
                bateria: "36 horas",
                resistencia: "100m",
                gps: "Dual-frequency"
            },
            pros: ["Tela brilhante", "Bateria melhor", "Super resistente", "Ecossistema"],
            cons: ["Muito caro", "Só iOS", "Grande", "Pesado"],
            bestFor: "Atletas e usuários iPhone",
            link: "https://www.apple.com/br/apple-watch-ultra"
        },
        {
            name: "Garmin Fenix 7",
            price: "R$ 5.000 - R$ 7.000",
            rating: 4.7,
            specs: {
                tela: "1.3\" MIP",
                bateria: "18 dias",
                resistencia: "100m",
                gps: "Multi-GNSS"
            },
            pros: ["Bateria incrível", "GPS preciso", "Muitos esportes", "Super resistente"],
            cons: ["Caro", "Tela escura", "Interface complexa", "Pesado"],
            bestFor: "Atletas sérios e aventureiros",
            link: "https://www.garmin.com/br"
        },
        {
            name: "Xiaomi Band 8",
            price: "R$ 300 - R$ 400",
            rating: 4.3,
            specs: {
                tela: "1.62\" AMOLED",
                bateria: "16 dias",
                resistencia: "5ATM",
                gps: "Não"
            },
            pros: ["Preço imbatível", "Bateria excelente", "Leve", "Muitos modos"],
            cons: ["Sem GPS", "Build plástico", "App limitado", "Notificações básicas"],
            bestFor: "Quer fitness tracker barato",
            link: "https://www.mi.com/br"
        }
    ]
};

// Função de busca com IA (simulada)
async function aiSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) {
        alert('Digite algo para buscar!');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultados').style.display = 'none';
    
    // Simular delay da IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Buscar nos dados - busca mais flexível
    let results = [];
    const searchTerms = query.split(' ').filter(term => term.length > 2);
    
    for (const category in productDatabase) {
        const products = productDatabase[category];
        for (const product of products) {
            let match = false;
            
            // Busca por nome exato ou parcial
            if (product.name.toLowerCase().includes(query)) {
                match = true;
            }
            
            // Busca por categoria
            if (category.toLowerCase().includes(query)) {
                match = true;
            }
            
            // Busca por especificações
            for (const spec in product.specs) {
                if (String(product.specs[spec]).toLowerCase().includes(query)) {
                    match = true;
                }
            }
            
            // Busca por prós/contras
            if (product.pros.some(pro => pro.toLowerCase().includes(query))) {
                match = true;
            }
            
            // Busca por termos múltiplos
            if (searchTerms.length > 0) {
                const allTermsMatch = searchTerms.every(term => 
                    product.name.toLowerCase().includes(term) ||
                    category.toLowerCase().includes(term) ||
                    Object.values(product.specs).some(spec => String(spec).toLowerCase().includes(term))
                );
                if (allTermsMatch) match = true;
            }
            
            if (match) {
                results.push({ ...product, category });
            }
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
        const searchTerms = query.split(' ').filter(term => term.length > 2);
        
        for (const category in productDatabase) {
            const products = productDatabase[category];
            for (const product of products) {
                let match = false;
                
                // Busca por nome exato ou parcial
                if (product.name.toLowerCase().includes(query)) {
                    match = true;
                }
                
                // Busca por categoria
                if (category.toLowerCase().includes(query)) {
                    match = true;
                }
                
                // Busca por especificações
                for (const spec in product.specs) {
                    if (String(product.specs[spec]).toLowerCase().includes(query)) {
                        match = true;
                    }
                }
                
                // Busca por prós/contras
                if (product.pros.some(pro => pro.toLowerCase().includes(query))) {
                    match = true;
                }
                
                // Busca por termos múltiplos
                if (searchTerms.length > 0) {
                    const allTermsMatch = searchTerms.every(term => 
                        product.name.toLowerCase().includes(term) ||
                        category.toLowerCase().includes(term) ||
                        Object.values(product.specs).some(spec => String(spec).toLowerCase().includes(term))
                    );
                    if (allTermsMatch) match = true;
                }
                
                if (match) {
                    results.push({ ...product, category });
                }
            }
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
