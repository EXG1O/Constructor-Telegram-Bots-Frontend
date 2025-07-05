import React, { CSSProperties, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  addEdge as baseAddEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  DefaultEdgeOptions,
  Edge,
  FinalConnectionState,
  HandleType,
  MarkerType,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { iconButtonVariants } from 'components/ui/IconButton';
import Page from 'components/ui/Page';
import { createMessageToast } from 'components/ui/ToastContainer';

import BackgroundTaskNode from './components/BackgroundTaskNode';
import BackgroundTaskOffcanvas from './components/BackgroundTaskOffcanvas';
import CommandNode from './components/CommandNode';
import CommandOffcanvas from './components/CommandOffcanvas';
import ConditionNode from './components/ConditionNode';
import ConditionOffcanvas from './components/ConditionOffcanvas';
import Panel from './components/Panel';
import TriggerNode from './components/TriggerNode';
import TriggerOffcanvas from './components/TriggerOffcanvas';

import useTelegramBotMenuConstructorRouteLoaderData from './hooks/useTelegramBotMenuConstructorRouteLoaderData';

import { APIResponse } from 'api/core';
import {
  ConnectionAPI,
  ConnectionsAPI,
  DiagramBackgroundTaskAPI,
  DiagramCommandAPI,
  DiagramConditionAPI,
  DiagramTriggerAPI,
} from 'api/telegram_bots/main';
import {
  BackgroundTask,
  Command,
  Condition,
  TelegramBot,
  Trigger,
} from 'api/telegram_bots/types';

import cn from 'utils/cn';

import {
  convertDiagramBlocksToEdges,
  parseEdgeSourceHandle,
  parseEdgeTargetHandle,
} from './utils/edges';
import {
  convertDiagramBlockToNode,
  ExistingDiagramBlock,
  NodeType,
} from './utils/nodes';
import { parseNodeID } from './utils/nodes';

import('@xyflow/react/dist/base.css');

export const nodeTypes = {
  trigger: TriggerNode,
  command: CommandNode,
  condition: ConditionNode,
  background_task: BackgroundTaskNode,
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
  } = useTelegramBotMenuConstructorRouteLoaderData();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    Object.entries({
      trigger: diagramTriggers,
      command: diagramCommands,
      condition: diagramConditions,
      background_task: diagramBackgroundTasks,
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

  async function addEdge(
    edge: Edge | Connection,
    shouldUpdateEdges: boolean = true,
  ): Promise<void> {
    if (edge.source && edge.sourceHandle && edge.target && edge.targetHandle) {
      const sourceHandle = parseEdgeSourceHandle(edge.sourceHandle);
      const targetHandle = parseEdgeTargetHandle(edge.targetHandle);

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
        const errors: APIResponse.ErrorDetail[] = response.json.errors;

        createMessageToast({
          message: errors.length
            ? errors[0].detail
            : t('messages.createConnection.error'),
          level: 'error',
        });
        return;
      }

      if (shouldUpdateEdges) {
        setEdges((prevEdges) =>
          baseAddEdge({ ...edge, id: response.json.id.toString() }, prevEdges),
        );
      }
    }
  }

  async function deleteEdge(
    edge: Edge,
    shouldUpdateEdges: boolean = true,
  ): Promise<void> {
    if (!edge.sourceHandle) return;

    const response = await ConnectionAPI.delete(telegramBot.id, parseInt(edge.id));

    if (!response.ok) {
      createMessageToast({
        message: t('messages.deleteConnection.error'),
        level: 'error',
      });
      return;
    }

    if (shouldUpdateEdges) {
      setEdges((prevEdges) => prevEdges.filter((prevEdge) => prevEdge.id !== edge.id));
    }
  }

  async function handleNodeDragStop(
    _event: React.MouseEvent,
    _node: Node,
    nodes: Node[],
  ): Promise<void> {
    nodes.forEach(async (node) => {
      const nodeID = parseNodeID(node.id);

      await diagramBlockAPIMap[nodeID.type].update(
        telegramBot.id,
        nodeID.id,
        node.position,
      );
    });
  }

  function handleNodesDelete(nodes: Node[]): void {
    const nodeIDs = new Set<string>(nodes.map((node) => node.id));

    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => !nodeIDs.has(edge.source) && !nodeIDs.has(edge.target),
      ),
    );
    setNodes((prevNodes) => prevNodes.filter((node) => !nodeIDs.has(node.id)));
  }

  function handleValidConnection(edge: Edge | Connection): boolean {
    // TODO: The implementation needs to be tested across various scenarios.
    return Boolean(
      edge.sourceHandle && edge.targetHandle && edge.source !== edge.target,
    );
  }

  function handleConnect(connection: Connection): void {
    addEdge(connection);
  }

  async function handleReconnect(
    oldEdge: Edge,
    newConnection: Connection,
  ): Promise<void> {
    await deleteEdge(oldEdge);
    await addEdge(newConnection);
  }

  async function handleReconnectEnd(
    _event: MouseEvent | TouchEvent,
    edge: Edge,
    _handleType: HandleType,
    connectionState: FinalConnectionState,
  ): Promise<void> {
    if (!connectionState.isValid) {
      await deleteEdge(edge);
    }
  }

  async function updateDiagramBlock(
    type: NodeType,
    id: number,
    options: UpdateDiagramBlockOptions,
  ): Promise<void> {
    const response = await diagramBlockAPIMap[type].get(telegramBot.id, id);

    if (!response.ok) {
      createMessageToast({
        message: options.messages.getDiagramBlock.error,
        level: 'error',
      });
      return;
    }

    const updatedNode: Node = convertDiagramBlockToNode(type, response.json);

    setNodes((currentNodes) => {
      const newNodes: Node[] = [...currentNodes];
      const updatedNodeIndex = newNodes.findIndex((node) => node.id === updatedNode.id);

      if (updatedNodeIndex !== -1) {
        newNodes[updatedNodeIndex] = updatedNode;
      } else {
        newNodes.push(updatedNode);
      }

      return newNodes;
    });
  }

  async function handleTriggerChange(trigger: Trigger): Promise<void> {
    await updateDiagramBlock('trigger', trigger.id, {
      messages: { getDiagramBlock: { error: t('messages.getDiagramTrigger.error') } },
    });
  }

  async function handleCommandChange(command: Command): Promise<void> {
    await updateDiagramBlock('command', command.id, {
      messages: { getDiagramBlock: { error: t('messages.getDiagramCommand.error') } },
    });
  }

  async function handleConditionChange(condition: Condition): Promise<void> {
    await updateDiagramBlock('condition', condition.id, {
      messages: { getDiagramBlock: { error: t('messages.getDiagramCondition.error') } },
    });
  }

  async function handleBackgroundTaskChange(
    backgroundTask: BackgroundTask,
  ): Promise<void> {
    await updateDiagramBlock('background_task', backgroundTask.id, {
      messages: {
        getDiagramBlock: { error: t('messages.getDiagramBackgroundTask.error') },
      },
    });
  }

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
      <div
        ref={handleRef}
        className='h-full min-w-[600px] overflow-hidden rounded-lg bg-light'
      >
        <ReactFlow
          fitView
          minZoom={0.4}
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
