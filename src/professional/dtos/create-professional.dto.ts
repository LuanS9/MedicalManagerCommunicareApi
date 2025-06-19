import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import eProfessionalType from '../enums/professional-type.enum';

export class CreateProfessionalDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsEnum(eProfessionalType)
  type: eProfessionalType;

  @IsEmail()
  email: string;
}
