// public/swipe.js
class DeveloperCardSwipe {
    constructor() {
        this.currentIndex = 0;
        this.profiles = [];
        this.cardContainer = document.querySelector('.card-container');
        this.noMoreProfiles = document.querySelector('.no-more-profiles');
        
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        // Bind event handlers
        document.querySelector('.reject').addEventListener('click', () => this.swipeLeft());
        document.querySelector('.accept').addEventListener('click', () => this.swipeRight());
        
        // Load initial profiles
        this.loadProfiles();
    }

    async loadProfiles() {
        try {
            const response = await fetch('/api/developers');
            this.profiles = await response.json();
            this.showNextProfile();
        } catch (error) {
            console.error('Error loading profiles:', error);
        }
    }

    // showNextProfile() {
    //     if (this.currentIndex >= this.profiles.length) {
    //         this.cardContainer.style.display = 'none';
    //         this.noMoreProfiles.style.display = 'block';
    //         return;
    //     }

    //     const profile = this.profiles[this.currentIndex];
    //     const card = this.createProfileCard(profile);
        
    //     this.cardContainer.innerHTML = '';
    //     this.cardContainer.appendChild(card);
        
    //     // Add touch handlers
    //     this.addTouchHandlers(card);
    // }
    async showNextProfile() {
        if (this.currentIndex >= this.profiles.length) {
            this.cardContainer.style.display = 'none';
            this.noMoreProfiles.style.display = 'block';
            return;
        }

        const profile = this.profiles[this.currentIndex];
        const card = await this.createProfileCard(profile);
        
        this.cardContainer.innerHTML = '';
        this.cardContainer.appendChild(card);
        
        // Add touch handlers
        this.addTouchHandlers(card);
    }
    


    // Fetch the person's github Profile Pic 
    async fetchGitHubProfile(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error('Failed to fetch GitHub profile');
            const data = await response.json();
            return data.avatar_url;
        } catch (error) {
            console.error('Error fetching GitHub profile:', error);
            return 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'; // Default GitHub logo
        }
    }

    // createProfileCard(profile) {
    //     const card = document.createElement('div');
    //     card.className = 'profile-card';
        
    //     const contributionData = this.generateContributionVisualization();
        
    //     card.innerHTML = `
    //         <div class="profile-image">
    //             <img src="${profile.imageUrl || '/images/placeholder.png'}" 
    //                  alt="${profile.name}" 
    //                  onerror="this.src='/images/placeholder.png'">
    //         </div>
    //         <div class="profile-info">
    //             <h2 class="profile-name">${profile.name}</h2>
    //             <p class="profile-role">${this.formatRole(profile.role)}</p>
                
    //             <div class="profile-links">
    //                 <a href="https://github.com/${profile.github}" target="_blank">
    //                     <img src="./images/github-mark.png" alt="Github" width="20" height="20">
    //                     ${profile.github}
    //                 </a>
    //                 <a href="${profile.linkedin}" target="_blank">
    //                     <img src="./images/linkedinlogo.png" alt="LinkedIn" width="20" height="20">
    //                     LinkedIn
    //                 </a>
    //             </div>

    //             <div class="github-chart">
    //                 <small>GitHub Activity</small>
    //                 <div class="contribution-grid">
    //                     ${contributionData}
    //                 </div>
    //             </div>
    //         </div>
    //     `;
    //     return card;
    // }

    async createProfileCard(profile) {
        const card = document.createElement('div');
        card.className = 'profile-card';
        
        // Fetch GitHub avatar URL
        const avatarUrl = await this.fetchGitHubProfile(profile.github);
        const contributionData = this.generateContributionVisualization();
        
        card.innerHTML = `
            <div class="profile-image">
                <img src="${avatarUrl}" 
                     alt="${profile.name}" 
                     onerror="this.src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'">
            </div>
            <div class="profile-info">
                <h2 class="profile-name">${profile.name}</h2>
                <p class="profile-role">${this.formatRole(profile.role)}</p>
                
                <div class="profile-links">
                    <a href="https://github.com/${profile.github}" target="_blank">
                        <img src="./images/github-mark.png" alt="Github" width="20" height="20">
                        ${profile.github}
                    </a>
                    <a href="${profile.linkedin}" target="_blank">
                        <img src="./images/linkedinlogo.png" alt="LinkedIn" width="20" height="20">
                        LinkedIn
                    </a>
                </div>
    
                <div class="profile-description">
                    <p>${profile.description}</p>
                </div>
    
                <div class="github-chart">
                    <small>GitHub Activity</small>
                    <div class="contribution-grid">
                        ${contributionData}
                    </div>
                </div>
            </div>
        `;
    
        return card;
    }





    generateContributionVisualization() {
        // Generate a simple visualization of contribution activity
        return Array(12).fill(0).map(() => {
            const intensity = Math.random();
            const color = this.getActivityColor(intensity);
            return `<div class="contribution-cell" style="background-color: ${color}"></div>`;
        }).join('');
    }

    getActivityColor(intensity) {
        const hue = 200; // Blue hue
        const saturation = 80;
        const lightness = 95 - (intensity * 40);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    formatRole(role) {
        return role
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('-');
    }

    addTouchHandlers(card) {
        card.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            card.classList.add('swiping');
        });

        card.addEventListener('touchmove', (e) => {
            if (!this.touchStartX) return;

            const touchX = e.touches[0].clientX;
            const diffX = touchX - this.touchStartX;
            card.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.1}deg)`;
        });

        card.addEventListener('touchend', (e) => {
            const diffX = e.changedTouches[0].clientX - this.touchStartX;
            card.classList.remove('swiping');

            if (Math.abs(diffX) > 100) {
                if (diffX > 0) {
                    this.swipeRight();
                } else {
                    this.swipeLeft();
                }
            } else {
                card.style.transform = '';
            }

            this.touchStartX = null;
            this.touchStartY = null;
        });
    }

    swipeLeft() {
        const card = document.querySelector('.profile-card');
        card.classList.add('swipe-left');
        this.handleSwipe('reject');
    }

    swipeRight() {
        const card = document.querySelector('.profile-card');
        card.classList.add('swipe-right');
        this.handleSwipe('accept');
        window.location.href = 'match.html';
    }

    handleSwipe(direction) {
        setTimeout(() => {
            this.currentIndex++;
            this.showNextProfile();
        }, 300);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DeveloperCardSwipe();
});
