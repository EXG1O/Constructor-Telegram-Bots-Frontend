import React, { memo, ReactElement, ReactNode, useCallback } from 'react';
import { Node } from 'reactflow';

import ConditionOffcanvas from '../components/ConditionOffcanvas';
import { StoreProviderProps } from '../components/ConditionOffcanvas/providers/StoreProvider';

import useTelegramBotMenuRootRouteLoaderData from '../../Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { DiagramConditionAPI } from 'services/api/telegram_bots/main';

import { parseDiagramConditionNodes } from '../utils';

export interface ConditionOffcanvasProviderProps {
	setNodes: React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>;
	children: ReactNode;
}

function ConditionOffcanvasProvider({
	setNodes,
	children,
}: ConditionOffcanvasProviderProps): ReactElement<ConditionOffcanvasProviderProps> {
	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const handleAdd = useCallback<StoreProviderProps['onAdd']>(async (condition) => {
		const response = await DiagramConditionAPI.get(telegramBot.id, condition.id);

		if (response.ok) {
			setNodes((prevNodes) => [
				...prevNodes,
				...parseDiagramConditionNodes([response.json]),
			]);
		}
	}, []);
	const handleSave = useCallback<StoreProviderProps['onSave']>(async (condition) => {
		const response = await DiagramConditionAPI.get(telegramBot.id, condition.id);

		if (response.ok) {
			setNodes((prevNodes) =>
				prevNodes.map((node) =>
					node.id === `condition:${condition.id}`
						? parseDiagramConditionNodes([response.json])[0]
						: node,
				),
			);
		}
	}, []);

	return (
		<ConditionOffcanvas.StoreProvider onAdd={handleAdd} onSave={handleSave}>
			<ConditionOffcanvas />
			{children}
		</ConditionOffcanvas.StoreProvider>
	);
}

export default memo(ConditionOffcanvasProvider);
