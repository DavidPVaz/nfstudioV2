'use client';

import { useNotificationProvider } from '@/hooks/use-notification';
import {
    Notification,
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
            {notifications.map(({ id, title, description, action, ...props }) => (
                <Notification key={id} {...props}>
                    <div className="grid w-full gap-1">
                        {title && <NotificationTitle>{title}</NotificationTitle>}
                        {description && (
                            <NotificationDescription>{description}</NotificationDescription>
                        )}
                        <NotificationTimer duration={props.duration} />
                    </div>
                    {action}
                    <NotificationClose />
                </Notification>
            ))}
            <NotificationViewport />
        </Provider>
    );
};
