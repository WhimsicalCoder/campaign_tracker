import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [campaigns, setCampaigns] = useState([]);
  
  useEffect(() => {
    fetchCampaigns();
  }, []);
  
  const fetchCampaigns = async () => {
    const response = await axios.get('/campaigns');
    setCampaigns(response.data);
  };

  const completeCampaign = async (id) => {
    await axios.post(`/campaigns/${id}/complete`);
    fetchCampaigns();
  };

  const isEndingSoon = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = Math.abs(end - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5;
  };

  return (
    <div className="App">
      <h1>Campaign Tracker</h1>
      <table>
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Platform</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Flags</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className={isEndingSoon(campaign.end_date) ? 'ending-soon' : ''}>
              <td>{campaign.campaign_name}</td>
              <td>{campaign.platform_name}</td>
              <td>{campaign.start_date}</td>
              <td>{campaign.end_date}</td>
              <td>{campaign.flags}</td>
              <td>{campaign.notes}</td>
              <td>
                <button onClick={() => completeCampaign(campaign.id)}>Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
