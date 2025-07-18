import { Params } from 'react-router-dom';

import { DiagramBackgroundTasksAPI } from 'api/telegram_bots/background_task';
import { APIResponse as BackgroundTaskAPIResponse } from 'api/telegram_bots/background_task/types';
import { DiagramCommandsAPI } from 'api/telegram_bots/command';
import { APIResponse as CommandAPIResponse } from 'api/telegram_bots/command/types';
import { DiagramConditionsAPI } from 'api/telegram_bots/condition';
import { APIResponse as ConditionAPIResponse } from 'api/telegram_bots/condition/types';
import { DiagramTriggersAPI } from 'api/telegram_bots/trigger';
import { APIResponse as TriggerAPIResponse } from 'api/telegram_bots/trigger/types';

export interface LoaderData {
  diagramTriggers: TriggerAPIResponse.DiagramTriggersAPI.Get;
  diagramCommands: CommandAPIResponse.DiagramCommandsAPI.Get;
  diagramConditions: ConditionAPIResponse.DiagramConditionsAPI.Get;
  diagramBackgroundTasks: BackgroundTaskAPIResponse.DiagramBackgroundTasksAPI.Get;
}

async function loader({
  params,
}: {
  params: Params<'telegramBotID'>;
}): Promise<LoaderData | null> {
  const telegramBotID: number = parseInt(params.telegramBotID!);

  const [
    diagramTriggersResponse,
    diagramCommandsResponse,
    diagramConditionsResponse,
    diagramBackgroundTasksResponse,
  ] = await Promise.all([
    DiagramTriggersAPI.get(telegramBotID),
    DiagramCommandsAPI.get(telegramBotID),
    DiagramConditionsAPI.get(telegramBotID),
    DiagramBackgroundTasksAPI.get(telegramBotID),
  ]);

  if (
    !diagramTriggersResponse.ok ||
    !diagramCommandsResponse.ok ||
    !diagramConditionsResponse.ok ||
    !diagramBackgroundTasksResponse.ok
  )
    return null;

  return {
    diagramTriggers: diagramTriggersResponse.json,
    diagramCommands: diagramCommandsResponse.json,
    diagramConditions: diagramConditionsResponse.json,
    diagramBackgroundTasks: diagramBackgroundTasksResponse.json,
  };
}

export default loader;
