
const Environment = require('yeoman-environment');

process.on("message", req => {
	try {
		const env = Environment.createEnv();
		env.lookup({ packagePaths: req.packagePath });
		const gen = env.create(req.namespace);
		env.runGenerator(gen);
		process.send(`${gen._globalConfig.name} (process)`);
	} catch (error) {
		process.send(error.message);
	}
});