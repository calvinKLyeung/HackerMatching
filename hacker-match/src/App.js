// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileForm from './ProfileForm';
import MatchList from './MatchList';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [lastAddedUserRole, setLastAddedUserRole] = useState(null); // To track the last added user's role

  // Fetch profiles from the backend when the component mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:5001/users');
        setUsers(response.data); // Store the fetched profiles in state
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };
    fetchProfiles();
  }, []);

  const getSuggestedMatches = async (selectedRole) => {
    try {
      const response = await axios.get(`http://localhost:5001/match/${selectedRole}`);
      console.log('Fetched matches:', response.data);
  
      // Ensure matches is always an array, even if only one object is returned
      const matchData = Array.isArray(response.data) ? response.data : [response.data];
      setMatches(matchData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };
  

  // Handle form submission to save profile to the backend
  const handleProfileSubmit = async ({ name, role, description }) => {
    try {
      // Send a POST request to save the profile to the backend
      const response = await axios.post('http://localhost:5001/users', {
        name,
        role,
        description,
      });

      // Update the users state with the newly created user
      setUsers([...users, response.data]);

      // Update the last added user's role
      setLastAddedUserRole(role);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Handle the "Start Matching" button click
  const handleStartMatching = () => {
    if (lastAddedUserRole) {
      getSuggestedMatches(lastAddedUserRole);
    } else {
      console.error('No role specified for matching.');
    }
  };

  return (
    <div className="App">
      <ProfileForm onSubmitProfile={handleProfileSubmit} />
      <button onClick={handleStartMatching} disabled={!lastAddedUserRole}>
        Start Matching
      </button>
      <MatchList matches={matches} />
    </div>
  );
}

export default App;
