const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

ready(function(){
    const tableBodyTimetable = document.querySelector("#tableTimetable tbody");

    // Fetch TimeLimit
    fetch('https://mdm-api.darak.cc/api/v2/mdm/public/timetable', {
        method: 'GET',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyTimetable.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyTimetable.deleteRow(0);
        }

        for (let timeScopeNo = 0; timeScopeNo < 48; timeScopeNo++) {
            // Add row heading
            var row, cell, text;
            row = tableBodyTimetable.insertRow();

            cell = row.insertCell();
            text = document.createTextNode(json[0][timeScopeNo]['timeScope']);
            cell.appendChild(text);

            for (day of json) {
                cell = row.insertCell();
                cell.style.color = 'white';
                if (day[timeScopeNo]['isAllowed']) {
                    cell.style.backgroundColor = 'green';
                    cell.innerHTML = '허용';
                } else {
                    cell.style.backgroundColor = 'red';
                    cell.innerHTML = '차단';
                }
            }
        }
    });
});