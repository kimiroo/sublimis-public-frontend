const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

ready(function(){
    const apiHost = 'https://mdm-api.darak.cc';
    const tableBodyClients = document.querySelector("#tableClients tbody");
    const tableBodyAllowedApps = document.querySelector("#tableAllowedApps tbody");
    const tableBodyDisabledApps = document.querySelector("#tableDisabledApps tbody");
    const tableBodyUninstallBlockedApps = document.querySelector("#tableUninstallBlockedApps tbody");
    const tableBodyMonitoredSystemApps = document.querySelector("#tableMonitoredSystemApps tbody");
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
            
            let deviceState;
            if (client.aliveState == 'alive') {deviceState = '정상'}
            else if (client.aliveState == 'outdated') {deviceState = '검사한지 오래됨'}
            else if (client.aliveState == 'inactive') {deviceState = '비활성화'}
            else {deviceState = '오류'}

            insert7ColTableRow(tableBodyClients, client.deviceName, client.deviceId, client.role, getFormatedTimestamp(client.registeredTimestamp), getFormatedTimestamp(client.lastAliveTimestamp), deviceState, client.state=='enforcing'?'잠금':'잠금해제');
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

    // Fetch UninstallBlockedApps
    fetch(apiHost + '/api/v1/mdm/public/getMonitoredSystemApps', {
        method: 'POST',
    })
    .then(resp => resp.json())
    .then(json => {

        if (json.length === 0) {
            td = tableBodyMonitoredSystemApps.getElementsByTagName('td')[0];
            td.innerHTML = '없음';
        } else {
            tableBodyMonitoredSystemApps.deleteRow(0);
        }
        
        for (app of json) {
            insert1ColTableRow(tableBodyMonitoredSystemApps, app);
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
      
          const yyyy = Number(day.dateString.slice(0,4));
          const mm = Number(day.dateString.slice(5,7));
          const dd = Number(day.dateString.slice(8,10));
          
          const hour = Math.floor( day.usageTimeSeconds / (60*60) );
          const minute = Math.floor( day.usageTimeSeconds / (60) );
      
          const eventObj = {
              'Date': new Date(yyyy, mm-1, dd),
              'Title': hour + '시간 ' + minute + '분',
              'Link': '/usageTimeDetail/?date=' + day.dateString
          };
          events.push(eventObj);
        }
      
        const settings = {};
      
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

    function insert7ColTableRow(elem, col1, col2, col3, col4, col5, col6, col7) {
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

        cell = row.insertCell();
        text = document.createTextNode(col5);
        cell.appendChild(text);

        cell = row.insertCell();
        text = document.createTextNode(col6);
        cell.appendChild(text);

        cell = row.insertCell();
        text = document.createTextNode(col7);
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
        cell.innerHTML = '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + pkgName + '</a>';
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