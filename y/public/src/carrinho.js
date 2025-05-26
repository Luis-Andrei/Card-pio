// Gerenciamento do carrinho
let carrinho = [];

const bairros = [
    { nome: 'Retirada em Loja', valor: 0.00 },
    { nome: 'Canabarro', valor: 5.00 },
    { nome: 'Centro', valor: 6.00 },
    { nome: 'Centro Administrativo', valor: 7.00 },
    { nome: 'Languiru', valor: 10.00 },
    { nome: 'Boa Vista', valor: 10.00 },
    { nome: 'Pontes Filho', valor: 10.00 },
    { nome: 'Alesgut', valor: 11.00 },
    { nome: 'Linha Frank', valor: 12.00 },
    { nome: 'Teutônia', valor: 10.00 },
    { nome: 'Bairro Linha Harmonia', valor: 20.00 }
];

function toggleCarrinho() {
    const carrinhoContainer = document.querySelector('.carrinho-container');
    carrinhoContainer.style.display = carrinhoContainer.style.display === 'none' ? 'block' : 'none';
}

function adicionarAoCarrinho(item, preco, descricao) {
    carrinho.push({ item, preco, descricao });
    atualizarCarrinho();
    atualizarContador();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    atualizarContador();
}

function atualizarContador() {
    const contador = document.querySelector('.carrinho-count');
    contador.textContent = carrinho.length;
}

function selecionarBairro() {
    let bairroSelecionado = null;
    const dialog = document.createElement('div');
    dialog.className = 'selecionar-bairro-dialog';
    dialog.innerHTML = `
        <div class="selecionar-bairro-content">
            <h3>Selecione o Bairro para Entrega:</h3>
            <div class="lista-bairros">
                ${bairros.map(bairro => `
                    <label>
                        <input type="radio" name="bairro" value="${bairro.nome}">
                        ${bairro.nome} (R$ ${bairro.valor.toFixed(2)})
                    </label>
                `).join('')}
            </div>
            <div class="dialog-buttons">
                <button onclick="confirmarBairro()">Confirmar</button>
                <button onclick="fecharDialogBairro()">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);

    window.confirmarBairro = function() {
        const selecionado = document.querySelector('input[name="bairro"]:checked');
        if (selecionado) {
            bairroSelecionado = bairros.find(b => b.nome === selecionado.value);
            fecharDialogBairro();
            return bairroSelecionado;
        } else {
            alert('Por favor, selecione um bairro!');
            return null;
        }
    };

    window.fecharDialogBairro = function() {
        document.body.removeChild(dialog);
    };

    return new Promise((resolve) => {
        const checkDialog = setInterval(() => {
            if (!document.body.contains(dialog)) {
                clearInterval(checkDialog);
                resolve(bairroSelecionado);
            } else {
                const confirmarBtn = dialog.querySelector('.dialog-buttons button:first-child');
                confirmarBtn.onclick = async () => {
                    const resultado = window.confirmarBairro();
                    if (resultado) {
                        resolve(resultado);
                    }
                };
                const cancelarBtn = dialog.querySelector('.dialog-buttons button:last-child');
                cancelarBtn.onclick = () => {
                    window.fecharDialogBairro();
                    resolve(null); // Resolve com null se cancelar
                };
            }
        }, 100);
    });
}

function selecionarFormaPagamento() {
    const formas = [
        { id: 'dinheiro', label: 'Dinheiro' },
        { id: 'credito', label: 'Cartão de Crédito' },
        { id: 'debito', label: 'Cartão de Débito' },
        { id: 'pix', label: 'PIX' }
    ];

    let formaPagamento = '';
    const dialog = document.createElement('div');
    dialog.className = 'forma-pagamento-dialog';
    dialog.innerHTML = `
        <div class="forma-pagamento-content">
            <h3>Forma de Pagamento</h3>
            <div class="formas-pagamento">
                ${formas.map(forma => `
                    <label>
                        <input type="radio" name="formaPagamento" value="${forma.id}">
                        ${forma.label}
                    </label>
                `).join('')}
            </div>
            <div class="dialog-buttons">
                <button onclick="confirmarFormaPagamento()">Confirmar</button>
                <button onclick="fecharDialog()">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);

    window.confirmarFormaPagamento = function() {
        const selecionado = document.querySelector('input[name="formaPagamento"]:checked');
        if (selecionado) {
            formaPagamento = formas.find(f => f.id === selecionado.value).label;
            fecharDialog();
            return formaPagamento;
        } else {
            alert('Por favor, selecione uma forma de pagamento!');
            return null;
        }
    };

    window.fecharDialog = function() {
        document.body.removeChild(dialog);
    };

    return new Promise((resolve) => {
        const checkDialog = setInterval(() => {
            if (!document.body.contains(dialog)) {
                clearInterval(checkDialog);
                resolve(formaPagamento);
            }
        }, 100);
    });
}

