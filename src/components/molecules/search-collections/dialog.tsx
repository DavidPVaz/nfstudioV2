import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem
} from '@/components/atoms/command';

interface SearchDialogProps {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    onSelect: (value: string) => void;
    data: Array<{ value: string; name: string; imgSrc?: string }>;
}

// TODO: add image in item. add chain bar
export const SearchDialog = ({ open, onOpenChange, onSelect, data }: SearchDialogProps) => (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Search collections on NFStudio" />
        <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
                {data.map(({ value, name, imgSrc }) => (
                    <CommandItem key={value} value={value} onSelect={onSelect}>
                        <span>{name}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
        </CommandList>
    </CommandDialog>
);
