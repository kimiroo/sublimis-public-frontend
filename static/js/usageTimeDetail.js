const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

ready(function(){
    const tableBodyUsageTimeDetail = document.querySelector("#tableUsageTimeDetail tbody");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const date = urlParams.get('date')

    // Fetch clients
    fetch('https://mdm-api.darak.cc/api/v1/mdm/public/getUsedTimeDetail', {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({'date': date})
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyUsageTimeDetail.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else if (json.result === 'failed') {
            alert(json.reason)
        } else {
            tableBodyUsageTimeDetail.deleteRow(0);
        }
        
        for (client of json) {
            insert4ColTableRow(tableBodyUsageTimeDetail, client.sessionIdFingerprint, getFormatedTimestamp(client.startTimestamp), getFormatedTimestamp(client.endTimestamp), client.usedTime);
        }
    });

    function insert4ColTableRow(elem, col1, col2, col3, col4) {
        var row, cell, text;
        row = elem.insertRow();

        cell = row.insertCell();
        text = document.createTextNode(col1);
        cell.appendChild(text);

        cell = row.insertCell();
        text = document.createTextNode(col2);
        cell.appendChild(text);

        cell = row.insertCell();
        text = document.createTextNode(col3);
        cell.appendChild(text);

        cell = row.insertCell();
        text = document.createTextNode(col4);
        cell.appendChild(text);
    }

    function getFormatedTimestamp(timestamp) {
        let timestamp_parsed = Date.parse(timestamp);
        timestamp_parsed = new Date(timestamp_parsed);

        const year = timestamp_parsed.getFullYear();
        const month = timestamp_parsed.getMonth() + 1;
        const day = timestamp_parsed.getDate();
        const hours = timestamp_parsed.getHours();
        const minutes = timestamp_parsed.getMinutes();
        const seconds = timestamp_parsed.getSeconds();

        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        return formattedDate;
    }
});