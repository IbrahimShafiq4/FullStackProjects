using MindMesh.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(AppUser user);
    }
}
