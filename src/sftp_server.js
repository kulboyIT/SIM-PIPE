// start a dockerized sftp server in sandbox using atmoz/sftp
// using dockerode-compose library

var Docker = require('dockerode');
var DockerodeCompose = require('../compose');

// var docker = new Docker();
var docker = new Docker({
    host:"127.0.0.1",
    port:2375,
    });
var compose = new DockerodeCompose(docker, './sftp_atmoz.yml', 'stfp');

//  start sftp server in host 2 using atmoz docker image
(async () => {
  await compose.pull();
  var state = await compose.up();
  console.log(state);
})();