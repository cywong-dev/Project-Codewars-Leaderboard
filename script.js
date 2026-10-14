/**
 * Codewars Leaderboard - Junior-Friendly Implementation
 */

// 1. Pure function to extract unique language names from all user objects
function extractAvailableLanguages(usersData) {
    const languagesList = [];

    usersData.forEach(user => {
        // Check if user has ranks and languages properties
        if (user.ranks && user.ranks.languages) {
            const languagesObj = user.ranks.languages;
            const languageNames = Object.keys(languagesObj);

            languageNames.forEach(lang => {
                // Add to list only if not already included
                if (!languagesList.includes(lang)) {
                    languagesList.push(lang);
                }
            });
        }
    });

    // Sort alphabetically
    return languagesList.sort();
}

// 2. Pure function to filter, format, and sort leaderboard data
function getLeaderboardData(usersData, selectedLanguage) {
    const processedUsers = [];

    usersData.forEach(user => {
        let score = 0;
        let hasRanking = false;

        // Check if we want overall score or a specific programming language score
        if (selectedLanguage === 'overall') {
            if (user.ranks && user.ranks.overall) {
                score = user.ranks.overall.score;
                hasRanking = true;
            }
        } else {
            if (user.ranks && user.ranks.languages && user.ranks.languages[selectedLanguage]) {
                score = user.ranks.languages[selectedLanguage].score;
                hasRanking = true;
            }
        }

        // Only include user if they have a ranking for this category
        if (hasRanking) {
            processedUsers.push({
                username: user.username,
                clan: user.clan || '',
                score: score
            });
        }
    });

    // Sort users by score in descending order (highest score first)
    processedUsers.sort((userA, userB) => {
        return userB.score - userA.score;
    });

    return processedUsers;
}

// 3. Fetch user data from Codewars API
async function fetchUserData(username) {
    const cleanName = username.trim();
    const url = `https://www.codewars.com/api/v1/users/${encodeURIComponent(cleanName)}`;

    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`User "${cleanName}" was not found on Codewars.`);
        } else {
            throw new Error(`Failed to fetch data for "${cleanName}". Status code: ${response.status}`);
        }
    }

    const data = await response.json();
    return data;
}

// 4. Main Event Listener (DOM Setup)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('leaderboard-form');
    const usernamesInput = document.getElementById('usernames-input');
    const errorContainer = document.getElementById('error-container');
    const leaderboardSection = document.getElementById('leaderboard-section');
    const languageSelect = document.getElementById('language-select');
    const leaderboardBody = document.getElementById('leaderboard-body');

    // Store fetched user data in memory so we don't have to re-fetch when changing dropdowns
    let cachedUsersData = [];

    form.addEventListener('submit', async (event) => {
        // Prevent page from refreshing on submit
        event.preventDefault();

        // Clear previous errors and hide table
        errorContainer.classList.add('hidden');
        errorContainer.textContent = '';
        leaderboardSection.classList.add('hidden');

        // Get input value and split by commas
        const rawText = usernamesInput.value;
        const usernames = rawText.split(',').map(name => name.trim()).filter(name => name.length > 0);

        if (usernames.length === 0) {
            showError('Please enter at least one username.');
            return;
        }

        try {
            // Create an array of fetch promises
            const promises = usernames.map(name => fetchUserData(name));
            
            // Wait for all fetches to finish (settled lets us catch individual errors)
            const results = await Promise.allSettled(promises);

            const successfulUsers = [];
            const errorMessages = [];

            results.forEach((result) => {
                if (result.status === 'fulfilled') {
                    successfulUsers.push(result.value);
                } else {
                    errorMessages.push(result.reason.message);
                }
            });

            if (successfulUsers.length === 0) {
                showError(errorMessages.join(' '));
           	    clearTable();
                return;
            }

            // Save successful user data
            cachedUsersData = successfulUsers;

            // Populate language drop-down options
            const languages = extractAvailableLanguages(cachedUsersData);
            populateDropdown(languages);

            // Render table with overall view by default
            renderTable(cachedUsersData, 'overall');
            leaderboardSection.classList.remove('hidden');

            // If some users failed but others succeeded, notify the user
            if (errorMessages.length > 0) {
                showError(`Note: Some users could not be loaded. ${errorMessages.join(' ')}`);
            }

        } catch (error) {
            showError('An unexpected error occurred. Please check your internet connection and try again.');
        }
    });

    // Listen for changes on the language dropdown menu
    languageSelect.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        renderTable(cachedUsersData, selectedLanguage);
    });

    function populateDropdown(languages) {
        // Reset to default overall option
        languageSelect.innerHTML = '<option value="overall">Overall Ranking</option>';

        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
            languageSelect.appendChild(option);
        });
    }


    function clearTable() {
	        leaderboardBody.innerHTML = '';
    }

    function renderTable(usersData, selectedLanguage) {
        const tableData = getLeaderboardData(usersData, selectedLanguage);
        leaderboardBody.innerHTML = '';

        if (tableData.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 3;
            cell.textContent = 'No users found with a ranking for this language.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            leaderboardBody.appendChild(row);
            return;
        }

        tableData.forEach((user, index) => {
            const row = document.createElement('tr');

            // Highlight the top user (first row after sorting)
            
	    let winner = "";
	    if (index === 0) {
                winner = "WINNER IS ";
            }

            const tdUsername = document.createElement('td');
            tdUsername.textContent = winner + user.username;

            const tdClan = document.createElement('td');
            tdClan.textContent = user.clan || '-';

            const tdScore = document.createElement('td');
            tdScore.textContent = user.score.toLocaleString();

            row.appendChild(tdUsername);
            row.appendChild(tdClan);
            row.appendChild(tdScore);
            leaderboardBody.appendChild(row);
        });
    }

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }
});

// Export functions for Jest unit testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractAvailableLanguages
    };
}
