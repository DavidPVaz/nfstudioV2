'use client';

import { useMemo, useEffect } from 'react';
import { useNetworkState } from '@/hooks/use-network-state';
import { useNotification } from '@/hooks/use-notification';

export const NetworkStatus = () => {
    const { notify } = useNotification();
    const { isOnline, hasChangedStatus } = useNetworkState();

    const notification = useMemo(
        () =>
            isOnline
                ? {
                      title: 'You are back online!',
                      description: 'You can now use this application without limitations.'
                  }
                : {
                      title: 'You are currently offline.',
                      description:
                          "You can continue to use this application as usual but some interactions might not be available. We'll let you know once you come back online."
                  },
        [isOnline]
    );

    useEffect(() => {
        if (!hasChangedStatus) {
            return;
        }

        notify({ ...notification, duration: 10000, variant: 'offline' });
    }, [isOnline, hasChangedStatus, notify, notification]);

    return null;
};
