import { useContext } from 'react';

import FormToggleSectionContext, {
  FormToggleSectionContextProps,
} from '../contexts/FormToggleSectionContext';

function useFormToggleSection(): FormToggleSectionContextProps {
  const context = useContext<FormToggleSectionContextProps | undefined>(
    FormToggleSectionContext,
  );

  if (context === undefined) {
    throw new Error(
      'useFormToggleSection must be used with a FormToggleSectionContext.',
    );
  }

  return context;
}

export default useFormToggleSection;
