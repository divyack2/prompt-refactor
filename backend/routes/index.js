
module.exports = function (app, router) {
    app.use('/api', require('./home')(router));
    app.use('/api/refactor-prompt', require('./prompts')(router))

};
  