import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'
import './carrinho.js'

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