async function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('Adicione itens ao carrinho antes de finalizar o pedido!');
        return;
    }

    const formaPagamento = await selecionarFormaPagamento();
    if (!formaPagamento) return;

    const bairroSelecionado = await selecionarBairro();
    if (!bairroSelecionado) return;

    const valorEntrega = bairroSelecionado.valor;
    let total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    total += valorEntrega; // Adiciona o valor da entrega ao total

    const data = new Date();
    const numeroPedido = Math.floor(Math.random() * 10000);
    
    const mensagem = `
=== PEDIDO FINALIZADO ===
Número do Pedido: #${numeroPedido}
Data: ${data.toLocaleDateString()}
Hora: ${data.toLocaleTimeString()}
Bairro para Entrega: ${bairroSelecionado.nome} (R$ ${valorEntrega.toFixed(2)})

ITENS DO PEDIDO:
${carrinho.map(item => `
${item.item}: R$ ${item.preco.toFixed(2)}
Descrição: ${item.descricao}
`).join('\n')}

TOTAL: R$ ${total.toFixed(2)}

Forma de Pagamento: ${formaPagamento}

Observações:
_________________________

Obrigado pela preferência!
Lanceria 3 Aliança
`;

    // Formatar a mensagem para o WhatsApp
    const mensagemWhatsApp = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://wa.me/5551995304159?text=${mensagemWhatsApp}`;
    
    // Abrir o WhatsApp em uma nova aba
    window.open(linkWhatsApp, '_blank');
    
    // Limpar o carrinho após enviar
    carrinho = [];
    atualizarCarrinho();
    atualizarContador();
    document.querySelector('.carrinho-container').style.display = 'none';
}

function atualizarCarrinho() {
    const carrinhoElement = document.getElementById('carrinho-items');
    const totalElement = document.getElementById('carrinho-total');
    const finalizarButton = document.getElementById('finalizar-pedido');
    
    carrinhoElement.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrinho-item';
        itemElement.innerHTML = `
            <span>${item.item}</span>
            <span>R$ ${item.preco.toFixed(2)}</span>
        `;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', () => removerDoCarrinho(index));
        itemElement.appendChild(removeButton);
        carrinhoElement.appendChild(itemElement);
        total += item.preco;
    });

    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
    finalizarButton.disabled = carrinho.length === 0;
}

// Adicionar botão de adicionar ao carrinho em cada item do menu
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const nome = item.querySelector('h3').textContent;
        const precoText = item.querySelector('.price').textContent;
        const preco = parseFloat(precoText.replace('Valor: R$ ', '').replace('R$ ', '').replace(',', '.'));
        const descricao = item.querySelector('p') ? item.querySelector('p').textContent : '';
        
        const botao = document.createElement('button');
        botao.className = 'adicionar-carrinho';
        botao.textContent = 'Adicionar ao Carrinho';
        botao.onclick = () => adicionarAoCarrinho(nome, preco, descricao);
        
        item.appendChild(botao);
    });

    // Adicionar evento de finalizar pedido
    document.getElementById('finalizar-pedido').addEventListener('click', finalizarPedido);

    // Adicionar evento de clique no ícone do carrinho
    document.querySelector('.carrinho-icon').addEventListener('click', toggleCarrinho);

    // Fechar carrinho ao clicar fora dele
    document.addEventListener('click', (event) => {
        const carrinhoContainer = document.querySelector('.carrinho-container');
        const carrinhoIcon = document.querySelector('.carrinho-icon');
        
        if (!carrinhoContainer.contains(event.target) && !carrinhoIcon.contains(event.target)) {
            carrinhoContainer.style.display = 'none';
        }
    });
}); 