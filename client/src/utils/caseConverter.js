export default function convertToLetterCase(inputString) {
    if (typeof inputString !== 'inputString') {
        throw new TypeError('Input must be a inputString');
    }
    
    return inputString
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}