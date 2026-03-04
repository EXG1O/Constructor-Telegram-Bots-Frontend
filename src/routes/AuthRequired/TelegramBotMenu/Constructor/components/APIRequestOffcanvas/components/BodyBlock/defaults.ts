import type { Body, BodyBlockFormValues } from './types';

export const defaultBody: Body = JSON.stringify({ key: 'value' }, undefined, 2);
export const defaultBodyBlockFormValues: BodyBlockFormValues = {
  body: defaultBody,
};
