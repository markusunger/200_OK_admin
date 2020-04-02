// styles JSON strings by doing basic syntax highlighting
// regex from https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript

export default function styleJSON(jsonString) {
  const spanStyles = {
    key: 'json-key',
    stringValue: 'json-string',
    numValue: 'json-number',
    booleanValue: 'json-boolean',
    nullValue: 'json-null',
  };

  const styledJSON = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return styledJSON.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
    let spanClass = spanStyles.numValue;
    if (/^"/.test(match)) {
      spanClass = /:$/.test(match) ? spanStyles.key : spanStyles.stringValue;
    }
    if (/true|false/.test(match)) spanClass = spanStyles.booleanValue;
    if (/null/.test(match)) spanClass = spanStyles.nullValue;

    return `<span class="${spanClass}">${match}</span>`;
  });
}
