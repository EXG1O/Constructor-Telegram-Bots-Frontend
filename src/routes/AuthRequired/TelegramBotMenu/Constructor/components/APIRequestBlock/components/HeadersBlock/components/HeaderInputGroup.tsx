import React, { CSSProperties, memo, ReactElement } from 'react';

import Button from 'react-bootstrap/Button';
import Input from 'react-bootstrap/FormControl';
import InputGroup, { InputGroupProps } from 'react-bootstrap/InputGroup';

import useAPIRequestBlockStore from '../../../hooks/useAPIRequestBlockStore';

export interface HeaderDetailProps extends Omit<InputGroupProps, 'children'> {
	index: number;
}

const deleteButtonStyle: CSSProperties = {
	width: '31px',
	height: '31px',
	fontSize: '18px',
};

function HeaderDetail({
	index,
	...props
}: HeaderDetailProps): ReactElement<HeaderDetailProps> {
	const header = useAPIRequestBlockStore((state) => state.apiRequest.headers[index]);
	const updateAPIRequest = useAPIRequestBlockStore((state) => state.updateAPIRequest);

	return (
		<InputGroup {...props}>
			<Input
				size='sm'
				value={header.key}
				placeholder={gettext('Ключ')}
				onChange={(e) =>
					updateAPIRequest((apiRequest) => {
						apiRequest.headers[index].key = e.target.value;
					})
				}
			/>
			<Input
				size='sm'
				value={header.value}
				placeholder={gettext('Значение')}
				onChange={(e) =>
					updateAPIRequest((apiRequest) => {
						apiRequest.headers[index].value = e.target.value;
					})
				}
			/>
			<Button
				as='i'
				size='sm'
				variant='danger'
				className='d-flex justify-content-center align-items-center bi bi-trash p-0'
				style={deleteButtonStyle}
				onClick={() =>
					updateAPIRequest((apiRequest) => {
						apiRequest.headers.splice(index, 1);
					})
				}
			/>
		</InputGroup>
	);
}

export default memo(HeaderDetail);
