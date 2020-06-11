const xmlrpc = require('xmlrpc');

// const args = process.argv;
const command = process.argv[2];

// create a client
const client = xmlrpc.createClient({
  host: 'localhost',
  port: 49999,
  path: '/plone/RobotRemote',
});

function setup() {
  // Setup site
  client.methodCall(
    'run_keyword',
    [
      'remote_zodb_setup',
      ['plone.app.robotframework.testing.PLONE_ROBOT_TESTING'],
    ],
    () => {},
  );
}

function teardown() {
  // Tearing down
  client.methodCall(
    'run_keyword',
    [
      'remote_zodb_teardown',
      ['plone.app.robotframework.testing.PLONE_ROBOT_TESTING'],
    ],
    (error, value) => {
      console.log('err + val', { error, value });
    },
  );
}

switch (command) {
  case 'setup':
    return setup();
  case 'teardown':
    return teardown();
  default:
    return setup();
}
