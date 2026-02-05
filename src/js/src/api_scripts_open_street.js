import {MapEditorOpenStreet} from './map/MapEditorOpenStreet.js';
import {AltitudeTools} from "./altitude/AltitudeTools.js";
import {ChartTools} from "./chart/ChartTools.js";
import {OtherScripts} from "./other_scripts.js";


//////////////////////////////////////////////////////// API ////////////////////////////////////////////////////////
// Функция для получения списка топиков

let topicsCache = {}; // Глобальный объект для хранения данных по ключу (ID топика)
// Функция для получения списка топиков
function getTopics() {
    // Выполняем GET-запрос к API для получения списка топиков
    $.ajax({
        url: 'http://109.195.147.171:8080/api/topics',
        method: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            // Сохраняем данные в кэш (если нужно)
            topicsCache = data;

            // Очищаем карту, если она существует
            if (typeof mapEditor !== 'undefined') {
                mapEditor.removeAllMarkers();
            }

            // Очищаем список топиков в интерфейсе
            $('#topics-list').empty();

            // Проходим по каждому топику и создаём элементы для отображения
            data.forEach(function(topic) {
                // Добавляем топик в список
                $('#topics-list').append(`
                <a class="list-group-item list-group-item-action py-3 lh-sm"
                   data-id="${topic.ID_Topic}"
                   data-name="${topic.Name_Topic}"
                   data-path="${topic.Path_Topic}"
                   data-latitude="${topic.Latitude_Topic}"
                   data-longitude="${topic.Longitude_Topic}"
                   data-altitude="${topic.Altitude_Topic}"
                   data-altitude-sensor="${topic.AltitudeSensor_Topic}">
                    <div class="d-flex w-100 align-items-center justify-content-between">
                        <strong class="mb-1">${topic.Name_Topic}</strong>
                        <small>${topic.Latitude_Topic}, ${topic.Longitude_Topic}</small>
                    </div>
                    <div class="col-10 mb-1 small">${topic.Path_Topic}</div>
                    <div class="col-10 mb-1 small">Высота активации: ${topic.Altitude_Topic}</div>
                    <div class="col-10 mb-1 small">Высота датчика: ${topic.AltitudeSensor_Topic}</div>
                    <button class="button-delete-topic btn btn-danger rounded-pill px-3 mt-1" type="button" data-id="${topic.ID_Topic}">Delete</button>
                </a>
            `);

                // Добавляем маркер на карту, если карта существует
                if (typeof mapEditor !== 'undefined') {
                    mapEditor.addMarker([topic.Latitude_Topic, topic.Longitude_Topic], topic.Name_Topic, topic.Path_Topic);
                }
            });

            console.log("Список топиков обновлен:", topicsCache);
        },
        error: function(error) {
            console.error("Ошибка при получении данных:", error);
        }
    });
}

//let topicsDataCache = {};
// function getTopicsWithData() {
//     $.get('http://109.195.147.171:8080/api/topics_with_data', function(data) {
//         topicsDataCache = data;  // Преобразуем объект в массив
//
//         if(typeof mapEditor !== 'undefined') {
//             mapEditor.removeAllMarkers();
//         }
//
//         // Очищаем список топиков
//         $('#topics-list').empty();
//
//         const otherScripts = new OtherScripts();
//         // Создаём элемент для каждого топика
//         Object.values(topicsDataCache).forEach(function(topic) {
//             //console.log(`Вычисляем для топика: ${topic.ID_Topic}`)
//             //topic.MovingAverage = otherScripts.calculateMovingAverage(topic.Data, 7);
//             topic.MovingAverage = otherScripts.calculateEMA(topic.Data, 7, 10, 3);
//
//             $('#topics-list').append(`
//                 <a class="list-group-item list-group-item-action py-3 lh-sm"
//                    data-id="${topic.ID_Topic}"
//                    data-name="${topic.Name_Topic}"
//                    data-path="${topic.Path_Topic}"
//                    data-latitude="${topic.Latitude_Topic}"
//                    data-longitude="${topic.Longitude_Topic}"
//                    data-altitude="${topic.Altitude_Topic}"
//                    data-topic='${JSON.stringify(topic.Data)}'
//                    data-area='${JSON.stringify(topic.Area)}'>
//                     <div class="d-flex w-100 align-items-center justify-content-between">
//                         <strong class="mb-1">${topic.Name_Topic}</strong>
//                         <small>${topic.Latitude_Topic}, ${topic.Longitude_Topic}</small>
//                     </div>
//                     <div class="col-10 mb-1 small">${topic.Path_Topic}</div>
//                     <div class="col-10 mb-1 small">Высота: ${topic.Altitude_Topic}</div>
//                     <button class="button-delete-topic btn btn-danger rounded-pill px-3 mt-1" type="button" data-id="${topic.ID_Topic}">Delete</button>
//                 </a>
//             `);
//
//             if(typeof mapEditor !== 'undefined') {
//                 mapEditor.addMarker([topic.Latitude_Topic, topic.Longitude_Topic], topic.Name_Topic, topic.Path_Topic);
//             }
//         });
//
//         console.log("Глобальный список обновлен:", topicsDataCache);
//     });
// }

