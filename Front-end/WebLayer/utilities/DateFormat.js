export function DateBg(date) {
    return new Date(date).toLocaleDateString('ru-RU', { dateStyle: 'short' });
}