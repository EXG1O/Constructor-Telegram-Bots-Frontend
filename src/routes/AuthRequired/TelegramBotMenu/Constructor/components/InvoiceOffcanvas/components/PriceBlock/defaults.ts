import type { Price, PriceBlockFormValues } from './types';

export const defaultPrice: Price = { label: '', amount: '' };
export const defaultPriceBlockFormValues: PriceBlockFormValues = {
  price: defaultPrice,
};
