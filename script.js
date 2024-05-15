document.addEventListener('DOMContentLoaded', function() {
    const addCampaignLink = document.getElementById('add-campaign-link');
    const viewCampaignsLink = document.getElementById('view-campaigns-link');
    const addCampaignSection = document.getElementById('add-campaign');
    const viewCampaignsSection = document.getElementById('view-campaigns');
    const campaignForm = document.getElementById('campaign-form');
    const campaignsTableBody = document.querySelector('#campaigns-table tbody');

    function showSection(section) {
        addCampaignSection.classList.remove('active');
        viewCampaignsSection.classList.remove('active');
        section.classList.add('active');
    }

    addCampaignLink.addEventListener('click', function() {
        showSection(addCampaignSection);
    });

    viewCampaignsLink.addEventListener('click', function() {
        showSection(viewCampaignsSection);
        displayCampaigns();
    });

    campaignForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const campaign = {
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
        campaigns.forEach(campaign => {
            const row = document.createElement('tr');
            if (isUrgent(campaign.endDate)) {
                row.classList.add('table-danger');
            }
            row.innerHTML = `
                <td>${campaign.name}</td>
                <td>${campaign.startDate}</td>
                <td>${campaign.endDate}</td>
                <td>${campaign.platform}</td>
                <td>${campaign.flags}</td>
                <td>${campaign.notes}</td>
            `;
            campaignsTableBody.appendChild(row);
        });
    }

    function isUrgent(endDate) {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = Math.abs(end - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 5;
    }

    // Show the add campaign section by default
    showSection(addCampaignSection);
});
