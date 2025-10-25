import {
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Res,
  HttpStatus,
  HttpException,
  ValidationPipe,
  UsePipes,
  Controller,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { AvatarService } from './avatar.service';
import { GenerateAvatarDto, GetAvatarDto, ListAvatarsDto } from './dto/generate-avatar.dto';
import { GenerateAvatarV2Dto } from './dto/generate-avatar-v2.dto';
import { GenerateAvatarV3Dto } from './dto/generate-avatar-v3.dto';
import { ColorPaletteDto } from './dto/color-palette.dto';

@ApiTags('Avatar')
@Controller()
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Post('v1/generate')
  @ApiOperation({ summary: 'Generate a new avatar (API v1)' })
  @ApiResponse({ status: 201, description: 'Avatar generated successfully' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateAvatarV1(@Body() dto: GenerateAvatarDto) {
    return await this.avatarService.generateAvatar(dto);
  }

  @Post('v2/generate')
  @ApiOperation({ summary: 'Generate gradient avatar (API v2)' })
  @ApiResponse({ status: 201, description: 'Gradient avatar generated successfully' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateAvatarV2(@Body() dto: GenerateAvatarV2Dto) {
    return await this.avatarService.generateAvatarV2(dto);
  }

  @Post('v3/generate')
  @ApiOperation({ summary: 'Generate emoji avatar (API v3)' })
  @ApiResponse({ status: 201, description: 'Emoji avatar generated successfully' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateAvatarV3(@Body() dto: GenerateAvatarV3Dto) {
    return await this.avatarService.generateAvatarV3(dto);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Health status retrieved' })
  async healthCheck() {
    try {
      const health = await this.avatarService.healthCheck();
      return {
        statusCode: HttpStatus.OK,
        message: 'Health check completed',
        data: health,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'Get list of avatars with pagination' })
  @ApiQuery({
    name: 'pick',
    required: false,
    description: 'Number of records to retrieve (default: 10, max: 100)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of records to skip (default: 0)',
  })
  @ApiResponse({ status: 200, description: 'Avatar list retrieved successfully' })
  @ApiResponse({ status: 204, description: 'No avatars found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async listAvatars(@Query() dto: ListAvatarsDto, @Res() res: Response) {
    const result = await this.avatarService.listAvatars(dto);

    // Устанавливаем заголовки кеширования для списков
    res.set({
      'Cache-Control': 'public, max-age=300', // 5 минут для списков
      'Content-Type': 'application/json',
    });

    res.json(result);
  }





  @Get(':id')
  @ApiOperation({ summary: 'Get avatar by ID' })
  @ApiParam({ name: 'id', description: 'Avatar ID (UUID)' })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter to apply (grayscale, sepia, negative)',
  })
  @ApiQuery({ name: 'size', required: false, description: 'Size parameter (4-9, where 2^n)' })
  @ApiResponse({ status: 200, description: 'Avatar retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid parameters' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAvatar(@Param('id') id: string, @Query() dto: GetAvatarDto, @Res() res: Response) {
    try {
      const result = await this.avatarService.getAvatar(id, dto);

      // Генерируем ETag на основе ID и версии аватара
      const etag = `"${result.id}-${result.version}"`;

      // Проверяем If-None-Match заголовок для условного запроса
      const ifNoneMatch = res.req.headers['if-none-match'];
      if (ifNoneMatch === etag) {
        res.status(HttpStatus.NOT_MODIFIED);
        res.end();
        return;
      }

      // Отладочная информация
      // console.log(
      //   `Sending image - type: ${typeof result.image}, isBuffer: ${Buffer.isBuffer(result.image)}, length: ${result.image?.length}`,
      // );

      // Устанавливаем HTTP заголовки кеширования
      res.set({
        'Content-Type': result.contentType,
        'Content-Length': result.image.length.toString(),
        'Cache-Control': 'public, max-age=86400, immutable', // 24 часа, immutable для статических изображений
        ETag: etag,
        'Last-Modified': result.createdAt.toUTCString(),
        'X-Avatar-ID': result.id,
        'X-Created-At': result.createdAt.toISOString(),
        'X-Version': result.version,
      });

      res.send(result.image);
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        {
          statusCode: status,
          message: error.message,
        },
        status,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete avatar by ID' })
  @ApiParam({ name: 'id', description: 'Avatar ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Avatar deleted successfully' })
  async deleteAvatar(@Param('id') id: string) {
    return await this.avatarService.deleteAvatar(id);
  }
}
