import React, { memo, ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/Button';
import FormInputFeedback from 'components/FormInputFeedback';
import FormTelegramQuillEditorFeedback from 'components/FormTelegramQuillEditorFeedback';
import Modal from 'components/Modal';
import Stack from 'components/Stack';
import { createMessageToast } from 'components/ToastContainer';

import { VariableAPI, VariablesAPI } from 'api/telegram_bots/main';
import { Variable } from 'api/telegram_bots/types';

import { useVariableModalStore } from './store';

export interface FormValues {
	name: string;
	value: string;
	description: string;
}

export const defaultFormValues: FormValues = { name: '', value: '', description: '' };

function InnerVariableModal(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
		keyPrefix: 'user.variableModal',
	});

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

	const variableID = useVariableModalStore((state) => state.variableID);
	const type = useVariableModalStore((state) => state.type);
	const show = useVariableModalStore((state) => state.show);
	const loading = useVariableModalStore((state) => state.loading);
	const hideModal = useVariableModalStore((state) => state.hideModal);
	const setLoading = useVariableModalStore((state) => state.setLoading);

	useEffect(() => {
		if (variableID) {
			(async () => {
				const response = await VariableAPI.get(telegramBot.id, variableID);

				if (!response.ok) {
					hideModal();
					createMessageToast({
						message: t('messages.getVariable.error'),
						level: 'error',
					});
					return;
				}

				const { id, ...variable } = response.json;

				setValues(variable);
				setLoading(false);
			})();
		}
	}, [variableID]);

	function handleExited(): void {
		resetForm();
	}

	return (
		<Modal
			show={show}
			loading={isSubmitting || loading}
			onHide={hideModal}
			onExited={handleExited}
		>
			<Form>
				<Modal.Header closeButton>
					<Modal.Title>{t('title', { context: type })}</Modal.Title>
				</Modal.Header>
				<Modal.Body as={Stack} gap={2}>
					<FormInputFeedback
						name='name'
						placeholder={t('nameInput.placeholder')}
					/>
					<FormTelegramQuillEditorFeedback
						height={220}
						name='value'
						placeholder={t('valueInput.placeholder')}
					/>
					<FormInputFeedback
						name='description'
						placeholder={t('descriptionInput.placeholder')}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='success' type='submit'>
						{t('actionButton', { context: type })}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export interface VariableModalProps {
	onAdd?: (variable: Variable) => void;
	onSave?: (variable: Variable) => void;
}

function VariableModal({
	onAdd,
	onSave,
}: VariableModalProps): ReactElement<VariableModalProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
		keyPrefix: 'user.variableModal',
	});

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const variableID = useVariableModalStore((state) => state.variableID);
	const type = useVariableModalStore((state) => state.type);
	const hideModal = useVariableModalStore((state) => state.hideModal);

	async function handleSubmit(
		values: FormValues,
		{ setFieldError }: FormikHelpers<FormValues>,
	): Promise<void> {
		const response = await (variableID
			? VariableAPI.update(telegramBot.id, variableID, values)
			: VariablesAPI.create(telegramBot.id, values));

		if (!response.ok) {
			for (const error of response.json.errors) {
				if (!error.attr) continue;
				setFieldError(error.attr, error.detail);
			}
			createMessageToast({
				message: t(`messages.${type}Variable.error`),
				level: 'error',
			});
			return;
		}

		(variableID ? onSave : onAdd)?.(response.json);
		hideModal();
		createMessageToast({
			message: t(`messages.${type}Variable.success`),
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
			<InnerVariableModal />
		</Formik>
	);
}

export default memo(VariableModal);
