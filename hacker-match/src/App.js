// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileForm from './ProfileForm';
import MatchList from './MatchList';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);

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

  // Fetch matches from the backend based on selected role
  const getSuggestedMatches = async (selectedRole) => {
    try {
      const response = await axios.get(`http://localhost:5001/match/${selectedRole}`);
      setMatches(response.data); // Store the matches in state
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

      // Fetch suggested matches based on the new user's role
      getSuggestedMatches(role);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="App">
      <ProfileForm onSubmitProfile={handleProfileSubmit} />
      <MatchList matches={matches} />
    </div>
  );
}

export default App;
