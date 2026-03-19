type Handler<T> = (event: T) => void

class EventEmitter {
    private handlers: Map<string, Handler<unknown>[]> = new Map()

    subscribe<T>(eventType: string, handler: Handler<T>) {
        const existing = this.handlers.get(eventType) ?? []
        this.handlers.set(eventType, [...existing, handler as Handler<unknown>])
    }

    unsubscribe<T>(eventType: string, handler: Handler<T>) {
        const existing = this.handlers.get(eventType) ?? []
        this.handlers.set(eventType, existing.filter(h => h !== (handler as Handler<unknown>)))
    }

    emit<T>(eventType: string, payload: T) {
        const existing = this.handlers.get(eventType) ?? []
        existing.forEach(h => h(payload))
    }
}

export const eventEmitter = new EventEmitter()
