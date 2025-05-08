const Locations = require("../models/Locations");
const RatingLocation = require("../models/RatingLocation");

// GET /api/locations hoặc /api/locations/:id
exports.getLocations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Mặc định trang 1
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const locations = await Locations.find()
      .sort({ createdAt: -1 }) // mới nhất lên trước
      .skip(skip)
      .limit(limit);

    const total = await Locations.countDocuments();

    const formattedLocations = locations.map((loc) => ({
      _id: loc._id,
      id: loc.id,
      name: loc.name,
      location: loc.location,
      description: loc.description,
      rating: `${loc.rating}/5`,
      imageUrl: loc.imageUrl,
    }));

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: formattedLocations,
    });
  } catch (error) {
    console.error("Error fetching paginated locations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/ratings
exports.postRatingLocation = async (req, res) => {
  try {
    const { userId, userEmail, locationId, locationName, rating, comment } =
      req.body;

    if (!userId || !userEmail || !locationId || !locationName || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra nếu rating đã tồn tại → cập nhật
    const existingRating = await RatingLocation.findOne({ userId, locationId });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.createdAt = new Date();
      await existingRating.save();
      return res.json({ message: "Rating updated", rating: existingRating });
    }

    // Tạo mới
    const newRating = new RatingLocation({
      userId,
      userEmail,
      locationId,
      locationName,
      rating,
      comment,
    });

    await newRating.save();
    res.status(201).json({ message: "Rating saved", rating: newRating });
  } catch (error) {
    console.error("Error posting rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};
