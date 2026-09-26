import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import { type DiagramBlock, type Options, TelegramBotsService } from 'api';

import reverse from 'utils/reverse';

import type { NodeType } from './enums';

export type LoaderData = Record<NodeType, DiagramBlock[]>;

async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const fallback = () => {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    return redirect(reverse(RouteID.TelegramBots));
  };

  const telegramBotID = Number(params.telegramBotID);

  if (Number.isNaN(telegramBotID)) {
    throw fallback();
  }

  const options: Options<{ url: string; path: { telegramBotId: number } }, true> = {
    path: { telegramBotId: telegramBotID },
    throwOnError: true,
  };

  try {
    const [
      { data: diagramTriggers },
      { data: diagramMessages },
      { data: diagramConditions },
      { data: diagramBackgroundTasks },
      { data: diagramAPIRequests },
      { data: diagramDatabaseOperations },
      { data: diagramInvoices },
      { data: diagramTemporaryVariables },
      { data: diagramRandomizers },
      { data: diagramTimers },
    ] = await Promise.all([
      TelegramBotsService.getDiagramTriggerList(options),
      TelegramBotsService.getDiagramMessageList(options),
      TelegramBotsService.getDiagramConditionList(options),
      TelegramBotsService.getDiagramBackgroundTaskList(options),
      TelegramBotsService.getDiagramApiRequestList(options),
      TelegramBotsService.getDiagramDatabaseOperationList(options),
      TelegramBotsService.getDiagramInvoiceList(options),
      TelegramBotsService.getDiagramTemporaryVariableList(options),
      TelegramBotsService.getDiagramRandomizerList(options),
      TelegramBotsService.getDiagramTimerList(options),
    ]);
    return {
      trigger: diagramTriggers,
      message: diagramMessages,
      condition: diagramConditions,
      background_task: diagramBackgroundTasks,
      api_request: diagramAPIRequests,
      database_operation: diagramDatabaseOperations,
      invoice: diagramInvoices,
      temporary_variable: diagramTemporaryVariables,
      randomizer: diagramRandomizers,
      timer: diagramTimers,
    };
  } catch {
    throw fallback();
  }
}

export default loader;
