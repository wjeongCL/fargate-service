const test = require('ava');
const cfntest = require('@cfn-modules/test');

test.serial('alb-single', async t => {
  const stackName = cfntest.stackName();
  try {
    t.log(await cfntest.createStack(`${__dirname}/alb-single.yml`, stackName, {}));
    const outputs = await cfntest.getStackOutputs(stackName);
    t.log(outputs);
    const res = await cfntest.probeHttpGet(`http://${outputs.DnsName}`);
    t.is(res.headers.server, 'Apache/2.4.23 (Unix)');
    t.true(res.data.includes('It works!'));
  } finally {
    t.log(await cfntest.deleteStack(stackName));
    t.pass();
  }
});
