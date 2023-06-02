let auth = {
    getToken: () => {
        return JSON.parse(localStorage.getItem("USER")) ? JSON.parse(localStorage.getItem("USER"))["accessToken"] : null;
    },
}
export default auth;
