async function loadRoadmapData() {
    try {
        const response = await fetch('/data/roadmap.json');
        const data = await response.json();
        renderTimeline(data.timeline);
        renderRoadmapSection('in-progress-section', data.inProgress);
        renderRoadmapSection('planned-section', data.planned);
        renderRoadmapSection('backlog-section', data.backlog);
    } catch (error) {
        console.error('Error loading roadmap data:', error);
    }
}

function renderTimeline(timelineData) {
    const timelineSection = document.getElementById('timeline-section');
    timelineSection.innerHTML = timelineData.map(item => `
        <div class="timeline-item ${item.status}">
            <div class="timeline-content">
                <h3>${item.quarter}</h3>
                <p>${item.title}</p>
            </div>
        </div>
    `).join('');
}

function renderRoadmapSection(sectionId, items) {
    const section = document.getElementById(sectionId);
    section.innerHTML = items.map(item => `
        <div class="roadmap-item ${sectionId.replace('-section', '')}">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            ${item.items ? `
                <ul>
                    ${item.items.map(subItem => `<li>${subItem}</li>`).join('')}
                </ul>
            ` : ''}
            <span class="status">${item.status}</span>
        </div>
    `).join('');
}

function renderBacklog(backlogData) {
    const backlogSection = document.getElementById('backlog-section');
    backlogSection.innerHTML = backlogData.map(item => `
        <tr>
            <td>${item.feature}</td>
            <td>${item.priority}</td>
            <td>${item.status}</td>
            <td>${item.targetDate}</td>
        </tr>
    `).join('');
}

// Load the roadmap data when the page loads
document.addEventListener('DOMContentLoaded', loadRoadmapData);