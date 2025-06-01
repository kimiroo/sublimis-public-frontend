import CodeFlask from 'codeflask';

const editorElem = document.getElementById('editor');
const placeholderElem = document.getElementById('loadingPlaceholder');

// Fetch Policy file
fetch('https://mdm-api.darak.cc/api/v2/mdm/public/policies', {
    method: 'GET',
})
.then(resp => resp.json())
.then(json => {

    const json_string = JSON.stringify(json, null, 2);
    const text = document.createTextNode(json_string);
    editorElem.appendChild(text);

    const flask = new CodeFlask(editorElem, {
        language: 'js',
        lineNumbers: true,
        readonly: true
    });

    placeholderElem.style.display = 'none';
    editorElem.style.removeProperty("display")
});