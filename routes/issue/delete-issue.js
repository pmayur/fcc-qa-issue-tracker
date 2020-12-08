const IssueModel = require("../../models/Issue");

module.exports = function (req, res) {
    let project = req.params.project;

    let _id = req.body._id;

    if (!_id || _id === "") {
        return res.json({ error: "missing _id" });
    }

    IssueModel.deleteOne({ project, _id }, function (err, r) {

        if (err) return res.json({ error: "could not delete", _id });

        return res.json({
            result: "successfully deleted",
            _id,
        });
    });
};
