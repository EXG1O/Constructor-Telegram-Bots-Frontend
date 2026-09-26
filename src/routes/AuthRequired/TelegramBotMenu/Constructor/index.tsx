import React, {
  type ComponentType,
  type CSSProperties,
  type ReactElement,
  useCallback,
} from 'react';
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

import type { RouteID } from 'routes';
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
import RandomizerNode from './components/RandomizerNode';
import RandomizerOffcanvas from './components/RandomizerOffcanvas';
import TemporaryVariableNode from './components/TemporaryVariableNode';
import TemporaryVariableOffcanvas from './components/TemporaryVariableOffcanvas';
import TimerNode from './components/TimerNode';
import TimerOffcanvas from './components/TimerOffcanvas';
import TriggerNode from './components/TriggerNode';
import TriggerOffcanvas from './components/TriggerOffcanvas';

import useTelegramBotMenuConstructorRouteLoaderData from './hooks/useTelegramBotMenuConstructorRouteLoaderData';

import type { DiagramBlock, TelegramBot } from 'api';
import {
  ConnectionSourceObjectType,
  type DiagramMessage,
  type Options,
  TelegramBotsService,
} from 'api';
import type { RequestResult } from 'api/client/client';

import cn from 'utils/cn';

import { NodeType } from './enums';
import {
  convertDiagramBlocksToEdges,
  type EdgeSourceHandle,
  type EdgeTargetHandle,
  parseEdgeSourceHandle,
  parseEdgeTargetHandle,
} from './utils/edges';
import { convertDiagramBlockToNode, type NodeID } from './utils/nodes';
import { parseNodeID } from './utils/nodes';

import('@xyflow/react/dist/base.css');

export const nodeTypes: Record<NodeType, ComponentType<any>> = {
  [NodeType.Trigger]: TriggerNode,
  [NodeType.Message]: MessageNode,
  [NodeType.Condition]: ConditionNode,
  [NodeType.BackgroundTask]: BackgroundTaskNode,
  [NodeType.ApiRequest]: APIRequestNode,
  [NodeType.DatabaseOperation]: DatabaseOperationNode,
  [NodeType.Invoice]: InvoiceNode,
  [NodeType.TemporaryVariable]: TemporaryVariableNode,
  [NodeType.Randomizer]: RandomizerNode,
  [NodeType.Timer]: TimerNode,
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

const diagramBlockUpdateMap: Record<
  NodeType,
  (
    options: Options<
      {
        url: string;
        path: { telegramBotId: TelegramBot['id']; id: DiagramBlock['id'] };
        body: Pick<DiagramBlock, 'x' | 'y'>;
      },
      false
    >,
  ) => RequestResult<{ 200: DiagramBlock }, any, false>
> = {
  [NodeType.Trigger]: (options) => TelegramBotsService.updateDiagramTrigger(options),
  [NodeType.Message]: (options) => TelegramBotsService.updateDiagramMessage(options),
  [NodeType.Condition]: (options) =>
    TelegramBotsService.updateDiagramCondition(options),
  [NodeType.BackgroundTask]: (options) =>
    TelegramBotsService.updateDiagramBackgroundTask(options),
  [NodeType.ApiRequest]: (options) =>
    TelegramBotsService.updateDiagramApiRequest(options),
  [NodeType.DatabaseOperation]: (options) =>
    TelegramBotsService.updateDiagramDatabaseOperation(options),
  [NodeType.Invoice]: (options) => TelegramBotsService.updateDiagramInvoice(options),
  [NodeType.TemporaryVariable]: (options) =>
    TelegramBotsService.updateDiagramTemporaryVariable(options),
  [NodeType.Randomizer]: (options) =>
    TelegramBotsService.updateDiagramRandomizer(options),
  [NodeType.Timer]: (options) => TelegramBotsService.updateDiagramTimer(options),
};

function Constructor(): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
  );

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const diagramBlocks = useTelegramBotMenuConstructorRouteLoaderData();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    Object.entries(diagramBlocks).flatMap(([type, blocks]) =>
      blocks.map((block) => convertDiagramBlockToNode(type as NodeType, block)),
    ),
  );

  const { message: diagramMessages, ...otherDiagramBlocks } = diagramBlocks;
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    convertDiagramBlocksToEdges({
      messages: diagramMessages as DiagramMessage[],
      other: Object.values(otherDiagramBlocks).flat(),
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

      const { data, error } = await TelegramBotsService.createConnection({
        path: { telegramBotId: telegramBotID },
        body: {
          ...(sourceHandle.objectType === ConnectionSourceObjectType.Message &&
          sourceHandle.nestedObjectID
            ? {
                source_object_type: ConnectionSourceObjectType.MessageKeyboardButton,
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
        },
      });

      if (error || !data) {
        for (const item of error.errors) {
          if (item.attr) continue;
          createMessageToast({ message: item.detail, level: 'error' });
        }
        createMessageToast({
          message: t('messages.createConnection.error'),
          level: 'error',
        });
        return;
      }

      setEdges((prevEdges) =>
        RFAddEdge({ ...edge, id: data.id.toString() }, prevEdges),
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

      const { error } = await TelegramBotsService.deleteConnection({
        path: { telegramBotId: telegramBotID, id: Number(edge.id) },
      });

      if (error) {
        setEdges((prevEdges) =>
          prevEdges.map((prevEdge) =>
            prevEdge.id === edge.id ? { ...prevEdge, hidden: false } : prevEdge,
          ),
        );
        for (const item of error.errors) {
          if (item.attr) continue;
          createMessageToast({ message: item.detail, level: 'error' });
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
          return diagramBlockUpdateMap[nodeID.type]({
            path: {
              telegramBotId: telegramBotID,
              id: nodeID.id,
            },
            body: node.position,
          });
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
        <RandomizerOffcanvas />
        <TimerOffcanvas />
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
