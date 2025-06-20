import React, { ChangeEvent, forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cva } from 'class-variance-authority';
import { Search, X } from 'lucide-react';

import Button from 'components/ui/Button';
import IconButton, { IconButtonProps } from 'components/ui/IconButton';
import Input, { InputProps } from 'components/ui/Input';

import cn from 'utils/cn';

type Size = 'sm' | 'md' | 'lg';

const DEFAULT_SIZE: Size = 'sm';

const containerVariants = cva(['group', 'inline-flex'], {
  variants: {
    size: {
      sm: ['gap-2'],
      md: ['gap-3'],
      lg: ['gap-4'],
    },
  },
  defaultVariants: {
    size: DEFAULT_SIZE,
  },
});

const labelVariants = cva(
  ['inline-flex', 'items-center', 'h-full', 'bg-gray-100', 'border', 'border-outline'],
  {
    variants: {
      size: {
        sm: ['rounded-l-sm', 'px-2', 'py-1', '[&_svg]:size-4'],
        md: ['rounded-l-md', 'px-2.5', 'py-1.5', '[&_svg]:size-4.5'],
        lg: ['rounded-l-lg', 'px-3', 'py-2', '[&_svg]:size-5'],
      },
    },
    defaultVariants: {
      size: DEFAULT_SIZE,
    },
  },
);

const inputVariants = cva(['rounded-l-none', '-ms-px'], {
  variants: {
    size: {
      sm: ['pr-6'],
      md: ['pr-7.5'],
      lg: ['pr-9'],
    },
  },
  defaultVariants: {
    size: DEFAULT_SIZE,
  },
});

const cancelButtonVariants = cva(['absolute', 'top-1/2', '-translate-y-1/2'], {
  variants: {
    size: {
      sm: ['right-1.75'],
      md: ['right-2.25'],
      lg: ['right-3'],
    },
  },
  defaultVariants: {
    size: DEFAULT_SIZE,
  },
});

const visibilityButtonVariants = cva(
  [
    'group-data-[active=true]:animate-in',
    'group-data-[active=true]:fade-in-0',
    'group-data-[active=false]:animate-out',
    'group-data-[active=false]:fade-out-0',
  ],
  {
    variants: {
      visible: {
        false: ['hidden'],
      },
    },
    defaultVariants: {
      visible: true,
    },
  },
);

const ICON_BUTTON_SIZE_MAP: Record<Size, NonNullable<IconButtonProps['size']>> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export interface SearchInputProps extends Omit<InputProps, 'size'> {
  size?: Size;
  containerProps?: HTMLAttributes<HTMLDivElement>;
  onSearch?: (value: string) => void;
  onCancel?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      size = DEFAULT_SIZE,
      containerProps,
      defaultValue,
      value: externalValue,
      className,
      onSearch,
      onCancel,
      onChange,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation('components', { keyPrefix: 'search' });

    const [value, setValue] = useState<string>(defaultValue?.toString() ?? '');
    const [searchDone, setSearchDone] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);

    const active = Boolean(value) || searchDone;

    useEffect(() => {
      const nextValue: string = externalValue?.toString() ?? '';

      if (nextValue) {
        setValue(nextValue);
      }
    }, [externalValue]);
    useEffect(() => {
      if (active) {
        setVisible(true);
      } else {
        const timeout: NodeJS.Timeout = setTimeout(() => setVisible(false), 100);
        return () => clearTimeout(timeout);
      }
    }, [active]);

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
      setValue(event.target.value);
      onChange?.(event);
    }

    function handleSearch(): void {
      onSearch?.(value);
      setSearchDone(true);
    }

    function handleCancel(): void {
      setValue('');
      onCancel?.();
      setSearchDone(false);
    }

    return (
      <div {...containerProps} className={cn(containerVariants({ size, className: containerProps?.className }))} data-active={active}>
        <div className='relative flex flex-auto'>
          <div className={cn(labelVariants({ size }))}>
            <Search />
          </div>
          <Input
            {...props}
            ref={ref}
            size={size}
            value={value}
            placeholder={t('inputPlaceholder')}
            className={cn(inputVariants({ size, className }))}
            onChange={handleChange}
          />
          <IconButton
            size={ICON_BUTTON_SIZE_MAP[size]}
            className={cn(
              cancelButtonVariants({ size }),
              visibilityButtonVariants({ visible }),
              className,
            )}
            onClick={handleCancel}
          >
            <X />
          </IconButton>
        </div>
        <Button
          size={size}
          variant='dark'
          className={cn(visibilityButtonVariants({ visible }))}
          onClick={handleSearch}
        >
          {t('button')}
        </Button>
      </div>
    );
  },
);
SearchInput.displayName = 'SearchInput';

export default SearchInput;
