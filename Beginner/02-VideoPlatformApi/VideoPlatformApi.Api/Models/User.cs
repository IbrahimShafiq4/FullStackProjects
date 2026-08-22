using System.ComponentModel.DataAnnotations;
using VideoPlatformApi.Models;

namespace VideoPlatformApi.Api.Models
{
    public class User: BaseEntity
    {
        // ===========              User name                         ===========
        [Required(      ErrorMessage = "Username is Required")]
        [MaxLength(100, ErrorMessage = "Username cannot exceed 100 characters")]
        public string           Username                { get; set; } = string.Empty;
        // ======================================================================
        [Required(      ErrorMessage = "Email is Required")]
        [EmailAddress(  ErrorMessage = "Invalid Email format")]
        [MaxLength(200, ErrorMessage = "Email cannot exceed 200 characters")]
        // ===========              User Email                        ===========
        public string           Email                   { get; set; } = string.Empty;
        // ======================================================================

        // =========== User Profile Picture that saved on the machine ===========
        public string?          ProfilePictureUrl       { get; set; }
        // ======================================================================

        // ===========              User CreationDate                 =========== 
        public DateTime         CreatedAt               { get; set; } = DateTime.UtcNow;
        // ======================================================================

        // ===========              Navigational Properties           ===========
        public List<Video>      Videos                  { get; set; } = new List<Video  >();
        public List<Comment>    Comments                { get; set; } = new List<Comment>();
        public List<Like>       Likes                   { get; set; } = new List<Like   >();
        // ======================================================================
    }
}
