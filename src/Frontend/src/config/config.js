export const backend = {
    portDev: 5000,
    urls: {
        login: "/Auth/Login",
        logout: "/Auth/Logout",
        admin: "/Admin",
        data: "/Data"
    },
    roles: {
        user: "User",
        admin: "Admin"
    }
};

export const frontend = {
    urls: {
        homePage: "/",
        loginPage: "/Login",
        adminPage: "/Admin",
        dataPage: "/Data",
        errorPage: "/Error"
    },
    errorMessages: {
        userNameMissingError: "Please enter your username.",
        passwordMissingError: "Please enter your password.",
        invalidUserNameOrPasswordError: "Invalid username or password.",
        failedToGetData: "Failed to get data.",
        generalError: {
            line1: "❌ An error occured we couldn't recover from.",
            line2: "✅ Please try again reloading the page later.",
            line3: "😢 We're sorry for the inconvenience."
        }
    }
};
