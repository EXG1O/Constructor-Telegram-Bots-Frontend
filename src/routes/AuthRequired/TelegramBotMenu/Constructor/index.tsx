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
  MarkerType,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlow,
  reconnectEdge,
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

import useTelegramBotMenuConstructorRouteLoaderData from './hooks/useTelegramBotMenuConstructorRouteLoaderData';

import { APIResponse } from 'api/core';
import {
  ConnectionAPI,
  ConnectionsAPI,
  DiagramBackgroundTaskAPI,
  DiagramCommandAPI,
  DiagramConditionAPI,
} from 'api/telegram_bots/main';
import {
  BackgroundTask,
  Command,
  Condition,
  DiagramBackgroundTask,
  DiagramCommand,
  DiagramCondition,
} from 'api/telegram_bots/types';

import cn from 'utils/cn';

import {
  parseDiagramBackgroundTaskNodes,
  parseDiagramCommandNodes,
  parseDiagramConditionNodes,
  parseEdges,
} from './utils';

import('@xyflow/react/dist/base.css');

type NodeType = 'command' | 'condition' | 'background_task';
type NodeID = [NodeType, string];
type Source = ['command' | 'condition' | 'background_task', string];
type Target = ['command' | 'condition', string];
type Handle = ['left' | 'right', string];
type SourceHandle = [...Source, ...Handle];
type TargetHandle = [...Target, ...Handle];

