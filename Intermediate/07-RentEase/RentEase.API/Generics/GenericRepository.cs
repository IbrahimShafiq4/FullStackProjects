using Microsoft.EntityFrameworkCore;
using RentEase.API.Data;

namespace RentEase.API.Generics
{
    public interface IGenericRepository<T> where T: class
    {
        Task<T?>        GetByIdAsync(int id);
        Task<List<T>>   GetAllAsync();
        Task            AddAsync(T entity);
        void            Remove(T entity);
    }

    public class GenericRepository<T>: IGenericRepository<T> where T: class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbset;

        public GenericRepository(AppDbContext context)
        { _context = context; _dbset = _context.Set<T>(); }

        public async Task<T?> GetByIdAsync(int id) =>
            await _dbset.FindAsync(id);

        public async Task<List<T>> GetAllAsync() =>
            await _dbset.ToListAsync();

        public async Task AddAsync(T entity) =>
            await _dbset.AddAsync(entity);

        public void Remove(T entity) =>
            _dbset.Remove(entity);
    }
}
