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

            let issue_title     = "New Task";
            let issue_text      = "A new task is upon us need to do it quick lads!!";
            let created_by      = "Madmax";
            let assigned_to     = "";
            let status_text     = "";

            chai.request(server)
                .post("/api/issues/{project}")
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

        test("Create an issue without required fields", function (done) {

            let issue_title     = undefined;
            let issue_text      = "A new task is upon us need to do it quick lads!!";
            let created_by      = "Madmax";
            let assigned_to     = "";
            let status_text     = "";

            chai.request(server)
                .post("/api/issues/{project}")
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
    })

});
