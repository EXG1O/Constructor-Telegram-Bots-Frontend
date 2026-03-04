import type { Params } from 'react-router-dom';

import { DiagramAPIRequestsAPI } from 'api/telegram-bots/api-request';
import type { APIResponse as APIRequestAPIResponse } from 'api/telegram-bots/api-request/types';
import { DiagramBackgroundTasksAPI } from 'api/telegram-bots/background-task';
import type { APIResponse as BackgroundTaskAPIResponse } from 'api/telegram-bots/background-task/types';
import { DiagramConditionsAPI } from 'api/telegram-bots/condition';
import type { APIResponse as ConditionAPIResponse } from 'api/telegram-bots/condition/types';
import { DiagramDatabaseOperationsAPI } from 'api/telegram-bots/database-operation';
import type { APIResponse as DatabaseOperationAPIResponse } from 'api/telegram-bots/database-operation/types';
import { DiagramInvoicesAPI } from 'api/telegram-bots/invoice';
import type { APIResponse as InvoiceAPIResponse } from 'api/telegram-bots/invoice/types';
import { DiagramMessagesAPI } from 'api/telegram-bots/message';
import type { APIResponse as MessageAPIResponse } from 'api/telegram-bots/message/types';
import { DiagramTemporaryVariablesAPI } from 'api/telegram-bots/temporary-variable';
import type { APIResponse as TemporaryVariableAPIResponse } from 'api/telegram-bots/temporary-variable/types';
import { DiagramTriggersAPI } from 'api/telegram-bots/trigger';
import type { APIResponse as TriggerAPIResponse } from 'api/telegram-bots/trigger/types';

export interface LoaderData {
  diagramTriggers: TriggerAPIResponse.DiagramTriggersAPI.Get;
  diagramMessages: MessageAPIResponse.DiagramMessagesAPI.Get;
  diagramConditions: ConditionAPIResponse.DiagramConditionsAPI.Get;
  diagramBackgroundTasks: BackgroundTaskAPIResponse.DiagramBackgroundTasksAPI.Get;
  diagramAPIRequests: APIRequestAPIResponse.DiagramAPIRequestsAPI.Get;
  diagramDatabaseOperations: DatabaseOperationAPIResponse.DiagramDatabaseOperationsAPI.Get;
  diagramInvoices: InvoiceAPIResponse.DiagramInvoicesAPI.Get;
  diagramTemporaryVariables: TemporaryVariableAPIResponse.DiagramTemporaryVariablesAPI.Get;
}

async function loader({
  params,
}: {
  params: Params<'telegramBotID'>;
}): Promise<LoaderData | null> {
  const telegramBotID = Number(params.telegramBotID);
  if (Number.isNaN(telegramBotID)) return null;

  const [
    diagramTriggersResponse,
    diagramMessagesResponse,
    diagramConditionsResponse,
    diagramBackgroundTasksResponse,
    diagramAPIRequestsResponse,
    diagramDatabaseOperationsResponse,
    diagramInvoicesResponse,
    diagramTemporaryVariablesResponse,
  ] = await Promise.all([
    DiagramTriggersAPI.get(telegramBotID),
    DiagramMessagesAPI.get(telegramBotID),
    DiagramConditionsAPI.get(telegramBotID),
    DiagramBackgroundTasksAPI.get(telegramBotID),
    DiagramAPIRequestsAPI.get(telegramBotID),
    DiagramDatabaseOperationsAPI.get(telegramBotID),
    DiagramInvoicesAPI.get(telegramBotID),
    DiagramTemporaryVariablesAPI.get(telegramBotID),
  ]);

  if (
    !diagramTriggersResponse.ok ||
    !diagramMessagesResponse.ok ||
    !diagramConditionsResponse.ok ||
    !diagramBackgroundTasksResponse.ok ||
    !diagramAPIRequestsResponse.ok ||
    !diagramDatabaseOperationsResponse.ok ||
    !diagramInvoicesResponse.ok ||
    !diagramTemporaryVariablesResponse.ok
  )
    return null;

  return {
    diagramTriggers: diagramTriggersResponse.json,
    diagramMessages: diagramMessagesResponse.json,
    diagramConditions: diagramConditionsResponse.json,
    diagramBackgroundTasks: diagramBackgroundTasksResponse.json,
    diagramAPIRequests: diagramAPIRequestsResponse.json,
    diagramDatabaseOperations: diagramDatabaseOperationsResponse.json,
    diagramInvoices: diagramInvoicesResponse.json,
    diagramTemporaryVariables: diagramTemporaryVariablesResponse.json,
  };
}

export default loader;
