function safeParseJSON(value: string): any | string {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
export default safeParseJSON;
