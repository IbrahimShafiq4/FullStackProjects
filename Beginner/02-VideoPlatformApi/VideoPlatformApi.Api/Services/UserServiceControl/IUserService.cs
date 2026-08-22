using VideoPlatformApi.Api.DTOs;

namespace VideoPlatformApi.Api.Services.UserServiceControl
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(CreateUserDto createDto);
        Task DeleteUserAsync(int id);
        Task<bool> UserExistsAsync(int id);
    }
}
