import type {
  ApiRequest,
  ApiRequestRequestWritable,
  BackgroundTask,
  BackgroundTaskRequestWritable,
  Condition,
  ConditionRequestWritable,
  DatabaseOperation,
  DatabaseOperationRequestWritable,
  DiagramApiRequest,
  DiagramBackgroundTask,
  DiagramCondition,
  DiagramDatabaseOperation,
  DiagramInvoice,
  DiagramMessage,
  DiagramRandomizer,
  DiagramTemporaryVariable,
  DiagramTimer,
  DiagramTrigger,
  Invoice,
  InvoiceRequestWritable,
  Message,
  MessageRequestWritable,
  Randomizer,
  RandomizerRequestWritable,
  TemporaryVariable,
  TemporaryVariableRequestWritable,
  Timer,
  TimerRequestWritable,
  Trigger,
  TriggerRequestWritable,
} from './client';

export type Block =
  | Trigger
  | Message
  | Condition
  | BackgroundTask
  | ApiRequest
  | DatabaseOperation
  | Invoice
  | TemporaryVariable
  | Timer
  | Randomizer;

export type BlockRequestWritable =
  | TriggerRequestWritable
  | MessageRequestWritable
  | ConditionRequestWritable
  | BackgroundTaskRequestWritable
  | ApiRequestRequestWritable
  | DatabaseOperationRequestWritable
  | InvoiceRequestWritable
  | TemporaryVariableRequestWritable
  | TimerRequestWritable
  | RandomizerRequestWritable;

export type DiagramBlock =
  | DiagramTrigger
  | DiagramMessage
  | DiagramCondition
  | DiagramBackgroundTask
  | DiagramApiRequest
  | DiagramDatabaseOperation
  | DiagramInvoice
  | DiagramTemporaryVariable
  | DiagramTimer
  | DiagramRandomizer;
