const feedbackModel = require("../models/feedbackschema");

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id || req.user.id;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product ID, rating, and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const feedback = await feedbackModel.create({
      productId,
      userId,
      rating,
      comment,
    });

    const populatedFeedback = await feedbackModel
      .findById(feedback._id)
      .populate("userId", "name email");

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: populatedFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get feedback for a product
const getProductFeedback = async (req, res) => {
  try {
    const { productId } = req.params;

    const feedbacks = await feedbackModel
      .find({ productId })
      .populate("userId", "name email")
      .populate("replies.userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Like a feedback
const likeFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.user._id || req.user.id;

    const feedback = await feedbackModel.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    const likeIndex = feedback.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      feedback.likes.splice(likeIndex, 1);
    } else {
      // Like
      feedback.likes.push(userId);
    }

    await feedback.save();

    res.status(200).json({
      success: true,
      likes: feedback.likes.length,
      isLiked: likeIndex === -1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reply to a feedback
const replyToFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id || req.user.id;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply comment is required",
      });
    }

    const feedback = await feedbackModel.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    feedback.replies.push({
      userId,
      comment: comment.trim(),
    });

    await feedback.save();

    const updatedFeedback = await feedbackModel
      .findById(feedbackId)
      .populate("userId", "name email")
      .populate("replies.userId", "name email");

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      feedback: updatedFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getProductFeedback,
  likeFeedback,
  replyToFeedback,
};
