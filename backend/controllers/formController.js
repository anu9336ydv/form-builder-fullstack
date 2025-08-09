const Form = require("../models/Form");
const cloudinary = require("../config/cloudinary");

// --- Form Management ---

// @desc    Create a new empty form
// @route   POST /api/forms
exports.createForm = async (req, res) => {
  try {
    const form = new Form({ questions: [] });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error creating form", error });
  }
};

// @desc    Update an existing form
// @route   PUT /api/forms/:id
exports.updateForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "Error updating form", error });
  }
};

// @desc    Get a single form for editing or preview
// @route   GET /api/forms/:id
exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "Error getting form", error });
  }
};

// --- Image Upload ---
const fs = require("fs");
const path = require("path");

exports.uploadImage = async (req, res) => {
  try {
    // Ensure uploads folder exists
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "form-builder",
      });
      fs.unlinkSync(file.path);
      res.status(200).json({ imageUrl: result.secure_url });
    } catch (cloudErr) {
      console.error("Cloudinary upload error:", cloudErr);
      res
        .status(500)
        .json({
          message: "Image upload failed (cloudinary)",
          error: cloudErr.message || cloudErr,
        });
    }
  } catch (error) {
    console.error("Image upload error:", error);
    res
      .status(500)
      .json({
        message: "Image upload failed (server)",
        error: error.message || error,
      });
  }
};

// --- Form Submissions ---

// @desc    Get all submissions for a form
// @route   GET /api/forms/:id/submissions
exports.getSubmissions = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form.submissions);
  } catch (error) {
    res.status(500).json({ message: "Error getting submissions", error });
  }
};

// @desc    Submit a form response
// @route   POST /api/forms/:id/submit
exports.submitForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    form.submissions.push({ answers: req.body });
    await form.save();
    res.status(201).json({ message: "Submission successful" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting form", error });
  }
};
