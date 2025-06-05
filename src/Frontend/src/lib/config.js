export const backend = {
    portDev: 5000,
    urls: {
        getXcsrfToken: '/Auth/GetXcsrfToken',
        login: '/Auth/Login',
        logout: '/Auth/Logout',
        admin: '/Admin',
        data: '/Data'
    },
    roles: {
        user: 'User',
        admin: 'Admin'
    }
};

const pages = {
    homePage: '/',
    loginPage: '/login',
    adminPage: '/admin',
    dataPage: '/data',
    errorPage: '/error',
    notFoundPage: '/not-found'
};

export const frontend = {
    portDev: 3000,
    urls: {
        pages: pages,
        api: {
            getXcsrf: '/api/get-xcsrf',
            login: '/api/login',
            logout: '/api/logout',
            admin: '/api/admin',
            data: '/api/data'
        }
    },
    noshow: {
        navigationComponent: [
            pages.loginPage,
            pages.errorPage
        ],
        userComponent: [
            pages.loginPage,
            pages.errorPage
        ]
    },
    errorMessages: {
        userNameMissingError: 'Please enter your username.',
        passwordMissingError: 'Please enter your password.',
        invalidUserNameOrPasswordError: 'Invalid username or password.',
        failedToGetData: 'Failed to get data.',
        generalError: {
            line1: "❌ An error occurred we couldn't recover from.",
            line2: '✅ Please try again reloading the page later.',
            line3: "😢 We're sorry for the inconvenience."
        }
    }
};