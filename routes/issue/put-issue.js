const { update } = require("../../models/Issue");
const IssueModel = require("../../models/Issue");

module.exports =  async function (req, res) {

    // get current project from the params
    let project = req.params.project;

    // _id for which the object is to be updated
    let _id = req.body._id;

    // if _id is missing or is blank
    if( !_id || _id === "") {
        return res.json({
            error: "missing _id"
        })
    }

    // get update info from the body
    let updateObject = {
        issue_title  : req.body.issue_title,
        issue_text   : req.body.issue_text,
        created_by   : req.body.created_by,
        assigned_to  : req.body.assigned_to,
        open         : req.body.open,
        status_text  : req.body.status_text
    }

    // iterate through the object and remove any values which are undefined
    Object.keys(updateObject).forEach((key) => {
        (updateObject[key] === undefined
        || updateObject[key] === "")
        && delete updateObject[key]
    });

    // if updateObject contains no fields to update
    if (Object.keys(updateObject).length <= 0) {
        return res.json({
            error: "no update field(s) sent",
            _id
        })
    }

    try {
        // find object to update by id
        let objectToUpdate = await IssueModel.findById({ _id });

        objectToUpdate = Object.assign(objectToUpdate, updateObject);

        try {
            let saveUpdatedObject = await objectToUpdate.save();

            return res.json({
                result: "successfully updated",
                _id: saveUpdatedObject._id
            })

        } catch (err) {

            return res.json({
                error: "could not update",
                _id
            })

        }
    } catch (err) {

        return res.json({
            error: "could not update",
            _id
        })
    }
}