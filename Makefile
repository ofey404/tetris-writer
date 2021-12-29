install:
	yes | vsce package
	code --install-extension tetris-writer-*.vsix 
