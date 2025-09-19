import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null; // ✅ prevents undefined crash
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        // console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        console.log("uploaded on cloudinary and deleted");
        console.log("Deleting file:", localFilePath);


        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload process failed
        console.log(error);
        console.log("not uploaded on cloudinary and deleted");
        console.log("Deleting file:", localFilePath);

        return null
    };
}
export { uploadOnCloudinary }