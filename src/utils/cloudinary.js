import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
       path: "./.env",
       localFirst: true,
});

cloudinary.config({
       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
       api_key: process.env.CLOUDINARY_API_KEY,
       api_secret: process.env.CLOUDINARY_API_SECRET,
       secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
       try {
              if (!localFilePath) return null;

              // upload the file on cloudinary

              const response = await cloudinary.uploader.upload(localFilePath, {
                     resource_type: "auto",
              });

              // file has been uploaded successfully
              // console.log("File is uploaded on cloudinary", response);

              fs.unlinkSync(localFilePath); // Remove the locally stored temp file after successful upload

              return response;
       } catch (error) {
              fs.unlinkSync(localFilePath); // Remove the locally stored temp file if the upload fails

              console.log("Error in uploading on cloudinary", error);

              return null;
       }
};

const deleteOldImage = async (publicId) => {
       try {
              await cloudinary.uploader.destroy(publicId);
       } catch (error) {
              console.log("Error in deleting old image from cloudinary", error);
       }
};

export { uploadOnCloudinary, deleteOldImage };
