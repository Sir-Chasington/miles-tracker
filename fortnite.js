// May 24, 2024 START
// August 16, 2024 END
const levelsToReach = 50;
const startDateYear = 2024;
const startDateMonth = 10;
const startDateDay = 2;
const endDateYear = 2024;
const endDateMonth = 11;
const endDateDay = 1;

const maxLevelToReach = levelsToReach * 2
const startDate = new Date(startDateYear, startDateMonth, startDateDay).valueOf()

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const today = new Date().setHours(0,0,0,0);
const endOfSeason = new Date(endDateYear, endDateMonth, endDateDay).valueOf()

const daysLapsed = Math.ceil((today - startDate) / oneDay); // Calculate days lapsed
const daysInSeason = Math.round((endOfSeason - startDate) / oneDay); // Calculate days in season
const levelsADay = levelsToReach / daysInSeason;
const levelsADay200 = maxLevelToReach / daysInSeason;

const levelNeeded = daysLapsed * levelsADay;
const levelNeeded200 = daysLapsed * levelsADay200;

const daysLeft = Math.round(Math.abs((today - endOfSeason) / oneDay));
const level100Message = `You need to be at level ${levelNeeded.toFixed(1)} to get to 100 before season end`;
const level200Message = `You need to be at level ${levelNeeded200.toFixed(1)} to get to 200 before season end`;

const startFormatted = `${startDateMonth+1}/${startDateDay}/${startDateYear}`;
const endFormatted = `${endDateMonth+1}/${endDateDay}/${endDateYear}`;

// Update dashboard
document.getElementById('levelsTo100').innerHTML = level100Message;
document.getElementById('levelsTo200').innerHTML = level200Message;
document.getElementById('levelsADay').innerHTML = `${levelsADay.toFixed(2)} levels a day to get to 100`;
document.getElementById('levelsADay200').innerHTML = `${levelsADay200.toFixed(2)} levels a day to get to 200`;
document.getElementById('seasonStart').innerHTML = `Season Start: ${startFormatted}`;
document.getElementById('seasonEnd').innerHTML = `Season End: ${endFormatted}`;

// Define an array containing all the days in the season
const allDays = Array.from({ length: daysInSeason }, (_, i) => i + 1);

const levelsData100 = Array.from({ length: daysInSeason }, (_, i) => {
    return (levelsADay * (i + 1)).toFixed(1);
});

const levelsData200 = Array.from({ length: daysInSeason }, (_, i) => {
    return (levelsADay200 * (i + 1)).toFixed(1);
});

// Create levels chart
const levelsCtx = document.getElementById('levelsChart').getContext('2d');
const levelsChart = new Chart(levelsCtx, {
    type: 'line',
    data: {
        labels: allDays, // Use allDays array as labels
        datasets: [
            {
                label: 'Levels to 100',
                data: levelsData100,
                borderColor: '#f44336', // Red
                backgroundColor: 'rgba(244, 67, 54, 0.2)', // Red with opacity
                tension: 0.1
            },
            {
                label: 'Levels to 200',
                data: levelsData200,
                borderColor: '#2196f3', // Blue
                backgroundColor: 'rgba(33, 150, 243, 0.2)', // Blue with opacity
                tension: 0.1
            },
            {
                label: 'Current Day',
                data: [{ x: daysLapsed, y: levelNeeded.toFixed(1) }, { x: daysLapsed, y: levelNeeded200.toFixed(1) }],
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red with opacity
                borderColor: 'rgba(255, 99, 132, 1)', // Red
                borderWidth: 1,
                pointRadius: 8,
                pointHoverRadius: 10
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
