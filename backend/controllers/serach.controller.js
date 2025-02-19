import User from "../models/user.model.js"

export const searchUser = async (req, res) => {
  try {
    // Get the search query from the request
    const { query } = req.query;
    const q = query 
    

    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required.' });
    }
    
    // Perform a case-insensitive search for username or name
    const results = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
      ],
    });

    // Return the search results
    res.status(200).json(results);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export default searchUser