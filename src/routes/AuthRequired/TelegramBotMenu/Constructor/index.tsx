import React, { CSSProperties, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  addEdge as RFAddEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  DefaultEdgeOptions,
  Edge,
  FinalConnectionState,
  HandleType,
  IsValidConnection,
  MarkerType,
  MiniMap,
  Node,
  OnConnect,
  OnNodeDrag,
  OnNodesDelete,
  OnReconnect,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { iconButtonVariants } from 'components/ui/IconButton';
import Page from 'components/ui/Page';
import { createMessageToast } from 'components/ui/ToastContainer';

import APIRequestNode from './components/APIRequestNode';
import APIRequestOffcanvas from './components/APIRequestOffcanvas';
import BackgroundTaskNode from './components/BackgroundTaskNode';
import BackgroundTaskOffcanvas from './components/BackgroundTaskOffcanvas';
import CommandNode from './components/CommandNode';
import CommandOffcanvas from './components/CommandOffcanvas';
import ConditionNode from './components/ConditionNode';
import ConditionOffcanvas from './components/ConditionOffcanvas';
import DatabaseOperationNode from './components/DatabaseOperationNode';
import DatabaseOperationOffcanvas from './components/DatabaseOperationOffcanvas';
import Panel from './components/Panel';
import TriggerNode from './components/TriggerNode';
import TriggerOffcanvas from './components/TriggerOffcanvas';

import useTelegramBotMenuConstructorRouteLoaderData from './hooks/useTelegramBotMenuConstructorRouteLoaderData';

import { APIResponse } from 'api/core';
import { DiagramAPIRequestAPI } from 'api/telegram-bots/api-request';
import { APIRequest } from 'api/telegram-bots/api-request/types';
import { DiagramBackgroundTaskAPI } from 'api/telegram-bots/background-task';
import { BackgroundTask } from 'api/telegram-bots/background-task/types';
import { DiagramCommandAPI } from 'api/telegram-bots/command';
import { Command } from 'api/telegram-bots/command/types';
import { DiagramConditionAPI } from 'api/telegram-bots/condition';
import { Condition } from 'api/telegram-bots/condition/types';
import { ConnectionAPI, ConnectionsAPI } from 'api/telegram-bots/connection';
import { DiagramDatabaseOperationAPI } from 'api/telegram-bots/database-operation';
import { DatabaseOperation } from 'api/telegram-bots/database-operation/types';
import { TelegramBot } from 'api/telegram-bots/telegram-bot/types';
import { DiagramTriggerAPI } from 'api/telegram-bots/trigger';
import { Trigger } from 'api/telegram-bots/trigger/types';

import cn from 'utils/cn';

import {
  convertDiagramBlocksToEdges,
  EdgeSourceHandle,
  EdgeTargetHandle,
  parseEdgeSourceHandle,
  parseEdgeTargetHandle,
} from './utils/edges';
import {
  convertDiagramBlockToNode,
  ExistingDiagramBlock,
  NodeID,
  NodeType,
} from './utils/nodes';
import { parseNodeID } from './utils/nodes';

import('@xyflow/react/dist/base.css');

export const nodeTypes = {
  trigger: TriggerNode,
  command: CommandNode,
  condition: ConditionNode,
  background_task: BackgroundTaskNode,
  api_request: APIRequestNode,
  database_operation: DatabaseOperationNode,
};
const defaultEdgeOptions: DefaultEdgeOptions = {
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
      id: ExistingDiagramBlock['id'],
    ) => Promise<
      | APIResponse.Base<true, ExistingDiagramBlock>
      | APIResponse.Base<false, APIResponse.ErrorList>
    >;
    update: (
      telegramBotID: TelegramBot['id'],
      id: ExistingDiagramBlock['id'],
      data: Pick<ExistingDiagramBlock, 'x' | 'y'>,
    ) => Promise<
      | APIResponse.Base<true, ExistingDiagramBlock>
      | APIResponse.Base<false, APIResponse.ErrorList>
    >;
  }
> = {
  trigger: DiagramTriggerAPI,
  command: DiagramCommandAPI,
  condition: DiagramConditionAPI,
  background_task: DiagramBackgroundTaskAPI,
  api_request: DiagramAPIRequestAPI,
  database_operation: DiagramDatabaseOperationAPI,
};

interface UpdateDiagramBlockOptions {
  messages: {
    getDiagramBlock: {
      error: string;
    };
  };
}

