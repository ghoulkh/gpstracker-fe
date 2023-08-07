import {atom, selector} from "recoil";

const username = atom({
    key: 'USERNAME',
    default: "",
});

export const usernameState = selector({
    key: 'USERNAME_STATE',
    get: ({ get }) => get(username),
    set: ({ set }, newValue) => {
        set(username, newValue);
    }
});

const pageIndex = atom({
    key: 'PAGE_INDEX',
    default: 1,
});

export const pageIndexState = selector({
    key: 'PAGE_INDEX_STATE',
    get: ({ get }) => get(pageIndex),
    set: ({ set }, newValue) => {
        set(pageIndex, newValue);
    }
});

const pageSize = atom({
    key: 'PAGE_SIZE',
    default: 100,
});

export const pageSizeState = selector({
    key: 'PAGE_SIZE_STATE',
    get: ({ get }) => get(pageSize),
    set: ({ set }, newValue) => {
        set(pageSize, newValue);
    }
});

const user = atom({
    key: 'USER',
    default: [],
});

export const userState = selector({
    key: 'USER_STATE',
    get: ({ get }) => get(user),
    set: ({ set }, newValue) => {
        set(user, newValue);
    }
});

const driver = atom({
    key: 'DRIVER',
    default: [],
});

export const driverState = selector({
    key: 'DRIVER_STATE',
    get: ({ get }) => get(driver),
    set: ({ set }, newValue) => {
        set(driver, newValue);
    }
});

const admin = atom({
    key: 'ADMIN',
    default: [],
});

export const adminState = selector({
    key: 'ADMIN_STATE',
    get: ({ get }) => get(admin),
    set: ({ set }, newValue) => {
        set(admin, newValue);
    }
});

const popup = atom({
    key: 'POPUP',
    default: false,
});

export const popupState = selector({
    key: 'POPUP_STATE',
    get: ({ get }) => get(popup),
    set: ({ set }, newValue) => {
        set(popup, newValue);
    }
});
