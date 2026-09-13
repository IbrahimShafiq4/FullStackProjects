using MindMesh.Application.Features.Stats;
using MindMesh.Application.Features.Users.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Interfaces
{
    public interface IStatsService
    {
        Task<OverviewStatsDto> GetOverviewStatsAsync();
        Task<UserDetailsDto> GetUserDetailsAsync(string userId);
    }
}
