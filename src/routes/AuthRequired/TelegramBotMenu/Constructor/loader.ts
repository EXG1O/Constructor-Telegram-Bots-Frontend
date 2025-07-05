import { Params } from 'react-router-dom';

import {
  DiagramBackgroundTasksAPI,
  DiagramCommandsAPI,
  DiagramConditionsAPI,
  DiagramTriggersAPI,
} from 'api/telegram_bots/main';
import { APIResponse } from 'api/telegram_bots/types';

export interface LoaderData {
  diagramTriggers: APIResponse.DiagramTriggersAPI.Get;
  diagramCommands: APIResponse.DiagramCommandsAPI.Get;
  diagramConditions: APIResponse.DiagramConditionsAPI.Get;
  diagramBackgroundTasks: APIResponse.DiagramBackgroundTasksAPI.Get;
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
