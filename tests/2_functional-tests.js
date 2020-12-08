const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const IssueModel = require('../models/Issue');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite("Routing Tests", function () {
        test("Create an issue with every field", function (done) {

            let project         = "programming"

            let issue_title     = "New Task";
            let issue_text      = "A new task is upon us need to do it quick lads!!";
            let created_by      = "Madmax";
            let assigned_to     = "Newon";
            let status_text     = "Planning";

            chai.request(server)
                .post(`/api/issues/${project}`)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    issue_title,
                    issue_text,
                    created_by,
                    assigned_to,
                    status_text,
                })
                .end( (err, res) => {
                    let resBody = res.body;

                    assert.equal(res.status, 200);
                    assert.equal(resBody.issue_title, issue_title);
                    assert.equal(resBody.issue_text, issue_text);
                    assert.equal(resBody.created_by, created_by);
                    assert.equal(resBody.assigned_to, assigned_to);
                    assert.equal(resBody.status_text, status_text);
                    assert.exists(resBody._id);
                    assert.exists(resBody.created_on);
                    assert.exists(resBody.updated_on);
                    assert.notExists(err);
                    done();
                });
        });

        test("Create an issue with only required fields", function (done) {

            let project         = "programming"

            let issue_title     = "New Task";
            let issue_text      = "A new task is upon us need to do it quick lads!!";
            let created_by      = "Madmax";

            chai.request(server)
                .post(`/api/issues/${project}`)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    issue_title,
                    issue_text,
                    created_by,
                })
                .end( (err, res) => {
                    let resBody = res.body;

                    assert.equal(res.status, 200);
                    assert.equal(resBody.issue_title, issue_title);
                    assert.equal(resBody.issue_text, issue_text);
                    assert.equal(resBody.created_by, created_by);
                    assert.equal(resBody.assigned_to, "");
                    assert.equal(resBody.status_text, "");
                    assert.exists(resBody._id);
                    assert.exists(resBody.created_on);
                    assert.exists(resBody.updated_on);
                    assert.notExists(err);
                    done();
                });
        });

        test("Create an issue without required fields", function (done) {

            let project         = "programming"

            let issue_title     = undefined;
            let issue_text      = "A new task is upon us need to do it quick lads!!";
            let created_by      = "Madmax";

            chai.request(server)
                .post(`/api/issues/${project}`)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    issue_title,
                    issue_text,
                    created_by,
                })
                .end( (err, res) => {
                    let resBody = res.body;

                    assert.equal(res.status, 200);
                    assert.exists(resBody.error)
                    assert.equal(resBody.error, "required field(s) missing");
                    assert.notExists(err);
                    done();
                });
        });

        test("View all issues on a project", function (done) {

            let project = "programming"

            chai.request(server)
                .get(`/api/issues/${project}`)
                .end( async (err, res) => {
                    let resBody = res.body;

                    // get issues from the database
                    let issuesForProject    = await IssueModel.find({ project })
                    let noOfIssues          = issuesForProject.length;

                    assert.equal(res.status, 200);
                    assert.equal(resBody.length, noOfIssues);
                    done();
                });
        });

        test("View issues on a project with one filter", function (done) {

            let project = "testing"
            let _id = "5fcf6ae14565a82046877d24"
            let query = `?_id=${_id}`

            chai.request(server)
                .get(`/api/issues/${project}`+query)
                .end( async (err, res) => {
                    let resBody = res.body;

                    // get issues from the database
                    let issuesForProject    = await IssueModel.find({ project, _id })
                    let noOfIssues          = issuesForProject.length;

                    assert.equal(resBody.length, noOfIssues);
                    assert.equal(res.status, 200);
                    done();
                });
        });

        test("View issues on a project with multipe filters", function (done) {

            let project = "testing"
            let _id = "5fcf6ae14565a82046877d24"
            let created_by      = "Madmax";
            let query = `?_id=${_id}&created_by=${created_by}`

            chai.request(server)
                .get(`/api/issues/${project}`+query)
                .end( async (err, res) => {
                    let resBody = res.body;

                    // get issues from the database
                    let issuesForProject = await IssueModel.find({
                        project,
                        _id,
                        created_by,
                    });

                    let noOfIssues = issuesForProject.length;

                    assert.equal(res.status, 200);
                    assert.equal(resBody.length, noOfIssues);
                    done();
                });
        });

        test("Update one field on an issue", function (done) {

            let project = "testing";
            let _id = "5fcf6ae14565a82046877d24";
            let assigned_to = "GoodMax"

            chai.request(server)
                .put(`/api/issues/${project}`)
                .set("content-type", "application/x-www-form-urlencoded")
                .send({
                    _id,
                    assigned_to
                })
                .end( async (err, res) => {
                    let resBody = res.body;

                    // get updated issue from the database
                    let updatedIssue = await IssueModel.findOne({
                        project,
                        _id,
                    });

                    assert.notEqual(updatedIssue.createdAt, updatedIssue.updatedAt)
                    assert.equal(res.status, 200);
                    assert.equal(updatedIssue.assigned_to, assigned_to);
                    assert.equal(resBody.result, "successfully updated");
                    assert.equal(resBody._id, _id);
                    done();
                });
        });

        test("Update multiple fields on an issue", function (done) {

            let project = "testing";
            let _id = "5fcf6ae14565a82046877d24";
            let assigned_to = "MadderMax";
            let status_text = "Deadline approaching";
            let issue_title = "Priority"

            chai.request(server)
                .put(`/api/issues/${project}`)
                .set("content-type", "application/x-www-form-urlencoded")
                .send({
                    _id,
                    assigned_to,
                    status_text,
                    issue_title
                })
                .end( async (err, res) => {
                    let resBody = res.body;

                    // get updated issue from the database
                    let updatedIssue = await IssueModel.findOne({
                        project,
                        _id,
                    });

                    assert.notEqual(updatedIssue.createdAt, updatedIssue.updatedAt)
                    assert.equal(res.status, 200);
                    assert.equal(updatedIssue.assigned_to, assigned_to);
                    assert.equal(updatedIssue.status_text, status_text);
                    assert.equal(updatedIssue.issue_title, issue_title);
                    assert.equal(resBody.result, "successfully updated");
                    assert.equal(resBody._id, _id);
                    done();
                });
        });

        test("Update an issue with no fields to update", function (done) {

            let project = "testing";

            let _id = "5fcf6ae14565a82046877d24";
            let assigned_to = "";
            let status_text = "";
            let issue_title = "";

            chai.request(server)
                .put(`/api/issues/${project}`)
                .set("content-type", "application/x-www-form-urlencoded")
                .send({
                    _id,
                    assigned_to,
                    status_text,
                    issue_title
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "no update field(s) sent");
                    assert.equal(res.body._id, _id);
                    done();
                });
        });

        test("Update an issue with missing _id", function (done) {

            let project = "programming";
            let assigned_to = "MadMax2";
            let status_text = "Deadline approaching";
            let issue_title = "Priority"

            chai.request(server)
                .put(`/api/issues/${project}`)
                .set("content-type", "application/x-www-form-urlencoded")
                .send({
                    assigned_to,
                    status_text,
                    issue_title
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                    done();
                });
        });

        test("Update an issue with an invalid _id", function (done) {

            let _id = "random"
            let project = "programming";
            let assigned_to = "MadMax2";
            let status_text = "Deadline approaching";
            let issue_title = "Priority"

            chai.request(server)
                .put(`/api/issues/${project}`)
                .set("content-type", "application/x-www-form-urlencoded")
                .send({
                    _id,
                    assigned_to,
                    status_text,
                    issue_title
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not update");
                    assert.equal(res.body._id, _id);
                    done();
                });
        });

        test("Delete an issue with missing _id", function (done) {

            let _id = ""
            let project = "programming";

            chai.request(server)
                .delete(`/api/issues/${project}`)
                .set("content-type", "application/x-www-form-urlencoded")
                .send({
                    _id,
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                    done();
                });
        });

        test("Delete an issue with an invalid _id", function (done) {

            let _id = "random"
            let project = "programming";
            chai.request(server)
                .delete(`/api/issues/${project}`)
                .set("content-type", "application/x-www-form-urlencoded")
                .send({
                    _id,
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not delete");
                    assert.equal(res.body._id, _id);
                    done();
                });
        });

        test("Delete an issue", async function () {

            let project = "programming";
            let issues = await IssueModel.find({ project }, '_id')

            const _id = issues[Math.floor(Math.random() * issues.length)]._id.toString();

            chai.request(server)
                .delete(`/api/issues/${project}`)
                .set("content-type", "application/x-www-form-urlencoded")
                .send({
                    _id,
                })
                .end( async (err, res) => {

                    let getIssueJustDeleted = await IssueModel.find({ _id });

                    assert.equal(res.status, 200);
                    assert.isEmpty(getIssueJustDeleted);
                    assert.equal(res.body.result, "successfully deleted");
                    assert.equal(res.body._id, _id);
                });
        });
    })

});
