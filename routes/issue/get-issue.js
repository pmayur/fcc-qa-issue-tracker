const IssueModel = require("../../models/Issue");

module.exports = async function (req, res) {

    // get all the queries received and create a search object
    let searchObject = {
        project      : req.params.project,
        _id          : req.query._id,
        open         : req.query.open,
        issue_title  : req.query.issue_title,
        issue_text   : req.query.issue_text,
        created_by   : req.query.created_by,
        assigned_to  : req.query.assigned_to,
        status_text  : req.query.status_text,
        createdAt    : req.query.created_on,
        updatedAt    : req.query.updated_on,
    }

    // iterate through the object and remove any values which are undefined
    Object.keys(searchObject).forEach((key) => {
        searchObject[key] === undefined && delete searchObject[key]
    });

    // find query for the issues model
    IssueModel.find(searchObject, (err, searchResult) => {

        // iff error is encountered
        if(err) {
            return res.end();

        } else {

            // filter the search result to exclude unrequired fields
            let responseArray = searchResult.map((issue) => {
                return {
                    _id         : issue._id,
                    issue_title : issue.issue_title,
                    issue_text  : issue.issue_text,
                    created_on  : issue.createdAt,
                    updated_on  : issue.updatedAt,
                    created_by  : issue.created_by,
                    assigned_to : issue.assigned_to,
                    open        : issue.open,
                    status_text : issue.status_text,
                }
            })

            // send the response array
            return res.send(responseArray);
        }
    });
};
