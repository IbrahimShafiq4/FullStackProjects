using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Domain.Entities;

namespace Vaultly.Application.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
