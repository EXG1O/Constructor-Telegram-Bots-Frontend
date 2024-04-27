import React, { ReactElement, memo } from 'react';

import { Panel as BasePanel } from 'reactflow';

import AddCommandButton from './components/AddCommandButton';

function Panel(): ReactElement {
	return (
		<BasePanel position='top-right'>
			<div className='vstack bg-light border rounded-1 gap-1 p-1'>
				<AddCommandButton size='sm' />
			</div>
		</BasePanel>
	);
}

export default memo(Panel);