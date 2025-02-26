import { GoneException, Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier'

@Injectable()
export class FileUploadService {
    
    getPublicIdFromUrl(url: string) {
        const parts = url.split("/");
        const fileName = parts.pop()?.split('.')[0] // getting the file name and removing the extensions (eg. jpg, jpeg and png)
        const folderPath = parts.slice(parts.indexOf('upload') + 2).join("/")
        const pulicId = folderPath ? `${folderPath}/${fileName}` : fileName || "";

        return pulicId
    }

    async upload(file: Express.Multer.File, options?: UploadApiOptions): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto', ...options },
                (error, result) => {
                    if(error) return reject(error);
                    resolve(result as UploadApiResponse);
                }
            )

            streamifier.createReadStream(file.buffer).pipe(uploadStream)
        }) 
    }

    // implement later when upload is tested to get the publidId for url
    async deleteFile(fileUrl: string) {
        const publicId = this.getPublicIdFromUrl(fileUrl);

        const deleteResult = await cloudinary.uploader.destroy(publicId).catch(
            (error) => console.log(error) // just log and ignore the error i does not really doe anythign
        )

        return deleteResult;
    }
}
