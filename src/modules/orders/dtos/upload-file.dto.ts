import { IsNotEmpty } from 'class-validator';

export class UploadFileDTO {
	@IsNotEmpty()
	public file: Express.Multer.File;
}
