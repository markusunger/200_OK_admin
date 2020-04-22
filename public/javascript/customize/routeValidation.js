export default function validateRouteInformation(path, responses) {
  const messages = [];

  // check for path starting with a slash
  if (path[0] !== '/') {
    messages.push('Route path has to start with a forward slash.');
  }

  // check for path containing at least one character
  if (path.length <= 1) {
    messages.push('Route path has to contain at least one character.');
  }

  // check for path containing only valid characters ([a-zA-Z0-9\-_])
  const validCharacters = /^(\/[a-zA-Z][a-zA-Z0-9-_]*)*$/;
  if (!validCharacters.test(path)) {
    messages.push('Route can only contain alphanumeric characters, hyphens or underscores.');
  }

  // check if at least one response is defined
  if (Object.values(responses).every(response => !response)) {
    messages.push('JSON for at least one request type needs to be provided.');
  }

  // check responses for valid JSON
  try {
    Object.values(responses)
      .filter(response => response)
      .forEach(response => JSON.parse(JSON.stringify(response)));
  } catch (_) {
    messages.push('Response JSON data needs to be valid.');
  }

  return messages.length > 0 ? messages : null;
}
