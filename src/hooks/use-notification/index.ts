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
} from './provider-state';

// TODO: add useNotification hook that encapsulates template logic for notifications that uses 'notify'
export const notify = ({ ...props }: Omit<Notification, 'id'>) => {
    const id = genId();

    const update = (props: Notification) =>
        dispatch({
            type: ACTION_TYPES.UPDATE_NOTIFICATION,
            notification: { ...props, id }
        });
    const dismiss = () => dispatch({ type: ACTION_TYPES.DISMISS_NOTIFICATION, notificationId: id });

    dispatch({
        type: ACTION_TYPES.ADD_NOTIFICATION,
        notification: {
            ...props,
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
};

export const useNotificationProvider = () => {
    const [state, setState] = useState<State>(memoryState);

    useEffect(() => addListener(setState), [setState]);

    return {
        ...state,
        dismiss: (notificationId?: string) =>
            dispatch({ type: ACTION_TYPES.DISMISS_NOTIFICATION, notificationId })
    };
};
