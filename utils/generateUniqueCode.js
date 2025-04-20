import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

export const generateUniqueCode = async (Model) => {
	let code;
	let isUnique = false;

	while (!isUnique) {
		code = nanoid();
		const existing = await Model.findOne({ code });
		if (!existing) isUnique = true;
	}

	return code;
};
