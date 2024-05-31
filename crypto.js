window.onload = function() {
    // Очистить поле предыдущей цены при обновлении страницы
    document.getElementById('previousPrice').value = '';
};

function calculateGrowth() {
    const marketCap = parseFloat(document.getElementById('marketCap').value) || 0;
    const marketCapUnit = parseFloat(document.getElementById('marketCapUnit').value);
    const price = parseFloat(document.getElementById('price').value);
    const previousPrice = parseFloat(document.getElementById('previousPrice').value) || price;
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value) || 0;
    const investmentPrice = parseFloat(document.getElementById('investmentPrice').value) || 0;

    const adjustedMarketCap = marketCap * marketCapUnit;
    const growthFactor = previousPrice !== 0 ? price / previousPrice : null;
    const previousMarketCap = (adjustedMarketCap / price) * previousPrice;

    let tableHTML = '<table>';
    tableHTML += '<tr><th>Параметр</th><th>Значение</th></tr>';

    if (!isNaN(previousMarketCap)) {
        tableHTML += `<tr><td>Предыдущая рыночная капитализация</td><td>${formatMarketCap(previousMarketCap)}</td></tr>`;
    }

    if (!isNaN(growthFactor)) {
        tableHTML += `<tr><td>Коэффициент роста</td><td>x${growthFactor.toFixed(2)}</td></tr>`;
    }

    if (investmentAmount && investmentPrice) {
        const currentInvestmentValue = investmentAmount * (price / investmentPrice);
        const earnings = currentInvestmentValue - investmentAmount;
        tableHTML += `<tr><td>Текущая стоимость инвестиций</td><td>$${currentInvestmentValue.toFixed(2)}</td></tr>`;
        tableHTML += `<tr><td>Прибыль</td><td>$${earnings.toFixed(2)}</td></tr>`;

        const previousInvestmentValue = investmentAmount * (price / previousPrice);
        const previousEarnings = previousInvestmentValue - investmentAmount;
        tableHTML += `<tr><td>Стоимость инвестиций по предыдущей цене</td><td>$${previousInvestmentValue.toFixed(2)}</td></tr>`;
        tableHTML += `<tr><td>Прибыль по предыдущей цене</td><td>$${previousEarnings.toFixed(2)}</td></tr>`;
    }

    tableHTML += '<tr><th>Коэффициент роста</th><th>Цена ($)</th><th>Рыночная капитализация</th></tr>';

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
    const units = ["", "Тысячи", "Миллионы", "Миллиарды", "Триллионы"];
    let unitIndex = 0;
    let reducedValue = value;

    while (reducedValue >= 1000 && unitIndex < units.length - 1) {
        reducedValue /= 1000;
        unitIndex++;
    }

    return `${reducedValue.toFixed(2)} ${units[unitIndex]}`;
}