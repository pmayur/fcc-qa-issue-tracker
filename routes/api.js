'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(require('./issue/get-issue'))

    .post(require('./issue/post-issue'))

    .put(require('./issue/put-issue'))

    .delete(require('./issue/delete-issue'))

};
