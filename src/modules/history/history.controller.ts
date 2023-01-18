import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CodeMessage } from 'src/common/constants/code-message';
import { Permissions } from 'src/decorators/permission.decorator';
import { ErrorException } from 'src/exceptions/error.exception';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { HistoryCreateDto } from './dto/history-data.dto';
import { HistoryDto } from './dto/history.dto';
import { HistoryService } from './history.service';

@Controller('history')
@ApiTags('history')
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()

export class HistoryController {
  constructor(
    private historyService: HistoryService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('DOCTOR')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Create history after status booking = DONE',
    type: HistoryDto,
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/prescription',
      filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const extName = extname(file.originalname);
        const randomName = Array(4)
          .fill(4)
          .map(() => Math.floor(Math.random() * 10).toString(10))
          .join('')
        callback(null, `${name}-${randomName}${extName}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      const mimetypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
      ];
      if (!mimetypes.includes(file.mimetype)) {
        return callback(
          new ErrorException(
            HttpStatus.BAD_REQUEST,
            CodeMessage.ONLY_FILE_DOC_DOCX_PDF,
          ),
          false,
        );
      }
      callback(null, true);
    }
  }))
  async createHistory(
    @Body() historyCreateDto: HistoryCreateDto,
    @UploadedFile() file
  ): Promise<HistoryDto> {
    const history = await this.historyService.createHistory(historyCreateDto, file);
    return history;
  }
}