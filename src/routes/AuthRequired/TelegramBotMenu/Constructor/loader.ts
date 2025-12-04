import { Params } from 'react-router-dom';

import { DiagramAPIRequestsAPI } from 'api/telegram-bots/api-request';
import { APIResponse as APIRequestAPIResponse } from 'api/telegram-bots/api-request/types';
import { DiagramBackgroundTasksAPI } from 'api/telegram-bots/background-task';
import { APIResponse as BackgroundTaskAPIResponse } from 'api/telegram-bots/background-task/types';
import { DiagramConditionsAPI } from 'api/telegram-bots/condition';
import { APIResponse as ConditionAPIResponse } from 'api/telegram-bots/condition/types';
import { DiagramDatabaseOperationsAPI } from 'api/telegram-bots/database-operation';
import { APIResponse as DatabaseOperationAPIResponse } from 'api/telegram-bots/database-operation/types';
import { DiagramMessagesAPI } from 'api/telegram-bots/message';
import { APIResponse as MessageAPIResponse } from 'api/telegram-bots/message/types';
import { DiagramTriggersAPI } from 'api/telegram-bots/trigger';
import { APIResponse as TriggerAPIResponse } from 'api/telegram-bots/trigger/types';

export interface LoaderData {
  diagramTriggers: TriggerAPIResponse.DiagramTriggersAPI.Get;
  diagramMessages: MessageAPIResponse.DiagramMessagesAPI.Get;
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
    diagramMessagesResponse,
    diagramConditionsResponse,
    diagramBackgroundTasksResponse,
    diagramAPIRequestsResponse,
    diagramDatabaseOperationsResponse,
  ] = await Promise.all([
    DiagramTriggersAPI.get(telegramBotID),
    DiagramMessagesAPI.get(telegramBotID),
    DiagramConditionsAPI.get(telegramBotID),
    DiagramBackgroundTasksAPI.get(telegramBotID),
    DiagramAPIRequestsAPI.get(telegramBotID),
    DiagramDatabaseOperationsAPI.get(telegramBotID),
  ]);

  if (
    !diagramTriggersResponse.ok ||
    !diagramMessagesResponse.ok ||
    !diagramConditionsResponse.ok ||
    !diagramBackgroundTasksResponse.ok ||
    !diagramAPIRequestsResponse.ok ||
    !diagramDatabaseOperationsResponse.ok
  )
    return null;

  return {
    diagramTriggers: diagramTriggersResponse.json,
    diagramMessages: diagramMessagesResponse.json,
    diagramConditions: diagramConditionsResponse.json,
    diagramBackgroundTasks: diagramBackgroundTasksResponse.json,
    diagramAPIRequests: diagramAPIRequestsResponse.json,
    diagramDatabaseOperations: diagramDatabaseOperationsResponse.json,
  };
}

export default loader;
