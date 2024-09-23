import CodeFlask from 'codeflask';

const editorElem = document.getElementById('editor');
const placeholderElem = document.getElementById('loadingPlaceholder');

// Fetch Policy file
fetch('http://127.0.0.1:5000/api/v1/mdm/public/allPolicies', {
    method: 'POST',
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