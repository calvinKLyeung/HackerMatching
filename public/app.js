// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const profileContainer = document.getElementById('profile-container');
    const filterRole = document.getElementById('filter-role');
    const ourRole = document.getElementById('user-role');
    
    let developers = [];

    // Load existing profiles
    loadProfiles();

    // Event Listeners
    signupForm.addEventListener('submit', handleSubmit);
    // filterRole.addEventListener('change', handleFilter);
    ourRole.addEventListener('change', handleFilter);

    async function handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            role: document.getElementById('role').value,
            github: document.getElementById('github').value,
            linkedin: document.getElementById('linkedin').value,
            description: document.getElementById('description').value
        };

        try {
            const response = await fetch('/api/developers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newDeveloper = await response.json();
                developers.unshift(newDeveloper); // Add to the beginning of the array
                displayProfiles(developers);
                signupForm.reset();
                showNotification('Profile created successfully!');
            } else {
                const error = await response.json();
                showNotification(`Error: ${error.message}`, 'error');
            }
        } catch (error) {
            showNotification('Error creating profile. Please try again.', 'error');
        }
    }

    async function loadProfiles() {
        try {
            const response = await fetch('/api/developers');
            developers = await response.json();
            displayProfiles(developers);
        } catch (error) {
            showNotification('Error loading profiles. Please refresh the page.', 'error');
        }
    }

    function handleFilter() {
        console.log(ourRole)
        const selectedRole = ourRole.value;
        const filteredDevelopers = selectedRole
            ? developers.filter(dev => dev.role === selectedRole)
            : developers;

        console.log(filteredDevelopers, selectedRole)
        const swipeButton = document.getElementById('swipe-button')
        console.log(swipeButton, swipeButton.getAttribute("href"))
        console.log(selectedRole)
        swipeButton.setAttribute("href", swipeButton.getAttribute("href") + "?role=" + selectedRole)
        displayProfiles(filteredDevelopers);
    }

    function displayProfiles(profilesToShow) {
        profileContainer.innerHTML = profilesToShow
            .map(dev => `
                <div class="profile-card">
                    <h3>${escapeHtml(dev.name)}</h3>
                    <p class="role">${formatRole(dev.role)}</p>

                    <p class="github">
                        <img src="./images/github-mark.png" alt="Github logo" width="23" height="23" />
                        ${escapeHtml(dev.github)}
                    </p>

                    <p class="linkedin">
                        <img src="./images/linkedinlogo.png" alt="Linkedin logo" width="23" height="23"/>
                        ${escapeHtml(dev.linkedin)}
                    </p>
                    <p class="description">${escapeHtml(dev.description)}</p>
                    <p class="timestamp">Created: ${formatDate(dev.createdAt)}</p>
                </div>
            `)
            .join('');
    }

    function formatRole(role) {
        return role
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('-');
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});