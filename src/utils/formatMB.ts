interface Options {
  fractionDigits: number;
}

function formatMB(bytes: number, options?: Options): string {
  return `${(bytes / 1024 ** 2).toFixed(options?.fractionDigits ?? 2)} MB`;
}

export default formatMB;
