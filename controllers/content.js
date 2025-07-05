import PageContent from '../models/PageContent.js';
import axios from 'axios';

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
		const isPage = await PageContent.findOne({ name });
		if (isPage) {
			return res.status(400).json({ message: 'Page already exists' });
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
export const getPageByName = async (req, res) => {
	try {
		const { name } = req.params;
		const page = await PageContent.findOne({ name });
		if (!page) {
			return res.status(400).json({ message: 'Page with name not found!' });
		}
		res.status(200).json(page);
	} catch (error) {
		console.error('Error getting PageContents:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getPageById = async (req, res) => {
	try {
		const { id } = req.params;
		const page = await PageContent.findOne({ _id: id });
		if (!page) {
			return res.status(400).json({ message: 'Page not found!' });
		}
		res.status(200).json(page);
	} catch (error) {
		console.error('Error getting PageContents:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const updatePageContent = async (req, res) => {
	try {
		const { pageId } = req.body;
		const updatedPageContent = await PageContent.findByIdAndUpdate(
			pageId,
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
export const addPageContent = async (req, res) => {
	try {
		const { id } = req.params;
		const { sectionId, heading, subHeading, type, status } = req.body;

		if (!sectionId || !heading) {
			return res.status(400).json({ message: 'Required fields are missing.' });
		}

		// Find the page content document
		const pageContent = await PageContent.findById(id);
		if (!pageContent) {
			return res.status(404).json({ message: 'Page content not found.' });
		}

		// Find the section
		const section = pageContent.sections.id(sectionId);
		if (!section) {
			return res.status(404).json({ message: 'Section not found.' });
		}

		// Add new content
		section.contents.push({
			heading,
			subHeading,
			type,
			status,
		});

		// Save
		await pageContent.save();

		res
			.status(200)
			.json({ message: 'Content added successfully.', pageContent });
	} catch (error) {
		console.error('Error adding content:', error);
		res
			.status(500)
			.json({ message: 'Internal server error', error: error.message });
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
