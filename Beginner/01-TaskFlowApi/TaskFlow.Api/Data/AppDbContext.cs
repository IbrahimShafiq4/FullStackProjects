using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<TaskItem>      TaskItems   { get; set; }
        public DbSet<UserStreak>    UserStreaks { get; set; }
    }
}
