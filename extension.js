
const vscode = require("vscode");
const _ = require("lodash");
const Environment = require('yeoman-environment');

function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand("env.run.gen", function () {
		testGen();
	}));

	testGen();
};

async function testGen() {
	try {
		const lookupEnv = Environment.createEnv();
		const gensMeta = lookupEnv.lookup();

		const name = await vscode.window.showQuickPick(lookupEnv.getGeneratorNames());
		if (name) {
			const namespace = `${name}:app`;
			const genMeta = _.filter(gensMeta, {namespace})[0];
			
			const env = Environment.createEnv();
			env.lookup({packagePaths: [genMeta.packagePath]});
			
			const gen = env.create(namespace);
			env.runGenerator(gen);
			vscode.window.showInformationMessage(_.get(gen, "_globalConfig.name", namespace) + " created and running ...");
		}
	} catch (error) {
		vscode.window.showErrorMessage(error.stack);
	}
}

module.exports = {
	activate
}