let limit = 25;
let currentTopicID = null;
let isButtonBlocked = false; // Флаг для блокировки кнопки
const BUTTON_BLOCK_TIME = 2000; // Время блокировки в миллисекундах (2 секунды)
// Обработчик клика по топику в списке
$(document).on('click', '.list-group-item', async function() {
    // Если кнопка заблокирована, выходим из функции
    if (isButtonBlocked) {
        console.log('Кнопка заблокирована, попробуйте позже');
        return;
    }

    // Блокируем кнопку
    isButtonBlocked = true;

    // Разблокируем кнопку через указанное время
    setTimeout(() => {
        isButtonBlocked = false;
    }, BUTTON_BLOCK_TIME);

    const topicId = $(this).data('id');
    const topicName = $(this).data('name');
    const topicLatitude = $(this).data('latitude');
    const topicLongitude = $(this).data('longitude');

    currentTopicID = topicId;
    // Получаем данные топика
    const topicData = await $.get(
        `http://109.195.147.171:8080/api/topic_data?id_topic=${topicId}&limit=${limit}`,
        null,  // data (не требуется для GET)
        { xhrFields: { withCredentials: true } }  // конфигурация
    ).catch(error => {
        console.error("Ошибка запроса:", error);
        throw error;  // пробрасываем ошибку дальше, если нужно
    });

    // Обновляем интерфейс
    document.getElementById('text-topic-name').textContent = `Topic: ${topicName}`;

    if (typeof mapEditor !== 'undefined') {
        mapEditor.removeAllPolygons();
        mapEditor.setCenter([topicLatitude, topicLongitude], 12);

        // Обрабатываем Depression_AreaPoints
        if (topicData.Depression_AreaPoints) {
            try {
                // Парсим строку Depression_AreaPoints в массив
                const depressionPoints = JSON.parse(topicData.Depression_AreaPoints);

                // Проверяем, что результат — массив
                if (Array.isArray(depressionPoints)) {
                    console.log('Парсинг успешен:', depressionPoints);

                    // Рисуем полигоны на карте
                    depressionPoints.forEach(coord => {
                        mapEditor.addSquare(coord, 40, {
                            color: 'red',
                            fillColor: 'red',
                            fillOpacity: 0.2,
                            weight: 0,
                            opacity: 0.5
                        });
                    });
                } else {
                    console.error('Depression_AreaPoints не является массивом после парсинга');
                }
            } catch (e) {
                console.error('Ошибка при парсинге Depression_AreaPoints:', e);
            }
        }
    }

    console.log(`Выбран топик: ${topicName}`);
    console.log(`Данные топика: `, topicData);
});
// // Обработчик клика по топику в списке
// $(document).on('click', '.list-group-item', function() {
//     const topicSummary = {
//         id: $(this).data('id'),
//         name: $(this).data('name'),
//         path: $(this).data('path'),
//         latitude: $(this).data('latitude'),
//         longitude: $(this).data('longitude'),
//         topicData: JSON.parse($(this).attr('data-topic')),
//         topicArea: JSON.parse($(this).attr('data-area'))
//     };
//     currentTopicID = topicSummary.id;
//
//     if(typeof mapEditor !== 'undefined') {
//         mapEditor.removeAllPolygons();
//         mapEditor.setCenter([topicSummary.latitude, topicSummary.longitude], 12);
//
//         console.log(topicSummary.topicArea);
//
//         if (topicSummary.topicArea.length !== 0) {
//             // Перебираем каждый объект в topicSummary.topicArea
//             for (const area of topicSummary.topicArea) {
//                 console.log(area);
//
//                 // Проверяем, существует ли Depression_AreaPoint
//                 if (area.Depression_AreaPoint) {
//                     // Парсим строку в массив
//                     let parsedDepressionAreaPoint;
//                     try {
//                         parsedDepressionAreaPoint = JSON.parse(area.Depression_AreaPoint);
//                     } catch (e) {
//                         console.error('Ошибка при разборе Depression_AreaPoint:', e);
//                         parsedDepressionAreaPoint = [];
//                     }
//
//                     // Проверяем, является ли результат массивом
//                     if (Array.isArray(parsedDepressionAreaPoint)) {
//                         console.log('Парсинг успешен:', parsedDepressionAreaPoint);
//                         for (const coord of parsedDepressionAreaPoint) {
//                             mapEditor.addSquare(coord, 40, {
//                                 color: 'red',
//                                 fillColor: 'red',
//                                 fillOpacity: 0.2,
//                                 weight: 0,
//                                 opacity: 0.5
//                             });
//                         }
//                     } else {
//                         console.error('Depression_AreaPoint не является массивом после парсинга');
//                     }
//                 }
//             }
//         }
//     }
//     document.getElementById('text-topic-name').textContent = `Topic: ${topicSummary.name}`;
//
//     console.log(`Выбран топик: ${topicSummary.name}`);
// });

