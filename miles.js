const milesPerYear = 10000;
const daysInYear = 365;
const leaseYears = 3;
const totalMiles = milesPerYear * leaseYears;
const milesPerDay = Number(totalMiles / (daysInYear * leaseYears)).toFixed(0);

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

const currentMonth = currentDate.getMonth();
const nextMonth = (currentMonth + 1) % 12; // Get the index of the next month
const year = currentDate.getFullYear();

// Calculate the start and end dates for the current month cycle
const startOfMonth = new Date(year, currentMonth, 15);
const endOfMonth = new Date(year, nextMonth, 14);

// Calculate the month where the 15th starts
const monthWhere15thStarts = startOfMonth.toLocaleString('default', { month: 'long' });

// Calculate the number of days in the current month cycle
const daysInMonthCycle = Math.ceil((endOfMonth.getTime() - startOfMonth.getTime()) / (1000 * 3600 * 24)) + 1;

// Calculate allowed miles in the current month
const allowedMilesInMonth = (milesPerDay * daysInMonthCycle).toFixed(0);

// Calculate the number of days since the 15th of the month\
const currentDay = currentDate.getDate();

let daysSinceStartOfMonth;

if (currentDay >= 15) {
    // Case 1: Current date is on or after the 15th of the month
    daysSinceStartOfMonth = currentDay - 14;
} else {
    // Case 2: Current date is before the 15th of the month
    const daysInLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    const daysFromLastMonth = daysInLastMonth - 14;
    const daysFromThisMonth = currentDay;
    daysSinceStartOfMonth = daysFromLastMonth + daysFromThisMonth;
}

// Calculate potential current miles for the current month
const potentialCurrentMiles = (milesPerDay * daysSinceStartOfMonth).toFixed(0);

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
                },
                ticks: {
                    precision: 0 // Remove decimal points
                }
            }
        }
    }
});

const initialActualMilesUsed = 0; // Initial value for actual miles used

const ctx2 = document.getElementById('barChart').getContext('2d');
let barChart; // Declare the barChart variable globally so it can be accessed by other functions

function initializeBarChart() {
    const milesAllowedPerWeek = milesPerDay * 7;
    let actualMilesDrivenThisWeek = 0; // Default to 0

    // Attempt to retrieve the reported miles from localStorage
    const reportedMiles = localStorage.getItem('reportedMiles');
    if (reportedMiles) {
        const reportedMilesObj = JSON.parse(reportedMiles);
        actualMilesDrivenThisWeek = reportedMilesObj.currentValue;
    }

    barChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Allowed Miles', 'Actual Miles Driven'],
            datasets: [{
                label: 'Miles This Week',
                data: [milesAllowedPerWeek, actualMilesDrivenThisWeek],
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
                    beginAtZero: true,
                    ticks: {
                        precision: 0 // Remove decimal points
                    }
                }
            }
        }
    });
}

function updateBarChart() {
    const milesAllowedPerWeek = milesPerDay * 7;
    let actualMilesDrivenThisWeek = 0; // Default to 0

    // Attempt to retrieve the reported miles from localStorage
    const reportedMiles = localStorage.getItem('reportedMiles');
    if (reportedMiles) {
        const reportedMilesObj = JSON.parse(reportedMiles);
        actualMilesDrivenThisWeek = reportedMilesObj.currentValue;
    }

    // Update the data for the bar chart
    barChart.data.datasets[0].data = [milesAllowedPerWeek, actualMilesDrivenThisWeek];
    barChart.update();
}

// Initialize chart on window load
initializeBarChart();


const ctx3 = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(ctx3, {
    type: 'pie',
    data: {
        labels: [`Allowed Miles in ${monthWhere15thStarts}`, `Potential Current Miles for ${monthWhere15thStarts}`],
        datasets: [{
            label: 'Miles',
            data: [allowedMilesInMonth, potentialCurrentMiles],
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
                beginAtZero: true,
                ticks: {
                    precision: 0 // Remove decimal points
                }
            }
        }
    }
});

const ctx4 = document.getElementById('doughnutChart').getContext('2d');
const doughnutChart = new Chart(ctx4, {
    type: 'doughnut',
    data: {
        labels: ['Total Miles Left', 'Actual Miles Used'],
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
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0 // Remove decimal points
                }
            }
        }
    }
});

