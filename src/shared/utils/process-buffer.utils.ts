import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import sharp from "sharp";

import { getBuffer } from "./get-buffer.utils";

export const processBuffer = async (file: FileUpload) => {
  const buffer = await getBuffer(file);
  const processedBuffer = await sharp(buffer)
    .resize(512, 512)
    .webp()
    .toBuffer();
  return { buffer: processedBuffer, minetype: "image/webp" };
};
