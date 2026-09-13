using Microsoft.IdentityModel.Tokens;
using RentEase.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RentEase.API.Services
{
    public interface ITokenService { string CreateToken(AppUser user); }

    public class TokenService: ITokenService
    {
        private IConfiguration _config;

        public TokenService(IConfiguration config)
        { _config = config; }

        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new (ClaimTypes.NameIdentifier, user.Id),
                new (ClaimTypes.Name, user.FullName),
                new (ClaimTypes.Email, user.Email ?? string.Empty),
            };

            var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var token   = new JwtSecurityToken(
                    claims: claims,
                    signingCredentials: creds,
                    expires: DateTime.UtcNow.AddDays(1)
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
