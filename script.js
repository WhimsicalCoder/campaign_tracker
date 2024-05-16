document.addEventListener('DOMContentLoaded', function() {
    const addCampaignLink = document.getElementById('add-campaign-link');
    const viewCampaignsLink = document.getElementById('view-campaigns-link');
    const completedCampaignsLink = document.getElementById('completed-campaigns-link');
    const addCampaignSection = document.getElementById('add-campaign');
    const viewCampaignsSection = document.getElementById('view-campaigns');
    const completedCampaignsSection = document.getElementById('completed-campaigns');
    const campaignForm = document.getElementById('campaign-form');
    const campaignsTableBody = document.querySelector('#campaigns-table tbody');
    const completedCampaignsTableBody = document.querySelector('#completed-campaigns-table tbody');

    function showSection(section) {
        addCampaignSection.classList.remove('active');
        viewCampaignsSection.classList.remove('active');
        completedCampaignsSection.classList.remove('active');
        section.classList.add('active');
    }

    addCampaignLink.addEventListener('click', function() {
        showSection(addCampaignSection);
    });

    viewCampaignsLink.addEventListener('click', function() {
        showSection(viewCampaignsSection);
        displayCampaigns();
    });

    completedCampaignsLink.addEventListener('click', function() {
        showSection(completedCampaignsSection);
        displayCompletedCampaigns();
    });

    campaignForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const campaign = {
            id: Date.now(),
            name: campaignForm.name.value,
            startDate: campaignForm['start-date'].value,
            endDate: campaignForm['end-date'].value,
            platform: campaignForm.platform.value,
            flags: campaignForm.flags.value,
            notes: campaignForm.notes.value
        };
        saveCampaign(campaign);
        campaignForm.reset();
    });

    function saveCampaign(campaign) {
        let campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
        campaigns.push(campaign);
        localStorage.setItem('campaigns', JSON.stringify(campaigns));
    }

    function displayCampaigns() {
        let campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
        campaignsTableBody.innerHTML = '';
        campaigns.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        campaigns.forEach(campaign => {
            if (isCompleted(campaign.endDate)) {
                saveCompletedCampaign(campaign);
            } else {
                const row = document.createElement('tr');
                if (isUrgent(campaign.endDate)) {
                    row.classList.add('table-danger');
                }
                row.innerHTML = `
                    <td>${campaign.name}</td>
                    <td>${campaign.startDate}</td>
                    <td>${campaign.endDate}</td>
                    <td>${calculateDaysRemaining(campaign.endDate)}</td>
                    <td>${campaign.platform}</td>
                    <td contenteditable="true" class="editable" data-id="${campaign.id}" data-field="flags">${campaign.flags}</td>
                    <td contenteditable="true" class="editable" data-id="${campaign.id}" data-field="notes">${campaign.notes}</td>
                    <td><button class="delete-btn" data-id="${campaign.id}">Delete</button></td>
                `;
                campaignsTableBody.appendChild(row);
            }
        });
        addEditableListeners();
        addDeleteListeners();
    }

    function displayCompletedCampaigns() {
        let completedCampaigns = JSON.parse(localStorage.getItem('completedCampaigns')) || [];
        completedCampaignsTableBody.innerHTML = '';
        completedCampaigns.forEach(campaign => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${campaign.name}</td>
                <td>${campaign.startDate}</td>
                <td>${campaign.endDate}</td>
                <td>${campaign.platform}</td>
                <td>${campaign.flags}</td>
                <td>${campaign.notes}</td>
            `;
            completedCampaignsTableBody.appendChild(row);
        });
    }

    function isUrgent(endDate) {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = Math.abs(end - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 5;
    }

    function isCompleted(endDate) {
        const today = new Date();
        const end = new Date(endDate);
        return end < today;
    }

    function calculateDaysRemaining(endDate) {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = Math.abs(end - today);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    function saveCompletedCampaign(campaign) {
        let completedCampaigns
