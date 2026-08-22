using EventHive.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(AppUser user, string role);
    }
}
