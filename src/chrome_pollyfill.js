// The following are polyfills that plug holes present in the Chrome Manifest v3 behavior,
// to bring back the needed behavior offered by v2 (which is the baseline operating model).

// Fix: Chrome not hiding/disabling extension icon automatically on non-whitelisted pages (in contrast to FF)
(function () {
    if(!chrome.declarativeContent) return;                                                  // When running in chrome
    chrome.runtime.onInstalled.addListener(() => {                                          // During installation ...
        chrome.action.disable();                                                            // Disable the extension initially
        chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {              // Then clear all preexisting rules to ensure ours is the only one
            chrome.declarativeContent.onPageChanged.addRules([{                             // Then add the rule ...
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({                        // stating that ...
                        pageUrl: { hostSuffix: '.wikipedia.org', pathPrefix: '/wiki/' },    // on wikipedia articles ...
                    })
                ],
                actions: [new chrome.declarativeContent.ShowAction()],                      // the extension should be enabled
            }])
        });
    });
    debug('initialized chrome polyfill');
})();
