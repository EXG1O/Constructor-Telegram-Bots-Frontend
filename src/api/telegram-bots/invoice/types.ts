import { DiagramBlock, Media } from '../base/types';

export interface InvoiceImage extends Media {}

export interface InvoicePrice {
  id: number;
  label: string;
  amount: number;
}

export interface Invoice {
  id: number;
  name: string;
  title: string;
  description: string;
  image: InvoiceImage | null;
  prices: InvoicePrice[];
}

export interface DiagramInvoice extends DiagramBlock<Invoice['id']> {}

export namespace Data {
  export namespace InvoicesAPI {
    export interface CreateImage extends Omit<InvoiceImage, 'name' | 'size' | 'url'> {
      file: File | null;
    }

    export type CreateInvoicePrice = Omit<InvoicePrice, 'id'>;

    export interface Create extends Omit<Invoice, 'id' | 'image' | 'prices'> {
      image: CreateImage | null;
      prices: CreateInvoicePrice[] | null;
    }
  }

  export namespace InvoiceAPI {
    export type Update = InvoicesAPI.Create;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DiagramInvoiceAPI {
    export type Update = Pick<DiagramInvoice, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace InvoicesAPI {
    export type Get = Invoice[];
    export type Create = InvoiceAPI.Get;
  }

  export namespace InvoiceAPI {
    export type Get = Invoice;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramInvoicesAPI {
    export type Get = DiagramInvoice[];
  }

  export namespace DiagramInvoiceAPI {
    export type Get = DiagramInvoice;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
