import React, { useCallback, useMemo, useEffect } from 'react';
import { PLATFORMS } from '@/enums';
import { HelioCheckout } from '@heliofi/checkout-react';
import { useCollectionContext } from '@/app/collections/[collection]/context';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { useNotification } from '@/hooks/use-notification';
import { useApiWrite } from '@/hooks/use-api';
import { getPlatformOptionConfig } from '@/lib/utils';

const HELIO_CHECKOUT_STORE_VARIABLES = [
    'wagmi.store',
    'wc@2:core:0.3//keychain',
    'openlogin_store',
    'loglevel:http-helpers',
    'loglevel:openlogin',
    'loglevel:broadcast-channel',
    'loglevel:web3auth-logger',
    'WCM_VERSION'
];

const destroyHelioFootprint = () => {
    // clear script+iframe
    document.getElementById('verify-api')?.remove();
    document.getElementById('helio-checkout-react-v1')?.remove();

    // clear store variables
    HELIO_CHECKOUT_STORE_VARIABLES.forEach(property => window.localStorage.removeItem(property));
};

export const OrderContent = ({ close }: { close: () => void }) => {
    const { selectedCollection, paylinkId } = useCollectionContext();
    const {
        data: { platform, option, atRight, coverStyle, logo, selectedNFT }
    } = useWizardContext();
    const { notify } = useNotification();

    useEffect(() => destroyHelioFootprint, []);

    const onConversionError = useCallback(() => {
        notify({
            title: 'Whoops!',
            description:
                'An unexpected error occurred while creating your image. You will be automatically refunded.',
            duration: 6000,
            variant: 'destructive'
        });
    }, [notify]);

    const onConversionSuccess = useCallback((buffer: ArrayBuffer) => {
        // save this data in its own storage to be used in downloads folder
        updateData({
            downloadRef: window.URL.createObjectURL(new Blob([buffer], { type: 'image/png' })),
            downloadName: `${selectedNFT.id}_${option}_${new Date().toISOString()}`
        });
        // notify available download with download action
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

    const { send, reset } = useApiWrite<
        typeof data & { transactionSignature: string; statusToken: string },
        ArrayBuffer
    >({
        method: () => {},
        onError: onConversionError,
        onSuccess: onConversionSuccess
    });

    const onPaymentCancel = useCallback(() => {
        reset();
        close();
    }, [reset, close]);

    const onPaymentError = useCallback(
        ({ errorMessage }: { errorMessage?: string }) => {
            reset();
            close();
            notify({
                title: 'Whoops!',
                description: `An unexpected error occurred while processing your payment. Please retry. ${errorMessage ? errorMessage : ''}`,
                duration: 6000,
                variant: 'destructive'
            });
        },
        [reset, close, notify]
    );

    const onPaymentSuccess = useCallback(
        async ({
            data: { statusToken, transactionSignature }
        }: {
            data: { statusToken: string; transactionSignature: string };
        }) => {
            close();
            notify({
                title: 'Payment is complete!',
                description:
                    "NFStudio will now begin creating your image. We'll notify you once your download is available."
            });

            await send({
                ...data,
                transactionSignature,
                statusToken
            });

            reset();
        },
        [close, notify, send, data, reset]
    );

    const config = useMemo(
        () => ({
            additionalJSON: data,
            paylinkId,
            network: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'main' : 'test',
            showPayWithCard: false,
            onCancel: onPaymentCancel,
            onError: onPaymentError,
            onSuccess: onPaymentSuccess
        }),
        [data, paylinkId, onPaymentCancel, onPaymentError, onPaymentSuccess]
    );

    return <HelioCheckout config={config} />;
};
