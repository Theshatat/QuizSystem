using Microsoft.AspNetCore.Identity;

namespace QuizSystem.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string FullNme { get; set; }
    }
     
}
