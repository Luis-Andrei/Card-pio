// import './style.css' // Mantido se style.css for um módulo ou importado em outro lugar
// import javascriptLogo from './javascript.svg' // Removido: SVG não é módulo JS
// import { setupCounter } from './counter.js' // Removido: não parece ser usado
// import './carrinho.js' // Removido: já incluído via script tag no HTML
// import './avaliacoes.js' // Removido: já incluído via script tag no HTML

// O conteúdo do cardápio está no index.html

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
document.addEventListener('DOMContentLoaded', revealOnScroll);