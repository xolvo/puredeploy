var express = require('express'),
    app = express();

var spawn = require('child_process').spawn;
var conf = require('./conf.js');

app.use(express.bodyParser());

app.post('/', function(request, response) {
    var push = JSON.parse(request.body.payload);

    // Get push to master branch
    if(push.ref.indexOf(conf.deploy_branch) != -1) {
        console.log('Got code to deploy from commit %s', push.after);

        var s = spawn(
            conf.deploy_script,
            conf.deploy_script_args,
            {
                cwd: conf.project_dir,
                detached: true,
                stdio: ['ignore', process.stdout, process.stderr]
            }
        );

        s.unref();
    }

    response.end();
});

app.listen(conf.server_port);
console.log('Listening on port %s', conf.server_port);
