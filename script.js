document.addEventListener('DOMContentLoaded', () => {
    const toggleFormBtn = document.getElementById('toggle-form-btn');
    const formContainer = document.getElementById('form-container');
    const form = document.getElementById('campaign-form');
    const campaignTableBody = document.getElementById('campaign-table-body');

    toggleFormBtn.addEventListener('click', () => {
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const campaignName = document.getElementById('campaign-name').value;
        const platformName = document.getElementById('platform-name').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const flags = document.getElementById('flags').value;
        const notes = document.getElementById('notes').value;

        addCampaign(campaignName, platformName, startDate, endDate, flags, notes);
        form.reset();
        formContainer.style.display = 'none';
    });

    function addCampaign(campaignName, platformName, startDate, endDate, flags, notes) {
        const row = document.createElement('tr');

        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 5) {
            row.classList.add('ending-soon');
        }

        row.innerHTML = `
            <td>${campaignName}</td>
            <td>${platformName}</td>
            <td>${startDate}</td>
            <td>${endDate}</td>
            <td contenteditable="true">${flags}</td>
            <td contenteditable="true">${notes}</td>
            <td><button onclick="completeCampaign(this)">Complete</button></td>
        `;

        campaignTableBody.appendChild(row);
    }

    window.completeCampaign = function (button) {
        const row = button.parentElement.parentElement;
        row.remove();
        // Optionally, add code here to handle completed campaigns, e.g., move to another table or list
    };
});
