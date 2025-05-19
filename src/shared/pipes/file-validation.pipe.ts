import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ReadStream } from "fs";
import Upload from "graphql-upload/Upload.mjs";
@Injectable()
export class FileValidationPipe implements PipeTransform {
  public async transform(uploadPromise: Promise<Upload>) {
    const upload = await uploadPromise;
    console.log(uploadPromise);
    if (!upload?.file) {
      return;
    }

    const { file } = upload;
    const isValidFileFormat = this.validateFileFormat(file.filename, [
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
    const isFileSizeValid = await this.validateFileSize(
      fileStream,
      10 * 1024 * 1024,
    );
    if (!isFileSizeValid) {
      throw new BadRequestException("invalid file size");
    }

    return file;
  }

  private validateFileFormat(filename: string, allowedFormats: string[]) {
    const fileParts = filename.split(".");
    const format = fileParts[fileParts.length - 1];
    return allowedFormats.includes(format);
  }
  private async validateFileSize(fileStream: ReadStream, allowedSize: number) {
    return new Promise((resolve, reject) => {
      let fileSizeInBytes = 0;
      fileStream
        .on("data", (data: Buffer) => {
          fileSizeInBytes = data.byteLength;
        })
        .on("end", () => {
          resolve(fileSizeInBytes <= allowedSize);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }
}
