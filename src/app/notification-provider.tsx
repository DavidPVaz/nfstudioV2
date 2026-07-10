'use client';

import { useNotificationProvider } from '@/hooks/use-notification';
import {
    Notification,
    NotificationAction,
    NotificationClose,
    NotificationDescription,
    Provider,
    NotificationTitle,
    NotificationViewport,
    NotificationTimer
} from '@/components/atoms/notification';

export const NotificationProvider = () => {
    const { notifications } = useNotificationProvider();

    return (
        <Provider>
            {notifications.map(({
                id,
                title,
                description,
                action,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured to exclude from the DOM-bound spread. consumed later by the reducer via dispatch, not here
                cleanup,
                ...props
            }) => (
                <Notification key={id} {...props}>
                    <div className="grid w-full gap-1">
                        {title && <NotificationTitle>{title}</NotificationTitle>}
                        {description && (
                            <NotificationDescription>{description}</NotificationDescription>
                        )}
                        <NotificationTimer duration={props.duration} />
                    </div>
                    {action && (
                        <NotificationAction altText="Action" asChild>
                            {action}
                        </NotificationAction>
                    )}
                    <NotificationClose />
                </Notification>
            ))}
            <NotificationViewport />
        </Provider>
    );
};
