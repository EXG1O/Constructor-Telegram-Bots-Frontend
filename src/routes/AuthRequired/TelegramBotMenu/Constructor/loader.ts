import { Params } from 'react-router-dom';

import { DiagramAPIRequestsAPI } from 'api/telegram-bots/api-request';
import { APIResponse as APIRequestAPIResponse } from 'api/telegram-bots/api-request/types';
import { DiagramBackgroundTasksAPI } from 'api/telegram-bots/background-task';
import { APIResponse as BackgroundTaskAPIResponse } from 'api/telegram-bots/background-task/types';
import { DiagramCommandsAPI } from 'api/telegram-bots/command';
import { APIResponse as CommandAPIResponse } from 'api/telegram-bots/command/types';
import { DiagramConditionsAPI } from 'api/telegram-bots/condition';
import { APIResponse as ConditionAPIResponse } from 'api/telegram-bots/condition/types';
import { DiagramDatabaseOperationsAPI } from 'api/telegram-bots/database-operation';
import { APIResponse as DatabaseOperationAPIResponse } from 'api/telegram-bots/database-operation/types';
import { DiagramTriggersAPI } from 'api/telegram-bots/trigger';
import { APIResponse as TriggerAPIResponse } from 'api/telegram-bots/trigger/types';

export interface LoaderData {
  diagramTriggers: TriggerAPIResponse.DiagramTriggersAPI.Get;
  diagramCommands: CommandAPIResponse.DiagramCommandsAPI.Get;
  diagramConditions: ConditionAPIResponse.DiagramConditionsAPI.Get;
  diagramBackgroundTasks: BackgroundTaskAPIResponse.DiagramBackgroundTasksAPI.Get;
  diagramAPIRequests: APIRequestAPIResponse.DiagramAPIRequestsAPI.Get;
  diagramDatabaseOperations: DatabaseOperationAPIResponse.DiagramDatabaseOperationsAPI.Get;
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
    diagramAPIRequestsResponse,
    diagramDatabaseOperationsResponse,
  ] = await Promise.all([
    DiagramTriggersAPI.get(telegramBotID),
    DiagramCommandsAPI.get(telegramBotID),
    DiagramConditionsAPI.get(telegramBotID),
    DiagramBackgroundTasksAPI.get(telegramBotID),
    DiagramAPIRequestsAPI.get(telegramBotID),
    DiagramDatabaseOperationsAPI.get(telegramBotID),
  ]);

  if (
    !diagramTriggersResponse.ok ||
    !diagramCommandsResponse.ok ||
    !diagramConditionsResponse.ok ||
    !diagramBackgroundTasksResponse.ok ||
    !diagramAPIRequestsResponse.ok ||
    !diagramDatabaseOperationsResponse.ok
  )
    return null;

  return {
    diagramTriggers: diagramTriggersResponse.json,
    diagramCommands: diagramCommandsResponse.json,
    diagramConditions: diagramConditionsResponse.json,
    diagramBackgroundTasks: diagramBackgroundTasksResponse.json,
    diagramAPIRequests: diagramAPIRequestsResponse.json,
    diagramDatabaseOperations: diagramDatabaseOperationsResponse.json,
  };
}

export default loader;
