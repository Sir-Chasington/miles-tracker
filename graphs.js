const milesPerYear = 10000;
const daysInYear = 365;
const leaseYears = 3;
const totalMiles = milesPerYear * leaseYears;
const milesPerDay = totalMiles / (daysInYear * leaseYears);

const purchaseDate = new Date(2024, 2, 15);
const currentDate = new Date();
const timeLapsed = currentDate.getTime() - purchaseDate.getTime();
const daysLapsed = Math.floor(timeLapsed / (1000 * 3600 * 24));

// Initialize actual miles used with 0 initially
let actualMilesUsed = 0;

const allowedMiles = [];
const actualMiles = [];
const days = [];

// Calculate allowed miles and actual miles for each day
for (let i = 0; i <= daysLapsed; i++) {
    allowedMiles.push(milesPerDay * i);
    actualMiles.push(0); // Initialize actual miles with 0
    days.push(i);
}

const ctx1 = document.getElementById('mileageChart').getContext('2d');
const mileageChart = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: days,
        datasets: [{
            label: 'Allowed Miles',
            data: allowedMiles,
            fill: false,
            borderColor: '#1E88E5', // Cobalt Blue
            backgroundColor: '#1E88E5', // Cobalt Blue
            tension: 0.1
        },
        {
            label: 'Actual Miles Used',
            data: actualMiles, // Initially filled with 0
            fill: false,
            borderColor: '#FFC107', // Amber
            backgroundColor: '#FFC107', // Amber
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Days Since Purchase'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Miles'
                }
            }
        }
    }
});

const initialActualMilesUsed = 0; // Initial value for actual miles used

const ctx2 = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Allowed Miles', 'Actual Miles Used'],
        datasets: [{
            label: 'Allowed Miles',
            data: [allowedMiles[daysLapsed], 0], // Initially set actual miles used to 0
            backgroundColor: 'rgba(30, 136, 229, 0.5)', // Cobalt Blue with opacity
            borderColor: 'rgba(30, 136, 229, 1)', // Cobalt Blue
            borderWidth: 1
        },
        {
            label: 'Actual Miles Used',
            data: [0, initialActualMilesUsed], // Set initial actual miles used
            backgroundColor: 'rgba(255, 193, 7, 0.5)', // Amber with opacity
            borderColor: 'rgba(255, 193, 7, 1)', // Amber
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const ctx3 = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(ctx3, {
    type: 'pie',
    data: {
        labels: ['Allowed Miles', 'Actual Miles Used'],
        datasets: [{
            label: 'Miles',
            data: [allowedMiles[daysLapsed], 0], // Initially set actual miles used to 0
            backgroundColor: [
                'rgba(30, 136, 229, 0.5)', // Cobalt Blue with opacity
                'rgba(255, 193, 7, 0.5)' // Amber with opacity
            ],
            borderColor: [
                'rgba(30, 136, 229, 1)', // Cobalt Blue
                'rgba(255, 193, 7, 1)' // Amber
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const ctx4 = document.getElementById('doughnutChart').getContext('2d');
const doughnutChart = new Chart(ctx4, {
    type: 'doughnut',
    data: {
        labels: ['Total Miles Allowed', 'Actual Miles Used'],
        datasets: [{
            label: 'Miles',
            data: [totalMiles, 0], // Initially set actual miles used to 0
            backgroundColor: [
                'rgba(30, 136, 229, 0.5)', // Cobalt Blue with opacity
                'rgba(255, 193, 7, 0.5)' // Amber with opacity
            ],
            borderColor: [
                'rgba(30, 136, 229, 1)', // Cobalt Blue
                'rgba(255, 193, 7, 1)' // Amber
            ],
            borderWidth: 1
        }]
    },
    options: {}
});

// Check if there's a value stored in localStorage for actual miles used
const storedActualMilesUsed = localStorage.getItem('actualMilesUsed');
if (storedActualMilesUsed !== null) {
    // Parse the stored value as an integer
    actualMilesUsed = parseInt(storedActualMilesUsed);

    // Update the charts with the stored value
    updateCharts(actualMilesUsed);
}

// Function to update the charts
function updateCharts(newActualMilesUsed) {
    // Update the actual miles used in the datasets
    actualMiles[daysLapsed] = newActualMilesUsed;
    barChart.data.datasets[1].data[1] = newActualMilesUsed;
    pieChart.data.datasets[0].data[1] = newActualMilesUsed;
    doughnutChart.data.datasets[0].data[1] = newActualMilesUsed;

    // Update the mileage chart with a single data point for actual miles
    mileageChart.data.datasets[1].data = [{ x: daysLapsed, y: newActualMilesUsed }];

    // Update all charts
    mileageChart.update();
    barChart.update();
    pieChart.update();
    doughnutChart.update();

    // Update difference after updating charts
    updateDifference(newActualMilesUsed);
}


// Add event listener to the input field
document.getElementById('actualMilesInput').addEventListener('keydown', function(event) {
    // Check if the enter key (key code 13) is pressed
    if (event.keyCode === 13) {
        // Prevent the default behavior of the enter key (form submission)
        event.preventDefault();

        // Get the actual miles input field value
        const actualMilesInput = document.getElementById('actualMilesInput').value;
        
        // Parse the input value as an integer
        const newActualMilesUsed = parseInt(actualMilesInput);

        // Update localStorage with the new value of actual miles used
        localStorage.setItem('actualMilesUsed', newActualMilesUsed);

        // Update the charts with the new value
        updateCharts(newActualMilesUsed);
    }
});

// Add event listener to the submit button
document.getElementById('submitBtn').addEventListener('click', function() {
    // Get the actual miles input field value
    const actualMilesInput = document.getElementById('actualMilesInput').value;
    
    // Parse the input value as an integer
    const newActualMilesUsed = parseInt(actualMilesInput);

    // Update localStorage with the new value of actual miles used
    localStorage.setItem('actualMilesUsed', newActualMilesUsed);

    // Update the charts with the new value
    updateCharts(newActualMilesUsed);
});

function updateDifference(newActualMilesUsed) {
    // Calculate the difference between miles allowed and miles used
    const difference = allowedMiles[daysLapsed] - newActualMilesUsed;

    // Get the difference element
    const differenceElement = document.querySelector('.difference');

    // Set the text content of the difference element
    if (difference > 0) {
        differenceElement.textContent = `Under ${difference.toFixed(2)} miles`;
        differenceElement.classList.remove('over');
        differenceElement.classList.add('under');
    } else if (difference < 0) {
        differenceElement.textContent = `Over ${Math.abs(difference).toFixed(2)} miles`;
        differenceElement.classList.remove('under');
        differenceElement.classList.add('over');
    } else {
        differenceElement.textContent = "Miles used are equal to miles allowed";
        differenceElement.classList.remove('under', 'over');
    }
}
