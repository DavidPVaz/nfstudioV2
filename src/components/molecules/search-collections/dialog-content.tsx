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

export interface SearchDialogContentProps {
    onSelect: (value: string) => void;
    onChain: (chain: Chain) => void;
    data: Array<{ value: string; name: string; imgSrc?: string; chain: Chain }>;
    selectedChain: Chain | null;
}
const getSrc = (src: string) => `https://images.ctfassets.net/ze23ubzzqb1s/${src}`;

export const DialogContent = ({
    onSelect,
    onChain,
    data,
    selectedChain
}: SearchDialogContentProps) => (
    <>
        <CommandInput placeholder="Search collections on NFStudio" autoFocus />
        <ChainFilter onChain={onChain} />
        <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
                {data
                    .filter(({ chain }) => chain === selectedChain || true)
                    .map(({ value, name, imgSrc }) => (
                        <CommandItem key={value} value={value} onSelect={onSelect}>
                            {imgSrc && (
                                <Image
                                    optimizedWidth={50}
                                    alt={name}
                                    className="rounded-sm"
                                    src={getSrc(imgSrc)}
                                    useCustomLoader={false}
                                    width={35}
                                    height={45.8465}
                                />
                            )}
                            <span>{name}</span>
                        </CommandItem>
                    ))}
            </CommandGroup>
        </CommandList>
    </>
);

const ChainFilter = ({ onChain }: { onChain: (chain: Chain) => void }) => (
    <div className="h-11 w-full border-b">
        <div className="relative flex h-full w-full items-stretch justify-center gap-x-2 md:gap-x-0">
            {Object.entries(CHAIN_ICON_MAP).map(([chain, Icon]) => (
                <Button variant={'outline'} onClick={() => onChain(chain as Chain)}>
                    <Icon className="h-full fill-foreground" />
                </Button>
            ))}
        </div>
    </div>
);
