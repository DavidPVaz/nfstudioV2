import React, { useEffect, useMemo } from 'react';
import { CircleHelp, RefreshCcw } from 'lucide-react';
import type {
    SelectedNFTs,
    NFT,
    IncompleteNFT,
    LoadCompleteNFTs,
    LoadIncompleteNFTs
} from '@/app/collections/[collection]/studio/client';
import { NFTCard } from '@/components/molecules/card';
import { Button } from '@/components/atoms/button';
import { Tooltip } from '@/components/atoms/tooltip';
import { LoadNfts, LoadNftsInDialog } from '@/app/collections/[collection]/studio/client/load-nfts';
import { loadMetadata, type LoadMetadataProps } from '@/app/api';
import { useApiRead } from '@/hooks/use-api';
import { useDialog } from '@/hooks/use-dialog';
import { useStudioContext } from '@/app/collections/[collection]/studio/client/context';

const areCompleteNFTs = (nfts: SelectedNFTs): nfts is NFT[] =>
    nfts.every(
        nft =>
            typeof (nft as NFT).id === 'number' &&
            typeof (nft as NFT).selected === 'boolean' &&
            typeof (nft as NFT).src === 'string'
    );
const hasLoadedNFTs = (nfts: SelectedNFTs) => nfts.length > 0;

export const NftsBoard = ({
    nfts,
    onCompleteLoad,
    onIncompleteLoad,
    onNFTSelect
}: {
    nfts: SelectedNFTs;
    onCompleteLoad: LoadCompleteNFTs;
    onIncompleteLoad: LoadIncompleteNFTs;
    onNFTSelect: (selectedId: number) => void;
}) => {
    const { selectedCollection, unsupportedTraits, cacheStrategy } = useStudioContext();

    const userHasLoadedNFTs = useMemo(() => hasLoadedNFTs(nfts), [nfts]);
    const nftsLoadIsComplete = useMemo(() => areCompleteNFTs(nfts), [nfts]);

    const { response, noNetwork } = useApiRead<LoadMetadataProps, NFT[]>({
        method: loadMetadata,
        args: { collection: selectedCollection, nfts, unsupportedTraits },
        enabled: userHasLoadedNFTs && !nftsLoadIsComplete,
        onError: error => console.log(error)
    });

    // TODO: deal with error by notifying user - toast
    // TODO: in case of error, rollback to showing previous complete nft data if any

    useEffect(() => {
        if (nftsLoadIsComplete) {
            return;
        }

        if (response) {
            onCompleteLoad(response);
        }
    }, [nftsLoadIsComplete, response, onCompleteLoad]);

    if (!userHasLoadedNFTs) {
        return <LoadNfts onIncompleteLoad={onIncompleteLoad} />;
    }

    if (noNetwork) {
        return (
            <span className="p-8 text-lg">
                You are offline. Your request will resume as soon as you come back online.
            </span>
        );
    }

    return (
        <div className="relative flex w-full flex-col">
            <div className="container relative flex-1 overflow-y-auto">
                {!nftsLoadIsComplete ? (
                    'Loading... optimistically render skeleton with same number as user requested'
                ) : (
                    <div className="grid w-full grid-cols-1 gap-3 pb-8 pt-8 xs:grid-cols-2 2xs:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {(nfts as NFT[]).map(({ id, src, selected }) => (
                            <NFTCard
                                key={id}
                                imgSrc={src}
                                id={id}
                                selected={selected}
                                onClick={onNFTSelect}
                                {...cacheStrategy}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Toolbar onRefresh={onIncompleteLoad} canCreate={nftsLoadIsComplete} />
        </div>
    );
};

const Toolbar = ({
    canCreate,
    onRefresh
}: {
    canCreate: boolean;
    onRefresh: LoadIncompleteNFTs;
}) => {
    const refreshDialog = useDialog();

    return (
        <>
            <div className="sticky bottom-0 flex h-16 w-full flex-row items-center justify-center gap-x-2 rounded-b-lg border-t xs:gap-x-4 sm:h-20 sm:gap-x-6">
                <div className="relative flex flex-row gap-x-1 sm:gap-x-2">
                    <Tooltip content="Refresh NFT selection">
                        <Button variant="ghost" size="icon2x" onClick={refreshDialog.open}>
                            <RefreshCcw className="h-[1.7rem] w-[1.7rem] sm:h-[2rem] sm:w-[2rem]" />
                            <span className="sr-only">Refresh NFT selection</span>
                        </Button>
                    </Tooltip>

                    <Tooltip content="Get help">
                        <Button
                            variant="ghost"
                            size="icon2x"
                            onClick={() => console.log('Clicking help')}
                        >
                            <CircleHelp className="h-[1.7rem] w-[1.7rem] sm:h-[2rem] sm:w-[2rem]" />
                            <span className="sr-only">Get help</span>
                        </Button>
                    </Tooltip>
                </div>

                <Button
                    disabled={!canCreate}
                    size="lg"
                    onClick={() => {
                        //hasSelectedOneNft ? open wizard : show notification if user tries to create without having any selected nft
                    }}
                >
                    CREATE
                </Button>
            </div>

            <LoadNftsInDialog
                open={refreshDialog.isOpen}
                onOpenChange={refreshDialog.toggle}
                onRefresh={(incompleteNFTs: { ids: IncompleteNFT[] }) => {
                    refreshDialog.close();
                    onRefresh(incompleteNFTs);
                }}
            />
        </>
    );
};
