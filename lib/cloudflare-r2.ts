import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"


export function isCloudflareR2Configured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim() &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim()
  )
}

function getR2Client(): S3Client {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID!
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
  if (!isCloudflareR2Configured()) {
    throw new Error(
      "Cloudflare R2 credentials (CLOUDFLARE_R2_ACCESS_KEY_ID and CLOUDFLARE_R2_SECRET_ACCESS_KEY) are not set."
    )
  }

  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL!
    .replace(/\/$/, "")

  const cleanName = filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-|-$/g, "")
  const key = `${folder}/${Date.now()}-${cleanName}`

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
