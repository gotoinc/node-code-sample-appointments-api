import Multer from 'multer';
import { IServiceResponse } from 'src/common/service-response';
export const MinioServiceSymbol = Symbol('MINIO_SERVICE');

export interface IMinioService {
  uploadFile(
    bucket: string,
    key: string,
    body: Multer.File,
    mimetype: string,
  ): Promise<IServiceResponse<any>>;

  getFile(bucket: string, key: string): Promise<IServiceResponse<any>>;

  deleteFile(bucket: string, key: string): Promise<IServiceResponse<string>>;
}
