import {
  Collapsible,
  type CollapsibleProps,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';

import CollapsibleBody from './components/CollapsibleBody';

export type { CollapsibleProps };
export default Object.assign(Collapsible, {
  Trigger: CollapsibleTrigger,
  Body: CollapsibleBody,
});
