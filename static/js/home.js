const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

ready(function () {
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
    const tableBodyBreakTimePolicy = document.querySelector("#tableBreakTimePolicy tbody");
    const textPermissivePrivateDNSHostname = document.getElementById('textPermissivePrivateDNSHostname');
    const textEnforcingPrivateDNSHostname = document.getElementById('textEnforcingPrivateDNSHostname');
    const elementCalaender = document.getElementById('caleandar');

    // Fetch clients
    fetch(apiHost + '/api/v2/mdm/public/client', {
        method: 'GET',
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

                let deviceRole;
                if (client.role == 'master') { deviceRole = '주 기기' }
                else if (client.role == 'slave') { deviceRole = '보조 기기' }
                else { deviceRole = '오류' }

                let deviceState;
                if (client.aliveState == 'alive') { deviceState = '정상' }
                else if (client.aliveState == 'outdated') { deviceState = '검사한지 오래됨' }
                else if (client.aliveState == 'inactive') { deviceState = '비활성화' }
                else { deviceState = '오류' }

                let enforcingState;
                if (client.state == 'enforcing') { enforcingState = '잠금' }
                else if (client.state == 'permissive') { enforcingState = '잠금해제' }
                else { enforcingState = '오류' }

                insert7ColTableRow(tableBodyClients,
                    client.deviceName,
                    client.deviceId,
                    deviceRole,
                    getFormatedTimestamp(client.registeredTimestamp),
                    getFormatedTimestamp(client.lastAliveTimestamp),
                    deviceState,
                    enforcingState);
            }
        });

    // Fetch AllowedApps
    fetch(apiHost + '/api/v2/mdm/public/allowed-apps', {
        method: 'GET',
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
    fetch(apiHost + '/api/v2/mdm/public/disabled-apps', {
        method: 'GET',
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
    fetch(apiHost + '/api/v2/mdm/public/uninstall-blocked-apps', {
        method: 'GET',
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

    // Fetch MonitoredSystemApps
    fetch(apiHost + '/api/v2/mdm/public/monitored-system-apps', {
        method: 'GET',
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
                insert1LinkColTableRow(tableBodyMonitoredSystemApps, app);
            }
        });

    // Fetch ChromeDevURLAllowlist
    fetch(apiHost + '/api/v2/mdm/public/chrome-dev-url-allowlist', {
        method: 'GET',
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
    fetch(apiHost + '/api/v2/mdm/public/chrome-dev-url-blocklist', {
        method: 'GET',
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
    fetch(apiHost + '/api/v2/mdm/public/device-policy', {
        method: 'GET',
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
                insert3ColTableRow(tableBodyDevicePolicy, policy.key, policy.description, policy.value ? '예' : '아니오');
            }
        });

    // Fetch ChromeDevExtraPolicy
    fetch(apiHost + '/api/v2/mdm/public/chrome-dev-extra-policy', {
        method: 'GET',
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
    fetch(apiHost + '/api/v2/mdm/public/time-limit', {
        method: 'GET',
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

    // Fetch BreakTimePolicy
    fetch(apiHost + '/api/v2/mdm/public/break-time-policy', {
        method: 'GET',
    })
        .then(resp => resp.json())
        .then(json => {

            if (json.length === 0) {
                td = tableBodyBreakTimePolicy.getElementsByTagName('td')[0];
                td.innerHTML = '없음';
            } else {
                tableBodyBreakTimePolicy.deleteRow(0);
            }

            var row, cell, text;
            row = tableBodyBreakTimePolicy.insertRow();

            // MinimumEnforcingTime
            hour = Math.floor(json.minimumEnforcingTime / 60)
            minute = json.minimumEnforcingTime % 60

            cell = row.insertCell();
            text = document.createTextNode(hour + '시간 ' + minute + '분');
            cell.appendChild(text);

            // MaximumBreakTime
            hour = Math.floor(json.maximumBreakTime / 60)
            minute = json.maximumBreakTime % 60

            cell = row.insertCell();
            text = document.createTextNode(hour + '시간 ' + minute + '분');
            cell.appendChild(text);
        });

    // Fetch PrivateDNS
    fetch(apiHost + '/api/v2/mdm/public/private-dns', {
        method: 'GET',
    })
        .then(resp => resp.json())
        .then(json => {

            if (json.length === 0) {
                textPermissivePrivateDNSHostname.innerText = '오류 발생';
                textEnforcingPrivateDNSHostname.innerText = '오류 발생';
            } else {
                textPermissivePrivateDNSHostname.innerText = json.permissiveHostname;
                textEnforcingPrivateDNSHostname.innerText = json.enforcingHostname
            }
        });

    // Fetch GeofenceConfig
    fetch(apiHost + '/api/v2/mdm/public/geofence-config', {
        method: 'GET',
    })
        .then(resp => resp.json())
        .then(json => {

            // tableGeofenceConfig
            const textAccuracyThreasholdCorrection = document.getElementById('accuracyThreasholdCorrection');
            const textAccuracyThreasholdDiscard = document.getElementById('accuracyThreasholdDiscard');
            const textCorrectedOffsetExponentialFactor = document.getElementById('correctedOffsetExponentialFactor');
            const textCorrectedOffsetScaleFactor = document.getElementById('correctedOffsetScaleFactor');
            const textCorrectedOffsetMax = document.getElementById('correctedOffsetMax');

            // tableZoneList
            const tableZoneList = document.getElementById('tableZoneList');

            if (json.length === 0) {
                // tableGeofenceConfig
                textAccuracyThreasholdCorrection.innerText = '오류 발생';
                textAccuracyThreasholdDiscard.innerText = '오류 발생';
                textCorrectedOffsetExponentialFactor.innerText = '오류 발생';
                textCorrectedOffsetScaleFactor.innerText = '오류 발생';
                textCorrectedOffsetMax.innerText = '오류 발생';


                tdZoneList = tableZoneList.getElementsByTagName('td')[0];
                tdZoneList.innerHTML = '오류 발생';
            } else {
                // tableGeofenceConfig
                textAccuracyThreasholdCorrection.innerText = json.geofenceLogicSettings.accuracyThreasholdCorrection;
                textAccuracyThreasholdDiscard.innerText = json.geofenceLogicSettings.accuracyThreasholdDiscard;
                textCorrectedOffsetExponentialFactor.innerText = json.geofenceLogicSettings.correctedOffsetExponentialFactor;
                textCorrectedOffsetScaleFactor.innerText = json.geofenceLogicSettings.correctedOffsetMax;
                textCorrectedOffsetMax.innerText = json.geofenceLogicSettings.correctedOffsetScaleFactor;

                // tableNotification
                updateNotificationSection('notEnteredStudyZone', json.notification.notEnteredStudyZone);
                updateNotificationSection('zoneChange', json.notification.zoneChange);

                // tableZoneList
                if (json.zones.length === 0) {
                    tdZoneList = tableZoneList.getElementsByTagName('td')[0];
                    tdZoneList.innerHTML = '오류 발생';
                } else {
                    tableZoneList.deleteRow(1);
                    for (zone of json.zones) {
                        insert5ColTableRow(tableZoneList, zone.name, zone.zoneType, zone.latitude, zone.longitude, zone.radius);
                    }
                }
            }
        });

    // Fetch UsedTime
    fetch(apiHost + '/api/v2/mdm/public/used-time', {
        method: 'GET',
    })
        .then(resp => resp.json())
        .then(json => {

            var events = [];

            for (day of json) {

                const yyyy = Number(day.dateString.slice(0, 4));
                const mm = Number(day.dateString.slice(5, 7));
                const dd = Number(day.dateString.slice(8, 10));

                const hour = day.usageTimeString.split(':')[0];
                const minute = day.usageTimeString.split(':')[1];
                const seconds = day.usageTimeString.split(':')[2];

                const eventObj = {
                    'Date': new Date(yyyy, mm - 1, dd),
                    'Title': hour + '시간 ' + minute + '분 ' + seconds + '초',
                    'Link': '/history-detail/?date=' + day.dateString
                };
                events.push(eventObj);
            }

            const settings = {};

            caleandar(elementCalaender, events, settings);
        });

    function insert1LinkColTableRow(elem, pkgName) {
        var row, cell, text;
        row = elem.insertRow();

        cell = row.insertCell();
        cell.innerHTML = '<a href="https://www.google.com/search?q=' + pkgName + '&ie=UTF-8" target="_blank" rel="noopener noreferrer">' + pkgName + '</a>';
    }

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

    function insert5ColTableRow(elem, col1, col2, col3, col4, col5) {
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

    function updateNotificationSection(sectionName, sectionData) {
        // Handle 'enabled' field
        const enabledElement = document.querySelector(`[data-section="${sectionName}"][data-field="enabled"]`);
        if (enabledElement) {
            enabledElement.textContent = sectionData.enabled ? "예" : "아니오";
        }

        // Handle 'triggerTime' field (only for notEnteredStudyZone)
        if (sectionName === 'notEnteredStudyZone' && sectionData.triggerTime !== undefined) {
            const triggerTimeElement = document.querySelector(`[data-section="${sectionName}"][data-field="triggerTime"]`);
            if (triggerTimeElement) {
                triggerTimeElement.textContent = sectionData.triggerTime;
            }
        }

        // Handle 'triggerDay' field (only for notEnteredStudyZone)
        if (sectionName === 'notEnteredStudyZone' && sectionData.triggerDay) {
            const triggerDayElement = document.querySelector(`[data-section="${sectionName}"][data-field="triggerDay"]`);
            if (triggerDayElement) {
                const days = sectionData.triggerDay;
                const activeDays = [];
                if (days.mon) activeDays.push('월');
                if (days.tue) activeDays.push('화');
                if (days.wed) activeDays.push('수');
                if (days.thu) activeDays.push('목');
                if (days.fri) activeDays.push('금');
                if (days.sat) activeDays.push('토');
                if (days.sun) activeDays.push('일');

                triggerDayElement.textContent = activeDays.length > 0 ? activeDays.join(', ') : '없음';
            }
        }

        // Handle 'recipients' fields (self, family, friend)
        if (sectionData.recipients) {
            const recipients = sectionData.recipients;
            const recipientTypes = ['self', 'family', 'friend'];

            recipientTypes.forEach(recipientType => {
                // Select the specific SMS status td within this <td>
                const smsStatusTd = document.querySelector(`[data-section="${sectionName}"][data-notification-recipient="${recipientType}"][data-notification-method="sms"]`);
                // Select the specific NTFY status td within this <td>
                const ntfyStatusTd = document.querySelector(`[data-section="${sectionName}"][data-notification-recipient="${recipientType}"][data-notification-method="ntfy"]`);

                // Update SMS status
                if (smsStatusTd && recipients[recipientType].sms !== undefined) {
                    smsStatusTd.innerText = recipients[recipientType].sms ? "예" : "아니오";
                }
                // Update NTFY status
                if (ntfyStatusTd && recipients[recipientType].ntfy !== undefined) {
                    ntfyStatusTd.innerText = recipients[recipientType].ntfy ? "예" : "아니오";
                }
            });
        }
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
