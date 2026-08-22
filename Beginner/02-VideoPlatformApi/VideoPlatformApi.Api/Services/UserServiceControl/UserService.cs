using AutoMapper;
using VideoPlatformApi.Api.DTOs;
using VideoPlatformApi.Api.Models;
using VideoPlatformApi.Api.Repositories.UserRepo;
using VideoPlatformApi.Api.Services.FileServiceControl;

namespace VideoPlatformApi.Api.Services.UserServiceControl
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IFileService fileService, IMapper mapper)
        {
            _userRepository = userRepository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createDto)
        {
            // 1. نتأكد من عدم وجود بريد إلكتروني مكرر
            var existingUser = await _userRepository.GetByEmailAsync(createDto.Email);
            if (existingUser != null)
                throw new ArgumentException($"البريد الإلكتروني {createDto.Email} مستخدم بالفعل");

            // 2. نحفظ صورة المستخدم (لو موجودة)
            string? profilePictureUrl = null;
            if (createDto.ProfilePicture != null)
            {
                profilePictureUrl = await _fileService.SaveImageAsync(createDto.ProfilePicture, 300);
            }

            // 3. ننشئ المستخدم
            var user = new User
            {
                Username = createDto.Username,
                Email = createDto.Email,
                ProfilePictureUrl = profilePictureUrl,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"المستخدم بـ ID {id} غير موجود");

            // نحذف صورة المستخدم (لو موجودة)
            if (!string.IsNullOrEmpty(user.ProfilePictureUrl))
                await _fileService.DeleteFileAsync(user.ProfilePictureUrl);

            await _userRepository.DeleteAsync(id);
            await _userRepository.SaveChangesAsync();
        }

        public async Task<bool> UserExistsAsync(int id)
        {
            return await _userRepository.ExistsAsync(id);
        }
    }
}
