const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

ready(function(){
    const tableBodyUsageTimeDetail = document.querySelector("#tableUsageTimeDetail tbody");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const date = urlParams.get('date')

    // Fetch clients
    fetch('http://127.0.0.1:5000/api/v1/mdm/public/getUsedTimeDetail', {
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
            insert4ColTableRow(tableBodyUsageTimeDetail, client.sessionIdFingerprint, client.startTimestamp, client.endTimestamp, client.usedTime);
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
});