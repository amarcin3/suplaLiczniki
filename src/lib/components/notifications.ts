import { writable, derived, type Writable } from 'svelte/store';

type NotificationType = 'wait' | 'error' | 'success' | 'info';

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    timeout: number | null;
}

function createNotificationStore() {
    const _notifications: Writable<Notification[]> = writable<Notification[]>([]);

    function send(message: string, type: NotificationType, timeout: number | null): string {
        const id = createId();
        _notifications.update((state) => {
            return [...state, { id: id, type, message, timeout }];
        });
        return id;
    }

    function remove(id: string): void {
        _notifications.update((state) => {
            return state.filter((n) => n.id !== id);
        });
    }

    function updateType(id: string, type: NotificationType) {
        _notifications.update((state) => {
            return state.map((n) => {
                if (n.id === id) {
                    n.type = type;
                }
                return n;
            });
        });
    }

    function updateMessage(id: string, message: string) {
        _notifications.update((state) => {
            return state.map((n) => {
                if (n.id === id) {
                    n.message = message;
                }
                return n;
            });
        });
    }

    function updateTimeout(id: string, timeout: number | null) {
        _notifications.update((state) => {
            timersSetForIds = timersSetForIds.filter((nid) => nid !== id);
            return state.map((n) => {
                if (n.id === id) {
                    n.timeout = timeout;
                }
                return n;
            });
        });
    }

    let timersSetForIds: string[] = [];

    const notifications = derived(_notifications, ($_notifications, set) => {
        set($_notifications);

        // foreach notification
        $_notifications.forEach((notification) => {
            if (!notification.timeout) {
                // No timeout set, do nothing
                return;
            }

            // Has timeout set, check if timer is set
            if (timersSetForIds.includes(notification.id)) {
                // Timer is set, do nothing
                return;
            }

            // Timer is not set, set it
            setTimeout(() => {
                _notifications.update((state) => {
                    state = state.filter((n) => n.id !== notification.id);
                    timersSetForIds = timersSetForIds.filter((id) => id !== notification.id);
                    return state;
                });
            }, notification.timeout);
            timersSetForIds.push(notification.id);
        });
    });
    const { subscribe } = notifications;

    return {
        subscribe,
        wait: (msg: string, timeout: number | null) => send(msg, 'wait', timeout),
        error: (msg: string, timeout: number | null) => send(msg, 'error', timeout),
        success: (msg: string, timeout: number | null) => send(msg, 'success', timeout),
        info: (msg: string, timeout: number | null) => send(msg, 'info', timeout),
        updateType: (id: string, type: NotificationType) => updateType(id, type),
        updateMessage: (id: string, message: string) => updateMessage(id, message),
        updateTimeout: (id: string, timeout: number | null) => updateTimeout(id, timeout),
        remove: (id: string) => remove(id)
    };
}

function createId() {
    return '_' + Math.random().toString(36).substring(2, 9);
}

export const notifications = createNotificationStore();