const nodeTypes: NodeTypes = {
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

function Constructor(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor);

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();
  const { diagramCommands, diagramConditions, diagramBackgroundTasks } =
    useTelegramBotMenuConstructorRouteLoaderData();

  const [nodes, setNodes, onNodesChange] = useNodesState([
    ...parseDiagramCommandNodes(diagramCommands),
    ...parseDiagramConditionNodes(diagramConditions),
    ...parseDiagramBackgroundTaskNodes(diagramBackgroundTasks),
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    parseEdges(diagramCommands, diagramConditions, diagramBackgroundTasks),
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
      const [
        sourceObjectType,
        sourceObjectId,
        sourceHandlePosition,
        sourceNestedObjectId,
      ] = edge.sourceHandle.split(':') as SourceHandle;
      const [
        targetObjectType,
        targetObjectId,
        targetHandlePosition,
        _targetNestedObjectId,
      ] = edge.targetHandle.split(':') as TargetHandle;

      const response = await ConnectionsAPI.create(telegramBot.id, {
        ...(sourceObjectType !== 'command'
          ? {
              source_object_type: sourceObjectType,
              source_object_id: parseInt(sourceObjectId),
            }
          : {
              source_object_type: 'command_keyboard_button',
              source_object_id: parseInt(sourceNestedObjectId),
            }),
        source_handle_position: sourceHandlePosition,
        target_object_type: targetObjectType,
        target_object_id: parseInt(targetObjectId),
        target_handle_position: targetHandlePosition,
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
          baseAddEdge(
            { ...edge, id: `reactflow__edge-${response.json.id}` },
            prevEdges,
          ),
        );
      }
    }
  }

  async function deleteEdge(
    edge: Edge,
    shouldUpdateEdges: boolean = true,
  ): Promise<void> {
    if (!edge.sourceHandle) return;

    const response = await ConnectionAPI.delete(
      telegramBot.id,
      parseInt(edge.id.split('-')[1]),
    );

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
      const [type, id] = node.id.split(':') as NodeID;

      await {
        command: DiagramCommandAPI,
        condition: DiagramConditionAPI,
        background_task: DiagramBackgroundTaskAPI,
      }[type].update(telegramBot.id, parseInt(id), node.position);
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
    if (
      !edge.source ||
      !edge.sourceHandle ||
      !edge.target ||
      !edge.targetHandle ||
      edge.source === edge.target
    ) {
      return false;
    }

    switch ((edge.source.split(':') as Source)[0]) {
      case 'command':
        return !edges.some((_edge) => _edge.sourceHandle === edge.sourceHandle);
      case 'background_task':
        return !edges.some((_edge) => _edge.source === edge.source);
      default:
        return true;
    }
  }

  function handleConnect(connection: Connection): void {
    addEdge(connection);
  }

  async function handleReconnect(
    oldEdge: Edge,
    newConnection: Connection,
  ): Promise<void> {
    await Promise.all([deleteEdge(oldEdge, false), addEdge(newConnection, false)]);
    setEdges((prevEdges) => reconnectEdge(oldEdge, newConnection, prevEdges));
  }

  async function getDiagramCommand(
    commandID: Command['id'],
  ): Promise<DiagramCommand | null> {
    const response = await DiagramCommandAPI.get(telegramBot.id, commandID);

    if (!response.ok) {
      createMessageToast({
        message: t('messages.getDiagramCommand.error'),
        level: 'error',
      });
      return null;
    }

    return response.json;
  }

  async function handleAddCommand(command: Command): Promise<void> {
    const diagramCommand: DiagramCommand | null = await getDiagramCommand(command.id);
    if (!diagramCommand) return;

    setNodes((prevNodes) => [
      ...prevNodes,
      ...parseDiagramCommandNodes([diagramCommand]),
    ]);
  }

  async function handleSaveCommand(command: Command): Promise<void> {
    const diagramCommand: DiagramCommand | null = await getDiagramCommand(command.id);
    if (!diagramCommand) return;
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === `command:${command.id}`
          ? parseDiagramCommandNodes([diagramCommand])[0]
          : node,
      ),
    );
  }

  async function getDiagramCondition(
    conditionID: Condition['id'],
  ): Promise<DiagramCondition | null> {
    const response = await DiagramConditionAPI.get(telegramBot.id, conditionID);

    if (!response.ok) {
      createMessageToast({
        message: t('messages.getDiagramCondition.error'),
        level: 'error',
      });
      return null;
    }

    return response.json;
  }

  async function handleAddCondition(condition: Condition): Promise<void> {
    const diagramCondition: DiagramCondition | null = await getDiagramCondition(
      condition.id,
    );
    if (!diagramCondition) return;
    setNodes((prevNodes) => [
      ...prevNodes,
      ...parseDiagramConditionNodes([diagramCondition]),
    ]);
  }

  async function handleSaveCondition(condition: Condition): Promise<void> {
    const diagramCondition: DiagramCondition | null = await getDiagramCondition(
      condition.id,
    );
    if (!diagramCondition) return;
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === `condition:${condition.id}`
          ? parseDiagramConditionNodes([diagramCondition])[0]
          : node,
      ),
    );
  }

  async function getDiagramBackgroundTask(
    conditionID: BackgroundTask['id'],
  ): Promise<DiagramBackgroundTask | null> {
    const response = await DiagramBackgroundTaskAPI.get(telegramBot.id, conditionID);

    if (!response.ok) {
      createMessageToast({
        message: t('messages.getDiagramBackgroundTask.error'),
        level: 'error',
      });
      return null;
    }

    return response.json;
  }

  async function handleAddBackgroundTask(condition: BackgroundTask): Promise<void> {
    const diagramBackgroundTask: DiagramBackgroundTask | null =
      await getDiagramBackgroundTask(condition.id);
    if (!diagramBackgroundTask) return;
    setNodes((prevNodes) => [
      ...prevNodes,
      ...parseDiagramBackgroundTaskNodes([diagramBackgroundTask]),
    ]);
  }

  async function handleSaveBackgroundTask(condition: BackgroundTask): Promise<void> {
    const diagramBackgroundTask: DiagramBackgroundTask | null =
      await getDiagramBackgroundTask(condition.id);
    if (!diagramBackgroundTask) return;
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === `background_task:${condition.id}`
          ? parseDiagramBackgroundTaskNodes([diagramBackgroundTask])[0]
          : node,
      ),
    );
  }

  return (
    <Page title={t('title')} className='flex-auto'>
      <CommandOffcanvas onAdd={handleAddCommand} onSave={handleSaveCommand} />
      <ConditionOffcanvas onAdd={handleAddCondition} onSave={handleSaveCondition} />
      <BackgroundTaskOffcanvas
        onAdd={handleAddBackgroundTask}
        onSave={handleSaveBackgroundTask}
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
          deleteKeyCode={null}
          style={reactFlowStyle}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={handleNodeDragStop}
          onNodesDelete={handleNodesDelete}
          isValidConnection={handleValidConnection}
          onConnect={handleConnect}
          onReconnect={handleReconnect}
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
