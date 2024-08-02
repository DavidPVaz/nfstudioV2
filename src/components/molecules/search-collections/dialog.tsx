import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    Image
} from '@/components/atoms';

interface SearchDialogProps {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    onSelect: (value: string) => void;
    data: Array<{ value: string; name: string; imgSrc?: string }>;
}
const getSrc = (src: string) => `https://images.ctfassets.net/ze23ubzzqb1s/${src}`;
// TODO: add chain bar
export const SearchDialog = ({ open, onOpenChange, onSelect, data }: SearchDialogProps) => (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Search collections on NFStudio" />
        <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
                {data.map(({ value, name, imgSrc }) => (
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
    </CommandDialog>
);
