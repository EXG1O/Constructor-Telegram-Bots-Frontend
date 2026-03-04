import React, { forwardRef, useEffect, useState } from 'react';
import i18n from 'i18n';

import Page, { type PageProps } from 'components/ui/Page';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import SectionItem from './components/SectionItem';

import cn from 'utils/cn';

export interface Section {
  title: string;
  text: string;
}

export interface InfoPageOptions {
  getSections: {
    func: () => Promise<Section[] | null>;
    messages: {
      error: string;
    };
  };
}

export interface InfoPageProps extends PageProps {
  initialSections: Section[];
  options: InfoPageOptions;
}

const InfoPage = forwardRef<HTMLElement, InfoPageProps>(
  (
    {
      title,
      flex = true,
      gutters = true,
      initialSections,
      options,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [sections, setSections] = useState<Section[]>(initialSections);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      const updateSections = async () => {
        setLoading(true);

        const sections = await options.getSections.func();

        if (!sections) {
          createMessageToast({
            message: options.getSections.messages.error,
            level: 'error',
          });
          return;
        }

        setSections(sections);
        setLoading(false);
      };

      i18n.on('languageChanged', updateSections);
      return () => i18n.off('languageChanged', updateSections);
    }, []);

    return (
      <Page
        {...props}
        ref={ref}
        title={title}
        flex={flex}
        gutters={gutters}
        className={cn('flex-auto', className)}
      >
        <h2 className='text-center text-4xl font-semibold text-foreground'>{title}</h2>
        {!loading ? (
          sections.map((section, index) => (
            <SectionItem key={index} section={section} />
          ))
        ) : (
          <div className='flex flex-auto items-center justify-center'>
            <Spinner />
          </div>
        )}
        {children}
      </Page>
    );
  },
);
InfoPage.displayName = 'InfoPage';

export default InfoPage;
