let coachesData = [];
let filteredData = [];
let currentView = 'table';
let currentSort = 'name';

async function loadCoaches() {
    try {
        const response = await fetch('/assets/data/coaches.json');
        coachesData = await response.json();
        filteredData = [...coachesData];
        sortData(currentSort);
        renderCoaches();
    } catch (error) {
        console.error('Error loading coaches:', error);
        document.getElementById('resultsCount').textContent = 'Error loading coaches data.';
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const crewFilter = document.getElementById('crewSelect').value;

    filteredData = coachesData.filter(coach => {
        const matchesSearch = [coach.name, coach.school, coach.location, coach.crew, coach.training]
            .filter(Boolean)
            .some(value => value.toLowerCase().includes(searchTerm));
        const matchesCrew = crewFilter === 'all' || coach.crew === crewFilter;
        return matchesSearch && matchesCrew;
    });

    sortData(currentSort);
    renderCoaches();
}

function sortData(field) {
    currentSort = field;
    filteredData.sort((a, b) => {
        const aValue = (a[field] || '').toString().toLowerCase();
        const bValue = (b[field] || '').toString().toLowerCase();
        return aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
    });
}

function renderCoaches() {
    updateResultsCount();
    document.getElementById('noResults').style.display = filteredData.length === 0 ? 'block' : 'none';
    document.getElementById('tableView').style.display = filteredData.length && currentView === 'table' ? 'block' : 'none';
    document.getElementById('gridView').style.display = filteredData.length && currentView === 'grid' ? 'block' : 'none';
    if (filteredData.length > 0) {
        if (currentView === 'table') renderTableView();
        else renderGridView();
    }
}

function renderTableView() {
    const tbody = document.getElementById('coachesTableBody');
    tbody.innerHTML = filteredData.map(coach => `
        <tr>
            <td>
                <span class="coach-name">${coach.name}</span>
                <span class="coach-meta">${coach.age} years old</span>
            </td>
            <td>${coach.crew}</td>
            <td>
                <span class="coach-badge">${coach.training}${coach.hours ? ' • ' + coach.hours : ''}</span>
            </td>
            <td>${coach.utrUrl ? `<a href="${coach.utrUrl}" target="_blank" class="inline-link">${coach.utrLabel}</a>` : 'N/A'}</td>
            <td>${coach.school}</td>
            <td>${coach.location}</td>
        </tr>
    `).join('');
}

function renderGridView() {
    const grid = document.getElementById('coachesGrid');
    grid.innerHTML = filteredData.map(coach => `
        <div class="coach-card">
            <img src="${coach.photo}" alt="Coach ${coach.name}">
            <div class="coach-card-body">
                <h3>${coach.name}</h3>
                <p><strong>Crew:</strong> ${coach.crew}</p>
                <p><strong>Age:</strong> ${coach.age}</p>
                <p><strong>School:</strong> ${coach.school}</p>
                <p><strong>Location:</strong> ${coach.location}</p>
                <div class="coach-links">
                    ${coach.utrUrl ? `<a href="${coach.utrUrl}" target="_blank">${coach.utrLabel}</a>` : ''}
                    ${coach.profileUrl ? `<a href="${coach.profileUrl}" target="_blank">Training Journey</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('crewSelect').addEventListener('change', applyFilters);

function sortBy(field) {
    sortData(field);
    renderCoaches();
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = field;
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    if (event?.target) event.target.classList.add('active');
    renderCoaches();
}

function updateResultsCount() {
    const count = filteredData.length;
    document.getElementById('resultsCount').textContent = `Showing ${count} coach${count !== 1 ? 'es' : ''}`;
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('crewSelect').value = 'all';
    filteredData = [...coachesData];
    sortData(currentSort);
    renderCoaches();
}

loadCoaches();
