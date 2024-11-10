// src/ProfileForm.js
import React, { useState } from 'react';

function ProfileForm({ onSubmitProfile }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitProfile({ name, role, description });
  };

  return (
    <section id="signup-section">
      <h2>Create Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Your Role</option>
          <option value="Front-end Developer">Front-End Developer</option>
          <option value="Back-end Developer">Back-End Developer</option>
          <option value="Full-stack Developer">Full-Stack Developer</option>
        </select>
        <textarea
          placeholder="Describe your skills, goals, interests (max 100 words)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength="100"
          required
        />
        <button type="submit">Create Profile</button>
      </form>
    </section>
  );
}

export default ProfileForm;
