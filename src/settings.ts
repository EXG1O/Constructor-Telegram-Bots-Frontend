const DEBUG: boolean = process.env.DEBUG === 'true';
const WEBPACK_SERVE: boolean = process.env.WEBPACK_SERVE === 'true';
const PUBLIC_PATH: string = process.env.PUBLIC_PATH!;
const TELEGRAM_LOGIN_CLIENT_ID: number | null = parseInt(
  process.env.TELEGRAM_LOGIN_CLIENT_ID!,
);

export default { DEBUG, WEBPACK_SERVE, PUBLIC_PATH, TELEGRAM_LOGIN_CLIENT_ID };
