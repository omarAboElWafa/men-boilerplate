import * as Minio from 'minio';
import {  MINIO_CONFIG } from '../utils/config';

class FileUploader{
    minioClient: Minio.Client;
    bucketName: string;
    policy: object;
    constructor(){
        this.minioClient = new Minio.Client({
            endPoint: MINIO_CONFIG.endPoint,
            port: MINIO_CONFIG.port,
            useSSL: MINIO_CONFIG.useSSL,
            accessKey: MINIO_CONFIG.rootUser,
            secretKey: MINIO_CONFIG.rootPassword
        });
        this.bucketName = MINIO_CONFIG.bucketName;
        this.policy = MINIO_CONFIG.policy;
        this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(this.policy), function(err) {
            if (err) {
                return console.log(err)
            }
          
            console.log('Bucket policy set')
          });
    }
    initializeBucket = async () => {
        const bucketExists = await this.minioClient.bucketExists(this.bucketName);
        if (!bucketExists) {
          await this.minioClient.makeBucket(this.bucketName);
          console.log(`Bucket '${this.bucketName}' created successfully.`);
        }
    };

    uploadFile = async(file: Express.Multer.File, metaData: object): Promise<string> => { 
        console.log('Uploading file...');
        await this.initializeBucket();
        return new Promise((resolve, reject) => {
            // slugify file name to avoid special characters and spaces but resreving the extension
            // slugify the arabic file from arabic name to encoding name
            const fileNameSlugiFied = file.originalname.replace(/ /g, '_');
            this.minioClient.fPutObject(this.bucketName, fileNameSlugiFied, file.path, metaData, async (err, etag) => {
                if (err) {
                    console.error('Error uploading file to Minio:', err);
                    reject(err);
                } else {
                    console.log('File uploaded to Minio:', etag);
    
                    // Generate a public URL 
                    const currentTimeStamp = new Date().getTime();
                    const publicUrl = `http://${MINIO_CONFIG.publicHost}:${MINIO_CONFIG.port}/${this.bucketName}/${encodeURIComponent(fileNameSlugiFied)}-${currentTimeStamp}`;
                    console.log('Public URL:', publicUrl);
                    resolve(publicUrl);
                }
            });
        });
    }
    
}

export default FileUploader;
