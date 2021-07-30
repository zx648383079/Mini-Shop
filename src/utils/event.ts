interface IEventListenerObj {
    [event: string]: {
        once?: boolean;
        callback: Function;
    }[];
}

export class EventManager {

    private listeners: IEventListenerObj = {};

    public on(event: string, cb: (...items: any[]) => false|Promise<false|void>|void, once = false) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push({callback: cb, once});
    }

    public once(event: string, cb: (...items: any[]) => void) {
        this.on(event, cb, true);
    }

    public emit(event: string, ...params: any[]) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return;
        }
        const items = this.listeners[event];
        for (let i = items.length; i >= 0; i--) {
            const cb = items[i].callback;
            const res = cb(...params);
            if (items[i].once) {
                items.splice(i, 1);
                continue;
            }
            if (res === false) {
                items.splice(i, 1);
                continue;
            }
            if (res instanceof Promise) {
                res.then(o => {
                    if (o === false) {
                        items.splice(i, 1);
                    }
                });
            }
        }
    }

    public remove(event: string, cb: Function) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return;
        }
        const items = this.listeners[event];
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].callback === cb) {
                items.splice(i, 1);
            }
        }
    }

    public flush() {
        this.listeners = {};
    }
}