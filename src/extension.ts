// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

function registerCommand(
  context: vscode.ExtensionContext,
  command: string,
  callback: (...args: any[]) => any
) {
  let disposable = vscode.commands.registerCommand(command, callback);
  context.subscriptions.push(disposable);
}

function insertLambda() {
  // Get the active text editor
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const location = editor.selection.active;

    editor.edit((editBuilder) => {
      editBuilder.insert(location, "λ");
    });
  }
}

function splitParagraph() {
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
    const delimiters = [".", "?", "!", '."', ".'", "。"];
    const delimiterRegex = /(\.\'|\.\"|\.|\?|\!|。)/;

    const word = document.getText(range);
    const splited = word
      .split(delimiterRegex)
      .map((s) => s.trim())
      .map((w) => {
        if (delimiters.includes(w)) {
          return w + "\n\n";
        }
        return w;
      })
      .join("");
    editor.edit((editBuilder) => {
      editBuilder.replace(range, splited);
    });
  }
}

function mergeSentences() {
  // Get the active text editor
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const document = editor.document;
    const selection = editor.selection;

    // Get the word within the selection
    const word = document.getText(selection);

    const notEndWithSpace = ["。", "-"];
    const splited = word
      .split("\n")
      .filter((s) => s !== "")
      .map((w) => {
        var noTrailingSpace = false;
        for (const e of notEndWithSpace) {
          if (w.endsWith(e)) {
            noTrailingSpace = true;
            break;
          }
        }
        if (noTrailingSpace) {
          return w;
        }
        return w + " ";
      })
      .join("")
      .trim();
    editor.edit((editBuilder) => {
      editBuilder.replace(selection, splited);
    });
  }
}

function insertText(text: string) {
  // Get the active text editor
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const location = editor.selection.active;
    editor.edit((editBuilder) => {
      editBuilder.insert(location, text);
    });
  }
}

function insertShortDate() {
  const now = new Date();
  const YY = (now.getFullYear() % 100).toString().padStart(2, "0");  // Though I don't think I can live so long!
  const MM = (now.getMonth() + 1).toString().padStart(2, "0");
  const DD = now.getDate().toString().padStart(2, "0");
  insertText("## " + YY + MM + DD);
}

function insertCheckList() {
  insertText("- [ ] ");
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, "tetris-writer.splitParagraph", splitParagraph);
  registerCommand(context, "tetris-writer.mergeSentences", mergeSentences);
  registerCommand(context, "tetris-writer.insertShortDate", insertShortDate);
  registerCommand(context, "tetris-writer.insertLambda", insertLambda);
  registerCommand(context, "tetris-writer.insertCheckList", insertCheckList);

  // EXAMPLE: playground to try out new functionalities.
  let disposable = vscode.commands.registerCommand(
    "tetris-writer.playground",
    () => {
      console.log("tetris-writer.playground is active.");

      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;
        const line = document.lineAt(editor.selection.active.line);

        const text = line.text;
        // const line = document.getText();
        vscode.window.showInformationMessage(text);
        editor.edit((editBuilder) => {
          editBuilder.replace(line.range, "dummy");
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