// Обработчик удаления
$(document).on('click', '.button-delete-topic', function() {
    const topicID = $(this).data('id');
    const $listItem = $(this).closest('.list-group-item'); // Находим родительский элемент

    // Отправляем POST-запрос
    $.ajax({
        url: 'http://109.195.147.171:8080/api/delete_topic', // Замените на адрес вашего сервера
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id_topic: topicID }),
        xhrFields: {
            withCredentials: true  // Важно: передаем куки для авторизации
        },
        success: function(response) {
            console.log(response.message); // Успешный ответ
            console.log(`Топик удален: ${topicID}`);
            $listItem.remove(); // Удаляем элемент из DOM
            // alert("Топик успешно удален");
        },
        error: function(xhr) {
            let errorMsg = xhr.responseJSON?.error || 'Неизвестная ошибка';
            console.error('Ошибка удаления:', errorMsg);

            // Показываем пользователю понятное сообщение
            if (xhr.status === 401) {
                alert('Ошибка: Необходимо авторизоваться');
            } else if (xhr.status === 403) {
                alert('Ошибка: Нет прав на удаление');
            } else {
                alert('Ошибка удаления: ' + errorMsg);
            }
        }
    });
});

// Обработчик добовления топика
$('#topicForm').on('submit', function (event) {
    event.preventDefault(); // Останавливаем стандартное поведение формы

    const form = $(this);
    if (!form[0].checkValidity()) {
        event.stopPropagation(); // Останавливаем отправку, если валидация не пройдена
    } else {
        // Собираем данные из формы
        const topicName = $('#topicName').val();
        const topicPath = $('#topicPath').val();
        const latitude = parseFloat($('#latitude').val());
        const longitude = parseFloat($('#longitude').val());
        const altitude = $('#altitude').val();
        const altitudeSensor = $('#altitudeSensor').val();

        // Валидация координат
        let isValid = true;
        let errorMessage = '';

        // Проверка широты (-90 до 90)
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            isValid = false;
            errorMessage = 'Широта должна быть в диапазоне от -90 до 90 градусов.';
            $('#latitude').addClass('is-invalid');
        } else {
            $('#latitude').removeClass('is-invalid');
        }

        // Проверка долготы (-180 до 180)
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            isValid = false;
            errorMessage += '\nДолгота должна быть в диапазоне от -180 до 180 градусов.';
            $('#longitude').addClass('is-invalid');
        } else {
            $('#longitude').removeClass('is-invalid');
        }

        if (!isValid) {
            alert(errorMessage);
            return; // Прерываем отправку, если координаты невалидны
        }

        // Отправляем POST-запрос через AJAX
        $.ajax({
            url: 'http://109.195.147.171:8080/api/add_topic',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name_topic: topicName,
                path_topic: topicPath,
                latitude_topic: latitude,
                longitude_topic: longitude,
                altitude_topic: altitude,
                altitude_sensor_topic: altitudeSensor,
            }),
            xhrFields: {
                withCredentials: true  // Важно: передаем куки для авторизации
            },
            success: function (response) {
                console.log(response.message);
                console.log(`Топик добавлен: ${topicName}`);
                form[0].reset(); // Сброс формы
                form.removeClass('was-validated'); // Убираем стили валидации
                //alert(response.message); // Уведомление об успешном добавлении
            },
            error: function(xhr) {
                let errorMessage = 'Ошибка при добавлении топика';

                // Более детальная обработка ошибок
                if (xhr.responseJSON) {
                    errorMessage = xhr.responseJSON.error || errorMessage;

                    // Специальные сообщения для разных статусов
                    if (xhr.status === 401) {
                        errorMessage = 'Необходимо авторизоваться';
                    } else if (xhr.status === 400) {
                        errorMessage = 'Некорректные данные: ' + errorMessage;
                    }
                }

                console.error('Ошибка добавления:', errorMessage, xhr);
                alert(errorMessage);
            }
        });
    }

    form.addClass('was-validated'); // Добавляем стиль Bootstrap валидации
});

