import { Connection } from '../connection/types';
import { DiagramBlock } from '../diagram/types';

export interface MessageSettings {
  reply_to_user_message: boolean;
  delete_user_message: boolean;
  send_as_new_message: boolean;
}

export interface MessageMedia {
  id: number;
  position: number;
  name: string | null;
  size: number | null;
  url: string | null;
  from_url: string | null;
}

export interface MessageImage extends MessageMedia {}
export interface MessageDocument extends MessageMedia {}

export interface MessageKeyboardButton {
  id: number;
  row: number;
  position: number;
  text: string;
  url: string | null;
}

export interface MessageKeyboard {
  type: 'default' | 'inline' | 'payment';
  buttons: MessageKeyboardButton[];
}

export interface Message {
  id: number;
  name: string;
  text: string | null;
  settings: MessageSettings;
  images: MessageImage[];
  documents: MessageDocument[];
  keyboard: MessageKeyboard | null;
}

export interface DiagramMessageKeyboardButton extends MessageKeyboardButton {
  source_connections: Connection[];
}

export interface DiagramMessageKeyboard extends Pick<MessageKeyboard, 'type'> {
  buttons: DiagramMessageKeyboardButton[];
}

export interface DiagramMessage
  extends Pick<Message, 'id' | 'name' | 'text'>,
    DiagramBlock {
  keyboard: DiagramMessageKeyboard | null;
}

export namespace Data {
  export namespace MessagesAPI {
    export interface CreateMessageMedia
      extends Omit<MessageMedia, 'id' | 'name' | 'size' | 'url'> {
      file: File | null;
    }

    export type CreateMessageKeyboardButton = Omit<MessageKeyboardButton, 'id'>;

    export interface CreateMessageKeyboard extends Omit<MessageKeyboard, 'buttons'> {
      buttons: CreateMessageKeyboardButton[];
    }

    export interface Create
      extends Omit<Message, 'id' | 'images' | 'documents' | 'keyboard'> {
      images: CreateMessageMedia[] | null;
      documents: CreateMessageMedia[] | null;
      keyboard: CreateMessageKeyboard | null;
    }
  }

  export namespace MessageAPI {
    export interface UpdateMessageMedia extends MessagesAPI.CreateMessageMedia {
      id?: MessageMedia['id'];
    }

    export interface UpdateMessageKeyboardButton
      extends MessagesAPI.CreateMessageKeyboardButton {
      id?: MessageKeyboardButton['id'];
    }

    export interface UpdateMessageKeyboard extends Omit<MessageKeyboard, 'buttons'> {
      buttons: UpdateMessageKeyboardButton[];
    }

    export interface Update
      extends Omit<Message, 'id' | 'images' | 'documents' | 'keyboard'> {
      images: UpdateMessageMedia[] | null;
      documents: UpdateMessageMedia[] | null;
      keyboard: UpdateMessageKeyboard | null;
    }

    export interface PartialUpdateMessageKeyboard
      extends Partial<Omit<UpdateMessageKeyboard, 'buttons'>> {
      buttons?: Partial<UpdateMessageKeyboard['buttons']>;
    }

    export interface PartialUpdate extends Partial<Pick<Update, 'name' | 'text'>> {
      settings?: Partial<Update['settings']>;
      images?: Partial<UpdateMessageMedia>[] | null;
      documents?: Partial<UpdateMessageMedia>[] | null;
      keyboard?: PartialUpdateMessageKeyboard;
    }
  }

  export namespace DiagramMessageAPI {
    export type Update = Pick<DiagramMessage, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace MessagesAPI {
    export type Get = Message[];
    export type Create = MessageAPI.Get;
  }

  export namespace MessageAPI {
    export type Get = Message;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramMessagesAPI {
    export type Get = DiagramMessage[];
  }

  export namespace DiagramMessageAPI {
    export type Get = DiagramMessage;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
