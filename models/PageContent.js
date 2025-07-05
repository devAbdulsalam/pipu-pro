import mongoose, { Schema } from 'mongoose';

const PageContentSchema = new Schema(
	{
		name: { type: String, unique: true, required: true },
		sections: [
			{
				sectionName: { type: String, required: true },
				contents: [
					{
						heading: { type: String, required: true },
						subHeading: { type: String },
						type: { type: String },
						status: {
							type: String,
							enum: ['active', 'inactive'],
							default: 'active',
						},
					},
				],
			},
		],
	},
	{ timestamps: true }
);

const PageContent = mongoose.model('PageContent', PageContentSchema);
export default PageContent;
