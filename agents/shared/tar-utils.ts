import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import * as zlib from "zlib";

/* ------------------------------------------------------------------ */
/*  Tar Entry                                                          */
/* ------------------------------------------------------------------ */

export interface TarEntry {
  path: string;
  content: Buffer;
}

/* ------------------------------------------------------------------ */
/*  Tar Archive Builder                                                */
/* ------------------------------------------------------------------ */

/**
 * Build a minimal tar archive from a map of file paths to contents.
 *
 * Uses the POSIX ustar format. Each file entry consists of a 512-byte
 * header followed by the file content padded to a 512-byte boundary.
 * The archive ends with two 512-byte zero blocks.
 */
export function buildTarBuffer(files: Record<string, string>): Buffer {
  const blocks: Buffer[] = [];

  for (const [filePath, content] of Object.entries(files)) {
    const contentBuf = Buffer.from(content, "utf-8");
    const size = contentBuf.length;

    // Build 512-byte tar header
    const header = Buffer.alloc(512, 0);

    // File name (100 bytes)
    header.write(filePath, 0, Math.min(filePath.length, 100), "utf-8");

    // File mode (8 bytes) — 0644
    header.write("0000644\0", 100, 8, "utf-8");

    // Owner/group UID/GID (8+8 bytes)
    header.write("0000000\0", 108, 8, "utf-8");
    header.write("0000000\0", 116, 8, "utf-8");

    // File size in octal (12 bytes)
    header.write(size.toString(8).padStart(11, "0") + "\0", 124, 12, "utf-8");

    // Modification time (12 bytes)
    const mtime = Math.floor(Date.now() / 1000);
    header.write(mtime.toString(8).padStart(11, "0") + "\0", 136, 12, "utf-8");

    // Checksum placeholder (8 bytes of spaces)
    header.write("        ", 148, 8, "utf-8");

    // Type flag: '0' = regular file
    header.write("0", 156, 1, "utf-8");

    // USTAR indicator
    header.write("ustar\0", 257, 6, "utf-8");
    header.write("00", 263, 2, "utf-8");

    // Compute checksum (sum of all bytes in header treated as unsigned)
    let checksum = 0;
    for (let i = 0; i < 512; i++) {
      checksum += header[i];
    }
    header.write(
      checksum.toString(8).padStart(6, "0") + "\0 ",
      148,
      8,
      "utf-8",
    );

    blocks.push(header);

    // File content padded to 512-byte boundary
    const paddedSize = Math.ceil(size / 512) * 512;
    const contentBlock = Buffer.alloc(paddedSize, 0);
    contentBuf.copy(contentBlock);
    blocks.push(contentBlock);
  }

  // Two 512-byte zero blocks to end the archive
  blocks.push(Buffer.alloc(1024, 0));

  return Buffer.concat(blocks);
}

/* ------------------------------------------------------------------ */
/*  Tar Extraction                                                     */
/* ------------------------------------------------------------------ */

/**
 * Parse a tar buffer into an array of file entries.
 *
 * Reads POSIX ustar headers: 100 bytes for name, size at offset 124
 * (12 bytes octal), type flag at offset 156. Skips non-regular files.
 */
export function extractTar(tarBuffer: Buffer): TarEntry[] {
  const entries: TarEntry[] = [];
  let offset = 0;

  while (offset + 512 <= tarBuffer.length) {
    const header = tarBuffer.subarray(offset, offset + 512);

    // Check for end-of-archive (two zero blocks)
    if (header.every((b) => b === 0)) {
      break;
    }

    // Extract file name (first 100 bytes, null-terminated)
    const nameEnd = header.indexOf(0, 0);
    const name = header
      .subarray(0, nameEnd > 0 && nameEnd < 100 ? nameEnd : 100)
      .toString("utf-8");

    // Extract size (offset 124, 12 bytes octal, null-terminated)
    const sizeStr = header.subarray(124, 136).toString("utf-8").trim();
    const size = parseInt(sizeStr, 8) || 0;

    // Type flag at offset 156: '0' or '\0' = regular file
    const typeFlag = header[156];
    const isRegularFile = typeFlag === 0x30 || typeFlag === 0x00;

    offset += 512; // Move past header

    if (isRegularFile && size > 0 && name.length > 0) {
      const content = Buffer.from(tarBuffer.subarray(offset, offset + size));
      entries.push({ path: name, content });
    }

    // Advance past content (padded to 512-byte boundary)
    offset += Math.ceil(size / 512) * 512;
  }

  return entries;
}

/* ------------------------------------------------------------------ */
/*  S3 Fetch                                                           */
/* ------------------------------------------------------------------ */

/**
 * Download the assembled site archive from S3, decompress the tar.gz,
 * and return a map of file paths to their text content.
 */
export async function fetchAssembledFiles(
  s3: S3Client,
  s3Key: string,
  s3Bucket: string,
): Promise<Record<string, string>> {
  const s3Response = await s3.send(
    new GetObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
    }),
  );

  if (!s3Response.Body) {
    throw new Error(`S3 object ${s3Key} has no body`);
  }

  const gzBuffer = Buffer.from(await s3Response.Body.transformToByteArray());
  const tarBuffer = zlib.gunzipSync(gzBuffer);
  const entries = extractTar(tarBuffer);

  const files: Record<string, string> = {};
  for (const entry of entries) {
    files[entry.path] = entry.content.toString("utf-8");
  }

  return files;
}
