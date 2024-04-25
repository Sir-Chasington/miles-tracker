const levelsToReach = 100;
const startDateYear = 2024;
const startDateMonth = 2;
const startDateDay = 8;
const endDateYear = 2024;
const endDateMonth = 4;
const endDateDay = 24;

const maxLevelToReach = levelsToReach * 2
const startDate = new Date(startDateYear, startDateMonth, startDateDay).valueOf()

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const today = new Date().setHours(0,0,0,0);
const endOfSeason = new Date(endDateYear, endDateMonth, endDateDay).valueOf()

const daysLapsed = ((today - startDate) / 1000 / 60 / 60 / 24) + 1
const daysInSeason = Math.round(Math.abs((startDate - endOfSeason) / oneDay))
const levelsADay = levelsToReach / daysInSeason
const levelsADay200 = maxLevelToReach / daysInSeason

const levelNeeded = daysLapsed * levelsADay
const levelNeeded200 = daysLapsed * levelsADay200

const daysLeft = Math.round(Math.abs((today - endOfSeason) / oneDay));
const level100Message = `You need to be at level ${levelNeeded.toFixed(1)} to get to 100 before season end`;
const level200Message = `You need to be at level ${levelNeeded200.toFixed(1)} to get to 200 before season end`;

const startFormatted = `${startDateMonth}/${startDateDay}/${startDateYear}`;
const endFormatted = `${endDateMonth}/${endDateDay}/${endDateYear}`;

// Update dashboard
document.getElementById('levelsTo100').innerHTML = level100Message;
document.getElementById('levelsTo200').innerHTML = level200Message;
document.getElementById('levelsADay').innerHTML = `${levelsADay.toFixed(2)} levels a day to get to 100`;
document.getElementById('levelsADay200').innerHTML = `${levelsADay200.toFixed(2)} levels a day to get to 200`;
document.getElementById('seasonStart').innerHTML = `Season Start: ${startFormatted}`;
document.getElementById('seasonEnd').innerHTML = `Season End: ${endFormatted}`;

// Create levels chart
const levelsCtx = document.getElementById('levelsChart').getContext('2d');
const levelsChart = new Chart(levelsCtx, {
    type: 'line',
    data: {
        labels: ['Start', 'Today', 'End'],
        datasets: [
            {
                label: 'Current Level Needed For 100',
                data: [0, levelNeeded, levelsToReach],
                borderColor: '#f44336', // Red
                backgroundColor: 'rgba(244, 67, 54, 0.2)', // Red with opacity
                tension: 0.1
            },
            {
                label: 'Current Level Needed For 200',
                data: [0, levelNeeded200, maxLevelToReach],
                borderColor: '#2196f3', // Blue
                backgroundColor: 'rgba(33, 150, 243, 0.2)', // Blue with opacity
                tension: 0.1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Levels'
                }
            }
        }
    }
});


// Create days chart
const daysCtx = document.getElementById('daysChart').getContext('2d');
const daysChart = new Chart(daysCtx, {
    type: 'doughnut',
    data: {
        labels: ['Days Left', 'Days Passed'],
        datasets: [{
            label: 'Days in Season',
            data: [daysLeft, daysInSeason - daysLeft],
            backgroundColor: ['#ff9800', '#4caf50'], // Orange and Green
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        }
    }
});
