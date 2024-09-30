import React, { useCallback, useMemo } from 'react';
import { PLATFORMS } from '@/enums';
import { HelioCheckout } from '@heliofi/checkout-react';
import { useCollectionContext } from '@/app/collections/[collection]/context';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { getPlatformOptionConfig } from '@/lib/utils';

export const OrderContent = () => {
    const { selectedCollection, paylinkId } = useCollectionContext();
    const {
        //updateData,
        data: { platform, option, atRight, coverStyle, logo, selectedNFT }
    } = useWizardContext();

    const onCancel = useCallback(() => {
        //closeCheckout();
        //notify({ template: NOTIFICATION_TEMPLATE.CANCEL_PAYMENT });
    }, []);

    const onError = useCallback(() => {
        //closeCheckout();
        //notify({ template: NOTIFICATION_TEMPLATE.ERROR_PAYMENT });
    }, []);

    const data = useMemo(
        () => ({
            ...getPlatformOptionConfig({ platform: platform!, option: option! }),
            src: encodeURI(selectedNFT.src),
            atRight,
            coverStyle,
            logoSrc: coverStyle || !logo ? undefined : encodeURI(logo),
            mobile: platform === PLATFORMS.MOBILE,
            collection: selectedCollection.toLowerCase()
        }),
        [platform, option, selectedNFT, atRight, coverStyle, logo, selectedCollection]
    );

    const onSuccess = useCallback(
        ({
            data: { statusToken, transactionSignature }
        }: {
            data: { statusToken: string; transactionSignature: string };
        }) => {
            //const onConversionSuccess = (/*buffer*/) => {
            /*
                updateData({
                    downloadRef: window.URL.createObjectURL(
                        new Blob([buffer], { type: 'image/png' })
                    ),
                    downloadName: `${selectedId}_${option}`,
                    downloadId: generateId()
                });*/
            //};
            //const onConversionError = () => {
            //closeWizard();
            // notify
            //};
            //closeCheckout();
            //notify({ template: NOTIFICATION_TEMPLATE.SUCCESS_PAYMENT });
            /*
        await performCall({
            method: order,
            data: {
                ...data
                //transactionSignature,
                //statusToken
            },
            onSuccess: onConversionSuccess,
            onError: onConversionError,
            onStartRequest: () => setLoading(true),
            onEndRequest: () => setLoading(false)
        })*/
        },
        []
    );

    const config = useMemo(
        () => ({
            additionalJSON: data,
            paylinkId,
            network: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'main' : 'test',
            onCancel,
            onError,
            onSuccess
        }),
        [data, paylinkId, onCancel, onError, onSuccess]
    );

    return <HelioCheckout config={config} />;
};
