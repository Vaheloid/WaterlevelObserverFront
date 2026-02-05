export class ChartTools {
    constructor(chartId) {
        this.chartId = chartId;
        this.chart = null;
    }

    // Метод для инициализации графика
    initChart(chartType, label, labels, data, options = {}) {
        const ctx = document.getElementById(this.chartId).getContext('2d');
        this.chart = new Chart(ctx, {
            type: chartType, // Тип графика
            data: {
                labels: labels, // Массив меток (например, время)
                datasets: [{
                    label: label,
                    data: data, // Массив значений
                    borderColor: 'rgba(75, 192, 192, 1)', // Цвет линии
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Цвет фона
                    borderWidth: 2
                }]
            },
            options: options // Дополнительные настройки
        });
    }

    // Метод для обновления данных графика
    updateChartData(newData, newLabels = null) {
        if (this.chart) {
            this.chart.data.datasets[0].data = newData;
            if (newLabels) {
                this.chart.data.labels = newLabels;
            }
            this.chart.update();
        } else {
            console.error('График не инициализирован!');
        }
    }

    // Метод для обновления данных конкретного набора данных
    updateDatasetData(index, newData, newLabels = null) {
        if (this.chart) {
            if (index >= 0 && index < this.chart.data.datasets.length) {
                this.chart.data.datasets[index].data = newData;
                if (newLabels) {
                    this.chart.data.labels = newLabels;
                }
                this.chart.update();
            } else {
                console.error('Некорректный индекс набора данных!');
            }
        } else {
            console.error('График не инициализирован!');
        }
    }

    // Метод для добавления нового набора данных (например, для второго графика)
    addDataset(label, data, borderColor = 'rgba(0, 123, 255, 1)', backgroundColor = 'rgba(0, 123, 255, 0.2)') {
        if (this.chart) {
            const newDataset = {
                label: label,
                data: data,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 2
            };
            this.chart.data.datasets.push(newDataset);
            this.chart.update();
        } else {
            console.error('График не инициализирован!');
        }
    }

    // Метод для удаления набора данных по индексу
    removeDataset(index) {
        if (this.chart) {
            if (index >= 0 && index < this.chart.data.datasets.length) {
                this.chart.data.datasets.splice(index, 1);
                this.chart.update();
            } else {
                console.error('Некорректный индекс набора данных!');
            }
        } else {
            console.error('График не инициализирован!');
        }
    }

    // Метод для изменения параметров графика
    updateChartOptions(newOptions) {
        if (this.chart) {
            this.chart.options = { ...this.chart.options, ...newOptions };
            this.chart.update();
        } else {
            console.error('График не инициализирован!');
        }
    }

    // Метод для сброса графика (удалить данные и настройки)
    resetChart() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        } else {
            console.error('График не инициализирован!');
        }
    }
}
