import { useCallback } from 'react';
import { type Node, useReactFlow, type XYPosition } from '@xyflow/react';
import type { FormikHelpers } from 'formik';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { makeRequest } from 'api/core';
import type { Block, CreateBlock, DiagramBlock } from 'api/telegram-bots/base/types';

import { convertDiagramBlockToNode, type NodeType } from '../utils/nodes';
import useReactFlowCentralPosition from './useReactFlowCentralPosition';

type FormikValues<T extends Record<string, any>> = Pick<CreateBlock, keyof XYPosition> &
  T;

export interface FormikSubmitOptions<
  BlockType extends Block,
  FormikValuesType extends Record<string, any>,
> {
  messages: {
    add: {
      success: string;
      error: string;
    };
    edit: {
      success: string;
      error: string;
    };
  };
  type: NodeType;
  action: keyof FormikSubmitOptions<BlockType, FormikValuesType>['messages'];
  saveAPICall: (
    values: FormikValues<FormikValuesType>,
    helpers: FormikHelpers<FormikValuesType>,
  ) => Promise<Awaited<ReturnType<typeof makeRequest<BlockType>>> | null>;
  diagramAPICall: (
    id: number,
    values: FormikValues<FormikValuesType>,
    helpers: FormikHelpers<FormikValuesType>,
  ) => ReturnType<typeof makeRequest<DiagramBlock>>;
  onHide: (
    id: number,
    values: FormikValues<FormikValuesType>,
    helpers: FormikHelpers<FormikValuesType>,
  ) => void;
}

function useFormikSubmit<
  BlockType extends Block,
  FormikValuesType extends Record<string, any>,
>(
  factory: () => FormikSubmitOptions<BlockType, FormikValuesType>,
  deps: React.DependencyList,
) {
  const reactFlow = useReactFlow();
  const getReactFlowCentralPosition = useReactFlowCentralPosition();

  return useCallback(
    async (
      values: FormikValuesType,
      helpers: FormikHelpers<FormikValuesType>,
    ): Promise<void> => {
      const { messages, type, action, saveAPICall, diagramAPICall, onHide } = factory();
      const { setFieldError } = helpers;

      const handleError = () => {
        createMessageToast({ message: messages[action].error, level: 'error' });
      };

      const position: XYPosition | null =
        action === 'add' ? getReactFlowCentralPosition() : null;
      const saveResponse = await saveAPICall(
        position ? { ...values, ...position } : values,
        helpers,
      );
      if (saveResponse === null) return;

      if (!saveResponse.ok) {
        for (const error of saveResponse.json.errors) {
          if (!error.attr) continue;
          setFieldError(error.attr, error.detail);
        }
        return handleError();
      }

      const { id } = saveResponse.json;

      const diagramResponse = await diagramAPICall(id, values, helpers);
      if (!diagramResponse.ok) return handleError();

      const newNode: Node = convertDiagramBlockToNode(type, diagramResponse.json);

      reactFlow.setNodes((prevNodes) => {
        const newNodes: Node[] = [...prevNodes];
        const existingNodeIndex = newNodes.findIndex((node) => node.id === newNode.id);

        if (existingNodeIndex !== -1) {
          newNodes[existingNodeIndex] = newNode;
        } else {
          newNodes.push(newNode);
        }

        return newNodes;
      });

      if (action === 'add') {
        reactFlow.fitView({
          maxZoom: Math.max(1, reactFlow.getZoom()),
          duration: 450,
          nodes: [newNode],
        });
      }

      onHide(id, values, helpers);
      createMessageToast({ message: messages[action].success, level: 'success' });
    },
    deps,
  );
}

export default useFormikSubmit;
