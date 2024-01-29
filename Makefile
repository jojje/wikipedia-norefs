build: clean
	@echo -e "\n[*] Firefox build"
	web-ext build --source-dir src --artifacts-dir dist/firefox

	@echo -e "\n[*] Chrome build"
	cp -r src build
	patch -p1 < patch/chrome_manifest.patch
	cat src/chrome_pollyfill.js >> build/background.js
	web-ext build --source-dir build --artifacts-dir dist/chrome

lint:
	web-ext lint --source-dir src

run:
	web-ext run --source-dir src --firefox "C:/Program Files/Mozilla Firefox/firefox.exe" -p clean --url https://en.wikipedia.org/wiki/Internet_Archive#Book_collections

clean:
	rm -rf dist build
