
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
	const lookupEnv = Environment.createEnv();
	const gensMeta = lookupEnv.lookup();

	const name = await vscode.window.showQuickPick(lookupEnv.getGeneratorNames());
	const namespace = `${name}:app`;

	const genMeta = _.find(gensMeta, genMeta => {
		return genMeta.namespace === namespace;
	});

	if (genMeta) {
		const env = Environment.createEnv();
		env.lookup({ packagePaths: genMeta.packagePath });
		const gen = env.create(namespace);
		env.runGenerator(gen);


		vscode.window.showInformationMessage(_.get(gen, "_globalConfig.name") + " created and running ...");
	}
}


module.exports = {
	activate
}
