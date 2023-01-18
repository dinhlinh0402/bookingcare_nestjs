import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class HistoryCreateDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  doctorNote: string;

  @IsUUID('4')
  @IsNotEmpty()
  // @IsOptional()
  @ApiProperty()
  bookingId: string;

  @IsEmail()
  @IsNotEmpty()
  // @IsOptional()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  // @IsOptional()
  @ApiProperty()
  namePatient: string;
}