// Copyright 2024 Jonas Tingeborn
// This program is released under the GNU General Public License v2.

"use strict";

const EXT_NAME = 'Wikipedia NoRefs';
const WHITE_LIST = new RegExp('https://.*\.wikipedia.org/wiki/.*');
const DEBUG = false;

let enabled = true;  // hide refs by default (why else install this extension...)

function debug(...args) {
    if (DEBUG) console.debug(...args);
}

// push events to content script (pub/sub)
function notify(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        debug('sending content script message:', message);
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

// contextually change the extension's icon on a given tab
function updateIcon(tabId) {
    const stem = enabled ? 'enabled' : 'disabled';
    debug('updating icon {enabled:',enabled, 'tabId:', tabId, 'stem:', stem, '}');
    chrome.pageAction.setIcon({
        tabId: tabId,
        path: {
            48: `icons/${stem}-48-blue.png`,
            128: `icons/${stem}-128-blue.png`
        }
    });
}

// contextually update the extension help popup on a given tab
function updateTitle(tabId) {
    const sideEffect =  enabled ? 'show' : 'hide';
    const newTitle = `${EXT_NAME}: Click to ${sideEffect} references`;
    debug('updating extension title {enabled:',enabled, 'tabId:', tabId, 'newTitle', newTitle, '}');
    chrome.pageAction.setTitle({
        tabId: tabId,
        title: newTitle
    });
}

function updateUI(tab) {
    if (!WHITE_LIST.test(tab.url)) {  // only activate on intended pages (workaround for manifest
        return;                       // "default_icon:{}" & "show_matches":[] extension icon flicker when loading pages)
    }
    chrome.pageAction.show(tab.id);
    updateIcon(tab.id);
    updateTitle(tab.id);
}

// respond to RPC requests from content script (for allowing content scripts to know their initial behavior on page-load)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === 'isEnabled') {
        const response = {'enabled': enabled};
        debug('got content script command:', request, ', from tab:', sender.url, ', responding:', response);
        sendResponse(response);
    }
});

// handle extension icon's click events
chrome.pageAction.onClicked.addListener((tab) => {
    enabled = !enabled;
    updateUI(tab);
    notify({'enabled': enabled});
});

// make user's choice stickily reflect in the UI, so the last choice is retained for new tabs or page loads, until the user toggles the extension again.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status !== 'loading') return;   // Update UI as early as possible to reduce icon during a page load.
    updateUI(tab);
});

debug('initialized');
