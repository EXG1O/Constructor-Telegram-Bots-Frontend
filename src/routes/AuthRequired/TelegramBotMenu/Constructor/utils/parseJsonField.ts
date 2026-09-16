import type { FormikHelpers } from 'formik';
import i18next, { type TOptions } from 'i18next';

import type { RouteID } from 'routes';

interface StrictTOptions extends TOptions {
  ns: `${RouteID.TelegramBotMenuConstructor}`;
}

function parseJsonField(
  rawValue: string,
  fieldPath: string,
  setFieldError: FormikHelpers<any>['setFieldError'],
): any[] | Record<string, any> | null {
  try {
    return JSON.parse(rawValue);
  } catch (error) {
    if (error instanceof SyntaxError) {
      setFieldError(
        fieldPath,
        i18next.t<string, StrictTOptions, string, StrictTOptions>(
          'messages.validation.invalidJSON',
          { ns: 'telegram-bot-menu-constructor' },
        ),
      );
    }
    return null;
  }
}

export default parseJsonField;
