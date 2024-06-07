(function() {
    // Declare variables globally
    let milesTraveled;
    let percentUsed;

    // Set Text Content for a html element
    function setTextContent(id, content) {
        document.getElementById(id).textContent = content;
    }

    // reset miles section values
    function averageAreaReset() {
        document.getElementById('milesTraveled').value = '';
        document.getElementById('percentUsed').value = '';
        setTextContent('milesError', '');
    }

    // Function to calculate average miles traveled with battery consumption
    function setAverageMilesAndBattery() {
        if (!milesTraveled || !percentUsed) {
            setTextContent('milesError', 'Missing miles value or battery used value');
        } else {
            const recentAverageMilesPerPercent = milesTraveled / percentUsed;
            const currentSession = {
                miles: milesTraveled,
                percent: percentUsed,
                averagePerPercent: recentAverageMilesPerPercent,
                potentialTravel: recentAverageMilesPerPercent * 100
            };
            localStorage.setItem('currentSession', JSON.stringify(currentSession));
            setTextContent('recentMiles', `${milesTraveled.toFixed(2)} miles`);
            setTextContent('recentBattery', `${percentUsed.toFixed(2)}% used`);
            setTextContent('recentAverageBattery', `${recentAverageMilesPerPercent.toFixed(2)} miles per single percent`);
            setTextContent('recentFullDistance', `${currentSession.potentialTravel.toFixed(2)} miles`);

            // do we want to keep a historical snapshot of all reported miles?

            const overalSession = localStorage.getItem('overalSession');
            if (!overalSession) {
                localStorage.setItem('overalSession', JSON.stringify(currentSession));
                setTextContent('allMiles', `${milesTraveled.toFixed(2)} miles`);
                setTextContent('allBattery', `${percentUsed.toFixed(2)}% used`);
                setTextContent('allAverageBattery', `${recentAverageMilesPerPercent.toFixed(2)} miles per single percent`);
                setTextContent('allFullDistance', `${currentSession.potentialTravel.toFixed(2)} miles`);
            } else {
                const overallObj = JSON.parse(overalSession);
                const totalMilesTraveled = overallObj.miles + milesTraveled;
                const totalBatteryPercentUsed = overallObj.percent + percentUsed;
                const totalAverageMilesPerBatteryPercent = totalMilesTraveled / totalBatteryPercentUsed;
                const newObj = {
                    miles: totalMilesTraveled,
                    percent: totalBatteryPercentUsed,
                    averagePerPercent: totalAverageMilesPerBatteryPercent,
                    potentialTravel: totalAverageMilesPerBatteryPercent * 100
                };

                localStorage.setItem('overalSession', JSON.stringify(newObj));
                setTextContent('allMiles', `${newObj.miles.toFixed(2)} miles`);
                setTextContent('allBattery', `${newObj.percent.toFixed(2)}% used`);
                setTextContent('allAverageBattery', `${newObj.averagePerPercent.toFixed(2)} miles per single percent`);
                setTextContent('allFullDistance', `${newObj.potentialTravel.toFixed(2)} miles`);
            }
            averageAreaReset();
        }
    }

    // Event listener for calculating miles traveled and battery percent used
    document.getElementById('milesTraveled').addEventListener('keyup', function(event) {
        event.preventDefault();
        milesTraveled = Number(event.target.value);

        if (event.key === 'Enter') {
            setAverageMilesAndBattery();
        }
    });

    // Event listener for calculating percent of battery with miles traveled
    document.getElementById('percentUsed').addEventListener('keyup', function(event) {
        event.preventDefault();
        percentUsed = Number(event.target.value);

        if (event.key === 'Enter') {
            setAverageMilesAndBattery();
        }
    });

    window.onload = function() {
        // average section
        const averageSection = localStorage.getItem('currentSession');
        if (averageSection) {
            const parsed = JSON.parse(averageSection);
            setTextContent('recentMiles', `${parsed.miles.toFixed(2)} miles`);
            setTextContent('recentBattery', `${parsed.percent.toFixed(2)}% used`);
            setTextContent('recentAverageBattery', `${parsed.averagePerPercent.toFixed(2)} miles per single percent`);
            setTextContent('recentFullDistance', `${parsed.potentialTravel.toFixed(2)} total miles`);
        }
    
        const allConsumptionSection = localStorage.getItem('overalSession');
        if (allConsumptionSection) {
            const parsed = JSON.parse(allConsumptionSection);
            setTextContent('allMiles', `${parsed.miles.toFixed(2)} miles`);
            setTextContent('allBattery', `${parsed.percent.toFixed(2)}% used`);
            setTextContent('allAverageBattery', `${parsed.averagePerPercent.toFixed(2)} miles per single percent`);
            setTextContent('allFullDistance', `${parsed.potentialTravel.toFixed(2)} miles`);
        }
    };
}());
