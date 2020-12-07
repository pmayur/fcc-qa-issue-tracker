// Require Mongoose
const mongoose = require("mongoose");

// Define the Issue Schema
const IssueSchema = new mongoose.Schema(
    {
        project:{
            type: String,
            required: true
        },
        issue_title: {
            type: String,
            required: true,
        },
        issue_text: {
            type: String,
            required: true,
        },
        created_by: {
            type: String,
            required: true,
        },
        assigned_to: {
            type: String,
            required: false,
        },
        status_text: {
            type: String,
            required: false,
        },
        open: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Create a model from the schema
const IssueModel = mongoose.model("IssueModel", IssueSchema);

module.exports = IssueModel;
