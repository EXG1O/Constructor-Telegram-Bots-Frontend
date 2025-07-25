import { FormikHelpers } from 'formik';
import i18next from 'i18next';

import { RouteID } from 'routes';

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
        i18next.t('messages.validation.invalidJSON', {
          ns: RouteID.TelegramBotMenuConstructor,
        }),
      );
    }
    return null;
  }
}

export default parseJsonField;
