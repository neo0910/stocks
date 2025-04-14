import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Should be a correct email string' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password length should not be less than 8' })
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