// Check if there's a value stored in localStorage for actual miles used
const storedActualMilesUsed = localStorage.getItem('actualMilesUsed');
if (storedActualMilesUsed !== null) {
    // Parse the stored value as an integer
    actualMilesUsed = parseInt(storedActualMilesUsed);

    // Update the charts with the stored value
    updateCharts(actualMilesUsed);
    // Update the total miles driven with the stored value
    document.getElementById('totalMilesDriven').textContent = actualMilesUsed.toFixed(0);
} else {
    // If there is no value in local storage, initialize it with 0
    localStorage.setItem('actualMilesUsed', 0);
}

// Function to update the charts
function updateCharts(newActualMilesUsed) {
    // Update the pie chart data
    pieChart.data.datasets[0].data = [allowedMilesInMonth, potentialCurrentMiles];
    doughnutChart.data.datasets[0].data[0] = totalMiles - newActualMilesUsed; // Update total miles left in doughnut chart
    doughnutChart.data.datasets[0].data[1] = newActualMilesUsed;

    // Update the mileage chart with a single data point for actual miles
    mileageChart.data.datasets[1].data = [{ x: daysLapsed, y: newActualMilesUsed }];

    // Update all charts
    mileageChart.update();
    // barChart.update();
    updateBarChart();
    pieChart.update();
    doughnutChart.update();

    // Update difference after updating charts
    updateDifference(newActualMilesUsed);
}

function setValues() {
    // Get the actual miles input field value
    const actualMilesInput = document.getElementById('actualMilesInput').value;
            
    // Parse the input value as an integer
    const newActualMilesUsed = parseInt(actualMilesInput);

    // Update localStorage with the new value of actual miles used
    localStorage.setItem('actualMilesUsed', newActualMilesUsed);

    // Update the chart with the new value
    updateCharts(newActualMilesUsed);

    // Update the total miles driven with the new value
    document.getElementById('totalMilesDriven').textContent = newActualMilesUsed.toFixed(0); // No decimal places
}

function setReportedMilesLocalStorage(milesValue) {
    // If reportedMiles does not exist, create and initialize it
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday of current week
    startOfWeek.setHours(0, 0, 0, 0); // Set to beginning of day

    // Set ttl to the end of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Saturday of current week
    endOfWeek.setHours(23, 59, 59, 999); // Set to end of day

    const reportedMilesObj = {
        startOfWeekValue: milesValue,
        currentValue: 0,
        ttl: endOfWeek.toISOString()
    };

    // Save reportedMilesObj to localStorage
    localStorage.setItem('reportedMiles', JSON.stringify(reportedMilesObj));

    // update HTML element with currentValue
    document.getElementById('reportedMiles').textContent = 'Not enough data to calculate';
}

window.onload = function() {
    // Check if reportedMiles exists in localStorage
    const reportedMiles = localStorage.getItem('reportedMiles');
    const actualMilesUsed = localStorage.getItem('actualMilesUsed');
    const milesValue = actualMilesUsed != null ? JSON.parse(actualMilesUsed) : 0;
    if (!reportedMiles) {
        setReportedMilesLocalStorage(milesValue);
    } else {
        // If reportedMiles exists, check if ttl has expired
        const reportedMilesObj = JSON.parse(reportedMiles);
        const ttl = new Date(reportedMilesObj.ttl);
        const currentDate = new Date();
        if (currentDate > ttl) {
            // If ttl has passed, reset reportedMiles to initial values
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday of current week
            startOfWeek.setHours(0, 0, 0, 0); // Set to beginning of day

            // Set ttl to the end of the week
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Saturday of current week
            endOfWeek.setHours(23, 59, 59, 999); // Set to end of day

            reportedMilesObj.startOfWeekValue = milesValue;
            reportedMilesObj.currentValue = 0;
            reportedMilesObj.ttl = endOfWeek.toISOString();

            // Save the updated reportedMilesObj back to localStorage
            localStorage.setItem('reportedMiles', JSON.stringify(reportedMilesObj));

            // update HTML element with currentValue
            document.getElementById('reportedMiles').textContent = 0;
        } else {
            // If ttl has not expired, update HTML element with currentValue
            document.getElementById('reportedMiles').textContent = reportedMilesObj.currentValue;
        }
    }
};

