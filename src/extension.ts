// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tetris-writer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let splitParagraph = vscode.commands.registerCommand('tetris-writer.splitParagraph', () => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			var range: vscode.Range;

			if (selection.isEmpty) {
				range = document.lineAt(selection.active.line).range;
			} else {
				range = selection;
			}

			// Get the word within the selection
			const delimiters = ['.', '?', '!', '.\"', '.\'', '。'];
			const delimiterRegex = /(\.\'|\.\"|\.|\?|\!|。)/;

			const word = document.getText(range);
			const splited = word.split(delimiterRegex).map(s => s.trim()).map(w => {
				if (delimiters.includes(w)) {
					return w + '\n\n';
				}
				return w;
			}).join("");
			editor.edit(editBuilder => {
				editBuilder.replace(range, splited);
			});
		}
	});


	let joinSentences = vscode.commands.registerCommand('tetris-writer.joinSentences', () => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const word = document.getText(selection);

			const endWithSpace = ['.', '?', '!', '.\"', '.\''];
			const splited = word.split('\n').filter(s => s !== "").map(w => {
				if (endWithSpace.includes(w)) {
					return w + ' ';
				}
				else {
					return w;
				}
			}).join('');
			editor.edit(editBuilder => {
				editBuilder.replace(selection, splited);
			});
		}
	});


	let insertShortDate = vscode.commands.registerCommand('tetris-writer.insertShortDate', () => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const location = editor.selection.active;

			const now = new Date();

			const YY = (now.getFullYear() % 100).toString();
			const MM = (now.getMonth() + 1).toString();
			const DD = now.getDate().toString();
			editor.edit(editBuilder => {
				editBuilder.insert(location, YY+MM+DD);
			});
		}
	});

	let disposable = vscode.commands.registerCommand('tetris-writer.playground', () => {
		console.log('tetris-writer.playground is active.');

		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const line = document.lineAt(editor.selection.active.line);

			const text = line.text;
			// const line = document.getText();
			vscode.window.showInformationMessage(text);
			editor.edit(editBuilder => {
				editBuilder.replace(line.range, "dummy");
			});
		}
	});

	context.subscriptions.push(splitParagraph);
	context.subscriptions.push(joinSentences);
	context.subscriptions.push(insertShortDate);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
