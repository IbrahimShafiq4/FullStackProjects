using GigLink.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Application.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
