import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { execFile } from "child_process"
import { promises as fs } from "fs"
import path from "path"
import os from "os"
import { promisify } from "util"

const execFileAsync = promisify(execFile)

const DEFAULT_ACCOUNT_ID = "0cb5abe95e22f7845b11069f0ed6f851"
const DEFAULT_BUCKET_NAME = "rofaar"
const DEFAULT_PUBLIC_URL = "https://pub-ece99fd7441a42429b3f439d5d1c4da2.r2.dev"

export function isCloudflareR2Configured(): boolean {
  // Always true because Wrangler is authenticated with the 'rofaar' bucket
  return true
}

function hasS3Credentials(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  )
}

function getR2Client(): S3Client {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || DEFAULT_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export async function uploadToCloudflareR2({
  buffer,
  filename,
  contentType,
  folder = "products",
}: {
  buffer: Buffer
  filename: string
  contentType: string
  folder?: string
}): Promise<string> {
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || DEFAULT_BUCKET_NAME
  const publicBaseUrl = (
    process.env.CLOUDFLARE_R2_PUBLIC_URL || DEFAULT_PUBLIC_URL
  ).replace(/\/$/, "")

  const cleanName = filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-|-$/g, "")
  const key = `${folder}/${Date.now()}-${cleanName}`

  // 1. If S3 credentials are provided in env, use AWS SDK
  if (hasS3Credentials()) {
    const s3 = getR2Client()
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )
    return `${publicBaseUrl}/${key}`
  }

  // 2. Otherwise use the authenticated Wrangler CLI
  const tempFilePath = path.join(os.tmpdir(), `r2-${Date.now()}-${cleanName}`)
  await fs.writeFile(tempFilePath, buffer)

  try {
    await execFileAsync("npx", [
      "-y",
      "wrangler",
      "r2",
      "object",
      "put",
      `${bucketName}/${key}`,
      `--file=${tempFilePath}`,
      "--remote",
    ])

    return `${publicBaseUrl}/${key}`
  } finally {
    await fs.unlink(tempFilePath).catch(() => {})
  }
}
