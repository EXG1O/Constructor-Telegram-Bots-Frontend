import React, { memo, ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { Stack } from 'react-bootstrap';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/Button';
import FormInputFeedback from 'components/FormInputFeedback';
import FormTelegramQuillEditorFeedback from 'components/FormTelegramQuillEditorFeedback';
import Modal from 'components/Modal';
import { createMessageToast } from 'components/ToastContainer';

import { VariableAPI, VariablesAPI } from 'services/api/telegram_bots/main';
import { Variable } from 'services/api/telegram_bots/types';

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

	const variableID = useVariableModalStore((state) => state.variableID);
	const type = useVariableModalStore((state) => state.type);
	const show = useVariableModalStore((state) => state.show);
	const loading = useVariableModalStore((state) => state.loading);
	const hideModal = useVariableModalStore((state) => state.hideModal);
	const setLoading = useVariableModalStore((state) => state.setLoading);

	const { setValues, setErrors } = useFormikContext<FormValues>();

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
		setValues(defaultFormValues);
		setErrors({});
	}

	return (
		<Modal show={show} loading={loading} onHide={hideModal} onExited={handleExited}>
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
	const setLoading = useVariableModalStore((state) => state.setLoading);

	async function handleSubmit(
		values: FormValues,
		actions: FormikHelpers<FormValues>,
	): Promise<void> {
		setLoading(true);

		const response = await (variableID
			? VariableAPI.update(telegramBot.id, variableID, values)
			: VariablesAPI.create(telegramBot.id, values));

		if (!response.ok) {
			actions.setErrors(
				response.json.errors.reduce<Record<string, string>>(
					(errors, { attr, detail }) => {
						if (attr) errors[attr] = detail;
						return errors;
					},
					{},
				),
			);
			createMessageToast({
				message: t(`messages.${type}Variable.error`),
				level: 'error',
			});
			setLoading(false);
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
