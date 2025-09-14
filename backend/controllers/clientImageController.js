const User = require('../models/user');

const uploadClientImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;

    // convert image to buffer
    const imageBuffer = req.file.buffer;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: imageBuffer },
      { new: true }
    );

    res.json({
      message: 'Image uploaded successfully',
      avatar: `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

const getClientImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.avatar) {
      return res.status(404).json({ message: 'No image found' });
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    console.error('Image fetch error:', error);
    res.status(500).json({ message: 'Could not fetch image' });
  }
};

module.exports = { uploadClientImage, getClientImage };
