document.addEventListener("DOMContentLoaded", () => {
    const signupSection = document.getElementById("signup-section");
    const swipeSection = document.getElementById("swipe-section");
    const profileCard = document.getElementById("profile-card");
    const profileName = document.getElementById("profile-name");
    const profileRole = document.getElementById("profile-role");
    const profileDescription = document.getElementById("profile-description");

    // Sample profiles
    const profiles = [
        { name: "Alice", role: "Back-End Developer", description: "Specializes in databases and server-side logic." },
        { name: "Bob", role: "Front-End Developer", description: "Expert in UI/UX design and animations." },
        { name: "Charlie", role: "Full-Stack Developer", description: "Experience in both front-end and back-end." },
        { name: "David", role: "Back-End Developer", description: "Focus on security and performance." },
        { name: "Emma", role: "Front-End Developer", description: "Loves building responsive web interfaces." }
    ];

    let currentIndex = 0;
    let matches = [];

    document.getElementById("signup-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const role = document.getElementById("role").value;

        // Filter profiles based on role selection
        let filteredProfiles;
        if (role === "front-end") {
            filteredProfiles = profiles.filter(profile => profile.role === "Back-End Developer");
        } else if (role === "back-end") {
            filteredProfiles = profiles.filter(profile => profile.role === "Front-End Developer");
        } else {
            filteredProfiles = profiles; // full-stack sees all roles
        }

        if (filteredProfiles.length === 0) {
            alert("No matching profiles found.");
            return;
        }

        signupSection.style.display = "none";
        swipeSection.style.display = "block";

        currentIndex = 0;
        matches = [];
        loadProfile(filteredProfiles);
    });

    function loadProfile(filteredProfiles) {
        if (currentIndex < filteredProfiles.length) {
            const profile = filteredProfiles[currentIndex];
            profileName.textContent = `Name: ${profile.name}`;
            profileRole.textContent = `Role: ${profile.role}`;
            profileDescription.textContent = `Description: ${profile.description}`;
        } else {
            profileCard.innerHTML = "<p>No more profiles to show!</p>";
            console.log("Matches:", matches);
        }
    }

    document.getElementById("swipe-left").addEventListener("click", () => {
        currentIndex++;
        loadProfile(profiles);
    });

    document.getElementById("swipe-right").addEventListener("click", () => {
        if (currentIndex < profiles.length) {
            matches.push(profiles[currentIndex]);
        }
        currentIndex++;
        loadProfile(profiles);
    });
});