
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('filterInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const table = document.querySelector('#telemetryTable, #scoreTable');
        if (!table) return;

        const rows = table.getElementsByTagName('tr');
        
        Array.from(rows).forEach((row, index) => {
            if (index === 0) return; // Skip header row
            
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
});