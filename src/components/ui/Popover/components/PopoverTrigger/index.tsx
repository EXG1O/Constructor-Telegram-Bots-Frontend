import { PopoverTrigger, type PopoverTriggerProps } from '@radix-ui/react-popover';

import TriggerQuestionIcon from './components/TriggerQuestionIcon';

export type { PopoverTriggerProps };
export default Object.assign(PopoverTrigger, { QuestionIcon: TriggerQuestionIcon });
