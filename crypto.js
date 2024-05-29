window.onload = function() {
    // Очистить поле предыдущей цены при обновлении страницы
    document.getElementById('previousPrice').value = '';
};

function calculateGrowth() {
    const marketCap = parseFloat(document.getElementById('marketCap').value) || 0; // Установка значения по умолчанию, если поле пустое
    const marketCapUnit = parseFloat(document.getElementById('marketCapUnit').value);
    const price = parseFloat(document.getElementById('price').value);
    const previousPrice = parseFloat(document.getElementById('previousPrice').value) || price; // Использование текущей цены в качестве предыдущей, если поле пустое

    const adjustedMarketCap = marketCap * marketCapUnit;
    const growthFactor = previousPrice !== 0 ? price / previousPrice : null;
    const previousMarketCap = (adjustedMarketCap / price) * previousPrice;

    let tableHTML = '<table>';
    tableHTML += '<tr><th>Parameter</th><th>Value</th></tr>';

    if (!isNaN(previousMarketCap)) {
        tableHTML += `<tr><td>Previous Market Cap</td><td>${formatMarketCap(previousMarketCap)}</td></tr>`;
    }

    if (!isNaN(growthFactor)) {
        tableHTML += `<tr><td>Growth Factor</td><td>x${growthFactor.toFixed(2)}</td></tr>`;
    }

    tableHTML += '<tr><th>Growth Factor</th><th>Price ($)</th><th>Market Cap</th></tr>';

    if (!isNaN(price)) {
        for (let i = 2; i <= 100; i++) {
            const newPrice = price * i;
            const newMarketCap = (adjustedMarketCap / price) * newPrice;
            tableHTML += `<tr><td>x${i}</td><td>${newPrice.toFixed(4)}</td><td>${formatMarketCap(newMarketCap)}</td></tr>`;
        }
    }

    tableHTML += '</table>';

    document.getElementById('growthTable').innerHTML = tableHTML;
}

function formatMarketCap(value) {
    const units = ["", "Thousand", "Million", "Billion", "Trillion"];
    let unitIndex = 0;
    let reducedValue = value;

    while (reducedValue >= 1000 && unitIndex < units.length - 1) {
        reducedValue /= 1000;
        unitIndex++;
    }

    return `${reducedValue.toFixed(2)} ${units[unitIndex]}`;
}
