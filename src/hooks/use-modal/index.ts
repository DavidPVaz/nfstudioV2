import { useState } from 'react';

export const useModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return {
        open: () => {
            setIsOpen(true);
        },
        close: () => {
            setIsOpen(false);
        },
        toggle: () => {
            setIsOpen(isOpen => !isOpen);
        },
        isOpen
    };
};
