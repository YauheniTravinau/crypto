function isValidInput(input) {
    // Проверяем, является ли введенное значение числом и больше ли оно или равно 1
    return !isNaN(input) && parseFloat(input) >= 0;
}

function isAllowedCharacter(char) {
    // Разрешаем только цифры, точку и запятую
    return /^[0-9.,]*$/.test(char);
}

function addSell() {
    const stopLossesDiv = document.getElementById('stopLosses');
    const stopLossDiv = document.createElement('div');
    const stopLossNumber = document.querySelectorAll('.sellPercent').length + 1;

    stopLossDiv.id = 'stopLoss' + stopLossNumber;

    stopLossDiv.innerHTML = `
                <label for="stopLoss${stopLossNumber}Percent">Процент продажи (%):</label>
                <input type="number" class="sellPercent" value="" placeholder="Введите процент продажи">
                <label for="stopLoss${stopLossNumber}Price">Цена продажи ($):</label>
                <input type="number" class="sellPrice" value="" placeholder="Введите цену продажи">
                <button onclick="removeSell(this)">Удалить продажу</button><br><br>
            `;

    stopLossesDiv.appendChild(stopLossDiv);
}

function removeSell(button) {
    const parentDiv = button.parentNode;
    parentDiv.remove();
}

function calculateTotalProfit() {
    const investmentInput = document.getElementById('investment');
    const purchasePriceInput = document.getElementById('purchasePrice');
    const investment = parseFloat(investmentInput.value);
    const purchasePrice = parseFloat(purchasePriceInput.value);

    // Проверяем валидность ввода для инвестиции и цены покупки
    if (!isValidInput(investment) || !isValidInput(purchasePrice)) {
        alert('Пожалуйста, введите числа больше или равные 0.');
        return;
    }

    const totalCryptos = investment / purchasePrice; // Общее количество криптовалюты

    let totalProfit = 0;
    let totalSellPercent = 0; // Общий процент продажи

    const sellPercentInputs = document.querySelectorAll('.sellPercent');
    const sellPriceInputs = document.querySelectorAll('.sellPrice');

    for (let i = 0; i < sellPercentInputs.length; i++) {
        const sellPercentInput = sellPercentInputs[i];
        const sellPriceInput = sellPriceInputs[i];
        const sellPercent = parseFloat(sellPercentInput.value);
        const sellPrice = parseFloat(sellPriceInput.value);

        // Проверяем валидность ввода для процента продажи и цены продажи
        if (!isValidInput(sellPercent) || !isValidInput(sellPrice)) {
            alert('Пожалуйста, введите числа больше или равные 0 для процента продажи и цены продажи.');
            return;
        }

        // Проверяем допустимость ввода символов
        if (!isAllowedCharacter(sellPercentInput.value) || !isAllowedCharacter(sellPriceInput.value)) {
            alert('Пожалуйста, используйте только цифры, точку и запятую.');
            return;
        }

        // Проверяем, чтобы сумма процентов не превышала 100%
        totalSellPercent += sellPercent;
        if (totalSellPercent > 100) {
            alert('Суммарный процент продажи не может превышать 100%. Пожалуйста, исправьте введенные данные.');
            return; // Прерываем выполнение функции
        }

        const sellAmount = (sellPercent / 100) * totalCryptos; // Количество криптовалюты для продажи
        const sellProfit = (sellPrice - purchasePrice) * sellAmount; // Прибыль от продажи
        totalProfit += sellProfit;
    }

    const resultElement = document.getElementById('result');
    resultElement.textContent = 'Прибыль: $' + totalProfit.toFixed(2);
}

// Добавляем обработчик события для кнопки "Рассчитать прибыль"
document.getElementById('calculateProfitBtn').addEventListener('click', calculateTotalProfit);