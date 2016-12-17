/*
 * Method to determine if the application is being run in Node
 */

export function checkForNode() {
    // Checks if running in node env
    if (typeof process === 'object' && Object.prototype.toString.call(process) === '[object process]') {
        // Checks if running in Electron
        return !(window && window.process && window.process.type);
    }
    return false;
}

export function checkForElectron() {
    return (
        typeof process === 'object' &&
        Object.prototype.toString.call(process) === '[object process]' &&
        window && window.process && window.process.type
    );
}