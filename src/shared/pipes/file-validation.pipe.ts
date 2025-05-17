import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import {
  validateFileFormat,
  validateFileSize,
} from "@shared/utils/validate-file.utils";
import { ReadStream } from "fs";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";

@Injectable()
export class FileValidationPipe implements PipeTransform {
  public async transform(file: FileUpload) {
    if (!file.filename) {
      throw new BadRequestException("invalid file name");
    }

    const isValidFileFormat = validateFileFormat(file.filename, [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
    ]);
    if (!isValidFileFormat) {
      throw new BadRequestException("invalid file extension");
    }

    const fileStream = file.createReadStream() as ReadStream;
    const isFileSizeValid = await validateFileSize(
      fileStream,
      10 * 1024 * 1024,
    );
    if (!isFileSizeValid) {
      throw new BadRequestException("invalid file size");
    }

    return file;
  }
}
