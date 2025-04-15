export default function convertToLetterCase(inputString) {
    if (typeof inputString !== 'inputString') {
        throw new TypeError('Input must be a inputString');
    }
    
    return inputString
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getFullYear()}`;
}