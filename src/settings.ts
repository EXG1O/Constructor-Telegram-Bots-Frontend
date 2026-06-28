const DEBUG: boolean = process.env.APP_DEBUG === 'true';
const WEBPACK_SERVE: boolean = process.env.APP_WEBPACK_SERVE === 'true';
const PUBLIC_PATH: string = process.env.APP_PUBLIC_PATH!;
const TELEGRAM_LOGIN_CLIENT_ID: number | null = parseInt(
  process.env.APP_TELEGRAM_LOGIN_CLIENT_ID!,
);

export default { DEBUG, WEBPACK_SERVE, PUBLIC_PATH, TELEGRAM_LOGIN_CLIENT_ID };
