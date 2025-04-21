namespace Backend.Controllers;

class AuthErrors
{
    public const string SignupDataMissing = "The following data is required: user name, email, password, first name.";

    public const string LoginDataMissing = "The following data is required: user name/email, password.";

    public const string InvalidUserNameEmailOrPassword = "Invalid user name/email or password.";

    public const string InvalidRole = "Invalid role name.";
}