function Constructor(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor);

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();
  const {
    diagramTriggers,
    diagramCommands,
    diagramConditions,
    diagramBackgroundTasks,
    diagramAPIRequests,
    diagramDatabaseOperations,
  } = useTelegramBotMenuConstructorRouteLoaderData();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    Object.entries({
      trigger: diagramTriggers,
      command: diagramCommands,
      condition: diagramConditions,
      background_task: diagramBackgroundTasks,
      api_request: diagramAPIRequests,
      database_operation: diagramDatabaseOperations,
    } as Record<NodeType, ExistingDiagramBlock[]>).flatMap(([type, diagramBlocks]) =>
      diagramBlocks.map((diagramBlock) =>
        convertDiagramBlockToNode(type as NodeType, diagramBlock),
      ),
    ),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    convertDiagramBlocksToEdges({
      triggers: diagramTriggers,
      commands: diagramCommands,
      conditions: diagramConditions,
      backgroundTasks: diagramBackgroundTasks,
      apiRequests: diagramAPIRequests,
      databaseOperations: diagramDatabaseOperations,
    }),
  );

  function handleRef(element: HTMLDivElement | null): void {
    if (!element) return;

    element.querySelectorAll('.react-flow__panel').forEach((panel) => {
      panel.className = cn(panel.className, '!m-3');
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
      attrElement.className = cn(attrElement.className, '!text-[8px]', '!p-0', '!mb-0');
    }
  }

  const addEdge = useCallback(
    async (edge: Edge | Connection) => {
      if (!edge.sourceHandle || !edge.targetHandle) return;

      const sourceHandle: EdgeSourceHandle = parseEdgeSourceHandle(edge.sourceHandle);
      const targetHandle: EdgeTargetHandle = parseEdgeTargetHandle(edge.targetHandle);

      const response = await ConnectionsAPI.create(telegramBot.id, {
        ...(sourceHandle.objectType === 'command'
          ? {
              source_object_type: 'command_keyboard_button',
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
    [telegramBot],
  );

  const deleteEdge = useCallback(
    async (edge: Edge) => {
      setEdges((prevEdges) =>
        prevEdges.map((prevEdge) =>
          prevEdge.id === edge.id ? { ...prevEdge, hidden: true } : prevEdge,
        ),
      );

      const response = await ConnectionAPI.delete(telegramBot.id, parseInt(edge.id));

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
    [telegramBot],
  );

  const handleNodeDragStop = useCallback<OnNodeDrag>(
    async (_event, _node, nodes) => {
      await Promise.all(
        nodes.map((node) => {
          const nodeID: NodeID = parseNodeID(node.id);

          return diagramBlockAPIMap[nodeID.type].update(
            telegramBot.id,
            nodeID.id,
            node.position,
          );
        }),
      );
    },
    [telegramBot],
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

  const updateDiagramBlock = useCallback(
    async (type: NodeType, id: number, options: UpdateDiagramBlockOptions) => {
      const response = await diagramBlockAPIMap[type].get(telegramBot.id, id);

      if (!response.ok) {
        for (const error of response.json.errors) {
          if (error.attr) continue;
          createMessageToast({ message: error.detail, level: 'error' });
        }
        createMessageToast({
          message: options.messages.getDiagramBlock.error,
          level: 'error',
        });
        return;
      }

      const updatedNode: Node = convertDiagramBlockToNode(type, response.json);

      setNodes((prevNodes) => {
        const newNodes: Node[] = [...prevNodes];
        const updatedNodeIndex = newNodes.findIndex(
          (node) => node.id === updatedNode.id,
        );

        if (updatedNodeIndex !== -1) {
          newNodes[updatedNodeIndex] = updatedNode;
        } else {
          newNodes.push(updatedNode);
        }

        return newNodes;
      });
    },
    [telegramBot],
  );

  const handleTriggerChange = useCallback(
    async (trigger: Trigger) => {
      await updateDiagramBlock('trigger', trigger.id, {
        messages: { getDiagramBlock: { error: t('messages.getDiagramTrigger.error') } },
      });
    },
    [updateDiagramBlock],
  );

  const handleCommandChange = useCallback(
    async (command: Command) => {
      await updateDiagramBlock('command', command.id, {
        messages: { getDiagramBlock: { error: t('messages.getDiagramCommand.error') } },
      });
    },
    [updateDiagramBlock],
  );

  const handleConditionChange = useCallback(
    async (condition: Condition) => {
      await updateDiagramBlock('condition', condition.id, {
        messages: {
          getDiagramBlock: { error: t('messages.getDiagramCondition.error') },
        },
      });
    },
    [updateDiagramBlock],
  );

  const handleBackgroundTaskChange = useCallback(
    async (backgroundTask: BackgroundTask) => {
      await updateDiagramBlock('background_task', backgroundTask.id, {
        messages: {
          getDiagramBlock: { error: t('messages.getDiagramBackgroundTask.error') },
        },
      });
    },
    [updateDiagramBlock],
  );

  const handleAPIRequestChange = useCallback(
    async (backgroundTask: APIRequest) => {
      await updateDiagramBlock('api_request', backgroundTask.id, {
        messages: {
          getDiagramBlock: { error: t('messages.getDiagramAPIRequest.error') },
        },
      });
    },
    [updateDiagramBlock],
  );

  const handleDatabaseOperationChange = useCallback(
    async (operation: DatabaseOperation) => {
      await updateDiagramBlock('database_operation', operation.id, {
        messages: {
          getDiagramBlock: { error: t('messages.getDiagramDatabaseOperation.error') },
        },
      });
    },
    [updateDiagramBlock],
  );

  return (
    <Page title={t('title')} className='flex-auto'>
      <TriggerOffcanvas onAdd={handleTriggerChange} onSave={handleTriggerChange} />
      <CommandOffcanvas onAdd={handleCommandChange} onSave={handleCommandChange} />
      <ConditionOffcanvas
        onAdd={handleConditionChange}
        onSave={handleConditionChange}
      />
      <BackgroundTaskOffcanvas
        onAdd={handleBackgroundTaskChange}
        onSave={handleBackgroundTaskChange}
      />
      <APIRequestOffcanvas
        onAdd={handleAPIRequestChange}
        onSave={handleAPIRequestChange}
      />
      <DatabaseOperationOffcanvas
        onAdd={handleDatabaseOperationChange}
        onSave={handleDatabaseOperationChange}
      />
      <div ref={handleRef} className='size-full overflow-hidden rounded-lg bg-light'>
        <ReactFlow
          fitView
          minZoom={0.25}
          maxZoom={4}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
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
    </Page>
  );
}

export default Constructor;
