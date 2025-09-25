import Multer from 'multer';
import { IServiceResponse } from 'src/common/service-response';
export const MinioServiceSymbol = Symbol('MINIO_SERVICE');

export interface IMinioService {
  uploadFile(
    key: string,
    body: Multer.File,
    mimetype: string,
  ): Promise<IServiceResponse<any>>;

  getFile(key: string): Promise<IServiceResponse<any>>;

  deleteFile(key: string): Promise<IServiceResponse<string>>;
}
