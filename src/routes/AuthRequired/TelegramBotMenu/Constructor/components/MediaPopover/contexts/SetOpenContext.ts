import { createContext, type Dispatch, type SetStateAction } from 'react';

export type SetOpenContextValue = Dispatch<SetStateAction<boolean>>;

const SetOpenContext = createContext<SetOpenContextValue | undefined>(undefined);

export default SetOpenContext;
