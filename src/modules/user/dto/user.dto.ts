import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RoleEnum } from "../../../common/constants/role";
import { GenderEnum } from "../../../common/constants/gender";
import { AbstractDto } from "../../../common/dto/abstract.dto";
import { UserEntity } from "../user.entity";
import { SpecialtyDto } from "src/modules/specialty/dto/specialty.dto";
import { ClinicDto } from "src/modules/clinic/dto/clinic.dto";
import { DoctorInforDto } from "src/modules/doctor-infor/dto/doctor-infor.dto";

export class UserDto extends AbstractDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    middleName: string;

    @ApiPropertyOptional()
    lastName: string;

    @ApiPropertyOptional({ type: 'emun', enum: GenderEnum })
    gender: string;

    @ApiPropertyOptional()
    birthday: Date;

    @ApiPropertyOptional()
    birthPlace: string;

    @ApiPropertyOptional()
    nation: string;

    @ApiPropertyOptional()
    religion: string;

    @ApiPropertyOptional()
    identityCardNumber: string;

    @ApiPropertyOptional()
    identityCardDate: Date;

    @ApiPropertyOptional()
    identityCardPlace: string;

    @ApiPropertyOptional()
    address: string;

    @ApiPropertyOptional()
    phoneNumber: string;

    @ApiPropertyOptional({ type: 'emun', enum: RoleEnum })
    role: RoleEnum;

    @ApiPropertyOptional()
    avatar: string;

    @ApiPropertyOptional()
    status: boolean;

    @ApiPropertyOptional({ type: () => ClinicDto })
    clinic: ClinicDto;

    @ApiPropertyOptional({ type: () => SpecialtyDto })
    specialty: SpecialtyDto;

    @ApiPropertyOptional({ type: () => DoctorInforDto })
    doctorInfor: DoctorInforDto;

    @ApiPropertyOptional({ type: () => UserDto })
    creator: UserDto;


    constructor(entity: UserEntity) {
        super(entity);

        this.email = entity.email;
        this.firstName = entity.firstName;
        this.middleName = entity.middleName;
        this.lastName = entity.lastName;
        this.gender = entity.gender;
        this.address = entity.address;
        this.phoneNumber = entity.phoneNumber;
        this.gender = entity.gender;
        this.birthday = entity.birthday;
        this.avatar = entity.avatar;
        this.status = entity.status;
        this.nation = entity.nation;
        this.religion = entity.religion;
        this.role = entity.role;
        this.identityCardNumber = entity.identityCardNumber;
        this.identityCardDate = entity.identityCardDate;
        this.identityCardPlace = entity.identityCardPlace;

        if (entity.creator) {
            this.creator = entity.creator;
        }

        if (entity.doctorInfor) {
            this.doctorInfor = entity.doctorInfor;
        }

        if (entity.specialty) {
            this.specialty = entity.specialty;
        }

        if (entity.clinic) {
            this.clinic = entity.clinic;
        }

    }
}