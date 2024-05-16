const campaigns = [
    {
        id: 1,
        campaign_name: "Campaign 1",
        platform_name: "Platform 1",
        start_date: "2024-05-01",
        end_date: "2024-05-20",
        flags: "Flag 1",
        notes: "Note 1",
        status: "active"
    },
    {
        id: 2,
        campaign_name: "Campaign 2",
        platform_name: "Platform 2",
        start_date: "2024-05-05",
        end_date: "2024-05-15",
        flags: "Flag 2",
        notes: "Note 2",
        status: "active"
    }
];

function isEndingSoon(endDate) {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = Math.abs(end - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5;
}

function renderTable() {
    const tbody = document.querySelector("#campaignTable tbody");
    tbody.innerHTML = "";

    campaigns.forEach(campaign => {
        if (campaign.status === "active") {
            const row = document.createElement("tr");
            if (isEndingSoon(campaign.end_date)) {
                row.classList.add("ending-soon");
            }
            row.innerHTML = `
                <td>${campaign.campaign_name}</td>
                <td>${campaign.platform_name}</td>
                <td>${campaign.start_date}</td>
                <td>${campaign.end_date}</td>
                <td>${campaign.flags}</td>
                <td>${campaign.notes}</td>
                <td><button onclick="completeCampaign(${campaign.id})">Complete</button></td>
            `;
            tbody.appendChild(row);
        }
    });
}

function completeCampaign(id) {
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
        campaign.status = "completed";
        renderTable();
    }
}

document.addEventListener("DOMContentLoaded", renderTable);
