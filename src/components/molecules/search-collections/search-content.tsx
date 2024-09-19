import React from 'react';
import {
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    Image,
    Button
} from '@/components/atoms';
import { Chain, CHAIN_ICON_MAP } from '@/shared/enums';

type SearchContentProps = {
    onSelect: (value: string) => void;
    onChain: (chain: Chain | null) => void;
    data: { value: string; imgSrc: string }[];
    selectedChain: Chain | null;
};

export const SearchContent = ({ onSelect, onChain, data, selectedChain }: SearchContentProps) => (
    <>
        <CommandInput
            aria-label="Search collections"
            placeholder="Search collections on NFStudio"
            autoFocus
        />
        <ChainFilter onChain={onChain} selectedChain={selectedChain} />
        <CommandList>
            <CommandEmpty className="w-full pt-4 text-center text-lg">
                No collections found.
            </CommandEmpty>
            <CommandGroup>
                {data.map(({ value, imgSrc }) => (
                    <CommandItem key={value} value={value} onSelect={onSelect}>
                        <Image
                            optimizedWidth={300}
                            quality={30}
                            alt={value}
                            className="rounded-sm"
                            src={imgSrc}
                            width={35}
                            height={45.8465}
                        />
                        <span className="text-lg">{value}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
        </CommandList>
    </>
);

const ChainFilter = ({
    onChain,
    selectedChain
}: {
    onChain: (chain: Chain | null) => void;
    selectedChain: Chain | null;
}) => (
    <div className="h-11 w-full border-b">
        <div className="relative flex h-full w-full items-center justify-center">
            <Button
                aria-label="Select all chains"
                variant="ghost"
                className={`${selectedChain === null ? 'bg-accent' : ''} w-full gap-x-2 rounded-none hover:bg-accent/${selectedChain === null ? '100' : '50'}`}
                onClick={() => onChain(null)}
            >
                <p className="hidden text-sm text-foreground sm:inline">All chains</p>
                <p className="inline text-sm text-foreground sm:hidden">All</p>
            </Button>

            {Object.entries(CHAIN_ICON_MAP).map(([chain, Icon]) => {
                const chainIsSelected = selectedChain === chain;

                return (
                    <Button
                        key={chain}
                        aria-label={`Filter by ${chain} chain`}
                        variant="ghost"
                        className={`${chainIsSelected ? 'bg-accent' : ''} w-full gap-x-2 rounded-none hover:bg-accent/${chainIsSelected ? '100' : '50'}`}
                        onClick={() => onChain(chain as Chain)}
                    >
                        <Icon
                            className={`${chainIsSelected ? 'fill-foreground' : 'fill-foreground/70'} h-full group-hover:fill-foreground`}
                        />
                        {chainIsSelected && (
                            <p className="hidden text-sm text-foreground sm:inline">{chain}</p>
                        )}
                    </Button>
                );
            })}
        </div>
    </div>
);
