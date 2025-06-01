console.log('cart.js carregado e executando');

class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.userName = '';
        this.init();
    }

    init() {
        console.log('ShoppingCart init() chamado');
        this.showWelcomeDialog();
    }

    async showWelcomeDialog() {
        console.log('showWelcomeDialog chamado');
        return new Promise((resolve) => {
            console.log('Criando elemento do diálogo');
            const dialog = document.createElement('div');
            dialog.className = 'dialog welcome-dialog';
            dialog.innerHTML = `
                <div class="dialog-content">
                    <h3>Bem-vindo(a)!</h3>
                    <div class="welcome-form">
                        <input type="text" id="userName" placeholder="Digite seu nome" required>
                    </div>
                    <div class="dialog-buttons">
                        <button class="confirm-btn">Entrar</button>
                    </div>
                </div>
            `;

            console.log('Adicionando diálogo ao document.body');
            document.body.appendChild(dialog);

            const input = dialog.querySelector('#userName');
            const confirmBtn = dialog.querySelector('.confirm-btn');

            // Focar no input automaticamente
            input.focus();

            // Permitir enviar com Enter
            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    const name = input.value.trim();
                    console.log('Verificando login admin...');
                    console.log('Nome digitado:', name);
                    console.log('window.ENABLE_ADMIN:', window.ENABLE_ADMIN);
                    console.log('window.admin:', window.admin);
                    if (name.toLowerCase() === '3 aliança' && window.ENABLE_ADMIN && window.admin) {
                        const isAdmin = await window.admin.verifyAdminPassword();
                        if (isAdmin) {
                            this.userName = name;
                            window.admin.isAdmin = true;
                            document.body.removeChild(dialog);
                            window.admin.initializeAdmin();
                        } else {
                            this.showToast('Senha incorreta para o admin!');
                        }
                    } else if (name.toLowerCase() !== '3 aliança') {
                        this.userName = name;
                        document.body.removeChild(dialog);
                        this.initializeCart();
                    }
                }
            });

            confirmBtn.addEventListener('click', async () => {
                if (input.value.trim()) {
                    const name = input.value.trim();
                    console.log('Verificando login admin...');
                    console.log('Nome digitado:', name);
                    console.log('window.ENABLE_ADMIN:', window.ENABLE_ADMIN);
                    console.log('window.admin:', window.admin);
                    if (name.toLowerCase() === '3 aliança' && window.ENABLE_ADMIN && window.admin) {
                        const isAdmin = await window.admin.verifyAdminPassword();
                        if (isAdmin) {
                            this.userName = name;
                            window.admin.isAdmin = true;
                            document.body.removeChild(dialog);
                            window.admin.initializeAdmin();
                        } else {
                            this.showToast('Senha incorreta para o admin!');
                        }
                    } else if (name.toLowerCase() !== '3 aliança') {
                        this.userName = name;
                        document.body.removeChild(dialog);
                        this.initializeCart();
                    }
                } else {
                    this.showToast('Por favor, digite seu nome!');
                }
            });
        });
    }

    initializeCart() {
        // Remover painel administrativo se existir (garantir estado limpo)
        const adminPanelElement = document.querySelector('.admin-panel');
        if (adminPanelElement) {
            adminPanelElement.remove();
        }

        // Carregar carrinho salvo
        // this.loadCart(); // Removido para limpar carrinho ao recarregar
        
        // Inicializar elementos
        this.cartButton = document.querySelector('.cart-button');
        this.cartContainer = document.querySelector('.cart-container');
        this.cartItems = document.querySelector('.cart-items');
        this.cartTotal = document.querySelector('.cart-total');
        this.cartCount = document.querySelector('.cart-count');
        this.closeButton = document.querySelector('.close-cart');
        this.checkoutButton = document.querySelector('.checkout-button');
        
        // Adicionar event listeners
        this.cartButton.addEventListener('click', () => this.toggleCart());
        this.closeButton.addEventListener('click', () => this.toggleCart());
        this.checkoutButton.addEventListener('click', () => this.checkout());
        
        // Adicionar eventos aos botões de adicionar ao carrinho
        // document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        //     button.addEventListener('click', (e) => {
        //         const item = e.target.closest('.menu-item');
        //         const name = item.querySelector('h3').textContent;
        //         const price = parseFloat(button.dataset.price);
        //         this.addItem(name, price);
        //     });
        // });

        // Atualizar contador inicial
        this.updateCount();
    }

    toggleCart() {
        this.cartContainer.classList.toggle('active');
    }

    addItem(name, price) {
        this.items.push({ name, price });
        this.total += price;
        this.saveCart();
        this.updateCart();
        this.showToast('Item adicionado ao carrinho!');
    }

    removeItem(index) {
        this.total -= this.items[index].price;
        this.items.splice(index, 1);
        this.saveCart();
        this.updateCart();
        this.showToast('Item removido do carrinho!');
    }

    updateCart() {
        // Limpar itens atuais
        this.cartItems.innerHTML = '';
        
        // Adicionar itens ao carrinho
        this.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>R$ ${item.price.toFixed(2)}</span>
                <button onclick="cart.removeItem(${index})">Remover</button>
            `;
            this.cartItems.appendChild(itemElement);
        });
        
        // Atualizar total
        this.cartTotal.textContent = `Total: R$ ${this.total.toFixed(2)}`;
        this.updateCount();
    }

    updateCount() {
        this.cartCount.textContent = this.items.length;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const { items, total } = JSON.parse(savedCart);
            this.items = items;
            this.total = total;
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    async checkout() {
        if (this.items.length === 0) {
            this.showToast('Adicione itens ao carrinho primeiro!');
            return;
        }

        const paymentMethod = await this.selectPaymentMethod();
        if (!paymentMethod) return;

        const deliveryArea = await this.selectDeliveryArea();
        if (!deliveryArea) return;

        const deliveryFee = deliveryArea.fee;
        const finalTotal = this.total + deliveryFee;

        const order = {
            items: this.items,
            total: this.total,
            deliveryFee,
            finalTotal,
            paymentMethod,
            deliveryArea: deliveryArea.name,
            date: new Date().toLocaleString()
        };

        this.sendOrder(order);
    }

    async selectPaymentMethod() {
        const methods = [
            { id: 'cash', name: 'Dinheiro' },
            { id: 'credit', name: 'Cartão de Crédito' },
            { id: 'debit', name: 'Cartão de Débito' },
            { id: 'pix', name: 'PIX' }
        ];

        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'dialog payment-dialog';
            dialog.innerHTML = `
                <div class="dialog-content">
                    <h3>Forma de Pagamento</h3>
                    <div class="payment-methods">
                        ${methods.map(method => `
                            <label>
                                <input type="radio" name="payment" value="${method.id}">
                                ${method.name}
                            </label>
                        `).join('')}
                    </div>
                    <div class="dialog-buttons">
                        <button class="confirm-btn">Confirmar</button>
                        <button class="cancel-btn">Cancelar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            const confirmBtn = dialog.querySelector('.confirm-btn');
            const cancelBtn = dialog.querySelector('.cancel-btn');

            confirmBtn.onclick = () => {
                const selected = dialog.querySelector('input[name="payment"]:checked');
                if (selected) {
                    const method = methods.find(m => m.id === selected.value);
                    document.body.removeChild(dialog);
                    resolve(method);
                } else {
                    this.showToast('Selecione uma forma de pagamento!');
                }
            };

            cancelBtn.onclick = () => {
                document.body.removeChild(dialog);
                resolve(null);
            };
        });
    }

    async selectDeliveryArea() {
        const areas = [
            { name: 'Retirada em Loja', fee: 0 },
            { name: 'Canabarro', fee: 5 },
            { name: 'Centro', fee: 6 },
            { name: 'Centro Administrativo', fee: 7 },
            { name: 'Languiru', fee: 10 },
            { name: 'Boa Vista', fee: 10 },
            { name: 'Pontes Filho', fee: 10 },
            { name: 'Alesgut', fee: 11 },
            { name: 'Linha Frank', fee: 12 },
            { name: 'Teutônia', fee: 10 },
            { name: 'Bairro Linha Harmonia', fee: 20 }
        ];

        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'dialog delivery-dialog';
            dialog.innerHTML = `
                <div class="dialog-content">
                    <h3>Área de Entrega</h3>
                    <div class="delivery-areas">
                        ${areas.map(area => `
                            <label>
                                <input type="radio" name="delivery" value="${area.name}">
                                ${area.name} (R$ ${area.fee.toFixed(2)})
                            </label>
                        `).join('')}
                    </div>
                    <div class="dialog-buttons">
                        <button class="cancel-btn">Cancelar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            const cancelBtn = dialog.querySelector('.cancel-btn');

            // Adicionar evento de clique em cada label
            dialog.querySelectorAll('label').forEach(label => {
                label.addEventListener('click', () => {
                    const selected = dialog.querySelector('input[name="delivery"]:checked');
                    if (selected) {
                        const area = areas.find(a => a.name === selected.value);
                        document.body.removeChild(dialog);
                        resolve(area);
                    }
                });
            });

            cancelBtn.onclick = () => {
                document.body.removeChild(dialog);
                resolve(null);
            };
        });
    }

    sendOrder(order) {
        const numeroPedido = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const data = new Date();

        const message = `
=== PEDIDO FINALIZADO ===
Cliente: ${this.userName}
Número do Pedido: #${numeroPedido}
Data: ${data.toLocaleDateString()}
Hora: ${data.toLocaleTimeString()}
Bairro para Entrega: ${order.deliveryArea} (R$ ${order.deliveryFee.toFixed(2)})

ITENS DO PEDIDO:
${order.items.map(item => `
${item.name}: R$ ${item.price.toFixed(2)}
`).join('\n')}

Subtotal: R$ ${order.total.toFixed(2)}
Taxa de Entrega: R$ ${order.deliveryFee.toFixed(2)}
TOTAL: R$ ${order.finalTotal.toFixed(2)}

Forma de Pagamento: ${order.paymentMethod.name}

Observações:
_________________________

Obrigado pela preferência!
Lanceria 3 Aliança
`;

        const whatsappMessage = encodeURIComponent(message);
        window.open(`https://wa.me/5551995304159?text=${whatsappMessage}`, '_blank');

        // Limpar carrinho
        this.items = [];
        this.total = 0;
        this.saveCart();
        this.updateCart();
        this.toggleCart();
    }
}

// Inicializar carrinho
// const cart = new ShoppingCart(); 