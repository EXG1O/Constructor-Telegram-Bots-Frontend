import type { Options } from '..';

const FILE_ATTACHMENT_PREFIX: string = 'attach://';
const PAYLOAD_FIELD_NAME: string = '_data';

const formDataBodySerializer: Pick<Options, 'bodySerializer' | 'headers'> = {
  bodySerializer: (body): FormData => {
    const data = new FormData();
    let fileCounter: number = 0;

    const processValue = (value: any): any => {
      if (value === undefined || value === null) {
        return value;
      }

      if (value instanceof File || value instanceof Blob) {
        const fileKey: string = `file_${fileCounter++}`;
        data.append(fileKey, value, value instanceof File ? value.name : undefined);
        return `${FILE_ATTACHMENT_PREFIX}${fileKey}`;
      }

      if (Array.isArray(value)) {
        return value.map(processValue);
      }

      if (typeof value === 'object' && !(value instanceof Date)) {
        const result: Record<string, unknown> = {};
        Object.entries(value).forEach(([key, value]) => {
          result[key] = processValue(value);
        });
        return result;
      }

      return value;
    };

    data.append(PAYLOAD_FIELD_NAME, JSON.stringify(processValue(body)));

    return data;
  },
  headers: { 'Content-Type': null },
};

export default formDataBodySerializer;
