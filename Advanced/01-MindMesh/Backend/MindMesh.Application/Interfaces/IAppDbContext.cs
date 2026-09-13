using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

using MindMesh.Domain.Entities;

namespace MindMesh.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Board>            Boards      { get; }
        DbSet<Card>             Cards       { get; }
        DbSet<CardConnection>   Connections { get; }
        DbSet<AppUser>          Users       { get; }
        Task<int>               SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
