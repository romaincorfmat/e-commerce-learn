"use server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000, // Set timeout to 60 seconds
});

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("upload image function triggered");
    console.log("Uploading file to Cloudinary:", file.name);

    // Check file size
    const fileSizeInMB = buffer.length / (1024 * 1024);
    if (fileSizeInMB > 10) {
      throw new Error(
        `File size too large: ${fileSizeInMB.toFixed(
          2
        )}MB. Maximum size is 10MB.`
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          timeout: 60000, // Set timeout for this specific upload
        },
        (error, result) => {
          if (error) {
            console.log("Error uploading image to Cloudinary", error);
            reject(error);
          } else {
            console.log("Image uploaded successfully:", result?.secure_url);
            resolve(result?.secure_url || ""); // Return the secure URL of the uploaded image
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Error in uploadImage function:", error);
    throw error;
  }
};
