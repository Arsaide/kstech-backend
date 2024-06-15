import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  name: string;
  password: string;
}
export class RegisterDto {
  @IsString()
  name: string;
  password: string;
}
