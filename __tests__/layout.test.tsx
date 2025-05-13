import { add } from '@/app/page';

describe('Функція додавання', () => {
    test('додавання двох чисел', () => {
        expect(add(1, 2)).toBe(3);
        expect(add(-1, 1)).toBe(0);
        expect(add(-2, -3)).toBe(-5);
    });

    test('додавання нуля', () => {
        expect(add(0, 0)).toBe(0);
        expect(add(0, 5)).toBe(5);
    });
});
