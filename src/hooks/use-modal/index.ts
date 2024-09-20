import { useState } from 'react';

/**
 * Allows to control the state of a Modal component.
 */
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
