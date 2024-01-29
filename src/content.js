// Copyright 2024 Jonas Tingeborn
// This program is released under the GNU General Public License v2.

"use strict";

const STYLE_ID = 'wp-norefs-style';
const DEBUG_PREFIX = '[Wikipedia NoRefs]';
const DEBUG = false;

function debug(...args) {
    if (DEBUG) console.debug(DEBUG_PREFIX, ...args);
}

const findStyle = () => document.getElementById(STYLE_ID);

function hideRefs() {
    if (findStyle()) return;  // idempotency
    debug('hiding refs');
    const style = document.createElement('style');
    style.setAttribute('id', STYLE_ID);
    style.innerHTML = `sup {display: none}`;
    document.head.appendChild(style);
}

function showRefs() {
    const style = findStyle();
    if (style) {
        debug('showing refs');
        style.remove();
    }
}

function onStateUpdate(state) {
    if( state && state.enabled) hideRefs();
    else showRefs();
}

// subsequent state synchronization
chrome.runtime.onMessage.addListener((message) => {
    debug('got message:', message);
    onStateUpdate(message);
});

// initial state synchronization (special case)
chrome.runtime.sendMessage('isEnabled',(response) => {
    debug('got response:', response);
    onStateUpdate(response);
});

debug('initialized');
