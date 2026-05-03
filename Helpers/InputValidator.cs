using System.Text.RegularExpressions;

namespace SecurePortal.Helpers
{
    public class InputValidator
    {
        public static bool ValidEmail(string email)
        {
            return Regex.IsMatch(email,
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }

        public static bool ValidPassword(string password)
        {
            return Regex.IsMatch(password,
                @"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$");
        }
    }

}
