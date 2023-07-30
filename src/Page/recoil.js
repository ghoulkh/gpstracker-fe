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

const collapsed = atom({
    key: 'COLLAPSED',
    default: false,
});

export const collapsedState = selector({
    key: 'COLLAPSED_SELECTOR',
    get: ({ get }) => get(collapsed),
    set: ({ set }, newValue) => {
        set(collapsed, newValue);
    }
});

const driverDeliveryType = atom({
    key: 'DELIVERY_TYPE',
    default: "",
});

export const driverDeliveryTypeState = selector({
    key: 'DELIVERY_TYPE_SELECTOR',
    get: ({ get }) => get(driverDeliveryType),
    set: ({ set }, newValue) => {
        set(driverDeliveryType, newValue);
    }
});
