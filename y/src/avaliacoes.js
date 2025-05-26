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
    if (pratoAvaliacoes.length === 0) return;

    const media = pratoAvaliacoes.reduce((sum, av) => sum + av.valor, 0) / pratoAvaliacoes.length;
    const mediaElement = document.querySelector(`[data-prato="${nomePrato}"] .media-avaliacao`);
    
    if (mediaElement) {
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
}

// Adicionar botão de avaliação em cada item do menu
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const nome = item.querySelector('h3').textContent;
        
        // Adicionar container para média de avaliações
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'media-avaliacao';
        mediaContainer.setAttribute('data-prato', nome);
        item.appendChild(mediaContainer);

        // Adicionar botão de avaliação
        const botaoAvaliar = document.createElement('button');
        botaoAvaliar.className = 'avaliar-prato';
        botaoAvaliar.textContent = 'Avaliar';
        botaoAvaliar.onclick = () => mostrarDialogAvaliacao(nome);
        item.appendChild(botaoAvaliar);

        // Atualizar média inicial
        atualizarMediaAvaliacoes(nome);
    });
}); 