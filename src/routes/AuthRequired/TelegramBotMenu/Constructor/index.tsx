import React, { type CSSProperties, type ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  addEdge as RFAddEdge,
  Background,
  BackgroundVariant,
  type Connection,
  ConnectionLineType,
  Controls,
  type DefaultEdgeOptions,
  type Edge,
  type FinalConnectionState,
  type HandleType,
  type IsValidConnection,
  MarkerType,
  MiniMap,
  type OnConnect,
  type OnNodeDrag,
  type OnNodesDelete,
  type OnReconnect,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { iconButtonVariants } from 'components/ui/IconButton';
import Page from 'components/ui/Page';
import { createMessageToast } from 'components/ui/ToastContainer';

import APIRequestNode from './components/APIRequestNode';
import APIRequestOffcanvas from './components/APIRequestOffcanvas';
import BackgroundTaskNode from './components/BackgroundTaskNode';
import BackgroundTaskOffcanvas from './components/BackgroundTaskOffcanvas';
import ConditionNode from './components/ConditionNode';
import ConditionOffcanvas from './components/ConditionOffcanvas';
import DatabaseOperationNode from './components/DatabaseOperationNode';
import DatabaseOperationOffcanvas from './components/DatabaseOperationOffcanvas';
import InvoiceNode from './components/InvoiceNode';
import InvoiceOffcanvas from './components/InvoiceOffcanvas';
import MessageNode from './components/MessageNode';
import MessageOffcanvas from './components/MessageOffcanvas';
import Panel from './components/Panel';
import TemporaryVariableNode from './components/TemporaryVariableNode';
import TemporaryVariableOffcanvas from './components/TemporaryVariableOffcanvas';
import TriggerNode from './components/TriggerNode';
import TriggerOffcanvas from './components/TriggerOffcanvas';

import useTelegramBotMenuConstructorRouteLoaderData from './hooks/useTelegramBotMenuConstructorRouteLoaderData';

import type { APIResponse } from 'api/core';
import { DiagramAPIRequestAPI } from 'api/telegram-bots/api-request';
import { DiagramBackgroundTaskAPI } from 'api/telegram-bots/background-task';
import type { DiagramBlock } from 'api/telegram-bots/base/types';
import { DiagramConditionAPI } from 'api/telegram-bots/condition';
import { ConnectionAPI, ConnectionsAPI } from 'api/telegram-bots/connection';
import { DiagramDatabaseOperationAPI } from 'api/telegram-bots/database-operation';
import { DiagramInvoiceAPI } from 'api/telegram-bots/invoice';
import { DiagramMessageAPI } from 'api/telegram-bots/message';
import type { TelegramBot } from 'api/telegram-bots/telegram-bot/types';
import { DiagramTemporaryVariableAPI } from 'api/telegram-bots/temporary-variable';
import { DiagramTriggerAPI } from 'api/telegram-bots/trigger';

import cn from 'utils/cn';

import {
  convertDiagramBlocksToEdges,
  type EdgeSourceHandle,
  type EdgeTargetHandle,
  parseEdgeSourceHandle,
  parseEdgeTargetHandle,
} from './utils/edges';
import { convertDiagramBlockToNode, type NodeID, type NodeType } from './utils/nodes';
import { parseNodeID } from './utils/nodes';

import('@xyflow/react/dist/base.css');

export const nodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  condition: ConditionNode,
  background_task: BackgroundTaskNode,
  api_request: APIRequestNode,
  database_operation: DatabaseOperationNode,
  invoice: InvoiceNode,
  temporary_variable: TemporaryVariableNode,
};
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: ConnectionLineType.SmoothStep,
  markerEnd: {
    type: MarkerType.Arrow,
    strokeWidth: 1.8,
  },
};
const reactFlowStyle: CSSProperties = {
  '--xy-attribution-background-color-default': 'unset',
} as any;

const diagramBlockAPIMap: Record<
  NodeType,
  {
    get: (
      telegramBotID: TelegramBot['id'],
      id: DiagramBlock['id'],
    ) => Promise<
      | APIResponse.Base<true, DiagramBlock>
      | APIResponse.Base<false, APIResponse.ErrorList>
    >;
    update: (
      telegramBotID: TelegramBot['id'],
      id: DiagramBlock['id'],
      data: Pick<DiagramBlock, 'x' | 'y'>,
    ) => Promise<
      | APIResponse.Base<true, DiagramBlock>
      | APIResponse.Base<false, APIResponse.ErrorList>
    >;
  }
