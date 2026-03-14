type Handler<T extends any[]> = ((...args: T) => void) | undefined | null;

function composeHandlers<T extends any[] = []>(...handlers: Handler<T>[]) {
  return (...args: T) => {
    handlers.forEach((handler) => handler?.(...args));
  };
}

export default composeHandlers;
