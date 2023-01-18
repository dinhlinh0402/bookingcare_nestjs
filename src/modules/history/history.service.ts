import { HttpStatus, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { BookingStatus } from 'src/common/constants/booking.enum';
import { CodeMessage } from 'src/common/constants/code-message';
import { IFile } from 'src/common/interfaces/file.interface';
import { ErrorException } from 'src/exceptions/error.exception';
import baseURL from 'src/utils/baseUrl';
import { sendMail } from 'src/utils/sendMail.util';
import { BookingRepository } from '../bookings/booking.repository';
import { HistoryCreateDto } from './dto/history-data.dto';
import { HistoryDto } from './dto/history.dto';
import { HistoryRepository } from './history.repository';
import { sendPrescriptionSubject, sendPrescriptionTemplate } from './mail.template';

@Injectable()
export class HistoryService {
  constructor(
    public readonly bookingRepo: BookingRepository,
    public readonly historyRepo: HistoryRepository,
  ) { }

  async createHistory(historyData: HistoryCreateDto, file: IFile): Promise<HistoryDto> {
    if (!file) {
      new ErrorException(
        HttpStatus.BAD_REQUEST,
        CodeMessage.FILE_IS_NOT_EMPTY,
      )
    }

    const bookinged = await this.bookingRepo.findOne({
      where: {
        id: historyData.bookingId,
      },
      relations: ['schedule'],
    })

    if (!bookinged) {
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        CodeMessage.BOOKING_NOT_EXIST,
      )
    }

    console.log('booking: ', bookinged);

    if (bookinged.status !== BookingStatus.CONFIRMED) {
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        CodeMessage.BOOKING_NOT_CONFIRMED,
      )
    }

    const history = this.historyRepo.create({
      doctorNote: historyData.doctorNote,
      prescription: file.path,
    })

    const saveHistory = await this.historyRepo.save(history);
    await this.bookingRepo.save({
      ...bookinged,
      status: BookingStatus.DONE,
      history: history,
    });

    if (saveHistory) {
      const time = `${format(bookinged?.schedule?.timeStart, 'HH:mm')} - ${format(bookinged?.schedule?.timeEnd, 'HH:mm')}`;
      const date = format(bookinged?.schedule?.timeStart, 'dd/MM/yyyy');
      const mailContent = sendPrescriptionTemplate(
        historyData.namePatient,
        time,
        date,
      );
      const attachments = {
        fileName: `Don_Thuoc_${file.fieldname}`,
        link: `${baseURL}${file.path}`
        // link: `http://14.225.255.59:8000/uploads/prescription/BS-NodeJs-Dev-TTS-7950.docx`
      }
      try {
        await sendMail(historyData.email, sendPrescriptionSubject, mailContent, attachments);
      } catch (error) {
        console.log('error: ', error);
        throw new ErrorException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          CodeMessage.CAN_NOT_SEND_MAIL_TO_USER,
        );
      }
    }

    return history;
  }
}