// ==UserScript==
// @name TOGGLE BUTTON FOR WSM
// @namespace www.cobaltgroup.com
// @run-at document-end
// @include http://websites.cobalt.com/wsm/editSite.do*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @author cire
// ==/UserScript==

(function () {
    'use strict';
    var $fonts = jQuery('<link>').attr({
        'rel': 'stylesheet',
        'id': 'awesome-light',
        'href': 'https://cdn.rawgit.com/cirept/WSMupgrades/master/css/font-awesome-light.css',
    });
    var $fonts2 = jQuery('<link>').attr({
        'rel': 'stylesheet',
        'id': 'awesome-core',
        'href': 'https://cdn.rawgit.com/cirept/WSMupgrades/master/css/font-awesome-core.css',
    });
    jQuery('head').append($fonts);
    jQuery('head').append($fonts2);
})();
