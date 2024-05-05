const v2 = require("cloudinary");
const fs = require("fs");

v2.config({
   cloud_name: "doxmrrizw",
   api_key: "438652911353886",
   api_secret: "VV8TXoLfXGj84fCa2w5gPcLFhyU",
});
const uploadOnCloudinary = async (localFilePath) => {
   try {
      if (!localFilePath) return null;
      //upload the file on cloudinary
      const response = await v2.uploader.upload(localFilePath, {
         resource_type: "auto",
      });
      // file has been uploaded successfull
      //console.log("file is uploaded on cloudinary ", response.url);
      fs.unlinkSync(localFilePath);
      return response;
   } catch (error) {
      fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
      return null;
   }
};
module.exports = uploadOnCloudinary;
