
const vscode = require('vscode');
const Environment = require('yeoman-environment');


function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand("test-env-api.gen", function () {
		testGenerator();
	}));
};

async function testGenerator() {
	try {
		const env = Environment.createEnv();
		// lookup
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "looking for generators..."
		}, async () => {
			return env.lookup();
		});
		// getGeneratorNames
		const genName = await vscode.window.showQuickPick(env.getGeneratorNames());
		if (genName) {
			// create
			const gen = await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: `getting ${genName} generator...`
			}, async () => {
				return env.create(`${genName}:app`);
			});
			// runGenerator
			const info = gen && gen._globalConfig && gen._globalConfig.name || genName;
			vscode.window.showInformationMessage(`running '${info}' ...`);
			env.runGenerator(gen);
		}
	} catch (error) {
		console.error(error.stack);
		vscode.window.showErrorMessage(error.stack);
	}
}

module.exports = {
	activate
}
