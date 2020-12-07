const IssueModel = require("../../models/Issue");
const mongoose = require("mongoose");
const { response } = require("express");

module.exports = async function (req, res) {
    // get all the data received from the body
    let project = req.params.project

    let issue_title = req.body.issue_title;
    let issue_text = req.body.issue_text;
    let created_by = req.body.created_by;
    let assigned_to = req.body.assigned_to;
    let status_text = req.body.status_text;

    // create a new instance of the model
    let newIssue = new IssueModel({
        project,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
    });

    // mongoose check for validation errors
    const reqBodyHasValidationErrors = newIssue.validateSync();

    // validation errors caught action
    if (reqBodyHasValidationErrors) {
        return res.json({
            error: "required field(s) missing"
        });
    }

    // save the instance to database
    const saveInDatabase = newIssue.save();

    // save successful action
    saveInDatabase.then((response) => {
        return res.json({
            _id         : response._id,
            issue_title : response.issue_title,
            issue_text  : response.issue_text,
            created_on  : response.createdAt,
            updated_on  : response.updatedAt,
            created_by  : response.created_by,
            assigned_to : response.assigned_to,
            open        : response.open,
            status_text : response.status_text,
        });
    });

    // errors on save
    saveInDatabase.catch((err) => {
        return res.json({
            error: err.message
        })
    })
};
