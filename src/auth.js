// Sistema de autenticação
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
        console.log('Auth initialized:', this.users); // Debug log
    }

    init() {
        // Sempre criar/atualizar o usuário admin
        this.users['admin'] = {
            password: this.hashPassword('SDandrei857691@'),
            role: 'admin',
            name: 'Administrador'
        };
        this.saveUsers();
        console.log('Admin user created/updated'); // Debug log
    }

    hashPassword(password) {
        // Função simples de hash para demonstração
        return btoa(password); // Não use em produção!
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    saveCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    async login(username, password) {
        // Apenas admin precisa de senha
        if (username === 'admin') {
             const user = this.users[username];
             if (!user || user.password !== this.hashPassword(password)) {
                 throw new Error('Usuário ou senha inválidos');
             }
             this.currentUser = {
                 username,
                 role: user.role,
                 name: user.name
             };
        } else { // Outros usuários não precisam de senha
            const user = this.users[username];
            if (!user) {
                 throw new Error('Usuário não encontrado. Por favor, registre-se.');
            }
             this.currentUser = {
                 username,
                 role: user.role,
                 name: user.name
             };
        }
       
        this.saveCurrentUser();
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Função de registro simplificada para usuários normais (sem senha)
    register(username, name) {
        // Gerar uma senha aleatória para o localStorage, embora não seja usada para login
        const randomPassword = Math.random().toString(36).substring(2, 15);
        
        if (this.users[username]) {
            throw new Error('Usuário já existe');
        }

        this.users[username] = {
            password: this.hashPassword(randomPassword), // Salva um hash, mas não é usado para login
            role: 'user',
            name
        };
        this.saveUsers();
    }

    isLoggedIn() {
        return !!this.currentUser;
    }

    isAdmin() {
        console.log('Checking admin status:', this.currentUser); // Debug log
        return this.currentUser?.role === 'admin';
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Criar instância global do sistema de autenticação
const auth = new Auth();

// Funções para manipulação do DOM
function showLoginForm() {
    console.log('Showing login form'); // Debug log
    const loginHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <h2>Login</h2>
                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label for="username">Usuário:</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Senha:</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit">Entrar</button>
                </form>
                <p class="auth-switch">Não tem uma conta? <a href="#" id="showRegister">Registre-se</a></p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', loginHTML);
    setupLoginListeners();
}

function showRegisterForm() {
    const registerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <h2>Registro</h2>
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label for="regName">Nome:</label>
                        <input type="text" id="regName" required>
                    </div>
                    <div class="form-group">
                        <label for="regUsername">Usuário:</label>
                        <input type="text" id="regUsername" required>
                    </div>
                    <button type="submit">Registrar</button>
                </form>
                <p class="auth-switch">Já tem uma conta? <a href="#" id="showLogin">Faça login</a></p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', registerHTML);
    setupRegisterListeners();
}

function setupLoginListeners() {
    const loginForm = document.getElementById('loginForm');
    const showRegisterLink = document.getElementById('showRegister');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            await auth.login(username, password);
            updateUIForLoggedInUser();
            document.querySelector('.auth-container').remove();
        } catch (error) {
            alert(error.message);
        }
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.auth-container').remove();
        showRegisterForm();
    });
}

function setupRegisterListeners() {
    const registerForm = document.getElementById('registerForm');
    const showLoginLink = document.getElementById('showLogin');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const username = document.getElementById('regUsername').value;

        try {
            auth.register(username, name);
            alert('Registro realizado com sucesso! Faça login para continuar.');
            document.querySelector('.auth-container').remove();
            showLoginForm();
        } catch (error) {
            alert(error.message);
        }
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.auth-container').remove();
        showLoginForm();
    });
}

