export type JSONPath = string | null;

function getJSONPathLines(data: Record<string, any> | any[]): JSONPath[] {
  const pathLines: JSONPath[] = [];

  const collectPaths = (object: any, path: string[]): void => {
    if (typeof object !== 'object' || object === null) return;

    if (!path.length) {
      pathLines.push(null);
    }

    (Array.isArray(object)
      ? object.map((value, index) => [index, value])
      : Object.entries(object)
    ).forEach(([key, value]) => {
      const nextPath: string[] = [...path, key];
      pathLines.push(nextPath.join('.'));
      collectPaths(value, nextPath);
    });

    pathLines.push(null);
  };
  collectPaths(data, []);

  return pathLines;
}

export default getJSONPathLines;
