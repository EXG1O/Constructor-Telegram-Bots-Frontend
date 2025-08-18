import { Connection } from '../connection/types';
import { DiagramBlock } from '../diagram/types';

export interface CommandSettings {
  reply_to_user_message: boolean;
  delete_user_message: boolean;
  send_as_new_message: boolean;
}

export interface CommandMedia {
  id: number;
  position: number;
  name: string | null;
  size: number | null;
  url: string | null;
  from_url: string | null;
}

export interface CommandImage extends CommandMedia {}
export interface CommandDocument extends CommandMedia {}

export interface CommandMessage {
  text: string;
}

export interface CommandKeyboardButton {
  id: number;
  row: number;
  position: number;
  text: string;
  url: string | null;
}

export interface CommandKeyboard {
  type: 'default' | 'inline' | 'payment';
  buttons: CommandKeyboardButton[];
}

export interface Command {
  id: number;
  name: string;
  settings: CommandSettings;
  images: CommandImage[];
  documents: CommandDocument[];
  message: CommandMessage;
  keyboard: CommandKeyboard | null;
}

export interface DiagramCommandKeyboardButton extends CommandKeyboardButton {
  source_connections: Connection[];
}

export interface DiagramCommandKeyboard extends Pick<CommandKeyboard, 'type'> {
  buttons: DiagramCommandKeyboardButton[];
}

export interface DiagramCommand
  extends Pick<Command, 'id' | 'name' | 'message'>,
    Omit<DiagramBlock, 'source_connections'> {
  keyboard: DiagramCommandKeyboard | null;
}

export namespace Data {
  export namespace CommandsAPI {
    export interface CreateCommandMedia
      extends Omit<CommandMedia, 'id' | 'name' | 'size' | 'url'> {
      file: File | null;
    }

    export type CreateCommandKeyboardButton = Omit<CommandKeyboardButton, 'id'>;

    export interface CreateCommandKeyboard extends Omit<CommandKeyboard, 'buttons'> {
      buttons: CreateCommandKeyboardButton[];
    }

    export interface Create
      extends Omit<Command, 'id' | 'images' | 'documents' | 'keyboard'> {
      images: CreateCommandMedia[] | null;
      documents: CreateCommandMedia[] | null;
      keyboard: CreateCommandKeyboard | null;
    }
  }

  export namespace CommandAPI {
    export interface UpdateCommandMedia extends CommandsAPI.CreateCommandMedia {
      id?: CommandMedia['id'];
    }

    export interface UpdateCommandKeyboardButton
      extends CommandsAPI.CreateCommandKeyboardButton {
      id?: CommandKeyboardButton['id'];
    }

    export interface UpdateCommandKeyboard extends Omit<CommandKeyboard, 'buttons'> {
      buttons: UpdateCommandKeyboardButton[];
    }

    export interface Update
      extends Omit<Command, 'id' | 'images' | 'documents' | 'keyboard'> {
      images: UpdateCommandMedia[] | null;
      documents: UpdateCommandMedia[] | null;
      keyboard: UpdateCommandKeyboard | null;
    }

    export interface PartialUpdateCommandKeyboard
      extends Partial<Omit<UpdateCommandKeyboard, 'buttons'>> {
      buttons?: Partial<UpdateCommandKeyboard['buttons']>;
    }

    export interface PartialUpdate extends Partial<Pick<Update, 'name'>> {
      settings?: Partial<Update['settings']>;
      images?: Partial<UpdateCommandMedia>[] | null;
      documents?: Partial<UpdateCommandMedia>[] | null;
      message?: Partial<Update['message']>;
      keyboard?: PartialUpdateCommandKeyboard;
    }
  }

  export namespace DiagramCommandAPI {
    export type Update = Pick<DiagramCommand, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace CommandsAPI {
    export type Get = Command[];
    export type Create = CommandAPI.Get;
  }

  export namespace CommandAPI {
    export type Get = Command;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramCommandsAPI {
    export type Get = DiagramCommand[];
  }

  export namespace DiagramCommandAPI {
    export type Get = DiagramCommand;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
