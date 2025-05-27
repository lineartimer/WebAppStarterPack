export const backend = {
    portDev: 5000,
    urls: {
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

const urls = {
    homePage: '/',
    loginPage: '/login',
    adminPage: '/admin',
    dataPage: '/data',
    errorPage: '/error',
    notFoundPage: '/notfound'
};

export const frontend = {
    urls: urls,
    content: {
        homePage: {
            line1: 'A starter template with',
            line2: '✅ a .Net backend,',
            line3: '✅ a React frontend and',
            line4: '✅ a GitHub CI/CD pipeline',
            line5: '✅ that deploys to Azure.'
        },
        notFoundPage: {
            notFound: "🤷‍♂️ Nothing found here..."
        }
    },
    noshow: {
        navigationComponent: [
            urls.loginPage,
            urls.errorPage,
            urls.notFoundPage
        ],
        userComponent: [
            urls.loginPage,
            urls.errorPage,
            urls.notFoundPage
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