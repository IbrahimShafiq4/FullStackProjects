using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Auth
{
    public record RegisterRequest   (string FullName, string Email, string Password);
    public record LoginRequest      (string Email, string Password);
    public record AuthResponse      (string Id, string FullName, string Email);
}
