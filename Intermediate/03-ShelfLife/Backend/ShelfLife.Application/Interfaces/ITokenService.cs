using ShelfLife.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Application.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
