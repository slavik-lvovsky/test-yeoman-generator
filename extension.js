
const vscode = require("vscode");
const _ = require("lodash");
const path = require("path");
const Environment = require('yeoman-environment');
const envChild = require("child_process").fork(path.resolve(path.join(__dirname, "./job.js")));


function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand("env.run.gen", function () {
		testGen(false);
	}));

	context.subscriptions.push(vscode.commands.registerCommand("env.run.gen.process", function () {
		testGen(true);
	}));

	testGen(false);
};

envChild.on("message", res => {
	vscode.window.showInformationMessage(res);
});

async function testGen(useProcess) {
	try {
		const lookupEnv = Environment.createEnv();
		const gensMeta = lookupEnv.lookup();

		const name = await vscode.window.showQuickPick(lookupEnv.getGeneratorNames());
		if (name) {
			const namespace = `${name}:app`;
			const genMeta = _.filter(gensMeta, {namespace})[0];
			const packagePath = path.resolve(genMeta.packagePath);

			if (useProcess) {
				envChild.send({packagePath, namespace});
			} else {
				const env = Environment.createEnv();
				env.lookup({ packagePaths: packagePath });
				const gen = env.create(namespace);
				env.runGenerator(gen);
				vscode.window.showInformationMessage(gen._globalConfig.name);
			}
		}
	} catch (error) {
		vscode.window.showErrorMessage(error.stack);
	}
}

module.exports = {
	activate
}
