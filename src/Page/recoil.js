import { atom, selector } from 'recoil';

const positionClick = atom({
    key: 'POSITION_CLICK',
    default: null,
});

export const positionClickState = selector({
    key: 'POSITION_CLICK_SELECTOR',
    get: ({ get }) => get(positionClick),
    set: ({ set }, newValue) => {
        set(positionClick, newValue);
    }
});
