'use client';

import React from 'react';
import type { NotificationActionElement, NotificationProps } from '@/components/atoms/notification';

const NOTIFICATION_LIMIT = 2;
const NOTIFICATION_REMOVE_DELAY = 10000;

export type Notification = NotificationProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: NotificationActionElement;
};

export const ACTION_TYPES = {
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
} as const;

let count = 0;

type ActionType = typeof ACTION_TYPES;

type Action =
    | {
          type: ActionType['ADD_NOTIFICATION'];
          notification: Notification;
      }
    | {
          type: ActionType['UPDATE_NOTIFICATION'];
          notification: Partial<Notification>;
      }
    | {
          type: ActionType['DISMISS_NOTIFICATION'];
          notificationId?: Notification['id'];
      }
    | {
          type: ActionType['REMOVE_NOTIFICATION'];
          notificationId?: Notification['id'];
      };

export type State = {
    notifications: Notification[];
};

const notificationTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (notificationId: string) => {
    if (notificationTimeouts.has(notificationId)) {
        return;
    }

    const timeout = setTimeout(() => {
        notificationTimeouts.delete(notificationId);
        dispatch({
            type: ACTION_TYPES.REMOVE_NOTIFICATION,
            notificationId
        });
    }, NOTIFICATION_REMOVE_DELAY);

    notificationTimeouts.set(notificationId, timeout);
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ACTION_TYPES.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [action.notification, ...state.notifications].slice(
                    0,
                    NOTIFICATION_LIMIT
                )
            };

        case ACTION_TYPES.UPDATE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.map(t =>
                    t.id === action.notification.id ? { ...t, ...action.notification } : t
                )
            };

        case ACTION_TYPES.DISMISS_NOTIFICATION: {
            const { notificationId } = action;

            if (notificationId) {
                addToRemoveQueue(notificationId);
            } else {
                state.notifications.forEach(notification => {
                    addToRemoveQueue(notification.id);
                });
            }

            return {
                ...state,
                notifications: state.notifications.map(notification =>
                    notification.id === notificationId || notificationId === undefined
                        ? {
                              ...notification,
                              open: false
                          }
                        : notification
                )
            };
        }
        case ACTION_TYPES.REMOVE_NOTIFICATION:
            if (action.notificationId === undefined) {
                return {
                    ...state,
                    notifications: []
                };
            }

            return {
                ...state,
                notifications: state.notifications.filter(t => t.id !== action.notificationId)
            };
    }
};

const listeners: ((state: State) => void)[] = [];

export let memoryState: State = { notifications: [] };

export const dispatch = (action: Action) => {
    memoryState = reducer(memoryState, action);
    listeners.forEach(listener => {
        listener(memoryState);
    });
};

export const genId = () => (count = (count + 1) % Number.MAX_SAFE_INTEGER).toString();

export const addListener = (listener: React.Dispatch<React.SetStateAction<State>>) => {
    listeners.push(listener);

    return () => {
        const index = listeners.indexOf(listener);

        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};
