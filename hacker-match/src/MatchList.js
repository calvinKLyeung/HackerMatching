// src/MatchList.js
import React from 'react';

function MatchList({ matches }) {
  return (
    <section id="match-section" style={{ display: matches.length ? 'block' : 'none' }}>
      <h2>Potential Matches</h2>
      <div id="profile-container">
        {matches.map((match, index) => (
          <div key={index} className="profile">
            <h3>{match.name}</h3>
            <p>Role: {match.role}</p>
            <p>{match.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MatchList;