> = {
  trigger: DiagramTriggerAPI,
  message: DiagramMessageAPI,
  condition: DiagramConditionAPI,
  background_task: DiagramBackgroundTaskAPI,
  api_request: DiagramAPIRequestAPI,
  database_operation: DiagramDatabaseOperationAPI,
  invoice: DiagramInvoiceAPI,
  temporary_variable: DiagramTemporaryVariableAPI,
};

function Constructor(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor);

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const {
    diagramTriggers,
    diagramMessages,
    diagramConditions,
    diagramBackgroundTasks,
    diagramAPIRequests,
    diagramDatabaseOperations,
    diagramInvoices,
    diagramTemporaryVariables,
  } = useTelegramBotMenuConstructorRouteLoaderData();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    Object.entries({
      trigger: diagramTriggers,
      message: diagramMessages,
      condition: diagramConditions,
      background_task: diagramBackgroundTasks,
      api_request: diagramAPIRequests,
      database_operation: diagramDatabaseOperations,
      invoice: diagramInvoices,
      temporary_variable: diagramTemporaryVariables,
    } as Record<NodeType, DiagramBlock[]>).flatMap(([type, diagramBlocks]) =>
      diagramBlocks.map((diagramBlock) =>
        convertDiagramBlockToNode(type as NodeType, diagramBlock),
      ),
    ),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    convertDiagramBlocksToEdges({
      messages: diagramMessages,
      other: [
        ...diagramTriggers,
        ...diagramConditions,
        ...diagramBackgroundTasks,
        ...diagramAPIRequests,
        ...diagramDatabaseOperations,
        ...diagramInvoices,
        ...diagramTemporaryVariables,
      ],
    }),
  );

  function handleRef(element: HTMLDivElement | null): void {
    if (!element) return;

    element.querySelectorAll('.react-flow__panel').forEach((panel) => {
      panel.className = cn(panel.className, 'm-3!');
    });
    element.querySelectorAll('.react-flow__controls-button').forEach((button) => {
      button.className = cn(
        button.className,
        iconButtonVariants({ size: 'sm' }),
        'bg-white',
        'text-foreground',
        'rounded-none',
        'hover:bg-gray-100',
        'focus-visible:bg-gray-100',
        'focus-visible:ring-white/50',
      );
    });

    const attrElement: Element | null = element.querySelector(
      '.react-flow__attribution',
    );

    if (attrElement) {
      attrElement.className = cn(attrElement.className, 'text-[8px]!', 'p-0!', 'mb-0!');
    }
  }

  const addEdge = useCallback(
    async (edge: Edge | Connection) => {
      if (!edge.sourceHandle || !edge.targetHandle) return;

      const sourceHandle: EdgeSourceHandle = parseEdgeSourceHandle(edge.sourceHandle);
      const targetHandle: EdgeTargetHandle = parseEdgeTargetHandle(edge.targetHandle);

      const response = await ConnectionsAPI.create(telegramBotID, {
        ...(sourceHandle.objectType === 'message' && sourceHandle.nestedObjectID
          ? {
              source_object_type: 'message_keyboard_button',
              source_object_id: sourceHandle.nestedObjectID,
            }
          : {
              source_object_type: sourceHandle.objectType,
              source_object_id: sourceHandle.objectID,
            }),
        source_handle_position: sourceHandle.position,
        target_object_type: targetHandle.objectType,
        target_object_id: targetHandle.objectID,
        target_handle_position: targetHandle.position,
      });

      if (!response.ok) {
        for (const error of response.json.errors) {
          if (error.attr) continue;
          createMessageToast({ message: error.detail, level: 'error' });
        }
        createMessageToast({
          message: t('messages.createConnection.error'),
          level: 'error',
        });
        return;
      }

      setEdges((prevEdges) =>
        RFAddEdge({ ...edge, id: response.json.id.toString() }, prevEdges),
      );
    },
    [telegramBotID],
  );

  const deleteEdge = useCallback(
    async (edge: Edge) => {
      setEdges((prevEdges) =>
        prevEdges.map((prevEdge) =>
          prevEdge.id === edge.id ? { ...prevEdge, hidden: true } : prevEdge,
        ),
      );

      const response = await ConnectionAPI.delete(telegramBotID, parseInt(edge.id));

      if (!response.ok) {
        setEdges((prevEdges) =>
          prevEdges.map((prevEdge) =>
            prevEdge.id === edge.id ? { ...prevEdge, hidden: false } : prevEdge,
          ),
        );
        for (const error of response.json.errors) {
          if (error.attr) continue;
          createMessageToast({ message: error.detail, level: 'error' });
        }
        createMessageToast({
          message: t('messages.deleteConnection.error'),
          level: 'error',
        });
        return;
      }

      setEdges((prevEdges) => prevEdges.filter((prevEdge) => prevEdge.id !== edge.id));
    },
    [telegramBotID],
  );

  const handleNodeDragStop = useCallback<OnNodeDrag>(
    async (_event, _node, nodes) => {
      await Promise.all(
        nodes.map((node) => {
          const nodeID: NodeID = parseNodeID(node.id);

          return diagramBlockAPIMap[nodeID.type].update(
            telegramBotID,
            nodeID.id,
            node.position,
          );
        }),
      );
    },
    [telegramBotID],
  );

  const handleNodesDelete = useCallback<OnNodesDelete>((nodes) => {
    const nodeIDs = new Set<string>(nodes.map((node) => node.id));

    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => !nodeIDs.has(edge.source) && !nodeIDs.has(edge.target),
      ),
    );
    setNodes((prevNodes) => prevNodes.filter((node) => !nodeIDs.has(node.id)));
  }, []);

  const handleValidConnection = useCallback<IsValidConnection>((edge) => {
    // TODO: The implementation needs to be tested across various scenarios.
    return Boolean(
      edge.sourceHandle && edge.targetHandle && edge.source !== edge.target,
    );
  }, []);

  const handleConnect = useCallback<OnConnect>(
    (connection: Connection) => addEdge(connection),
    [addEdge],
  );

  const handleReconnect = useCallback<OnReconnect>(
    async (oldEdge, newConnection) => {
      await deleteEdge(oldEdge);
      await addEdge(newConnection);
    },
    [deleteEdge, addEdge],
  );

  const handleReconnectEnd = useCallback(
    async (
      _event: MouseEvent | TouchEvent,
      edge: Edge,
      _handleType: HandleType,
      connectionState: FinalConnectionState,
    ) => {
      if (!connectionState.isValid) {
        await deleteEdge(edge);
      }
    },
    [deleteEdge],
  );

  return (
    <Page title={t('title')} className='flex-auto'>
      <ReactFlowProvider>
        <TriggerOffcanvas />
        <MessageOffcanvas />
        <ConditionOffcanvas />
        <BackgroundTaskOffcanvas />
        <APIRequestOffcanvas />
        <DatabaseOperationOffcanvas />
        <InvoiceOffcanvas />
        <TemporaryVariableOffcanvas />
        <div ref={handleRef} className='size-full overflow-hidden rounded-lg bg-light'>
          <ReactFlow
            fitView
            minZoom={0.25}
            maxZoom={4}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            defaultEdgeOptions={defaultEdgeOptions}
            elevateEdgesOnSelect
            deleteKeyCode={null}
            style={reactFlowStyle}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={handleNodeDragStop}
            onNodesDelete={handleNodesDelete}
            isValidConnection={handleValidConnection}
            onConnect={handleConnect}
            onReconnect={handleReconnect}
            onReconnectEnd={handleReconnectEnd}
          >
            <Panel />
            <Controls
              showInteractive={false}
              className='overflow-hidden rounded-sm shadow-sm'
            />
            <MiniMap
              bgColor='var(--color-light)'
              nodeColor='var(--color-light-accent)'
              maskColor='var(--color-white)'
              className='overflow-hidden rounded-sm shadow-sm'
            />
            <Background variant={BackgroundVariant.Dots} size={1} gap={20} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </Page>
  );
}

export default Constructor;
