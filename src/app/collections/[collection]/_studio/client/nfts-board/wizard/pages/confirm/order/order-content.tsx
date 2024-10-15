import React, { useCallback, useMemo, useEffect } from 'react';
import { PLATFORMS } from '@/enums';
import { HelioCheckout } from '@heliofi/checkout-react';
import { useCollectionContext } from '@/app/collections/[collection]/context';
import { useStudioContext } from '@/app/collections/[collection]/_studio/client';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { useNotification } from '@/hooks/use-notification';
import { useApiWrite } from '@/hooks/use-api';
import { getPlatformOptionConfig } from '@/lib/utils';
import { order, type OrderProps } from '@/app/_service';
import { OrderError } from '@/app/_errors';

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
    const { onDownloadData } = useStudioContext();
    const {
        data: { platform, option, atRight, coverStyle, logo, selectedNFT }
    } = useWizardContext();
    const { notify } = useNotification();

    useEffect(() => destroyHelioFootprint, []);

    const onConversionError = useCallback(
        (error: OrderError) =>
            notify({
                title: 'Whoops!',
                description: error.message,
                duration: 7000,
                variant: 'destructive'
            }),
        [notify]
    );

    const onConversionSuccess = useCallback(
        (buffer: ArrayBuffer) => {
            const downloadRef = window.URL.createObjectURL(
                new Blob([buffer], { type: 'image/png' })
            );
            const name = `${selectedNFT.id}_${option}`;

            notify({
                title: 'Download is ready!',
                description:
                    'Your image is now available to download. You can download it now or access it later in downloads folder.',
                duration: 15000,
                action: (
                    <a href={downloadRef} download={name}>
                        Download
                    </a>
                ),
                cleanup: () => window.URL.revokeObjectURL(downloadRef)
            });

            onDownloadData({
                name,
                data: Array.from(new Uint8Array(buffer)),
                createdAt: new Date().getTime()
            });
        },
        [selectedNFT, option, onDownloadData, notify]
    );

    const data = useMemo(
        () => ({
            ...getPlatformOptionConfig({ platform: platform!, option: option! }),
            src: encodeURI(selectedNFT.src),
            atRight,
            coverStyle,
            logoSrc: coverStyle || !logo ? undefined : encodeURI(logo),
            mobile: platform === PLATFORMS.MOBILE,
            collection: selectedCollection
        }),
        [platform, option, selectedNFT, atRight, coverStyle, logo, selectedCollection]
    );

    const { send, reset } = useApiWrite<OrderProps, ArrayBuffer>({
        key: `order-${Object.values(data).join('-')}`,
        method: order,
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
                description: `${errorMessage ?? 'An unexpected error occurred while processing your payment. Please try again'}.`,
                duration: 7000,
                variant: 'destructive'
            });
        },
        [reset, close, notify]
    );

    const onPaymentSuccess = useCallback(
        ({
            data: { statusToken, transactionSignature }
        }: {
            data: {
                statusToken: OrderProps['statusToken'];
                transactionSignature: OrderProps['transactionSignature'];
            };
        }) => {
            send({
                ...data,
                transactionSignature,
                statusToken
            });
            close();
            notify({
                title: 'Payment is complete!',
                description:
                    "NFStudio will now begin creating your image. We'll notify you once your download is available."
            });
        },
        [close, notify, send, data]
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