//////////////////////////////////////////////////////// API ////////////////////////////////////////////////////////

const chartTools = new ChartTools('mainChart');
function chartReboot() {

    chartTools.resetChart(); // Сброс графика
    chartTools.initChart('line', "Actual values", [], [], { responsive: true, maintainAspectRatio: false });
    chartTools.addDataset('Moving average', [], 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)');
}

const otherScripts = new OtherScripts();
chartReboot();
async function updateChartForCurrentTopic(topicId) {
    if (!topicId) {
        console.warn("ID топика не указан");
        chartReboot(); // Сброс графика, если нет ID топика
        return;
    }

    // Получаем данные топика через API
    let topicData;
    try {
        topicData = await $.get(
            `http://109.195.147.171:8080/api/topic_data?id_topic=${topicId}&limit=${limit}`,
            null,  // data (не требуется для GET)
            { xhrFields: { withCredentials: true } }  // конфигурация
        ).catch(error => {
            console.error("Ошибка запроса:", error);
            throw error;  // пробрасываем ошибку дальше, если нужно
        });
    } catch (error) {
        console.error("Ошибка при загрузке данных топика:", error);
        chartReboot(); // Сброс графика в случае ошибки
        return;
    }

    const topicDataPoints = topicData.Data; // Данные текущего топика

    if (!topicDataPoints || topicDataPoints.length === 0) {
        console.warn("Нет данных для текущего топика");
        chartReboot(); // Сброс графика, если данных нет
        return;
    }

    // Вычисляем EMA (Exponential Moving Average)
    const ema = otherScripts.calculateEMA(topicDataPoints, 7, 2, 2);
    console.log("Данные топика", topicDataPoints);
    console.log("Средняя скользящая", ema);
    // Подготавливаем данные для графика
    const newData = [];
    const newLabels = [];
    const emaData = [];
    const emaLabels = [];

    topicDataPoints.forEach((record, index) => {
        newData.push(record.Value_Data); // Фактические значения

        // Преобразуем timestamp (в секундах) в читаемый формат времени
        const time = new Date(record.Time_Data * 1000).toLocaleString();
        newLabels.push(time);

        if (index < ema.length) {
            emaData.push(ema[index].Value_Data); // EMA
            emaLabels.push(time);
        }
    });

    // Добавляем предсказанные значения на 3 дня вперед
    const predictedValues = ema.slice(-3); // Последние 3 значения EMA

    for (let i = 0; i < 3; i++) {
        emaLabels.push(new Date(predictedValues[i].Time_Data * 1000).toLocaleString());
        emaData.push(predictedValues[i].Value_Data);
    }

    // Обновляем график
    chartTools.updateDatasetData(0, newData, newLabels); // Фактические значения
    chartTools.updateDatasetData(1, emaData, emaLabels); // EMA с предсказанными значениями

    console.log("Диаграмма обновлена с данными текущего топика");
}
// function updateChartForCurrentTopic() {
//     if (currentTopicID && topicsDataCache[currentTopicID]) {
//         const topicData = topicsDataCache[currentTopicID].Data;
//
//         if (topicData.length === 0 && topicsDataCache[currentTopicID].MovingAverage.length === 0) {
//             console.warn("Нет данных для текущего топика");
//             chartReboot();
//             return;
//         }
//         const movingAverage = topicsDataCache[currentTopicID].MovingAverage;
//
//         const newData = [];
//         const newLabels = [];
//         const movingAverageData = [];
//         const movingAverageLabels = [];
//
//         topicData.forEach((record, index) => {
//             newData.push(record.Value_Data);
//             const time = new Date(record.Time_Data * 1000).toLocaleString();
//             newLabels.push(time);
//
//             if (index < movingAverage.length) {
//                 movingAverageData.push(movingAverage[index].Value_Data);
//                 movingAverageLabels.push(time);
//             }
//         });
//
//         // Добавляем предсказанные значения на 3 дня вперед
//         const predictedValues = movingAverage.slice(-3); // Получаем последние 3 предсказанных значения
//
//         for (let i = 0; i < 3; i++) {
//             movingAverageLabels.push(new Date(predictedValues[i].Time_Data * 1000).toLocaleString());
//             movingAverageData.push(predictedValues[i].Value_Data);
//         }
//
//         chartTools.updateDatasetData(0, newData, newLabels); // Обновляем данные фактических значений
//         chartTools.updateDatasetData(1, movingAverageData, movingAverageLabels); // Обновляем данные Moving Average
//
//         console.log("Обновление диаграммы с датой и временем");
//     } else {
//         console.warn("Текущий топик не выбран или не найден в кэше");
//         //chartReboot();
//     }
// }

