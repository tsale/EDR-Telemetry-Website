function createSnow() {
    const snowContainer = document.getElementById('snow');
    if (!snowContainer) return;

    const snowflakes = ['❄', '❅', '❆'];
    
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('span');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        snowflake.style.opacity = Math.random();
        snowContainer.appendChild(snowflake);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('christmas-theme');
    createSnow();
});
