// src/App.js
import React, { useState } from 'react';
import ProfileForm from './ProfileForm';
import MatchList from './MatchList';
import './App.css';

const profiles = [
  { name: 'Alice', role: 'Front-end Developer', description: 'Experienced in React and CSS' },
  { name: 'Bob', role: 'Back-end Developer', description: 'Skilled in Node.js and Databases' },
  { name: 'Charlie', role: 'Full-stack Developer', description: 'Proficient in JavaScript and Python' },
  // Add more profiles
];

function App() {
  const [matches, setMatches] = useState([]);

  const getSuggestedMatches = (selectedRole) => {
    const roleMatches = {
      'Front-end Developer': ['Back-end Developer', 'Full-stack Developer'],
      'Back-end Developer': ['Front-end Developer', 'Full-stack Developer'],
      'Full-stack Developer': ['Front-end Developer', 'Back-end Developer', 'Full-stack Developer'],
    };
    const matchedRoles = roleMatches[selectedRole] || [];
    return profiles.filter((profile) => matchedRoles.includes(profile.role));
  };

  const handleProfileSubmit = ({ name, role, description }) => {
    const suggestions = getSuggestedMatches(role);
    setMatches(suggestions);
  };

  return (
    <div className="App">
      <ProfileForm onSubmitProfile={handleProfileSubmit} />
      <MatchList matches={matches} />
    </div>
  );
}

export default App;