//////////////////////////////////////////////////////// INIT ////////////////////////////////////////////////////////

//let altitudeTools;
// Загружаем список топиков при загрузке страницы
$(document).ready(function() {
    getTopics();
    // Обновляем список топиков каждые 10 секунд
    setInterval(() => getTopics(), 10000);
    // Обновляем график каждые 5 секунд
    setInterval(() => updateChartForCurrentTopic(currentTopicID), 5000);

    //altitudeTools = new AltitudeTools();
    //altitudeTools.findDepressionAreaWithIslands([54.71097, 55.9555], 90, 200);
});

let mapEditor;
document.addEventListener('DOMContentLoaded', () => {
    mapEditor = new MapEditorOpenStreet('map');

    // Обработчик клика по карте
    mapEditor.on('click', function(event) {
        const { lat, lng } = event.latlng;

        // Ограничиваем количество знаков после запятой и заменяем запятую на точку
        const formattedLat = lat.toFixed(6).replace(',', '.');
        const formattedLng = lng.toFixed(6).replace(',', '.');

        // Заполняем поля latitude и longitude
        document.getElementById('latitude').value = formattedLat;
        document.getElementById('longitude').value = formattedLng;

        // mapEditor.addSquare([lat, lng], 100, {
        //     color: 'red',
        //     fillColor: 'red',
        //     fillOpacity: 0.2,
        //     weight: 0,
        //     opacity: 0.5
        // });
    });
});

//////////////////////////////////////////////////////// INIT ////////////////////////////////////////////////////////
