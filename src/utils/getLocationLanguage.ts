import type { Location } from 'react-router-dom';
import Language from 'enums/language';

function getLocationLanguage(location?: Location): Language | null {
  const parts = (location || window.location).pathname.split('/');
  const value: string | null = parts[1] || null;

  return value && Object.values<string>(Language).includes(value)
    ? (value as Language)
    : null;
}

export default getLocationLanguage;
