const DEBUG: boolean = process.env.DEBUG === 'true';
const WEBPACK_SERVE: boolean = process.env.WEBPACK_SERVE === 'true';
const ENABLE_TELEGRAM_AUTH: boolean = process.env.ENABLE_TELEGRAM_AUTH === 'true';
const PUBLIC_PATH: string = process.env.PUBLIC_PATH!;

export default { DEBUG, WEBPACK_SERVE, ENABLE_TELEGRAM_AUTH, PUBLIC_PATH };
