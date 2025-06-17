const apiHost = 'https://mdm-api.darak.cc';
const redirectUrl = 'https://mdm.darak.cc';
const textExceptionType = document.getElementById('textExceptionType');
const textExceptionTime = document.getElementById('textExceptionTime');
const textExceptionReason = document.getElementById('textExceptionReason');
const btnApprove = document.getElementById('btnApprove');
const btnDisapprove = document.getElementById('btnDisapprove');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const requestId = urlParams.get('requestId');
if (requestId === null) {
    alert('오류가 발생했습니다.');
    window.location.href = redirectUrl;
}

btnApprove.addEventListener('click', (event) => {
    event.preventDefault();
    btnApprove.disabled = true;
    btnDisapprove.disabled = true;
    btnApprove.innerText = '처리 중';
    sendApprovalResult(true);
});

btnDisapprove.addEventListener('click', (event) => {
    event.preventDefault();
    btnApprove.disabled = true;
    btnDisapprove.disabled = true;
    btnDisapprove.innerText = '처리 중';
    sendApprovalResult(false);
});

function getExceptionUsageInfo() {
    fetch(apiHost + '/api/v2/mdm/exception-usage/info/' + requestId, {
        method: 'GET'
    })
        .then(resp => resp.json())
        .then(json => {

            if (json.result === 'success') {
                textExceptionType.innerText = (json.detail.exceptionType === 'emergencyUsage') ? '긴급사용' : '하루 휴식';
                textExceptionTime.innerText = getFormatedTimestamp(json.detail.untilTime) + ' 까지';
                textExceptionReason.innerText = json.detail.reason;
            } else {
                textExceptionType.innerText = '오류 발생';
                textExceptionTime.innerText = '오류 발생';
                textExceptionReason.innerText = '오류 발생';
                alert('올바르지 않거나 만료된 링크입니다.');
                window.location.href = redirectUrl;
            }
        })
        .catch(() => {
            textExceptionType.innerText = '오류 발생';
            textExceptionTime.innerText = '오류 발생';
            textExceptionReason.innerText = '오류 발생';
            alert('올바르지 않거나 만료된 링크입니다.');
            window.location.href = redirectUrl;
        });
}

function sendApprovalResult(isApproved) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    fetch(apiHost + '/api/v2/mdm/exception-usage/approve', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ requestId: requestId, isApproved: isApproved })
    })
        .then(resp => resp.json())
        .then(json => {

            if (json.result === 'success') {
                alert('처리되었습니다.');
                window.location.href = redirectUrl;
            } else {
                alert('오류가 발생했습니다.');
                window.location.href = redirectUrl;
            }
        })
        .catch(() => {
            alert('오류가 발생했습니다.');
            window.location.href = redirectUrl;
        });
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

function getRequestId() {
    const path = window.location.pathname;
    const pathSegments = path.endsWith('/') ? path.slice(0, -1).split('/') : path.split('/');
    const requestId = pathSegments[pathSegments.length - 1];

    return requestId;
}

getExceptionUsageInfo();
