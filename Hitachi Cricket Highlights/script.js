// File: Hitachi Cricket Highlights Script
// Match data
const matchData = {
    dominatorsBatting: [
        { name: 'Prajwal Siwakoti', runs: 55, balls: 37, fours: 4, sixes: 2, sr: 148.65, status: 'not out' },
        { name: 'Ritesh Dhakal', runs: 24, balls: 21, fours: 3, sixes: 0, sr: 114.29, status: 'c Amit Rai b Rabi Chhetri' },
        { name: 'Utsav Acharya', runs: 21, balls: 32, fours: 1, sixes: 1, sr: 65.63, status: 'b Amit Rai' },
        { name: 'Dipesh Sharma', runs: 11, balls: 13, fours: 1, sixes: 0, sr: 84.62, status: 'Run out' },
        { name: 'Rushan Tamrakar', runs: 10, balls: 12, fours: 1, sixes: 0, sr: 83.33, status: 'c Santosh Yadav b Amit Rai' },
        { name: 'Nischal Rokka', runs: 8, balls: 6, fours: 1, sixes: 0, sr: 133.33, status: 'c Swikar Bhattrai b Roshan Yadav' },
        { name: 'Girija Pariyar', runs: 7, balls: 5, fours: 0, sixes: 1, sr: 140.00, status: 'Run out' },
        { name: 'Surya Neupane', runs: 2, balls: 2, fours: 0, sixes: 0, sr: 100.00, status: 'Run out' },
        { name: 'Sangam Lingel', runs: 1, balls: 1, fours: 0, sixes: 0, sr: 100.00, status: 'Run out' }
    ],
    royalsBatting: [
        { name: 'Dipak Mandal', runs: 29, balls: 23, fours: 2, sixes: 2, sr: 126.09, status: 'c Girija Pariyar b Surya Neupane' },
        { name: 'Rabi Chhetri', runs: 18, balls: 27, fours: 0, sixes: 1, sr: 66.67, status: 'b Prajwal Siwakoti' },
        { name: 'Samiran Neupane', runs: 16, balls: 13, fours: 1, sixes: 1, sr: 123.08, status: 'c Jayant Sapkota b Rushan Tamrakar' },
        { name: 'Santosh Yadav', runs: 15, balls: 6, fours: 0, sixes: 2, sr: 250.00, status: 'Run out' },
        { name: 'Swikar Bhattrai', runs: 13, balls: 19, fours: 0, sixes: 0, sr: 68.42, status: 'c Nischal Rokka b Sangam Lingel' },
        { name: 'Suneel Shrestha', runs: 9, balls: 14, fours: 0, sixes: 0, sr: 64.29, status: 'Run out' },
        { name: 'Nabin Adhikari', runs: 8, balls: 11, fours: 0, sixes: 0, sr: 72.73, status: 'b Jayant Sapkota' },
        { name: 'Shikhar Basnet', runs: 3, balls: 6, fours: 0, sixes: 0, sr: 50.00, status: 'c Rushan Tamrakar b Sangam Lingel' },
        { name: 'Roshan Yadav', runs: 3, balls: 5, fours: 0, sixes: 0, sr: 60.00, status: 'c Utsav Acharya b Sangam Lingel' },
        { name: 'Amit Rai', runs: 1, balls: 2, fours: 0, sixes: 0, sr: 50.00, status: 'Run out' },
        { name: 'Nabin Adhikari', runs: 8, balls: 11, fours: 0, sixes: 0, sr: 72.73, status: 'b Jayant Sapkota' }
    ],
    dominatorsBowling: [
        { name: 'Rushan Tamrakar', overs: 4.0, maidens: 0, runs: 18, wickets: 1, economy: 4.50 },
        { name: 'Jayant Sapkota', overs: 3.5, maidens: 0, runs: 21, wickets: 1, economy: 5.48 },
        { name: 'Surya Neupane', overs: 3.0, maidens: 0, runs: 21, wickets: 1, economy: 7.00 },
        { name: 'Sangam Lingel', overs: 2.0, maidens: 0, runs: 21, wickets: 3, economy: 10.50 },
        { name: 'Prajwal Siwakoti', overs: 3.0, maidens: 0, runs: 26, wickets: 1, economy: 8.67 },
        { name: 'Nischal Rokka', overs: 4.0, maidens: 0, runs: 32, wickets: 0, economy: 8.00 }
    ],
    royalsBowling: [
        { name: 'Roshan Yadav', overs: 4.0, maidens: 0, runs: 31, wickets: 1, economy: 7.75 },
        { name: 'Amit Rai', overs: 4.0, maidens: 0, runs: 44, wickets: 2, economy: 11.00 },
        { name: 'Shikhar Basnet', overs: 4.0, maidens: 0, runs: 37, wickets: 0, economy: 9.25 },
        { name: 'Swikar Bhattrai', overs: 4.0, maidens: 0, runs: 29, wickets: 0, economy: 7.25 },
        { name: 'Rabi Chhetri', overs: 3.0, maidens: 0, runs: 22, wickets: 1, economy: 7.33 },
        { name: 'Dipak Mandal', overs: 1.0, maidens: 0, runs: 11, wickets: 0, economy: 11.00 }
    ]
};

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Populate batting tables
function populateBattingTables() {
    const dominatorsTable = document.getElementById('dominatorsBattingTable');
    const royalsTable = document.getElementById('royalsBattingTable');

    // Populate Dominators batting
    matchData.dominatorsBatting.forEach(player => {
        const row = dominatorsTable.insertRow();
        row.innerHTML = `
            <td>${player.name}</td>
            <td class="text-center">${player.runs}</td>
            <td class="text-center">${player.balls}</td>
            <td class="text-center">${player.fours}</td>
            <td class="text-center">${player.sixes}</td>
            <td class="text-center">${player.sr.toFixed(2)}</td>
            <td>${player.status}</td>
        `;
    });

    // Populate Royals batting
    matchData.royalsBatting.forEach(player => {
        const row = royalsTable.insertRow();
        row.innerHTML = `
            <td>${player.name}</td>
            <td class="text-center">${player.runs}</td>
            <td class="text-center">${player.balls}</td>
            <td class="text-center">${player.fours}</td>
            <td class="text-center">${player.sixes}</td>
            <td class="text-center">${player.sr.toFixed(2)}</td>
            <td>${player.status}</td>
        `;
    });
}

