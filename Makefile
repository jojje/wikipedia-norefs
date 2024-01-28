build: clean lint
	web-ext build --source-dir src --artifacts-dir dist

lint:
	web-ext lint --source-dir src

run:
	web-ext run --source-dir src --firefox "C:/Program Files/Mozilla Firefox/firefox.exe" -p clean --url https://en.wikipedia.org/wiki/Internet_Archive#Book_collections

clean:
	rm -rf dist
