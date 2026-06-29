"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOCUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(base64String: string): Promise<string> {
  try {
    const res = await cloudinary.uploader.upload(base64String, {
      folder: "jq-works-portfolio",
    });
    return res.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Gagal mengunggah gambar ke Cloudinary");
  }
}