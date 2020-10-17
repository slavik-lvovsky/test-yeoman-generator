
const env = require('./env');

process.on("message", req => {
	try {
		const gen = env.runGenerator(req.packagePath, req.namespace);
		process.send(`${gen._globalConfig.name} (process)`);
	} catch (error) {
		process.send(error.message);
	}
});