function updateUIForLoggedInUser() {
    console.log('Updating UI for logged in user'); // Debug log
    const user = auth.getCurrentUser();
    console.log('Current user:', user); // Debug log

    // Remover menu anterior se existir
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
        <span>Olá, ${user.name}</span>
        <button id="logoutBtn">Sair</button>
    `;

    const header = document.querySelector('.header');
    if (header) {
        header.appendChild(userMenu);

        // Adicionar botão de edição se for admin
        if (auth.isAdmin()) {
            console.log('User is admin, adding edit button'); // Debug log
            const editButton = document.createElement('button');
            editButton.id = 'editMenuBtn';
            editButton.textContent = 'Editar Cardápio';
            editButton.className = 'edit-menu-btn';
            userMenu.appendChild(editButton);

            editButton.addEventListener('click', () => {
                console.log('Edit button clicked'); // Debug log
                toggleEditMode();
            });
        }

        document.getElementById('logoutBtn').addEventListener('click', () => {
            auth.logout();
            userMenu.remove();
            showLoginForm();
        });
    } else {
        console.error('Header element not found'); // Debug log
    }
}

// Adicionar função para fazer logout após finalizar pedido
function logoutAfterOrder() {
    console.log('Logging out after order completion'); // Debug log
    auth.logout();
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.remove();
    }
    showLoginForm();
}

// Modificar a função saveItemChanges para incluir o logout
function saveItemChanges(item) {
    console.log('Saving changes for item:', item); // Debug log
    
    const title = item.querySelector('h3').textContent;
    const description = item.querySelector('p:not(.description)')?.textContent || '';
    const price = item.querySelector('.price').textContent;

    // Salvar no localStorage
    const menuData = JSON.parse(localStorage.getItem('menuData')) || {};
    menuData[title] = {
        description,
        price,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('menuData', JSON.stringify(menuData));

    // Atualizar o item no DOM
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(menuItem => {
        const itemTitle = menuItem.querySelector('h3').textContent;
        if (itemTitle === title) {
            const itemDesc = menuItem.querySelector('p:not(.description)');
            const itemPrice = menuItem.querySelector('.price');
            
            if (itemDesc) itemDesc.textContent = description;
            if (itemPrice) itemPrice.textContent = price;
        }
    });

    // Mostrar mensagem de sucesso
    const message = document.createElement('div');
    message.className = 'save-message';
    message.textContent = 'Alterações salvas com sucesso!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

// Função para carregar dados salvos
function loadSavedMenuData() {
    const menuData = JSON.parse(localStorage.getItem('menuData')) || {};
    console.log('Loading saved menu data:', menuData); // Debug log

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const title = item.querySelector('h3').textContent;
        const savedData = menuData[title];
        
        if (savedData) {
            const description = item.querySelector('p:not(.description)');
            const price = item.querySelector('.price');
            
            if (description) description.textContent = savedData.description;
            if (price) price.textContent = savedData.price;
        }
    });
}

function toggleEditMode() {
    console.log('Toggling edit mode'); // Debug log
    const menuItems = document.querySelectorAll('.menu-item');
    const isEditMode = document.body.classList.toggle('edit-mode');
    console.log('Edit mode:', isEditMode); // Debug log

    menuItems.forEach(item => {
        const title = item.querySelector('h3');
        const description = item.querySelector('p:not(.description)');
        const price = item.querySelector('.price');

        if (isEditMode) {
            // Adicionar container de edição
            const editContainer = document.createElement('div');
            editContainer.className = 'edit-container';
            
            // Converter para campos editáveis com ícones
            const titleContainer = createEditableField(title, 'Título', 'fa-heading');
            const descContainer = description ? createEditableField(description, 'Descrição', 'fa-align-left') : null;
            const priceContainer = createEditableField(price, 'Preço', 'fa-tag');

            // Adicionar campos ao container
            editContainer.appendChild(titleContainer);
            if (descContainer) editContainer.appendChild(descContainer);
            editContainer.appendChild(priceContainer);

            // Adicionar botões de ação
            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons';
            
            const saveButton = document.createElement('button');
            saveButton.className = 'save-item-btn';
            saveButton.innerHTML = '<i class="fas fa-save"></i> Salvar';
            saveButton.onclick = () => saveItemChanges(item);

            const cancelButton = document.createElement('button');
            cancelButton.className = 'cancel-item-btn';
            cancelButton.innerHTML = '<i class="fas fa-times"></i> Cancelar';
            cancelButton.onclick = () => {
                // Restaurar valores originais
                const menuData = JSON.parse(localStorage.getItem('menuData')) || {};
                const savedData = menuData[title.textContent];
                if (savedData) {
                    title.textContent = title.textContent;
                    if (description) description.textContent = savedData.description;
                    price.textContent = savedData.price;
                }
                editContainer.remove();
            };

            actionButtons.appendChild(saveButton);
            actionButtons.appendChild(cancelButton);
            editContainer.appendChild(actionButtons);

            // Substituir conteúdo original pelo container de edição
            const originalContent = item.innerHTML;
            item.innerHTML = '';
            item.appendChild(editContainer);

            // Adicionar evento de tecla Enter
            [title, description, price].forEach(element => {
                if (element) {
                    element.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            saveItemChanges(item);
                        }
                    });
                }
            });
        } else {
            // Remover modo de edição
            const editContainer = item.querySelector('.edit-container');
            if (editContainer) {
                editContainer.remove();
            }
        }
    });
}

function createEditableField(element, label, icon) {
    const container = document.createElement('div');
    container.className = 'editable-field';
    
    const labelElement = document.createElement('label');
    labelElement.innerHTML = `<i class="fas ${icon}"></i> ${label}`;
    
    element.contentEditable = true;
    element.className = 'editable-content';
    
    container.appendChild(labelElement);
    container.appendChild(element);
    
    return container;
}

// Adicionar estilos CSS para o modo de edição
const style = document.createElement('style');
style.textContent = `
    body {
        background-color: #1a1a1a;
        color: #e0e0e0;
    }

    .menu-item {
        border: 2px solid #333;
        padding: 20px;
        margin: 20px 0;
        position: relative;
        background: #2d2d2d;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    }

    .menu-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        border-color: #4CAF50;
    }

    .menu-item h3 {
        color: #fff;
        font-size: 1.4em;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .menu-item p {
        color: #b0b0b0;
        margin: 8px 0;
        line-height: 1.5;
    }

    .menu-item .price {
        color: #4CAF50;
        font-weight: bold;
        font-size: 1.2em;
        margin-top: 10px;
        display: block;
    }

    .edit-mode .menu-item {
        border-color: #4CAF50;
        background: #333;
    }

    .edit-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .editable-field {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .editable-field label {
        color: #b0b0b0;
        font-size: 0.9em;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .editable-field label i {
        color: #4CAF50;
    }

    .editable-content {
        border: 1px solid #444;
        padding: 10px;
        border-radius: 4px;
        background: #2d2d2d;
        color: #fff;
        min-height: 20px;
        transition: all 0.3s ease;
    }

    .editable-content:focus {
        outline: none;
        border-color: #4CAF50;
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
        background: #333;
    }

    .action-buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .save-item-btn, .cancel-item-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s ease;
    }

    .save-item-btn {
        background: #4CAF50;
        color: white;
    }

    .save-item-btn:hover {
        background: #45a049;
        transform: translateY(-1px);
    }

    .cancel-item-btn {
        background: #f44336;
        color: white;
    }

    .cancel-item-btn:hover {
        background: #d32f2f;
        transform: translateY(-1px);
    }

    .edit-menu-btn {
        background: #2196F3;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s ease;
    }

    .edit-menu-btn:hover {
        background: #1976D2;
        transform: translateY(-1px);
    }

    .save-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease, fadeOut 2s forwards 0.7s;
    }

    .save-message i {
        font-size: 1.2em;
    }

    .user-menu {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        background: #2d2d2d;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        z-index: 1000;
    }

    .user-menu span {
        font-weight: bold;
        color: #fff;
    }

    #logoutBtn {
        background: #f44336;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    #logoutBtn:hover {
        background: #d32f2f;
        transform: translateY(-1px);
    }

    .section-title {
        color: #fff;
        font-size: 1.8em;
        margin: 30px 0 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #4CAF50;
    }

    .header {
        background: #2d2d2d;
        color: white;
        padding: 20px;
        text-align: center;
        margin-bottom: 30px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border-bottom: 3px solid #4CAF50;
    }

    .header h1 {
        margin: 0;
        font-size: 2em;
        color: #fff;
    }

    .auth-container {
        background: rgba(0, 0, 0, 0.8);
    }

    .auth-box {
        background: #2d2d2d;
        border: 1px solid #444;
    }

    .auth-box h2 {
        color: #fff;
    }

    .auth-form input {
        background: #333;
        border: 1px solid #444;
        color: #fff;
    }

    .auth-form input:focus {
        border-color: #4CAF50;
        background: #3d3d3d;
    }

    .auth-form label {
        color: #b0b0b0;
    }

    .auth-form button {
        background: #4CAF50;
        color: white;
    }

    .auth-form button:hover {
        background: #45a049;
    }

    .auth-switch {
        color: #b0b0b0;
    }

    .auth-switch a {
        color: #4CAF50;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar o sistema de autenticação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug log
    if (!auth.isLoggedIn()) {
        showLoginForm();
    } else {
        updateUIForLoggedInUser();
        loadSavedMenuData(); // Carregar dados salvos
    }
}); 