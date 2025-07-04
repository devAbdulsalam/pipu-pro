import PageContent from '../models/PageContent.js';

export const getPageContents = async (req, res) => {
	try {
		const content = await PageContent.find();
		res.status(200).json(content);
	} catch (error) {
		console.error('Error getting PageContent:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getActivePageContent = async (req, res) => {
	try {
		const content = await PageContent.find();
		res.status(200).json(content);
	} catch (error) {
		console.error('Error getting PageContents:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const addPage = async (req, res) => {
	try {
		const { name, sections } = req.body;
		if (!name) {
			return res.status(400).json({ message: 'Name is required' });
		}
		const page = await PageContent.create({ name, sections });
		res.status(200).json(page);
	} catch (error) {
		console.error('Error creating PageContents:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const addPageContent = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedPageContent = await PageContent.findByIdAndUpdate(
			id,
			{ ...req.body },
			{ new: true, runValidators: true }
		);
		if (!updatedPageContent) {
			return res.status(404).json({ message: 'Page content not found' });
		}
		res.status(200).json(updatedPageContent);
	} catch (error) {
		console.error('Error updating page content:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const deletePage = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedPageContent = await PageContent.findByIdAndDelete(id);
		if (!deletedPageContent) {
			return res.status(404).json({ message: 'Page content not found' });
		}
		res.status(200).json({ message: 'Page content deleted successfully' });
	} catch (error) {
		console.error('Error deleting page content:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const deletePageContent = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedPageContent = await PageContent.findByIdAndDelete(id);
		if (!deletedPageContent) {
			return res.status(404).json({ message: 'Page content not found' });
		}
		res.status(200).json({ message: 'Page content deleted successfully' });
	} catch (error) {
		console.error('Error deleting page content:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
