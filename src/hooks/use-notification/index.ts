'use client';

import { useState, useEffect } from 'react';
import {
    genId,
    dispatch,
    ACTION_TYPES,
    memoryState,
    addListener,
    type State,
    type Notification
} from '@/hooks/use-notification/provider-state';

/**
 * Allows to hook into and add a notification to Notification Provider.
 */
export const useNotification = () => ({
    notify: (notification: Omit<Notification, 'id'>) =>
        setTimeout(() => {
            const id = genId();

            const update = (props: Notification) =>
                dispatch({
                    type: ACTION_TYPES.UPDATE_NOTIFICATION,
                    notification: { ...props, id }
                });
            const dismiss = () =>
                dispatch({ type: ACTION_TYPES.DISMISS_NOTIFICATION, notificationId: id });

            dispatch({
                type: ACTION_TYPES.ADD_NOTIFICATION,
                notification: {
                    ...notification,
                    id,
                    open: true,
                    onOpenChange: open => {
                        if (!open) {
                            dismiss();
                        }
                    }
                }
            });

            return {
                id,
                dismiss,
                update
            };
        })
});

/**
 * Creates the state store to be used in Notification Provider.
 */
export const useNotificationProvider = () => {
    const [state, setState] = useState<State>(memoryState);

    useEffect(() => addListener(setState), [setState]);

    return {
        ...state,
        dismiss: (notificationId?: string) =>
            dispatch({ type: ACTION_TYPES.DISMISS_NOTIFICATION, notificationId })
    };
};
