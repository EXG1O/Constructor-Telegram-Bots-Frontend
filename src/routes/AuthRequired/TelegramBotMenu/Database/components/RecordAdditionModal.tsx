import React, { ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers } from 'formik';
import monaco from 'monaco-editor';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/Button';
import FormMonacoEditorFeedback from 'components/FormMonacoEditorFeedback';
import Modal, { ModalProps } from 'components/Modal';
import { createMessageToast } from 'components/ToastContainer';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

import { DatabaseRecordsAPI } from 'services/api/telegram_bots/main';

interface FormValues {
	data: string;
}

export interface TelegramBotAdditionModalProps
	extends Omit<ModalProps, 'loading' | 'children' | 'onExited'> {
	show: NonNullable<ModalProps['show']>;
	onHide: NonNullable<ModalProps['onHide']>;
}

const defaultFormValues: FormValues = {
	data: JSON.stringify({ key: 'value' }, undefined, 4),
};

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
	glyphMargin: false,
	folding: false,
	lineNumbers: 'off',
	lineDecorationsWidth: 0,
	lineNumbersMinChars: 0,
};

function RecordAdditionModal({
	onHide,
	...props
}: TelegramBotAdditionModalProps): ReactElement<TelegramBotAdditionModalProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
		keyPrefix: 'records.recordAdditionModal',
	});

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

	async function handleSubmit(
		values: FormValues,
		{ setErrors, setFieldError }: FormikHelpers<FormValues>,
	): Promise<void> {
		let data: Record<string, any>;

		try {
			data = JSON.parse(values.data);
		} catch (error) {
			if (error instanceof SyntaxError) {
				setFieldError(
					'data',
					t('messages.addRecord.error', { context: 'validJSON' }),
				);
			}

			createMessageToast({
				message: t('messages.addRecord.error'),
				level: 'error',
			});
			return;
		}

		const response = await DatabaseRecordsAPI.create(telegramBot.id, { data });

		if (!response.ok) {
			setErrors(
				response.json.errors.reduce<Record<string, string>>(
					(errors, { attr, detail }) => {
						if (attr) errors[attr] = detail;
						return errors;
					},
					{},
				),
			);
			createMessageToast({
				message: t('messages.addRecord.error'),
				level: 'error',
			});
			return;
		}

		updateRecords();
		onHide();
		createMessageToast({
			message: t('messages.addRecord.success'),
			level: 'success',
		});
	}

	return (
		<Formik
			initialValues={defaultFormValues}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={handleSubmit}
		>
			{({ isSubmitting, resetForm }) => (
				<Modal
					{...props}
					loading={isSubmitting}
					onHide={onHide}
					onExited={useCallback(() => resetForm(), [])}
				>
					<Form>
						<Modal.Header closeButton>
							<Modal.Title>{t('title')}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<FormMonacoEditorFeedback
								language='json'
								name='data'
								options={monacoOptions}
							/>
						</Modal.Body>
						<Modal.Footer>
							<Button variant='success' type='submit'>
								{t('addButton')}
							</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			)}
		</Formik>
	);
}

export default RecordAdditionModal;
