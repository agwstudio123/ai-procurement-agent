import crypto from "crypto";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const publicKey = fs.readFileSync("public.pem", "utf8");
const entitySecret = process.env.CIRCLE_ENTITY_SECRET;

const encrypted = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  Buffer.from(entitySecret)
);

console.log("\nEncrypted Entity Secret:\n");
console.log(encrypted.toString("base64"));