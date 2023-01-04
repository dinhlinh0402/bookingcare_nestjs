import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { BookingsService } from './booking.service';
import { BookingCreateDto, BookingUpdateDto, ConfirmBookingDto } from './dto/booking-data.dto';
import { BookingPageDto, BookingPageOptionsDto } from './dto/booking-page.dto';
import { BookingDto } from './dto/booking.dto';

@Controller('bookings')
@ApiTags('bookings')
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()

// Tạm thời sẽ chỉ cho user đã đăng nhập được phép booking.
export class BookingssController {
    constructor(
        private bookingsService: BookingsService,
    ) { }



    @Post()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('user')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Create booking for user',
        type: BookingDto,
    })
    async createBooking(
        @Body() bookingCreateDto: BookingCreateDto
    ) {
        const bookAppointment = await this.bookingsService.createBooking(bookingCreateDto);
        return bookAppointment.toDto();
    }


    @Put(':bookingId')
    @UseGuards(JwtAuthGuard)
    @Permissions('user')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Update booking by user',
        type: BookingDto,
    })
    async updateBooking(
        @Body() bookingUpdateDto: BookingUpdateDto,
        @Param('bookingId') bookingId: string,
    ) {

    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic', 'HEAD_OF_DOCTOR', 'DOCTOR', 'USER')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'get bookings',
        type: BookingPageDto
    })
    async getBookings(
        @Query(new ValidationPipe({ transform: true }))
        bookingPageOptionsDto: BookingPageOptionsDto
    ) {
        return this.bookingsService.getBookings(bookingPageOptionsDto);
    }

    @Get(':bookingId')
    @UseGuards(JwtAuthGuard)
    @Permissions('admin', 'manager_clinic', 'HEAD_OF_DOCTOR', 'DOCTOR', 'USER')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Get booking by id',
        type: BookingDto,
    })
    async getBookingById(
        @Param('bookingId') bookingId: string,
    ) {
        const booking = await this.bookingsService.getBookingById(bookingId);
        return booking.toDto();
    }

    @Delete(':bookingId')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'user')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Delete booking successfully',
        type: Boolean,
    })
    async deleteBooking(
        @Param('bookingId') bookingId: string
    ) {

    }

    @Post('confirm-booking-appoinment')
    @HttpCode(HttpStatus.OK)
    async confirmBooking(
        @Body() confirmBookingDto: ConfirmBookingDto
    ) {

    }

}
