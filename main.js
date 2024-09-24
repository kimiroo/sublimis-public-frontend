const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

ready(function(){
    const apiHost = 'https://mdm-api.darak.cc';
    const tableBodyClients = document.querySelector("#tableClients tbody");
    const tableBodyAllowedApps = document.querySelector("#tableAllowedApps tbody");
    const tableBodyDisabledApps = document.querySelector("#tableDisabledApps tbody");
    const tableBodyUninstallBlockedApps = document.querySelector("#tableUninstallBlockedApps tbody");
    const tableBodyChromeAllowedURL = document.querySelector("#tableChromeAllowedURL tbody");
    const tableBodyChromeBlockedURL = document.querySelector("#tableChromeBlockedURL tbody");
    const tableBodyDevicePolicy = document.querySelector("#tableDevicePolicy tbody");
    const tableBodyChromeExtraPolicy = document.querySelector("#tableChromeExtraPolicy tbody");
    const tableBodyTimeAllowed = document.querySelector("#tableTimeAllowed tbody");
    const elementCalaender = document.getElementById('caleandar');
    

    // Fetch clients
    fetch(apiHost + '/api/v1/mdm/public/getClient', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyClients.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyClients.deleteRow(0);
        }
        
        for (client of json) {
            insert4ColTableRow(tableBodyClients, client.deviceName, client.deviceId, client.role, client.state=='enforcing'?'잠금':'잠금해제');
        }
    });

    // Fetch AllowedApps
    fetch(apiHost + '/api/v1/mdm/public/getAllowedApps', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyAllowedApps.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyAllowedApps.deleteRow(0);
        }
        
        for (app of json) {
            insertApplicationRow(tableBodyAllowedApps, app.packageName, app.title, app.icon, app.url);
        }
    });

    // Fetch DisabledApps
    fetch(apiHost + '/api/v1/mdm/public/getDisabledApps', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyDisabledApps.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyDisabledApps.deleteRow(0);
        }
        
        for (app of json) {
            insertApplicationRow(tableBodyDisabledApps, app.packageName, app.title, app.icon, app.url);
        }
    });

    // Fetch UninstallBlockedApps
    fetch(apiHost + '/api/v1/mdm/public/getUninstallBlockedApps', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyUninstallBlockedApps.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyUninstallBlockedApps.deleteRow(0);
        }
        
        for (app of json) {
            insertApplicationRow(tableBodyUninstallBlockedApps, app.packageName, app.title, app.icon, app.url);
        }
    });

    // Fetch ChromeDevURLAllowlist
    fetch(apiHost + '/api/v1/mdm/public/getChromeDevURLAllowlist', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyChromeAllowedURL.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyChromeAllowedURL.deleteRow(0);
        }
        
        for (url of json) {
            insert1ColTableRow(tableBodyChromeAllowedURL, url);
        }
    });

    // Fetch ChromeDevURLBlocklist
    fetch(apiHost + '/api/v1/mdm/public/getChromeDevURLBlocklist', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyChromeBlockedURL.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyChromeBlockedURL.deleteRow(0);
        }
        
        for (url of json) {
            insert1ColTableRow(tableBodyChromeBlockedURL, url);
        }
    });

    // Fetch DevicePolicy
    fetch(apiHost + '/api/v1/mdm/public/getDevicePolicy', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyDevicePolicy.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyDevicePolicy.deleteRow(0);
        }
        
        for (policy of json) {
            insert3ColTableRow(tableBodyDevicePolicy, policy.key, policy.description, policy.value?'예':'아니오');
        }
    });

    // Fetch ChromeDevExtraPolicy
    fetch(apiHost + '/api/v1/mdm/public/getChromeDevExtraPolicy', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyChromeExtraPolicy.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyChromeExtraPolicy.deleteRow(0);
        }
        
        for (policy of json) {
            insert2ColTableRow(tableBodyChromeExtraPolicy, policy.key, policy.value);
        }
    });

    // Fetch TimeLimit
    fetch(apiHost + '/api/v1/mdm/public/getTimeLimit', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyTimeAllowed.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyTimeAllowed.deleteRow(0);
        }

        const headingMap = ['알림', '잠금'];
        const keyMap = ['thresholdWarn', 'thresholdBlock'];

        for (let thresholdNo = 0; thresholdNo < 2; thresholdNo++) {
            // Add row heading
            var row, cell, text;
            row = tableBodyTimeAllowed.insertRow();

            cell = row.insertCell();
            text = document.createTextNode(headingMap[thresholdNo]);
            cell.appendChild(text);

            for (day of json) {
                hour = Math.floor(day[keyMap[thresholdNo]] / 60)
                minute = day[keyMap[thresholdNo]] % 60

                cell = row.insertCell();
                text = document.createTextNode(hour + '시간 ' + minute + '분');
                cell.appendChild(text);
            }
        }
    });

    // Fetch UsedTime
    fetch(apiHost + '/api/v1/mdm/public/getUsedTime', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        var events = [];

        for (day of json) {
            const hour = Math.floor( day.usageTimeSeconds / (60*60) );
            const minute = Math.floor( day.usageTimeSeconds / (60) );
            const eventObj = {
                'Date': new Date(day.date),
                'Title': hour + '시간 ' + minute + '분',
                'Link': '/usageTimeDetail/?date=' + day.dateString
            };
            events.push(eventObj);
        }

        var settings = {};
        caleandar(elementCalaender, events, settings);
    });

    function insert1ColTableRow(elem, col1) {
        var row, cell, text;
        row = elem.insertRow();

        cell = row.insertCell();
        text = document.createTextNode(col1);
        cell.appendChild(text);
    }

    function insert2ColTableRow(elem, col1, col2) {
        var row, cell, text;
        row = elem.insertRow();

        cell = row.insertCell();
        text = document.createTextNode(col1);
        cell.appendChild(text);

        cell = row.insertCell();
        text = document.createTextNode(col2);
        cell.appendChild(text);
    }

    function insert3ColTableRow(elem, col1, col2, col3) {
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
    }

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

    function insertApplicationRow(elem, pkgName, label, icon, url) {
        var row, cell, text;
        row = elem.insertRow();

        cell = row.insertCell();
        cell.rowSpan = 2;
        cell.innerHTML = '<img src="' + icon + '" style="height:60px;width:60px;">';

        cell = row.insertCell();
        text = document.createTextNode(label);
        cell.appendChild(text);

        row = elem.insertRow();

        cell = row.insertCell();
        cell.innerHTML = '<a href="' + url + '">' + pkgName + '</a>';
    }

});