function setReportedMiles() {
    // Get the actual miles input field value
    const actualMilesInput = document.getElementById('actualMilesInput').value;
            
    // Parse the input value as an integer
    const newActualMilesUsed = parseInt(actualMilesInput);

    // Check if reportedMiles exists in localStorage
    const reportedMiles = localStorage.getItem('reportedMiles');
    if (!reportedMiles) {
        const actualMilesUsed = localStorage.getItem('actualMilesUsed');
        const milesValue = actualMilesUsed != null ? JSON.parse(actualMilesUsed) : 0;
        setReportedMilesLocalStorage(milesValue);
    } else {
        // If reportedMiles exists, update the currentValue
        const reportedMilesObj = JSON.parse(reportedMiles);

        // Calculate the new currentValue
        const newCurrentValue = newActualMilesUsed - (reportedMilesObj.startOfWeekValue + reportedMilesObj.currentValue) + reportedMilesObj.currentValue;

        // Update the currentValue in reportedMilesObj
        reportedMilesObj.currentValue = newCurrentValue;

        // Save reportedMilesObj back to localStorage
        localStorage.setItem('reportedMiles', JSON.stringify(reportedMilesObj));

        // Update the HTML element with the new currentValue
        document.getElementById('reportedMiles').textContent = newCurrentValue;
    }
}


// Call setReportedMiles function when updating values
function setValuesAndUpdateReportedMiles() {
    setReportedMiles();
    setValues();
    document.getElementById('actualMilesInput').value = '';
}

// Add event listeners to update reported miles when values are set
document.getElementById('actualMilesInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        setValuesAndUpdateReportedMiles();
    }
});

document.getElementById('submitBtn').addEventListener('click', function() {
    setValuesAndUpdateReportedMiles();
});

function updateDifference(newActualMilesUsed) {
    // Calculate the difference between miles allowed and miles used
    const difference = allowedMiles[daysLapsed] - newActualMilesUsed;
    
    // Calculate the percentage difference
    const percentageDifference = ((allowedMiles[daysLapsed] - newActualMilesUsed) / ((allowedMiles[daysLapsed] + newActualMilesUsed) / 2)) * 100;

    // Get the difference element
    const differenceElement = document.querySelector('.difference');

    // Set the text content of the difference element
    if (difference > 0) {
        differenceElement.textContent = `Under By ${difference.toFixed(0)} miles (${percentageDifference.toFixed(2)}%)`;
        differenceElement.classList.remove('over');
        differenceElement.classList.add('under');
    } else if (difference < 0) {
        differenceElement.textContent = `Over By ${Math.abs(difference).toFixed(0)} miles (${percentageDifference.toFixed(2)}%)`;
        differenceElement.classList.remove('under');
        differenceElement.classList.add('over');
    } else {
        differenceElement.textContent = "Miles used are equal to miles allowed";
        differenceElement.classList.remove('under', 'over');
    }
}


const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'}
// Calculate the number of days since the purchase
const daysSincePurchase = Math.floor((currentDate - purchaseDate) / (1000 * 60 * 60 * 24));

// Update the HTML element with the number of days since the purchase
document.getElementById('daysSincePurchase').textContent = daysSincePurchase;

// Update todays date
document.getElementById('todayDate').textContent = currentDate.toLocaleDateString('en-US', dateOptions)

// Update the HTML element with the number of miles allowed in current month
document.getElementById('monthMiles').textContent = allowedMilesInMonth;

// Update the HTML element with the number of miles allowed so far in current month
document.getElementById('allowedSoFar').textContent = potentialCurrentMiles;

document.getElementById('purchaseDate').textContent = purchaseDate.toLocaleDateString('en-US', dateOptions);

// Calculate the total allowed miles since the date of purchase
const totalAllowedSoFar = Math.floor(milesPerDay * daysSincePurchase);

// Update the HTML element with the total allowed miles since purchase
document.getElementById('totalAllowedSoFar').textContent = totalAllowedSoFar.toFixed(0);

// Update teh HTML element with the miles allowed per day
document.getElementById('allowedPerDay').textContent = milesPerDay;