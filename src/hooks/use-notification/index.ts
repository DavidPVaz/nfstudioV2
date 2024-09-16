'use client';

import { useState, useEffect } from 'react';
import { NOTIFICATION_TEMPLATE, type NotificationTemplate } from '@/shared/enums';
import {
    genId,
    dispatch,
    ACTION_TYPES,
    memoryState,
    addListener,
    type State,
    type Notification
} from './provider-state';

const templateConfigMap: Record<NotificationTemplate, Omit<Notification, 'id'>> = {
    [NOTIFICATION_TEMPLATE.PAYMENT_CANCEL]: {
        description: 'You have cancelled your payment.',
        duration: 3000
    },
    [NOTIFICATION_TEMPLATE.PAYMENT_ERROR]: {
        description: 'There was an error processing your payment.',
        duration: 3000
    },
    [NOTIFICATION_TEMPLATE.PAYMENT_SUCCESS]: {
        description: 'Your payment was successful.',
        duration: 3000
    },
    [NOTIFICATION_TEMPLATE.CREATION_ERROR]: {
        description:
            'An unexpected error occurred while creating your image. You will be automatically refunded.',
        duration: 3000
    },
    [NOTIFICATION_TEMPLATE.CREATION_SUCCESS]: {
        description:
            "Download will start in 3 seconds. If it doesn't, please click the Download button.",
        duration: 3000
    },
    [NOTIFICATION_TEMPLATE.DOWNLOAD_FIRST]: {
        description: 'Make sure you download your image before you close.',
        duration: 3000
    },
    [NOTIFICATION_TEMPLATE.FETCH_ERROR]: {
        description: 'There was an error processing your request. Please try again.',
        duration: 3000
    },
    [NOTIFICATION_TEMPLATE.INVALID_NFT_IDS]: {
        description: 'No NFTs were found in this collection with the provided IDs.',
        duration: 3000
    }
};

const buildNotification = (
    template?: NotificationTemplate,
    customNotification?: Omit<Notification, 'id'>
): Omit<Notification, 'id'> => ({
    ...(template ? templateConfigMap[template] : {}),
    ...(customNotification ?? {})
});

export const useNotification = () => ({
    notify: ({
        template,
        customNotification
    }: {
        template?: NotificationTemplate;
        customNotification?: Omit<Notification, 'id'>;
    }) => {
        const notification = buildNotification(template, customNotification);
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
    }
});

export const useNotificationProvider = () => {
    const [state, setState] = useState<State>(memoryState);

    useEffect(() => addListener(setState), [setState]);

    return {
        ...state,
        dismiss: (notificationId?: string) =>
            dispatch({ type: ACTION_TYPES.DISMISS_NOTIFICATION, notificationId })
    };
};
