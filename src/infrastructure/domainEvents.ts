import { DomainEvent } from "../domain/events"
import { eventEmitter } from "./eventEmitter"

type EventType = DomainEvent["type"]
type EventPayload<T extends EventType> = Extract<DomainEvent, { type: T }>["payload"]

export const domainEvents = {
    subscribe<T extends EventType>(eventType: T, handler: (event: EventPayload<T>) => void) {
        eventEmitter.subscribe<EventPayload<T>>(eventType, handler)
    },
    unsubscribe<T extends EventType>(eventType: T, handler: (event: EventPayload<T>) => void) {
        eventEmitter.unsubscribe<EventPayload<T>>(eventType, handler)
    },
    emit<T extends EventType>(eventType: T, payload: EventPayload<T>) {
        eventEmitter.emit<EventPayload<T>>(eventType, payload)
    }
}
