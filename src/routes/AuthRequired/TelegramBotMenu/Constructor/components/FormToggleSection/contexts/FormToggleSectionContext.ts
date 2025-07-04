import { createContext } from 'react';

export interface FormToggleSectionContextProps {
  open: boolean;
}

const FormToggleSectionContext = createContext<
  FormToggleSectionContextProps | undefined
>(undefined);

export default FormToggleSectionContext;
