// import './style.css' // Mantido se style.css for um módulo ou importado em outro lugar
// import javascriptLogo from './javascript.svg' // Removido: SVG não é módulo JS
// import { setupCounter } from './counter.js' // Removido: não parece ser usado
// import './carrinho.js' // Removido: já incluído via script tag no HTML
// import './avaliacoes.js' // Removido: já incluído via script tag no HTML

console.log('main.js iniciado');

// Definir se o modo admin está ativo
const ENABLE_ADMIN = true; // Mude para false para desativar o admin
window.ENABLE_ADMIN = ENABLE_ADMIN; // Tornar a flag admin globalmente acessível

// O conteúdo do cardápio está no index.html

// Inicialização do painel admin (condicional)
if (ENABLE_ADMIN) {
    // A instância admin já foi criada em admin.js
    console.log('Admin panel habilitado');
}

(function() {
    console.log('IIFE em main.js executada');

    // Itens iniciais do menu
    const initialMenuItems = [
        // COMBOS PROMOCIONAIS
        {
            id: 1,
            name: 'Combo 1',
            price: 45.00,
            description: '2 Cachorros Simples\n1 Fruki 2 Lts',
            category: 'COMBOS PROMOCIONAIS'
        },
        {
            id: 2,
            name: 'Combo 2',
            price: 55.00,
            description: '2 Xis Salada\n1 Fruki 2 Lts',
            category: 'COMBOS PROMOCIONAIS'
        },
        {
            id: 3,
            name: 'Combo 3',
            price: 57.00,
            description: '2 Cachorros Simples\n1 porção fritas (200g)\n1 Fruki 2 Lts',
            category: 'COMBOS PROMOCIONAIS'
        },
        {
            id: 4,
            name: 'Combo 4',
            price: 67.00,
            description: '2 Xis Salada\n1 porção fritas (200g)\n1 Fruki 2 Lts',
            category: 'COMBOS PROMOCIONAIS'
        },
        {
            id: 5,
            name: 'Combo 5',
            price: 80.00,
            description: '3 Xis Salada\n1 Fruki 2 Lts',
            category: 'COMBOS PROMOCIONAIS'
        },
        {
            id: 6,
            name: 'Combo 6',
            price: 92.00,
            description: '3 Xis Salada\n1 porção fritas (200g)\n1 Fruki 2 Lts',
            category: 'COMBOS PROMOCIONAIS'
        },

        // XIS
        {
            id: 7,
            name: 'Xis Salada',
            price: 25.00,
            description: 'Pão, milho, ervilha, maionese, tomate, ovo, tempero verde, alface, catchup, mostarda, queijo, presunto e bife',
            category: 'XIS'
        },
        {
            id: 8,
            name: 'Xis Frango',
            price: 26.00,
            description: 'Pão, milho, ervilha, maionese, tomate, ovo, tempero verde, alface, catchup, mostarda, queijo, presunto e frango',
            category: 'XIS'
        },
        {
            id: 9,
            name: 'Xis Calabresa',
            price: 28.00,
            description: 'Pão, milho, ervilha, maionese, tomate, ovo, tempero verde, alface, catchup, mostarda, queijo, presunto e calabresa',
            category: 'XIS'
        },
        {
            id: 10,
            name: 'Xis Bacon',
            price: 30.00,
            description: 'Pão, milho, ervilha, maionese, tomate, ovo, tempero verde, alface, catchup, mostarda, queijo, presunto e bacon',
            category: 'XIS'
        },
        {
            id: 11,
            name: 'Xis Coração',
            price: 32.00,
            description: 'Pão, milho, ervilha, maionese, tomate, ovo, tempero verde, alface, catchup, mostarda, queijo, presunto e coração',
            category: 'XIS'
        },
        {
            id: 12,
            name: 'Xis Tudo',
            price: 32.00,
            description: 'Pão, milho, ervilha, maionese, tomate, ovo, tempero verde, alface, catchup, mostarda, queijo, presunto, bife, frango, calabresa e coração',
            category: 'XIS'
        },

        // CACHORRO-QUENTE
        {
            id: 18,
            name: 'Cachorro-Quente de Entreveiro',
            price: 35.00,
            description: 'Delicioso pão macio recheado com uma combinação irresistível de carnes: carne bovina, suína, frango, calabresa e bacon. Acompanhado de milho, ervilha, batata palha crocante, ketchup e mostarda.\nAdicionais opcionais: cebola e pimentão.',
            category: 'CACHORRO-QUENTE'
        },
        {
            id: 13,
            name: 'Cachorro Simples',
            price: 20.00,
            description: 'Pão, molho de salsicha, catchup, mostarda, milho, ervilha, batata palha e tempero verde',
            category: 'CACHORRO-QUENTE'
        },
        {
            id: 14,
            name: 'Cachorro Duplo',
            price: 23.00,
            description: 'Pão, molho de salsicha, catchup, mostarda, milho, ervilha, batata palha e tempero verde (2 salsichas)',
            category: 'CACHORRO-QUENTE'
        },
        {
            id: 15,
            name: 'Cachorro Frango',
            price: 26.00,
            description: 'Pão, molho de salsicha, catchup, mostarda, milho, ervilha, batata palha e tempero verde',
            category: 'CACHORRO-QUENTE'
        },
        {
            id: 16,
            name: 'Cachorro Carne',
            price: 25.00,
            description: 'Pão, molho de salsicha, catchup, mostarda, milho, ervilha, batata palha e tempero verde',
            category: 'CACHORRO-QUENTE'
        },
        {
            id: 17,
            name: 'Cachorro Calabresa',
            price: 27.00,
            description: 'Pão, molho de salsicha, catchup, mostarda, milho, ervilha, batata palha e tempero verde',
            category: 'CACHORRO-QUENTE'
        },

        // ACOMPANHAMENTOS
        {
            id: 19,
            name: 'Batata Frita Tradicional',
            price: 4.00,
            description: 'Dentro do XIS',
            category: 'ACOMPANHAMENTOS'
        },
        {
            id: 20,
            name: 'Torrada com Ovo',
            price: 17.00,
            description: 'Pao de Xis, Catchup, Mostarda, Milho, Ervilha, Tomate, Ovo, Tempero Verde',
            category: 'ACOMPANHAMENTOS'
        },

        // PORÇÕES DE BATATA FRITA
        {
            id: 21,
            name: 'Porção 200g',
            price: 15.00,
            description: 'Batata frita',
            category: 'PORÇÕES DE BATATA FRITA'
        },
        {
            id: 22,
            name: 'Porção 280g',
            price: 20.00,
            description: 'Batata frita',
            category: 'PORÇÕES DE BATATA FRITA'
        },
        {
            id: 23,
            name: 'Porção 350g',
            price: 25.00,
            description: 'Batata frita',
            category: 'PORÇÕES DE BATATA FRITA'
        },
        {
            id: 24,
            name: 'Porção 400g',
            price: 30.00,
            description: 'Batata frita',
            category: 'PORÇÕES DE BATATA FRITA'
        },

        // PICADÃO FAMÍLIA
        {
            id: 25,
            name: 'Picadão 1 pessoa',
            price: 65.00,
            description: 'Ovo de codorna, azeitona, batata frita, polenta, queijo, carne bovina, coração, frango, calabresa e anel de cebola',
            category: 'PICADÃO FAMÍLIA'
        },
        {
            id: 26,
            name: 'Picadão 2 pessoas',
            price: 95.00,
            description: 'Ovo de codorna, azeitona, batata frita, polenta, queijo, carne bovina, coração, frango, calabresa e anel de cebola',
            category: 'PICADÃO FAMÍLIA'
        },
        {
            id: 27,
            name: 'Picadão 3 pessoas',
            price: 120.00,
            description: 'Ovo de codorna, azeitona, batata frita, polenta, queijo, carne bovina, coração, frango, calabresa e anel de cebola',
            category: 'PICADÃO FAMÍLIA'
        },
        {
            id: 28,
            name: 'Picadão 4 pessoas',
            price: 160.00,
            description: 'Ovo de codorna, azeitona, batata frita, polenta, queijo, carne bovina, coração, frango, calabresa e anel de cebola',
            category: 'PICADÃO FAMÍLIA'
        },

        // BEBIDAS
        {
            id: 29,
            name: 'Refrigerante lata',
            price: 6.00,
            description: 'Guaraná / Pepsi',
            category: 'BEBIDAS'
        },
        {
            id: 30,
            name: 'Refrigerante 2L',
            price: 12.00,
            description: 'Guaraná / Pepsi',
            category: 'BEBIDAS'
        },
        {
            id: 31,
            name: 'Cerveja lata',
            price: 7.00,
            description: 'Polar, Brahma, Skol e Skin',
            category: 'BEBIDAS'
        }
    ];

    // Carregar itens do localStorage ou salvar itens iniciais se não houver nada ou for inválido
    // Só faz sentido carregar/salvar itens via admin se o admin estiver habilitado
    if (ENABLE_ADMIN && admin) {
        const savedItems = admin.getMenuItems(); // Reutiliza o método que já lida com JSON.parse
        if (!savedItems || savedItems.length === 0) {
            admin.saveMenuItems(initialMenuItems);
            console.log('Itens iniciais salvos no localStorage (localStorage vazio ou inválido).');
        } else {
            console.log('Itens encontrados no localStorage.');
        }

        console.log('Chamando admin.updateMenuDisplay');
        // Atualizar exibição do menu com os itens carregados (ou iniciais)
        admin.updateMenuDisplay();

        // Inicializar funcionalidades de avaliação após exibir o menu
        if (window.inicializarAvaliacoesNoMenu) {
            window.inicializarAvaliacoesNoMenu();
        }
    } else {
        // Se admin desabilitado, ainda precisamos exibir o menu (talvez carregar de outra forma ou ter um HTML estático fallback)
        // Por enquanto, faremos nada aqui, o menu só aparecerá se admin estiver ON e itens no localStorage
        // Em uma aplicação real, você carregaria o menu de outra fonte aqui.
         console.log('Modo admin desabilitado. Menu não será carregado via admin.');
    }

    // Função para revelar elementos ao rolar
    function revealOnScroll() {
        const sections = document.querySelectorAll('.menu-section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    }

    // Adicionar evento de scroll
    window.addEventListener('scroll', revealOnScroll);

    // Revelar seções visíveis ao carregar a página
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded disparado em main.js');
        revealOnScroll();

        // Inicializar carrinho aqui para garantir que o DOM esteja pronto
        const cart = new ShoppingCart();
        window.cart = cart; // Tornar a instância cart globalmente acessível
    });
})();