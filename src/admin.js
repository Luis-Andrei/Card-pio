class AdminPanel {
    constructor(password = '2195') {
        this.isAdmin = false;
        this.userName = '';
        this.adminPassword = password;
        this.adminPanelElement = null; // Para armazenar a referência do painel
    }

    async verifyAdminPassword() {
        const dialog = this.createDialog(`
            <h3>Acesso Administrador</h3>
            <div class="welcome-form">
                <input type="password" id="adminPassword" placeholder="Digite a senha" required autofocus>
            </div>
            <div class="dialog-buttons">
                <button class="confirm-btn">Confirmar</button>
                <button class="cancel-btn">Cancelar</button>
            </div>
        `);

        return new Promise((resolve) => {
            const input = dialog.querySelector('#adminPassword');
            const confirmBtn = dialog.querySelector('.confirm-btn');
            const cancelBtn = dialog.querySelector('.cancel-btn');

            const checkPassword = () => {
                console.log('Verificando senha...');
                console.log('Senha digitada (input.value):', input.value);
                console.log('Senha esperada (this.adminPassword):', this.adminPassword);
                console.log('Comparação (input.value === this.adminPassword):', input.value === this.adminPassword);
                if (input.value === this.adminPassword) {
                    this.closeDialog(dialog);
                    resolve(true);
                } else {
                    this.showToast('Senha incorreta!');
                }
            };

            confirmBtn.addEventListener('click', checkPassword);
            input.addEventListener('keypress', e => e.key === 'Enter' && checkPassword());
            cancelBtn.addEventListener('click', () => {
                this.closeDialog(dialog);
                resolve(false);
            });
        });
    }

    createDialog(contentHTML) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog admin-dialog';
        dialog.innerHTML = `<div class="dialog-content">${contentHTML}</div>`;
        document.body.appendChild(dialog);
        return dialog;
    }

    closeDialog(dialog) {
        if (dialog && dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
        }
    }

    initializeAdmin() {
        this.isAdmin = true;

        document.querySelector('.cart-button')?.remove();
        document.querySelector('.cart-container')?.remove();

        this.showAdminPanel();
    }

    showAdminPanel() {
        // Impedir múltiplos painéis
        if (this.adminPanelElement) {
            this.adminPanelElement.remove();
            this.adminPanelElement = null;
        }

        this.adminPanelElement = document.createElement('div');
        this.adminPanelElement.className = 'admin-panel';
        this.adminPanelElement.innerHTML = `
            <div class="admin-header">
                <h3>Painel Administrativo</h3>
                <button class="minimize-admin">-</button>
                <button class="close-admin">×</button>
            </div>
            <div class="admin-content">
                ${this.renderItemManagement()}
                ${this.renderStatistics()}
            </div>
        `;
        document.body.appendChild(this.adminPanelElement);
        
        // Adicionar classe active para a transição de entrada
        setTimeout(() => { // Usar setTimeout para garantir que o elemento esteja no DOM antes da transição
            this.adminPanelElement.classList.add('active');
        }, 10);

        this.adminPanelElement.querySelector('.close-admin').addEventListener('click', () => {
            this.closeDialog(this.adminPanelElement);
            this.isAdmin = false;
            this.updateMenuDisplay();
        });

        this.adminPanelElement.querySelector('.minimize-admin').addEventListener('click', () => {
            this.adminPanelElement.classList.toggle('minimized');
        });

        this.adminPanelElement.querySelector('.add-item-btn').addEventListener('click', () => this.showAddItemDialog());

        this.loadItemsList(this.adminPanelElement.querySelector('.items-list'));
        this.addExportImportButtons(this.adminPanelElement.querySelector('.admin-content'));
    }

    renderItemManagement() {
        return `
            <div class="admin-section">
                <div class="admin-header-section">
                    <h4>Gerenciar Itens</h4>
                    <button class="add-item-btn">+ Novo Item</button>
                </div>
                <div class="items-list"></div>
            </div>
        `;
    }

    renderStatistics() {
        return `
            <div class="admin-section">
                <h4>Estatísticas</h4>
                <div class="stats">
                    <div class="stat-item"><span>Total de Pedidos</span><span>0</span></div>
                    <div class="stat-item"><span>Valor Total</span><span>R$ 0,00</span></div>
                </div>
            </div>
        `;
    }

    async showAddItemDialog(item = null) {
        const isEditing = !!item;
        const dialog = this.createDialog(`
            <h3>${isEditing ? 'Editar Item' : 'Adicionar Novo Item'}</h3>
            <div class="admin-form">
                <div class="form-group">
                    <label>Nome do Item</label>
                    <input type="text" id="itemName" placeholder="Digite o nome do item" value="${item?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Preço</label>
                    <input type="number" id="itemPrice" placeholder="0.00" step="0.01" value="${item?.price || ''}" required>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea id="itemDescription" placeholder="Digite a descrição do item">${item?.description || ''}</textarea>
                </div>
            </div>
            <div class="dialog-buttons">
                <button class="confirm-btn">${isEditing ? 'Salvar' : 'Adicionar'}</button>
                <button class="cancel-btn">Cancelar</button>
            </div>
        `);

        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');

        confirmBtn.addEventListener('click', () => {
            const name = dialog.querySelector('#itemName').value.trim();
            const price = parseFloat(dialog.querySelector('#itemPrice').value);
            const description = dialog.querySelector('#itemDescription').value.trim();

            if (name && !isNaN(price)) {
                if (isEditing) {
                    this.updateMenuItem(item.id, name, price, description);
                    this.showToast('Item atualizado com sucesso!');
                } else {
                    this.addMenuItem(name, price, description);
                    this.showToast('Item adicionado com sucesso!');
                }
                this.closeDialog(dialog);
            } else {
                this.showToast('Preencha todos os campos corretamente!');
            }
        });

        cancelBtn.addEventListener('click', () => this.closeDialog(dialog));
    }

    addMenuItem(name, price, description = '') {
        const menuItems = this.getMenuItems();
        menuItems.push({ id: Date.now(), name, price, description });
        this.saveMenuItems(menuItems);
        this.refreshUI();
    }

    updateMenuItem(id, name, price, description = '') {
        const menuItems = this.getMenuItems();
        const index = menuItems.findIndex(item => item.id === id);
        if (index !== -1) {
            menuItems[index] = { id, name, price, description };
            this.saveMenuItems(menuItems);
            this.refreshUI();
        }
    }

    deleteMenuItem(id) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        const menuItems = this.getMenuItems().filter(item => item.id !== id);
        this.saveMenuItems(menuItems);
        this.refreshUI();
        this.showToast('Item excluído com sucesso!');
    }

    loadItemsList(container) {
        const items = this.getMenuItems();
        container.innerHTML = items.map(item => `
            <div class="admin-item" data-id="${item.id}">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">R$ ${item.price.toFixed(2)}</span>
                </div>
                <div class="item-actions">
                    <button class="edit-item"><i class="fas fa-edit"></i></button>
                    <button class="delete-item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.edit-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.admin-item').dataset.id);
                const item = items.find(i => i.id === itemId);
                this.showAddItemDialog(item);
            });
        });

        container.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.admin-item').dataset.id);
                this.deleteMenuItem(itemId);
            });
        });
    }

    updateMenuDisplay() {
        console.log('updateMenuDisplay chamado');
        const items = this.getMenuItems();
        const container = document.querySelector('.menu-items');
        if (!container) {
            console.log('Contêiner .menu-items não encontrado.');
            return;
        }

        // Agrupar itens por categoria
        const itemsByCategory = items.reduce((acc, item) => {
            const category = item.category || 'Pedido especial';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        // Obter categorias e ordenar, colocando 'Pedido especial' primeiro
        const sortedCategories = Object.keys(itemsByCategory).sort((a, b) => {
            if (a === 'Pedido especial') return -1; // Coloca 'Pedido especial' antes de outros
            if (b === 'Pedido especial') return 1;  // Coloca outros depois de 'Pedido especial'
            return a.localeCompare(b); // Ordena as demais em ordem alfabética
        });

        // Gerar HTML para cada categoria na ordem ordenada
        container.innerHTML = sortedCategories.map(category => `
            <section class="menu-section">
                <h2 class="section-title">${category}</h2>
                ${itemsByCategory[category].map(item => `
                    <div class="menu-item" data-id="${item.id}">
                        <div class="menu-item-header">
                            <h3>${item.name}</h3>
                            ${this.isAdmin ? `
                                <div class="menu-item-actions">
                                    <button class="edit-menu-item" data-id="${item.id}">Editar</button>
                                    <button class="delete-menu-item" data-id="${item.id}">Excluir</button>
                                </div>
                            ` : ''}
                        </div>
                        <p>${item.description || ''}</p>
                        <div class="menu-item-footer">
                            <span class="price">R$ ${item.price.toFixed(2)}</span>
                            ${!this.isAdmin ? `
                                <button class="add-to-cart-btn" data-price="${item.price}">Adicionar ao Carrinho</button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </section>
        `).join('');

        if (!this.isAdmin) {
            console.log('Anexando listeners para add-to-cart-btn');
            container.querySelectorAll('.add-to-cart-btn').forEach(button => {
                console.log('Anexando listener a um botão');
                button.addEventListener('click', e => {
                    const item = e.target.closest('.menu-item');
                    const name = item.querySelector('h3').textContent;
                    const price = parseFloat(button.dataset.price);
                    cart.addItem(name, price);
                });
            });
        } else {
            console.log('Admin mode ativo, não anexando listeners para add-to-cart-btn');
            container.querySelectorAll('.edit-menu-item').forEach(button => {
                button.addEventListener('click', e => {
                    const itemId = parseInt(e.target.closest('.menu-item').dataset.id);
                    const item = items.find(i => i.id === itemId);
                    this.showAddItemDialog(item);
                });
            });

            container.querySelectorAll('.delete-menu-item').forEach(button => {
                button.addEventListener('click', e => {
                    const itemId = parseInt(e.target.closest('.menu-item').dataset.id);
                    this.deleteMenuItem(itemId);
                });
            });
        }
    }

    addExportImportButtons(container) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'admin-export-import'; // Adicionar classe para estilização

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Exportar JSON';
        exportBtn.className = 'admin-export-btn'; // Adicionar classe
        exportBtn.addEventListener('click', () => {
            const dataStr = JSON.stringify(this.getMenuItems(), null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'menuItems.json';
            a.click();

            URL.revokeObjectURL(url); // Limpar o URL do objeto
        });

        const importBtn = document.createElement('button');
        importBtn.textContent = 'Importar JSON';
        importBtn.className = 'admin-import-btn'; // Adicionar classe
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const items = JSON.parse(reader.result);
                        // Opcional: Adicionar validação básica da estrutura do JSON aqui
                        if (Array.isArray(items) && items.every(item => typeof item === 'object' && item !== null && 'id' in item && 'name' in item && 'price' in item)) {
                             this.saveMenuItems(items);
                             this.refreshUI();
                             this.showToast('Itens importados com sucesso!');
                        } else {
                             this.showToast('Formato de arquivo JSON inválido.');
                        }
                    } catch (e) {
                        this.showToast('Erro ao ler ou analisar o arquivo JSON.');
                        console.error('Erro de importação:', e);
                    }
                };
                reader.readAsText(file);
            });
            input.click();
        });

        buttonContainer.appendChild(exportBtn);
        buttonContainer.appendChild(importBtn);
        container.appendChild(buttonContainer);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Helpers para localStorage
    getMenuItems() {
        return JSON.parse(localStorage.getItem('menuItems') || '[]');
    }

    saveMenuItems(items) {
        localStorage.setItem('menuItems', JSON.stringify(items));
    }

    refreshUI() {
        // Atualiza tanto a lista no admin panel quanto o menu principal
        const itemsListContainer = this.adminPanelElement?.querySelector('.items-list');
        if (itemsListContainer) {
            this.loadItemsList(itemsListContainer);
        }
        this.updateMenuDisplay();
    }
}

// Exportar a instância do AdminPanel
window.AdminPanel = AdminPanel;
window.admin = new AdminPanel('2195'); // Criar a instância global com a senha correta 