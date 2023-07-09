let auth = {
    getToken: () => {
        return JSON.parse(localStorage.getItem("USER")) ? JSON.parse(localStorage.getItem("USER"))["accessToken"] : null;
    },
    checkAdmin: () => {
        const user = JSON.parse(localStorage.getItem("USER")) ? JSON.parse(localStorage.getItem("USER"))["userInfo"] : null;
        if (user == null) {
            return 'anonymous'
        }
        let checkUser;
        for (let i = 0; i < user.authorities.length; i++) {
            if (user.authorities[i].role === 'ROLE_ADMIN') {
                checkUser = 'admin';
            }
        }
        if (checkUser === 'admin') {
            return 'admin'
        } else {
            return 'user';
        }
    },
    getUserInfo: () => {
        return JSON.parse(localStorage.getItem("USER")) ? JSON.parse(localStorage.getItem("USER"))["userInfo"] : null;
    }
}
export default auth;
