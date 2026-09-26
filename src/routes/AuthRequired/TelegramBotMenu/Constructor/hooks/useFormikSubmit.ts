import { useCallback } from 'react';
import { type Node, useReactFlow, type XYPosition } from '@xyflow/react';
import type { FormikHelpers } from 'formik';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { Block, BlockRequestWritable, DiagramBlock } from 'api';
import type { RequestResult } from 'api/client/client';

import type { NodeType } from '../enums';
import { convertDiagramBlockToNode } from '../utils/nodes';
import useReactFlowCentralPosition from './useReactFlowCentralPosition';

type FormikValues<T extends Record<string, any>> = Pick<
  BlockRequestWritable,
  keyof XYPosition
> &
  T;

export interface FormikSubmitOptions<
  TBlock extends Block,
  TFormikValues extends Record<string, any>,
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
  action: keyof FormikSubmitOptions<TBlock, TFormikValues>['messages'];
  saveAPICall: (
    values: FormikValues<TFormikValues>,
    helpers: FormikHelpers<TFormikValues>,
  ) => Promise<Awaited<RequestResult<{ 200: TBlock; 201: TBlock }, any, false>> | null>;
  diagramAPICall: (
    id: number,
    values: FormikValues<TFormikValues>,
    helpers: FormikHelpers<TFormikValues>,
  ) => RequestResult<{ 200: DiagramBlock }, any, false>;
  normalizeFieldName?: (fieldName: string) => string;
  onHide: (
    id: number,
    values: FormikValues<TFormikValues>,
    helpers: FormikHelpers<TFormikValues>,
  ) => void;
}

function useFormikSubmit<
  TBlock extends Block,
  TFormikValues extends Record<string, any>,
>(
  factory: () => FormikSubmitOptions<TBlock, TFormikValues>,
  deps: React.DependencyList,
) {
  const reactFlow = useReactFlow();
  const getReactFlowCentralPosition = useReactFlowCentralPosition();

  return useCallback(
    async (
      values: TFormikValues,
      helpers: FormikHelpers<TFormikValues>,
    ): Promise<void> => {
      const {
        messages,
        type,
        action,
        saveAPICall,
        diagramAPICall,
        normalizeFieldName,
        onHide,
      } = factory();
      const { setFieldError } = helpers;

      const handleError = () => {
        createMessageToast({ message: messages[action].error, level: 'error' });
      };

      const position: XYPosition | null =
        action === 'add' ? getReactFlowCentralPosition() : null;
      const saveResult = await saveAPICall(
        position ? { ...values, ...position } : values,
        helpers,
      );
      if (saveResult === null) return;

      if (saveResult.error || !saveResult.data) {
        for (const item of saveResult.error) {
          if (!item.attr) continue;
          setFieldError(normalizeFieldName?.(item.attr) ?? item.attr, item.detail);
        }
        return handleError();
      }

      const { id } = saveResult.data;

      const diagramResult = await diagramAPICall(id, values, helpers);
      if (diagramResult.error || !diagramResult.data) return handleError();

      const newNode: Node = convertDiagramBlockToNode(type, diagramResult.data);

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
