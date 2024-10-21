const DEBUG: boolean = process.env.DEBUG === 'true';
const WEBPACK_SERVE: boolean = process.env.WEBPACK_SERVE === 'true';
const ENABLE_TELEGRAM_AUTH: boolean = process.env.ENABLE_TELEGRAM_AUTH === 'true';
const PUBLIC_PATH: string | undefined = process.env.PUBLIC_PATH;

if (PUBLIC_PATH === undefined) {
	throw new Error('Please define the PUBLIC_PATH environment variable.');
}

export default { DEBUG, WEBPACK_SERVE, ENABLE_TELEGRAM_AUTH, PUBLIC_PATH };
