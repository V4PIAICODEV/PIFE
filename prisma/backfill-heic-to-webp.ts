import convertHeic from "heic-convert";
import sharp from "sharp";
import { PrismaClient } from "../lib/generated/prisma";
import { minioClient } from "../lib/minio";

const prisma = new PrismaClient();

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "";

function makeConsoleUrl(objectName: string): string {
  return `https://console-cach-minio.azbujd.easypanel.host/api/v1/buckets/${BUCKET_NAME}/objects/download?preview=true&prefix=${encodeURIComponent(
    objectName
  )}`;
}

async function convertObject(key: string): Promise<{ newKey: string } | null> {
  if (!key.toLowerCase().endsWith(".heic")) return null;
  const base = key.replace(/\.[^.]+$/, "");
  const newKey = `${base}.webp`;

  // Skip if target already exists
  try {
    await minioClient.statObject(BUCKET_NAME, newKey);
    return { newKey };
  } catch (_) {}

  const stream = await minioClient.getObject(BUCKET_NAME, key);
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    stream.on("data", (c: Buffer) => chunks.push(c));
    stream.on("end", resolve);
    stream.on("error", reject);
  });
  const buf = Buffer.concat(chunks);
  let webp: Buffer;
  try {
    webp = await sharp(buf).toFormat("webp").toBuffer();
  } catch (_) {
    // Fallback: use heic-convert (WASM) to JPEG, then to WebP for size
    const jpegBuf = (await convertHeic({
      buffer: buf,
      format: "JPEG",
      quality: 0.9,
    })) as Buffer;
    webp = await sharp(jpegBuf).toFormat("webp").toBuffer();
  }

  await minioClient.putObject(BUCKET_NAME, newKey, webp, webp.length, {
    "Content-Type": "image/webp",
  });
  return { newKey };
}

async function updateDbUrls(oldKey: string, newKey: string) {
  const oldUrl = makeConsoleUrl(oldKey);
  const newUrl = makeConsoleUrl(newKey);

  await prisma.$transaction([
    prisma.usuario.updateMany({
      where: { image: { contains: oldKey } },
      data: { image: newUrl },
    }),
    prisma.checkinPife.updateMany({
      where: { image: { contains: oldKey } },
      data: { image: newUrl },
    }),
    prisma.acelerarOi.updateMany({
      where: { image: { contains: oldKey } },
      data: { image: newUrl },
    }),
  ]);
}

async function main() {
  const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
  const removeOriginals =
    process.env.REMOVE_ORIGINALS === "1" ||
    process.env.REMOVE_ORIGINALS === "true";

  console.log("🔍 Procurando objetos .heic no bucket:", BUCKET_NAME);

  const heicKeys: string[] = [];
  const objectsStream = minioClient.listObjectsV2(BUCKET_NAME, "", true);
  await new Promise<void>((resolve, reject) => {
    objectsStream.on("data", (obj: any) => {
      if (obj.name && obj.name.toLowerCase().endsWith(".heic")) {
        heicKeys.push(obj.name);
      }
    });
    objectsStream.on("end", resolve);
    objectsStream.on("error", reject);
  });

  console.log(`Encontrados ${heicKeys.length} arquivos HEIC.`);

  for (const key of heicKeys) {
    console.log("→ Convertendo:", key);
    if (dryRun) continue;

    const res = await convertObject(key);
    if (res?.newKey) {
      await updateDbUrls(key, res.newKey);
      if (removeOriginals) {
        try {
          await minioClient.removeObject(BUCKET_NAME, key);
          console.log("   🧹 Removido original:", key);
        } catch (e) {
          console.warn("   ⚠️  Falha ao remover original:", key, e);
        }
      }
    }
  }

  console.log("✅ Backfill concluído.");
}

main()
  .catch((e) => {
    console.error("❌ Erro no backfill:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
