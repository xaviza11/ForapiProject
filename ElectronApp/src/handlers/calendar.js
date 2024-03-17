function calendar() {
    const saveEvents = require('../utils/storeFunctions/nonEncrypted/saveEvents')
    const getEvents = require('../utils/storeFunctions/nonEncrypted/getEvents')
    const deleteEvent = require('../utils/storeFunctions/nonEncrypted/deleteEvent')
    const routerLanguage = require('../utils/routerLanguage')
    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const location = getCountry()
    const language = routerLanguage(location.country)

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    const weekdays = [language.Monday, language.Tuesday, language.Wednesday, language.Thursday, language.Friday, language.Saturday, language.Sunday];

    let date = new Date();

    let numberClicked = date.getDate().toString()
    let selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate().toString());
    const eventDate = document.getElementById('newEventDate')
    const eventDateParsed = parseDate(new Date(date.getFullYear(), date.getMonth(), date.getDate().toString()))
    eventDate.textContent = eventDateParsed

    function getCurrentDate(element, asString) {
        if (element) {
            if (asString) {
                if (date.getDay() >= 1) {
                    return element.textContent = weekdays[date.getDay() - 1] + ', ' + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
                } else {
                    return element.textContent = language.Sunday + ', ' + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
                }
            }
            return element.value = date.toISOString().substr(0, 10);
        }
        return date;
    }

    function generateCalendar(isSelected) {
        const calendar = document.getElementById('calendar');
        if (calendar) {
            calendar.remove();
        }

        const table = document.createElement("table");
        table.id = "calendar";

        const trHeader = document.createElement('tr');
        trHeader.className = 'text-base text-gray-400 font-normal w-10 my-2';
        weekdays.map(week => {
            const th = document.createElement('th');
            const w = document.createTextNode(week.substring(0, 3));
            th.appendChild(w);
            trHeader.appendChild(th);
        });

        table.appendChild(trHeader);

        const weekDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            0
        ).getDay();

        const lastDay = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate();

        let tr = document.createElement("tr");
        let td = '';
        let empty = '';
        let btn = document.createElement('button');
        let week = 1;

        while (week < weekDay) {
            td = document.createElement("td");
            empty = document.createTextNode(' ');
            td.appendChild(empty);
            tr.appendChild(td);
            week++;
        }

        for (let i = 0; i <= lastDay;) {
            while (week <= 7) {
                td = document.createElement('td');
                let text
                if (i > 0) {
                    text = document.createTextNode(i);
                } else {
                    text = document.createTextNode(' ');
                }
                btn = document.createElement('button');

                if (numberClicked === i.toString()) {
                    btn.className = "text-base flex justify-center items-center border-none w-[2.1vw] h-[3vh] cursor-pointer z-50 outline-none rounded-lg transition-all duration-400 ease-in-out bg-green-300";
                    if (!isSelected) dayHasEvent(i, btn)
                } else {
                    btn.className = "text-base flex justify-center items-center border-none w-[2.2vw] h-[3vh] cursor-pointer z-50 outline-none rounded-lg transition-all duration-400 ease-in-out";
                    if (i > 0 && i < lastDay + 1) dayHasEvent(i, btn)
                }

                btn.addEventListener('click', function () {
                    numberClicked = text.textContent
                    changeDate(text)
                });

                week++;

                if (i <= lastDay) {
                    i++;
                    btn.appendChild(text);
                    td.appendChild(btn)
                } else {
                    text = document.createTextNode(' ');
                    td.appendChild(text);
                }
                tr.appendChild(td);
            }

            table.appendChild(tr);
            tr = document.createElement("tr");
            week = 1;
        }

        const content = document.getElementById('table');
        content.appendChild(table);
        changeHeader(date);
        getCurrentDate(document.getElementById("currentDate"), true);
        getCurrentDate(document.getElementById("date"), false);
        retrieveEvents()
    }

    function changeHeader(dateHeader) {
        const month = document.getElementById("month-header");
        month.className = 'text-1xl font-semibold'
        if (month.childNodes[0]) {
            month.removeChild(month.childNodes[0]);
        }
        const headerMonth = document.createElement("h1");
        const textMonth = document.createTextNode(months[dateHeader.getMonth()].substring(0, 3) + " " + dateHeader.getFullYear());
        headerMonth.appendChild(textMonth);
        month.appendChild(headerMonth);
    }

    function changeDate(button) {
        let newDay = parseInt(button.textContent);
        date = new Date(date.getFullYear(), date.getMonth(), newDay);
        selectedDate = new Date(date.getFullYear(), date.getMonth(), newDay.toString());
        const eventDate = document.getElementById('newEventDate')
        const eventDateParsed = parseDate(new Date(date.getFullYear(), date.getMonth(), date.getDate().toString()))
        eventDate.textContent = eventDateParsed
        generateCalendar(true);
    }

    const nextMonth = document.getElementById('nextMonth')
    nextMonth.addEventListener('click', function () {
        date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        numberClicked = null
        generateCalendar()
    })

    const prevMonth = document.getElementById('prevMonth')
    prevMonth.addEventListener('click', function () {
        date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        numberClicked = null
        generateCalendar()
    })

    const newEventButton = document.getElementById('newEventButton')
    newEventButton.addEventListener('click', function () {
        selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate().toString());
        const eventDate = document.getElementById('newEventDate')
        const eventDateParsed = parseDate(selectedDate)
        eventDate.textContent = eventDateParsed

        const getTitle = document.getElementById('newEventTitle').value;
        const getDescription = document.getElementById('newEventDescription').value;

        const payload = { date: eventDateParsed, title: getTitle, description: getDescription, isOrder: false }
        saveEvents(payload)
        retrieveEvents()
    })

    function parseDate(selectedDate) {
        let selectedDateString = selectedDate.toString()
        let parts = selectedDateString.split(" ");
        let dateWithoutTime = parts.slice(0, 4).join(" ");
        return dateWithoutTime
    }

    function parseDeadLine(selectedDate) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return selectedDate.toLocaleDateString('es-ES', options);
    }

    const resetDate = document.getElementById('resetDate')
    resetDate.addEventListener('click', function () {
        date = new Date();
        numberClicked = date.getDate().toString()
        selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate().toString());
        const eventDate = document.getElementById('newEventDate')
        const eventDateParsed = parseDate(selectedDate)
        eventDate.textContent = eventDateParsed
        generateCalendar()
    })

    function retrieveEvents() {
        const events = getEvents()
        const eventsDiv = document.getElementById('events')
        eventsDiv.innerHTML = ''
        if (events !== null) {
            const parsedDate = parseDate(selectedDate)
            const parsedDeadLine = parseDeadLine(selectedDate)

            for (let i = 0; i < events.events.length; i++) {
                console.log(events.events[i].deadLine === parsedDeadLine)
                if (events.events[i].date === parsedDate || events.events[i].deadLine === parsedDeadLine) {
                    console.log(events.events[i].date === parsedDate || events.events[i].deadLine === parseDeadLine)
                    if (events.events[i].isOrder === false) {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'p-4 border border-gray-300 my-4 bg-gray-100 w-full';

                        const title = document.createElement('h2');
                        title.textContent = events.events[i].title;
                        title.className = 'text-xl font-bold';

                        const description = document.createElement('p');
                        description.textContent = events.events[i].description;
                        description.className = 'text-gray-600';

                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = '🗑️';
                        deleteButton.className = 'text-2xl';

                        deleteButton.addEventListener('click', function () {
                            deleteEvent(events.events[i].index)
                            retrieveEvents()
                        });

                        eventDiv.appendChild(title);
                        eventDiv.appendChild(description);
                        eventDiv.appendChild(deleteButton);

                        eventsDiv.appendChild(eventDiv);
                    } else {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'p-4 border border-green-300 my-4 bg-green-100 w-full';

                        const client = document.createElement('h2');
                        client.textContent = events.events[i].userName;
                        client.className = 'text-xl font-bold';

                        eventDiv.appendChild(client);

                        for (let j = 0; j < events.events[i].items.length; j++) {
                            const item = document.createElement('h2');
                            item.textContent = events.events[i].items[j].name;
                            item.className = 'text-xl';

                            const price = document.createElement('h2');
                            price.textContent = events.events[i].items[j].price + '€'
                            price.className = 'text-xl';

                            const description = document.createElement('p');
                            description.textContent = language.quantity + ' ' + events.events[i].items[j].quantity;
                            description.className = 'text-gray-600';

                            eventDiv.appendChild(item);
                            eventDiv.appendChild(price);
                            eventDiv.appendChild(description);

                        }

                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = '🗑️';
                        deleteButton.className = 'text-2xl';

                        deleteButton.addEventListener('click', function () {
                            deleteEvent(events.events[i].index)
                            retrieveEvents()
                        });

                        eventDiv.appendChild(deleteButton);
                        eventsDiv.appendChild(eventDiv);
                    }
                }
            }
        }
        else {
            const noEventsHeader = document.createElement('h2');
            noEventsHeader.textContent = language.noEvents;
            eventsDiv.appendChild(noEventsHeader)
        }
    }

    function dayHasEvent(day, btn) {
        const eventDateParsed = parseDate(new Date(date.getFullYear(), date.getMonth(), day.toString()))
        const eventDeadLineParsed = parseDeadLine(new Date(date.getFullYear(), date.getMonth(), day.toString()))
        const events = getEvents()
        const filteredEvents = events.events.filter(event => event.date === eventDateParsed || event.deadLine === eventDeadLineParsed);
        if (filteredEvents.length > 0) {
            btn.className = "text-base flex justify-center items-center border-none w-[2.1vw] h-[3vh] cursor-pointer z-50 outline-none rounded-lg transition-all duration-400 ease-in-out bg-orange-200";
        }

    }

    document.onload = generateCalendar(date);

}

module.exports = calendar
