const Environment = require('yeoman-environment');

function runGenerator(packagePath, namespace) {
	const env = Environment.createEnv();
	env.lookup({ packagePaths: packagePath });
	const gen = env.create(namespace);
	env.runGenerator(gen);
	return gen;
}

module.exports = {
	runGenerator
}
