const config = {
    backEndPortDev: 5000,
    frontendUrls: {
        homePage: "/",
        loginPage: "/Login",
        adminPage: "/Admin",
        dataPage: "/Data",
        errorPage: "/Error"
    },
    backendUrls: {
        login: "/Auth/Login",
        logout: "/Auth/Logout",
        admin: "/Admin",
        data: "/Data"
    },
    errorMessages: {
        userNameMissingError: "Please enter your username.",
        passwordMissingError: "Please enter your password.",
        invalidUserNameOrPasswordError: "Invalid username or password.",
        failedToGetData: "Failed to get data.",
        generalError: {
            line1: "❌ An error occured we couldn't recover from.",
            line2: "✅ Please try again reloading the site later.",
            line3: "😢 We're sorry for the inconvenience."
        }
    }
};

export default config;
