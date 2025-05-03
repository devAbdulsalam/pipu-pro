import mongoose from 'mongoose';
const BoardSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		BoardId: {
			type: String,
			required: true,
			unique: true,
		},
		members: {
			type: Number,
		},
		participants: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'User',
		},
		host: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

const Board = mongoose.model('Board', BoardSchema);

export default Board;
