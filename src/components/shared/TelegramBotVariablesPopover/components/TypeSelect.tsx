import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Select, { SelectProps } from 'components/ui/Select';

export type Type = 'system' | 'user' | 'database';

export interface TypeSelectProps
  extends Omit<SelectProps, 'size' | 'children' | 'onChange'> {
  type: Type;
  onChange?: (type: Type) => void;
}

const types: Type[] = ['system', 'user', 'database'];

function TypeSelect({ type, onChange, ...props }: TypeSelectProps): ReactElement {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotVariablesPopover.types',
  });

  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    onChange?.(event.target.value as Type);
  }

  return (
    <Select {...props} size='sm' value={type} onChange={handleTypeChange}>
      {types.map((type) => (
        <option key={type} value={type}>
          {t(type)}
        </option>
      ))}
    </Select>
  );
}

export default TypeSelect;
