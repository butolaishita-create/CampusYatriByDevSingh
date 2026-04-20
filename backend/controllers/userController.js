const User = require('../models/User');

// @GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, college } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (college !== undefined) user.college = college;

    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, college: user.college, rating: user.rating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @POST /api/users/:id/rate
const rateUser = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const totalRating = user.rating * user.ratingCount + rating;
    user.ratingCount += 1;
    user.rating = totalRating / user.ratingCount;
    await user.save();

    res.json({ message: 'Rating submitted', rating: user.rating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserById, updateProfile, rateUser };
