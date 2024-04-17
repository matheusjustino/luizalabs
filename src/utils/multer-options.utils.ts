import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// TYPES
import { ValidMimeType } from './valid-mime-type.utils';

const validMimeTypes: ValidMimeType[] = ['text/plain'];

export const multerOptions: MulterOptions = {
	fileFilter: (req, file, cb) => {
		if (!file) cb(new BadRequestException(`No file content`), false);

		const validFile = validMimeTypes.filter(
			(type) => file.mimetype === type,
		);

		validFile.length
			? cb(null, true)
			: cb(
					new BadRequestException(
						`Arquivo Inválido. Extensões permitidas: ${validMimeTypes}`,
					),
					false,
				);
	},
	limits: {
		files: 1,
	},
};
