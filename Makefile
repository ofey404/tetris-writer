install:
	yes | vsce package
	code --install-extension tetris-writer-0.0.1.vsix 
