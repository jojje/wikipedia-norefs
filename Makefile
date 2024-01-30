VERSION = $(shell jq -r ".version" src/manifest.json)
NAME = $(shell jq -r ".name" src/manifest.json | tr " " "_" | tr "[A-Z]" "[a-z]" )-${VERSION}

build: clean
	@echo -e "\n[*] Firefox build"
	cp -r src build
	rm build/chrome_pollyfill.js
	web-ext build --source-dir build --artifacts-dir dist/firefox
	rm -rf build

	@echo -e "\n[*] Chrome build"
	cp -r src build
	patch -p1 < patch/chrome_manifest.patch
	cat src/chrome_pollyfill.js >> build/background.js
	rm build/chrome_pollyfill.js
	web-ext build --source-dir build --artifacts-dir dist/chrome

lint:
	web-ext lint --source-dir src

run:
	web-ext run --source-dir src --firefox "C:/Program Files/Mozilla Firefox/firefox.exe" -p clean --url https://en.wikipedia.org/wiki/Internet_Archive#Book_collections

clean:
	rm -rf dist build
