import * as readline from 'readline';

export type Key = {
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
    sequence: string;
};

/**
 * Starts listening for keypress events.
 * @param onKey Callback function for key events.
 */
export function listen(onKey: (key: Key) => void) {
    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str, key) => {
        if (key) {
            // Normalize some names if needed, but node's readline is usually good.
            // ctrl+c handling (optional, but good default)
            if (key.ctrl && key.name === 'c') {
                process.exit(0);
            }
            onKey(key);
        }
    });
}

/**
 * Standard cleanup for input listeners.
 */
export function stopListening() {
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
    }
    process.stdin.pause();
}
