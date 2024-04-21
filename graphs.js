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
    updateCharts();
}

// Function to update the charts
function updateCharts() {
    // Get the actual miles input element
    const actualMilesInput = document.getElementById('actualMilesInput');

    // Check if there's a value in localStorage for actual miles used
    const storedActualMilesUsed = localStorage.getItem('actualMilesUsed');

    // If there's a value in localStorage, use that as the new actual miles used
    if (storedActualMilesUsed !== null) {
        // Set the value of the actual miles input to the value from localStorage
        actualMilesInput.value = storedActualMilesUsed;

        // Parse the stored value as an integer
        actualMilesUsed = parseInt(storedActualMilesUsed);
    } else {
        // If no value is stored in localStorage, use the value from the input field
        actualMilesUsed = parseInt(actualMilesInput.value);

        // Update localStorage with the new value of actual miles used
        localStorage.setItem('actualMilesUsed', actualMilesUsed);
    }

    // Update the actual miles used in the datasets
    actualMiles[daysLapsed] = actualMilesUsed;
    barChart.data.datasets[1].data[1] = actualMilesUsed;
    pieChart.data.datasets[0].data[1] = actualMilesUsed;
    doughnutChart.data.datasets[0].data[1] = actualMilesUsed;

    // Update the mileage chart with a single data point for actual miles
    mileageChart.data.datasets[1].data = [{ x: daysLapsed, y: actualMilesUsed }];

    // Update all charts
    mileageChart.update();
    barChart.update();
    pieChart.update();
    doughnutChart.update();
}



