// Sistema de avaliações
let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || {};

// Lista de nomes para avaliações iniciais
const nomesIniciais = [
    "João Silva", "Maria Oliveira", "Lucas Souza", "Fernanda Lima",
    "Pedro Almeida", "Ana Costa", "Bruno Rodrigues", "Carolina Santos",
    "Rafael Pereira", "Isabela Gomes"
];

// Lista de comentários mais realistas
const comentariosDetalhadosIniciais = [
    "O xis é simplesmente o melhor que já comi na vida! Atendimento rápido e super educado. Recomendo muito! 🍔👌",
    "Gostei bastante do cachorro-quente, só achei que podia ter um pouco mais de maionese, mas no geral tudo perfeito.",
    "Entrega super rápida, tudo fresquinho. A batata frita estava crocante e saborosa. Vou pedir de novo com certeza!",
    "A porção de picadão família vale muito a pena, dá pra alimentar todo mundo! Só o refrigerante que poderia estar mais gelado.",
    "Muito bommm, chegou antes do previsto! Voces arrasam!",
    "Delicioso e bem servido. Primeira vez pedindo, virei cliente.",
    "Excelente qualidade e sabor. As estrelas fazem jus!",
    "Adorei a opção de retirada em loja, super prático e sem custo de entrega. O lanche estava quentinho.",
    "Perfeito para o fim de semana. O Xis Tudo é uma explosão de sabores.",
    "Saboroso como sempre! O pedido veio certinho e a embalagem é boa.",
    "Chegou super rápido! A batata frita estava quentinha e crocante.",
    "O atendimento pelo WhatsApp foi excelente, muito atenciosos.",
    "Muito bom, lanche bem recheado! 👍",
    "Faltou um pouco de sal na batata, mas o Xis compensou, muito saboroso!",
    "Pedido simples e rápido, ideal para uma refeição rápida."
];

// Novas listas de comentários por categoria
const comentariosPorCategoria = {
    "Xis": [
        "O xis é simplesmente o melhor que já comi na vida! Atendimento rápido e super educado. Recomendo muito! 🍔👌",
        "Perfeito para o fim de semana. O Xis Tudo é uma explosão de sabores.",
        "Muito bom, lanche bem recheado! 👍",
        "Faltou um pouco de sal na batata, mas o Xis compensou, muito saboroso!",
        "O Xis salada é leve e saboroso, uma ótima opção!",
        "Simplesmente o melhor Xis da região, ingredientes frescos e de qualidade."
    ],
    "Cachorro-Quente": [
        "Gostei bastante do cachorro-quente, só achei que podia ter um pouco mais de maionese, mas no geral tudo perfeito.",
        "Cachorro-quente bem montado e delicioso, chegou quentinho.",
        "Ótimo custo-benefício no cachorro-quente, bem servido.",
        "Sabor de infância, o cachorro-quente é caprichado!",
        "Pedi o cachorro-quente especial e adorei cada mordida."
    ],
    "Porção": [
        "Entrega super rápida, tudo fresquinho. A batata frita estava crocante e saborosa. Vou pedir de novo com certeza!",
        "A porção de picadão família vale muito a pena, dá pra alimentar todo mundo! Só o refrigerante que poderia estar mais gelado.",
        "Chegou super rápido! A batata frita estava quentinha e crocante.",
        "Porção generosa e muito saborosa, ideal para compartilhar.",
        "Adorei a porção de aipim, sequinha e crocante!"
    ],
    "Geral": [
        "Muito bommm, chegou antes do previsto! Voces arrasam!",
        "Delicioso e bem servido. Primeira vez pedindo, virei cliente.",
        "Excelente qualidade e sabor. As estrelas fazem jus!",
        "Adorei a opção de retirada em loja, super prático e sem custo de entrega. O lanche estava quentinho.",
        "Saboroso como sempre! O pedido veio certinho e a embalagem é boa.",
        "O atendimento pelo WhatsApp foi excelente, muito atenciosos.",
        "Pedido simples e rápido, ideal para uma refeição rápida."
    ]
};

