// src/MatchList.js
import React from 'react';

function MatchList({ matches }) {
  // Ensure matches is always an array
  const matchArray = Array.isArray(matches) ? matches : [];

  return (
    <section id="match-section" style={{ display: matchArray.length ? 'block' : 'none' }}>
      <h2>Potential Matches</h2>
      <div id="profile-container">
        {matchArray.length > 0 ? (
          matchArray.map((match, index) => (
            <div key={index} className="profile">
              <h3>{match.name}</h3>
              <p>Role: {match.role}</p>
              <p>{match.description}</p>
            </div>
          ))
        ) : (
          <p>No matches found</p> // Display message if no matches
        )}
      </div>
    </section>
  );
}

export default MatchList;
