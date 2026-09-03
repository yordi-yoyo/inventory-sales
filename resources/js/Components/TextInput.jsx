import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-gray-300 shadow-sm ' +
                'dark:border-white/10 dark:bg-ink dark:text-paper dark:focus:border-brass dark:focus:ring-brass ' +
                'focus:border-ledger focus:ring-ledger ' +
                className
            }
            ref={localRef}
        />
    );
});