using Backend.Dtos;

namespace Backend.Tests.Helpers;

public enum ParameterIntegrity
{
    Valid,

    Invalid,

    Missing
}

public class CredentialIntegrity
{
    public ParameterIntegrity Username;

    public ParameterIntegrity Email;

    public ParameterIntegrity Password;
}

public class UserIntegrity
{
    public ParameterIntegrity Username;

    public ParameterIntegrity Password;
    
    public ParameterIntegrity Email;

    public ParameterIntegrity FirstName;

    public ParameterIntegrity LastName;

    public ParameterIntegrity Role;
}

public enum Role
{
    User,

    Admin
}

class TestConstants
{
    public static string Username { get; } = "user1";

    public static string Password { get; } = "password1";

    public static string Email { get; } = "user1@gmail.com";

    public static string InvalidUsername { get; } = "invaliduser";

    public static string InvalidPassword { get; } = "invalidpassword";

    public static string InvalidEmail { get; } = "invalidemail";

    public static string InvalidFirstName { get; } = "invalidfirstname";

    public static string InvalidLastName { get; } = "invalidlastname";

    public static string InvalidRole { get; } = "invalidrole";

    public static string SignedUpUsername { get; } = "signedupuser";

    public static string SignedUpPassword { get; } = "signeduppassword";

    public static string SignedUpEmail { get; } = "signedupuser@gmail.com";

    public static string SignedUpFirstName { get; } = "signedupfirstname";

    public static string SignedUpLastName { get; } = "signeduplastname";

}

public class TestDataHelper
{
    public static CredentialDto GetTestCredential(CredentialIntegrity integrity)
    {
        var credentialDto = new CredentialDto
        {
            Username = (integrity.Username == ParameterIntegrity.Missing) ? null : (integrity.Username == ParameterIntegrity.Invalid ? TestConstants.InvalidUsername : TestConstants.Username),
            Email = (integrity.Email == ParameterIntegrity.Missing) ? null : (integrity.Email == ParameterIntegrity.Invalid ? TestConstants.InvalidEmail : TestConstants.Email)
        };

        if(integrity.Password != ParameterIntegrity.Missing)
        {
            credentialDto.Password = (integrity.Password == ParameterIntegrity.Invalid) ? TestConstants.InvalidPassword : TestConstants.Password;
        }

        return credentialDto;
    }

    public static CredentialDto GetTestCredentialForSignUp(CredentialIntegrity integrity)
    {
        var credentialDto = new CredentialDto
        {
            Username = (integrity.Username == ParameterIntegrity.Missing) ? null : (integrity.Username == ParameterIntegrity.Invalid ? TestConstants.InvalidUsername : TestConstants.SignedUpUsername),
            Email = (integrity.Email == ParameterIntegrity.Missing) ? null : (integrity.Email == ParameterIntegrity.Invalid ? TestConstants.InvalidEmail : TestConstants.SignedUpEmail)
        };

        if(integrity.Password != ParameterIntegrity.Missing)
        {
            credentialDto.Password = (integrity.Password == ParameterIntegrity.Invalid) ? TestConstants.InvalidPassword : TestConstants.SignedUpPassword;
        }

        return credentialDto;
    }

    public static UserDto GetTestUserForSignUp(UserIntegrity integrity, Role role)
    {
        var userDto = new UserDto
        {
            LastName = (integrity.LastName == ParameterIntegrity.Missing) ? null : (integrity.LastName == ParameterIntegrity.Invalid ? TestConstants.InvalidLastName : TestConstants.SignedUpLastName)
        };

        if(integrity.Username != ParameterIntegrity.Missing)
        {
            userDto.Username = (integrity.Username == ParameterIntegrity.Invalid) ? TestConstants.InvalidUsername : TestConstants.SignedUpUsername;
        }

        if(integrity.Password != ParameterIntegrity.Missing)
        {
            userDto.Password = (integrity.Password == ParameterIntegrity.Invalid) ? TestConstants.InvalidPassword : TestConstants.SignedUpPassword;
        }

        if(integrity.Email != ParameterIntegrity.Missing)
        {
            userDto.Email = (integrity.Email == ParameterIntegrity.Invalid) ? TestConstants.InvalidEmail : TestConstants.SignedUpEmail;
        }

        if(integrity.FirstName != ParameterIntegrity.Missing)
        {
            userDto.FirstName = (integrity.FirstName == ParameterIntegrity.Invalid) ? TestConstants.InvalidFirstName : TestConstants.SignedUpFirstName;
        }

        if(integrity.Role != ParameterIntegrity.Missing)
        {
            userDto.Role = (integrity.Role == ParameterIntegrity.Invalid) ? TestConstants.InvalidRole : (role == Role.Admin ? "Admin" : "User");
        }

        return userDto;
    }
}