function mostrarDialogAvaliacao(nomePrato) {
    const dialog = document.createElement('div');
    dialog.className = 'avaliacao-dialog';
    dialog.innerHTML = `
        <div class="avaliacao-content">
            <h3>Avaliar: ${nomePrato}</h3>
            <div class="estrelas">
                ${[1, 2, 3, 4, 5].map(num => `
                    <span class="estrela" data-valor="${num}">★</span>
                `).join('')}
            </div>
            <textarea placeholder="Deixe seu comentário (opcional)" class="comentario-avaliacao"></textarea>
            <div class="dialog-buttons">
                <button onclick="enviarAvaliacao('${nomePrato}')">Enviar Avaliação</button>
                <button onclick="fecharDialogAvaliacao()">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);

    // Adicionar eventos para as estrelas
    const estrelas = dialog.querySelectorAll('.estrela');
    estrelas.forEach(estrela => {
        estrela.addEventListener('mouseover', () => {
            const valor = parseInt(estrela.dataset.valor);
            estrelas.forEach(e => {
                e.style.color = parseInt(e.dataset.valor) <= valor ? '#FFD700' : '#ccc';
                e.style.transform = parseInt(e.dataset.valor) <= valor ? 'scale(1.2)' : 'scale(1)';
            });
        });
        estrela.addEventListener('click', () => {
            dialog.dataset.avaliacao = estrela.dataset.valor;
            estrelas.forEach(e => {
                e.style.color = parseInt(e.dataset.valor) <= valor ? '#FFD700' : '#ccc';
                e.style.transform = parseInt(e.dataset.valor) <= valor ? 'scale(1.2)' : 'scale(1)';
            });
        });
    });

    dialog.addEventListener('mouseleave', () => {
        const valorAtual = dialog.dataset.avaliacao || 0;
        estrelas.forEach(e => {
            e.style.color = parseInt(e.dataset.valor) <= valorAtual ? '#FFD700' : '#ccc';
            e.style.transform = parseInt(e.dataset.valor) <= valorAtual ? 'scale(1.2)' : 'scale(1)';
        });
    });

    // Focar no textarea
    setTimeout(() => {
        dialog.querySelector('.comentario-avaliacao').focus();
    }, 100);
}

function enviarAvaliacao(nomePrato) {
    const dialog = document.querySelector('.avaliacao-dialog');
    const valor = parseInt(dialog.dataset.avaliacao) || 0;
    const comentario = dialog.querySelector('.comentario-avaliacao').value;
    
    // Para avaliações reais, não pegamos nome. Poderíamos adicionar um campo no dialog se quiséssemos coletar o nome real.
    const nome = "Cliente"; // Nome genérico para avaliações reais, ou coletar do usuário

    if (valor === 0) {
        alert('Por favor, selecione uma avaliação!');
        return;
    }

    if (!avaliacoes[nomePrato]) {
        avaliacoes[nomePrato] = [];
    }

    avaliacoes[nomePrato].push({
        valor,
        comentario,
        data: new Date().toISOString(),
        nome: nome // Adiciona o campo nome
    });

    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
    fecharDialogAvaliacao();
    atualizarMediaAvaliacoes(nomePrato);
    
    // Mostrar mensagem de sucesso
    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-sucesso';
    mensagem.textContent = 'Avaliação enviada com sucesso!';
    document.body.appendChild(mensagem);
    
    setTimeout(() => {
        mensagem.remove();
    }, 3000);
}

function fecharDialogAvaliacao() {
    const dialog = document.querySelector('.avaliacao-dialog');
    if (dialog) {
        dialog.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(dialog);
        }, 300);
    }
}

function atualizarMediaAvaliacoes(nomePrato) {
    const pratoAvaliacoes = avaliacoes[nomePrato] || [];
    
    // Encontrar o item do menu pelo título
    const menuItems = document.querySelectorAll('.menu-item');
    const menuItem = Array.from(menuItems).find(item => 
        item.querySelector('h3').textContent === nomePrato
    );
    
    if (!menuItem) return;

    // Atualizar média
    if (pratoAvaliacoes.length > 0) {
        const media = pratoAvaliacoes.reduce((sum, av) => sum + av.valor, 0) / pratoAvaliacoes.length;
        let mediaElement = menuItem.querySelector('.media-avaliacao');
        
        if (!mediaElement) {
            mediaElement = document.createElement('div');
            mediaElement.className = 'media-avaliacao';
            const priceElement = menuItem.querySelector('.price');
            if (priceElement) {
                priceElement.parentNode.insertBefore(mediaElement, priceElement);
            }
        }
        
        mediaElement.innerHTML = `
            <div class="estrelas-media">
                ${[1, 2, 3, 4, 5].map(num => `
                    <span class="estrela" style="color: ${num <= Math.round(media) ? '#FFD700' : '#ccc'}">★</span>
                `).join('')}
            </div>
            <span class="media-valor">(${media.toFixed(1)})</span>
            <span class="contador-avaliacoes">${pratoAvaliacoes.length} avaliação${pratoAvaliacoes.length !== 1 ? 'ões' : ''}</span>
        `;
    }

    // Atualizar últimas avaliações
    const ultimasAvaliacoes = pratoAvaliacoes.slice(-2).reverse();
    let ultimasAvaliacoesContainer = menuItem.querySelector('.ultimas-avaliacoes');
    
    if (ultimasAvaliacoes.length > 0) {
        if (!ultimasAvaliacoesContainer) {
            ultimasAvaliacoesContainer = document.createElement('div');
            ultimasAvaliacoesContainer.className = 'ultimas-avaliacoes';
            
            // Encontrar o botão de adicionar ao carrinho
            const botaoCarrinho = menuItem.querySelector('.adicionar-carrinho');
            if (botaoCarrinho) {
                // Inserir após o botão
                botaoCarrinho.parentNode.insertBefore(ultimasAvaliacoesContainer, botaoCarrinho.nextSibling);
            }
        }
        
        const ultimasAvaliacoesHTML = ultimasAvaliacoes.map(av => `
            <div class="ultima-avaliacao${av.comentario ? '' : ' no-comment'}">
                <div class="estrelas-avaliacao">
                    ${[1, 2, 3, 4, 5].map(num => `
                        <span class="estrela" style="color: ${num <= av.valor ? '#FFD700' : '#ccc'}">★</span>
                    `).join('')}
                </div>
                ${av.comentario ? `<p class="comentario">${av.comentario}</p>` : ''}
                <span class="data-avaliacao"><strong class="nome-avaliador">${av.nome || 'Anônimo'}</strong> — <span class="data-texto">${av.data ? formatarDataAvaliacao(av.data) : 'Sem data'}</span></span>
            </div>
        `).join('');
        
        ultimasAvaliacoesContainer.innerHTML = ultimasAvaliacoesHTML;
    } else if (ultimasAvaliacoesContainer) {
        ultimasAvaliacoesContainer.remove();
    }
}

// Adicionar botão de avaliação em cada item do menu
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const nome = item.querySelector('h3').textContent;
        
        // Adicionar botão de avaliação
        const botaoAvaliar = document.createElement('button');
        botaoAvaliar.className = 'avaliar-prato';
        botaoAvaliar.textContent = 'Avaliar';
        botaoAvaliar.onclick = () => mostrarDialogAvaliacao(nome);
        item.appendChild(botaoAvaliar);

        // Atualizar média inicial
        atualizarMediaAvaliacoes(nome);
    });

    // Adicionar avaliações iniciais se não houver nenhuma
    const nomesPratos = Array.from(menuItems).map(item => item.querySelector('h3').textContent);
    popularAvaliacoesIniciais(nomesPratos);
});

function popularAvaliacoesIniciais(nomesPratos) {
    // Use a lista de comentários mais detalhados e nomes comuns para as avaliações iniciais
    // Determine a categoria do prato
    const determinarCategoria = (nomePrato) => {
        if (nomePrato.toLowerCase().includes('xis')) return 'Xis';
        if (nomePrato.toLowerCase().includes('cachorro-quente')) return 'Cachorro-Quente';
        if (nomePrato.toLowerCase().includes('porção') || nomePrato.toLowerCase().includes('batata')) return 'Porção';
        return 'Geral'; // Categoria padrão
    };

    const nomesParaUsar = [...nomesIniciais];

    nomesPratos.forEach(nomePrato => {
        if (!avaliacoes[nomePrato] || avaliacoes[nomePrato].length === 0) {
            avaliacoes[nomePrato] = [];
            const numAvaliacoes = Math.floor(Math.random() * 2) + 5; // 5 a 6 avaliações
            
            const categoria = determinarCategoria(nomePrato);
            const comentariosDisponiveis = [...(comentariosPorCategoria[categoria] || comentariosPorCategoria['Geral'])]; // Copia da lista de comentários da categoria ou geral
            let nomesDisponiveis = [...nomesParaUsar]; // Copia da lista de nomes

            // Embaralha os comentários para garantir variedade
            for (let i = comentariosDisponiveis.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [comentariosDisponiveis[i], comentariosDisponiveis[j]] = [comentariosDisponiveis[j], comentariosDisponiveis[i]];
            }

            for (let i = 0; i < numAvaliacoes; i++) {
                if (comentariosDisponiveis.length === 0 || nomesDisponiveis.length === 0) break; // Para se acabarem comentários ou nomes

                const valor = Math.floor(Math.random() * 3) + 3; // 3 a 5 estrelas
                
                // Seleciona e remove um comentário e um nome sequencialmente (ou aleatoriamente, mas sequencial evita repetição rápida)
                // Usando splice para remover e pegar o elemento
                const comentario = comentariosDisponiveis.splice(0, 1)[0]; // Pega o primeiro e remove

                // Embaralha os nomes e pega um
                 const indiceNome = Math.floor(Math.random() * nomesDisponiveis.length);
                 const nome = nomesDisponiveis.splice(indiceNome, 1)[0];
                
                // Gera uma data mais realista (entre alguns dias atrás e hoje)
                const diasAtras = Math.floor(Math.random() * 4); // Datas de hoje até 3 dias atrás
                const dataAvaliacao = new Date(Date.now() - diasAtras * 86400000).toISOString();

                avaliacoes[nomePrato].push({
                    valor,
                    comentario,
                    data: dataAvaliacao, // Usa a data gerada
                    nome: nome // Adiciona o nome
                });
            }
            // Garante que as avaliações mais recentes fiquem por último no array
            avaliacoes[nomePrato].sort((a, b) => new Date(a.data) - new Date(b.data));
            atualizarMediaAvaliacoes(nomePrato);
        }
    });
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
}

// Função auxiliar para formatar a data de exibição (pode ser melhorada para "há X dias")
function formatarDataAvaliacao(dataISO) {
    // Verifica se o input é uma string e não está vazio
    if (typeof dataISO !== 'string' || dataISO === '') {
        return "Data inválida"; // Retorna um texto indicativo ou vazio
    }

    const data = new Date(dataISO);
    // Verifica se a data criada é válida
    if (isNaN(data.getTime())) {
        return "Data inválida";
    }

    const agora = new Date();
    const diferencaEmDias = Math.floor((agora - data) / (1000 * 60 * 60 * 24));

    if (diferencaEmDias === 0) {
        return "hoje";
    } else if (diferencaEmDias === 1) {
        return "ontem";
    } else if (diferencaEmDias < 7) {
        return `há ${diferencaEmDias} dias`;
    } else if (diferencaEmDias < 30) {
        const semanas = Math.floor(diferencaEmDias / 7);
        return `há ${semanas} semana${semanas > 1 ? 's' : ''}`;
    } else {
        return data.toLocaleDateString();
    }
} 