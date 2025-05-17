import { ReadStream } from "fs";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";

export const getBuffer = async (file: FileUpload) => {
  const buffer: Uint8Array[] = [];
  for await (const chunk of file.createReadStream() as ReadStream) {
    buffer.push(chunk);
  }
  return Buffer.concat(buffer);
};
