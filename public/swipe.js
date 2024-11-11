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
            const devs = await response.json();
            const urlParams = new URLSearchParams(window.location.search);
            const role = urlParams.get('role');
            console.log(role)
            console.log(devs)
            this.profiles = role
            ? devs.filter(dev => dev.role !== role)
            : devs;
            console.log(this.profiles)
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

    // async createProfileCard(profile) {
    //     const card = document.createElement('div');
    //     card.className = 'profile-card';
        
    //     // Fetch GitHub avatar URL
    //     const avatarUrl = await this.fetchGitHubProfile(profile.github);
    //     const contributionData = this.generateContributionVisualization();
        
    //     card.innerHTML = `
    //         <div class="profile-image">
    //             <img src="${avatarUrl}" 
    //                  alt="${profile.name}" 
    //                  onerror="this.src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'">
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
    
    //             <div class="profile-description">
    //                 <p>${profile.description}</p>
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


    // async createProfileCard(profile) {
    //     const card = document.createElement('div');
    //     card.className = 'profile-card';
        
    //     // Fetch both GitHub avatar and contributions
    //     const [avatarUrl, contributions] = await Promise.all([
    //         this.fetchGitHubProfile(profile.github),
    //         this.fetchGitHubContributions(profile.github)
    //     ]);
        
    //     card.innerHTML = `
    //         <div class="profile-image">
    //             <img src="${avatarUrl}" 
    //                  alt="${profile.name}" 
    //                  onerror="this.src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'">
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
    
    //             <div class="profile-description">
    //                 <p>${profile.description}</p>
    //             </div>
    
    //             <div class="github-chart">
    //                 <small>GitHub Activity (Last 12 Weeks)</small>
    //                 <div class="contribution-grid">
    //                     ${this.generateContributionVisualization(contributions)}
    //                 </div>
    //                 <div class="contribution-legend">
    //                     <span class="legend-label">Less</span>
    //                     <div class="legend-cells">
    //                         ${this.generateLegend()}
    //                     </div>
    //                     <span class="legend-label">More</span>
    //                 </div>
    //             </div>
    //         </div>
    //     `;
    //     return card;
    // }



    async createProfileCard(profile) {
        const card = document.createElement('div');
        card.className = 'profile-card';
        
        // Fetch both GitHub avatar and contributions
        const [avatarUrl, contributions] = await Promise.all([
            this.fetchGitHubProfile(profile.github),
            this.fetchGitHubContributions(profile.github)
        ]);
        
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
                    <small>GitHub Activity (Last 12 Months)</small>
                    <div class="contribution-grid">
                        ${this.generateContributionVisualization(contributions)}
                    </div>
                </div>
            </div>
        `;
        return card;
    }











    async fetchGitHubContributions(username) {
        try {
            const response = await fetch(`/api/github/${username}/contributions`);
            if (!response.ok) throw new Error('Failed to fetch GitHub contributions');
            return await response.json();
        } catch (error) {
            console.error('Error fetching GitHub contributions:', error);
            return Array(12).fill(0);
        }
    }





    // generateContributionVisualization() {
    //     // Generate a simple visualization of contribution activity
    //     return Array(12).fill(0).map(() => {
    //         const intensity = Math.random();
    //         const color = this.getActivityColor(intensity);
    //         return `<div class="contribution-cell" style="background-color: ${color}"></div>`;
    //     }).join('');
    // }

    // generateContributionVisualization(contributions) {
    //     const maxContributions = Math.max(...contributions, 1); // Avoid division by zero
        
    //     return contributions.map((count, index) => {
    //         const intensity = count / maxContributions;
    //         const color = this.getActivityColor(intensity);
    //         const weeksAgo = 11 - index;
    //         const tooltip = `${count} contributions ${weeksAgo} week${weeksAgo === 1 ? '' : 's'} ago`;
            
    //         return `<div class="contribution-cell" 
    //                      style="background-color: ${color}" 
    //                      title="${tooltip}"></div>`;
    //     }).join('');
    // }

    generateContributionVisualization(contributions) {
        const maxContributions = Math.max(...contributions, 1); // Avoid division by zero
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        // Get current month index
        const currentMonthIndex = new Date().getMonth();
        
        return contributions.map((count, index) => {
            const intensity = count / maxContributions;
            const color = this.getActivityColor(intensity);
            
            // Calculate the month for this cell
            const monthIndex = (currentMonthIndex - (11 - index) + 12) % 12;
            const monthName = months[monthIndex];
            
            const tooltip = `${count} contributions in ${monthName}`;
            
            return `<div class="contribution-cell" 
                         style="background-color: ${color}" 
                         title="${tooltip}"></div>`;
        }).join('');
    }

    







    // getActivityColor(intensity) {
    //     const hue = 200; // Blue hue
    //     const saturation = 80;
    //     const lightness = 95 - (intensity * 40);
    //     return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    // }

    // getActivityColor(intensity) {
    //     if (intensity === 0) return '#ebedf0';
    //     if (intensity <= 0.25) return '#9be9a8';
    //     if (intensity <= 0.5) return '#40c463';
    //     if (intensity <= 0.75) return '#30a14e';
    //     return '#216e39';
    // }


    getActivityColor(intensity) {
        if (intensity === 0) return '#ebedf0';
        if (intensity <= 0.25) return '#9be9a8';
        if (intensity <= 0.5) return '#40c463';
        if (intensity <= 0.75) return '#30a14e';
        return '#216e39';
    }


    generateLegend() {
        const intensities = [0, 0.25, 0.5, 0.75, 1];
        return intensities
            .map(intensity => {
                const color = this.getActivityColor(intensity);
                return `<div class="legend-cell" style="background-color: ${color}"></div>`;
            })
            .join('');
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

    // swipeRight() {
    //     const card = document.querySelector('.profile-card');
    //     card.classList.add('swipe-right');
    
    //     const profile = this.profiles[this.currentIndex];
        
    //     // Fetch the avatar URL if it's not already available in the profile
    //     if (profile && profile.github) {
    //         this.fetchGitHubProfile(profile.github).then(avatarUrl => {
    //             localStorage.setItem("matchedAvatarUrl", avatarUrl);
    //             console.log("Saved avatar URL to localStorage:", avatarUrl); // Debug log
    //             window.location.href = 'match.html';
    //         });
    //     } else {
    //         console.warn("No GitHub username available for this profile:", profile);
    //         window.location.href = 'match.html';
    //     }
    // }

    swipeRight() {
        const card = document.querySelector('.profile-card');
        card.classList.add('swipe-right');
    
        const profile = this.profiles[this.currentIndex];
        
        // Store all profile data when there's a match
        if (profile && profile.github) {
            this.fetchGitHubProfile(profile.github).then(avatarUrl => {
                // Store the avatar URL
                localStorage.setItem("matchedAvatarUrl", avatarUrl);
                
                // Store the complete profile data
                localStorage.setItem("matchedProfile", JSON.stringify({
                    name: profile.name,
                    role: profile.role,
                    github: profile.github,
                    linkedin: profile.linkedin,
                    description: profile.description
                }));
    
                console.log("Saved profile data to localStorage:", profile); // Debug log
                this.handleSwipe('accept');
                window.location.href = 'match.html';
            });
        } else {
            console.warn("No GitHub username available for this profile:", profile);
            this.handleSwipe('accept');
            window.location.href = 'match.html';
        }
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
