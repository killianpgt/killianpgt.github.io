const projectData = {
    card1: {
        emoji: '🧊',
        title: 'Mini Map 3D',
        description: 'Small 3D minimap !',
        youtubeId: 'XkeFg0O5FJ8'
    },
    card2: {
        emoji: '⚔️',
        title: 'Boss System',
        description: 'A boss system for my RPG game !',
        youtubeId: '-Xf65kSTew8'
    },
};

const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const viewProjectBtn = document.getElementById('viewProject');
const viewCodeBtn = document.getElementById('viewCode');

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const data = projectData[id];
        modalImage.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${data.youtubeId}?autoplay=0&mute=1&controls=1&rel=0"
                allowfullscreen>
            </iframe>
        `;
        modalTitle.textContent = data.title;
        modalDescription.textContent = data.description;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        viewProjectBtn.onclick = () => alert('Voir le projet : ' + data.title);
        viewCodeBtn.onclick = () => alert('Voir le code source : ' + data.title);
    });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        modalImage.innerHTML = '';
    }, 300);
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});
