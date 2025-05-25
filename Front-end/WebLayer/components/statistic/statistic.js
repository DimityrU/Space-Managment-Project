import { Components } from "../../utilities/Components.js";
import { checkCookieExists } from "../../utilities/checkCookie.js";
import { StatisticController } from "../../Controllers/StatisticController.js";
import { SpaceController } from "../../Controllers/SpaceController.js";
import { displayPrompt } from "../../utilities/Prompt.js";
await checkCookieExists("SMPlace");
Components("statistic");
const statisticController = new StatisticController();
const spaceController = new SpaceController();

const emptyBookingData = {
    labels: ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'],
    values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

// Initialize the chart when the page loads
let bookingChart; // Declare bookingChart in a broader scope

function initializeChart(chartData) {
    const ctx = document.getElementById('bookingChart').getContext('2d');
    if (bookingChart) {
        bookingChart.destroy(); // Destroy existing chart instance if it exists
    }
    bookingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Брой заети дни',
                data: chartData.values,
                backgroundColor: '#023E8A',
                borderColor: '#388E3C',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

window.addEventListener('load', async () => {
    Years();
    await GetSpaces();
    document.querySelector(".loader").style.display = 'none';
    document.querySelector(".blur").classList.remove('blur');
});

// Add this after the window.addEventListener('load') block
document.addEventListener('DOMContentLoaded', function () {

    const getStatisticBtn = document.getElementById('get-statistic-btn');
    if (getStatisticBtn) {
        getStatisticBtn.addEventListener('click', getStatistic);
    }
});

// Also fix the getStatistic function by adding async keyword
async function getStatistic() {
    document.querySelector(".loader").style.display = 'block';

    const year = document.getElementById('year-select').value;
    const spaceId = document.getElementById('space-select').value;
    if (!year) {
        displayPrompt(".prompt-save", "Моля, изберете година.", false);
        return;
    }
    if (!spaceId) {
        displayPrompt(".prompt-save", "Моля, изберете помещение.", false);
        return;
    }
    try {
        const statisticData = await statisticController.GetStatistic(spaceId, year);
        if (statisticData.statistic && statisticData.statistic.labels && statisticData.statistic.values) {
            if (statisticData.statistic.values.every(value => value === 0)) {
                document.querySelector('h2').setAttribute('hidden', '');
                document.querySelector('.chart-summary').setAttribute('hidden', '');
                document.querySelector('.chart-container').setAttribute('hidden', '');
                displayPrompt(".prompt-save", "Няма данни в системата за резервации в избранта година за това помещение", false);

            }
            else {
                document.querySelector('h2').removeAttribute('hidden');
                initializeChart(statisticData.statistic);
                document.querySelector('.chart-summary').removeAttribute('hidden');
                document.querySelector('.chart-container').removeAttribute('hidden');
                document.getElementById('paid-amount').innerText = statisticData.paid + " лв.";
                document.getElementById('unpaid-amount').innerText = statisticData.unpaid + " лв.";
            }
        } else {
            initializeChart(emptyBookingData);
        }
        document.querySelector(".loader").style.display = 'none';

    } catch (error) {
        console.error("Error fetching statistic data:", error);
        document.querySelector(".loader").style.display = 'none';

    }
}


function Years() {

    const currentYear = new Date().getFullYear();
    const yearSelect = document.getElementById('year-select');

    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

async function GetSpaces() {
    let response = await spaceController.GetAllSpaces(true);
    let spaceNames = response.map(({ id, name }) => ({ id, name }));

    for (let space of spaceNames) {
        let option = document.createElement('option');
        option.value = space.id;
        option.textContent = space.name;
        document.getElementById('space-select').appendChild(option);
    }
}