export interface RegisterDto {
    displayName: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}