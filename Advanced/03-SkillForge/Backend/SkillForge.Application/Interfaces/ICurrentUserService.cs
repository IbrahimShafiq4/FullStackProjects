using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Interfaces
{
    public interface ICurrentUserService
    {
        string? UserId { get; }
    }
}
