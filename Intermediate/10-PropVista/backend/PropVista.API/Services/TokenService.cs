using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PropVista.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PropVista.API.Services
{
    public interface ITokenService 
    {
        string CreateToken(AppUser user);
    }

    public class TokenService: ITokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        { _config = config; }

        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,    user.Id),
                new Claim(ClaimTypes.Email,             user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name,              user.FullName),
                new Claim(ClaimTypes.Role,              user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.UtcNow.AddDays(1), signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
