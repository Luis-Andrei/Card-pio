// Sistema de avaliações
let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || {};

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
        data: new Date().toISOString()
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
                <span class="data-avaliacao">${new Date(av.data).toLocaleDateString()}</span>
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
    const comentariosIniciais = [
        "Muito bom!",
        "Delicioso!",
        "Excelente!",
        "Adorei!",
        "Perfeito!",
        "Saboroso!"
    ];

    nomesPratos.forEach(nomePrato => {
        if (!avaliacoes[nomePrato] || avaliacoes[nomePrato].length === 0) {
            avaliacoes[nomePrato] = [];
            const numAvaliacoes = Math.floor(Math.random() * 2) + 5; // 5 a 6 avaliações
            
            let comentariosDisponiveis = [...comentariosIniciais]; // Copia da lista de comentários

            for (let i = 0; i < numAvaliacoes; i++) {
                if (comentariosDisponiveis.length === 0) break; // Para se acabarem os comentários

                const valor = Math.floor(Math.random() * 3) + 3; // 3 a 5 estrelas
                
                const indiceAleatorio = Math.floor(Math.random() * comentariosDisponiveis.length);
                const comentario = comentariosDisponiveis.splice(indiceAleatorio, 1)[0]; // Seleciona e remove o comentário
                
                avaliacoes[nomePrato].push({
                    valor,
                    comentario,
                    data: new Date(Date.now() - i * 86400000).toISOString() // Datas recentes
                });
            }
            atualizarMediaAvaliacoes(nomePrato);
        }
    });
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
} 