// Populate bowling tables
function populateBowlingTables() {
    const dominatorsTable = document.getElementById('dominatorsBowlingTable');
    const royalsTable = document.getElementById('royalsBowlingTable');

    // Populate Dominators bowling
    matchData.dominatorsBowling.forEach(bowler => {
        const row = dominatorsTable.insertRow();
        row.innerHTML = `
            <td>${bowler.name}</td>
            <td class="text-center">${bowler.overs}</td>
            <td class="text-center">${bowler.maidens}</td>
            <td class="text-center">${bowler.runs}</td>
            <td class="text-center">${bowler.wickets}</td>
            <td class="text-center">${bowler.economy.toFixed(2)}</td>
        `;
    });

    // Populate Royals bowling
    matchData.royalsBowling.forEach(bowler => {
        const row = royalsTable.insertRow();
        row.innerHTML = `
            <td>${bowler.name}</td>
            <td class="text-center">${bowler.overs}</td>
            <td class="text-center">${bowler.maidens}</td>
            <td class="text-center">${bowler.runs}</td>
            <td class="text-center">${bowler.wickets}</td>
            <td class="text-center">${bowler.economy.toFixed(2)}</td>
        `;
    });
}

// Create charts
function createCharts() {
    // Top Scorers Chart
    const topScorersCtx = document.getElementById('topScorersChart').getContext('2d');
    const allBatsmen = [...matchData.dominatorsBatting, ...matchData.royalsBatting];
    const topScorers = allBatsmen.sort((a, b) => b.runs - a.runs).slice(0, 8);

    new Chart(topScorersCtx, {
        type: 'bar',
        data: {
            labels: topScorers.map(player => player.name),
            datasets: [{
                label: 'Runs Scored',
                data: topScorers.map(player => player.runs),
                backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
                    '#ef4444', '#06b6d4', '#84cc16', '#f97316'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Strike Rate Chart
    const strikeRateCtx = document.getElementById('strikeRateChart').getContext('2d');
    const qualifiedBatsmen = allBatsmen.filter(player => player.balls >= 5).sort((a, b) => b.sr - a.sr).slice(0, 7);

    new Chart(strikeRateCtx, {
        type: 'line',
        data: {
            labels: qualifiedBatsmen.map(player => player.name),
            datasets: [{
                label: 'Strike Rate',
                data: qualifiedBatsmen.map(player => player.sr),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Dismissal Types Chart
    const dismissalCtx = document.getElementById('dismissalChart').getContext('2d');
    const dismissals = {
        'Bowled': 3,
        'Caught': 5,
        'Run out': 9,
        'Not out': 1
    };

    new Chart(dismissalCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(dismissals),
            datasets: [{
                data: Object.values(dismissals),
                backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Economy Rate Chart
    const economyCtx = document.getElementById('economyChart').getContext('2d');
    const allBowlers = [...matchData.dominatorsBowling, ...matchData.royalsBowling];
    const sortedBowlers = allBowlers.sort((a, b) => a.economy - b.economy);

    new Chart(economyCtx, {
        type: 'bar',
        data: {
            labels: sortedBowlers.map(bowler => bowler.name),
            datasets: [{
                label: 'Economy Rate',
                data: sortedBowlers.map(bowler => bowler.economy),
                backgroundColor: sortedBowlers.map(bowler => 
                    bowler.economy < 6 ? '#10b981' : 
                    bowler.economy < 8 ? '#f59e0b' : '#ef4444'
                )
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 12
                }
            }
        }
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    populateBattingTables();
    populateBowlingTables();
    createCharts();
});