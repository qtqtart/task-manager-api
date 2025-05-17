import { ReadStream } from "fs";

export const validateFileFormat = (
  filename: string,
  allowedFormats: string[],
) => {
  const fileParts = filename.split(".");
  const format = fileParts[fileParts.length - 1];
  return allowedFormats.includes(format);
};

export const validateFileSize = async (
  fileStream: ReadStream,
  allowedSize: number,
) => {
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
};
