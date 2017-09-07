/*
// ---------------------------------------- Base Prototype
var EditorUpgrade = function () {};

EditorUpgrade.prototype = {
    'contentFrame': jQuery('iframe#cblt_content').contents(),
    'siteEditorIframe': this.contentFrame.find('iframe#siteEditorIframe').contents(),
    'editor': this.siteEditorIframe.find('#editor-wrapper').find('#editor').contents(),
    'pageOutline': jQuery(this.editor).find('#pageOutline').find('div[template*="generateCardsAndOptions"]'),
};

// ---------------------------------------- Toggle Card

var ToggleCardDeck = function () {
    this.$toggleDeck = jQuery('<button>').attr({
        'type': 'button',
        'class': 'superDuper',
    }).css({
        'position': 'absolute',
        'margin-left': '-35px',
        'width': 'auto',
    }).text('C');
};

ToggleCardDeck.prototype = new EditorUpgrade();
*/

// clone a copy of the button and add prepend to parent deck
/*
ToggleCardDeck.prototype.cloneButton = function () {
    if (jQuery(card).find('.deck').text().replace(/\s/g, '') !== '') {
        jQuery(card).prepend($toggleDeck.clone());
    }
};

// hide or show card if in memory
ToggleCardDeck.prototype.autoToggleDeck = function () {
    if (GM_listValues().includes(jQuery(card).attr('id')) && GM_getValue(jQuery(card).attr('id'), false)) {
        jQuery(card).find('.deck').toggle();
    }
};

// loop through page outline
ToggleCardDeck.prototype.loopThroughOutline = function (callBack) {
    jQuery(pageOutline).find('section').each(function (index, card) {
        callBack;
    });
};

// remember deck id
ToggleCardDeck.prototype.saveId = function (cardID, bool) {
    GM_setValue(cardID, bool);
};

// retrieve dec if
ToggleCardDeck.prototype.getId = function (cardID) {
    return GM_getValue(cardID, false) || GM_getValue(cardID, false) === false ? true : false
};

// bind buttons
ToggleCardDeck.prototype.bindButtons = function () {
    editor.find('.superDuper').on('click', function () {
        const cardID = jQuery(this).parent().attr('id');
        var toggle = getId(cardID);
        jQuery(this).parent().find('.deck').toggle();
        saveId(cardID, toggle);
    });
};

ToggleCardDeck.prototype = Object.create(EditorUpgrade);

// ---------------------------------------- Add pageName to url

var AddPageName = function () {};

// adds pageName to url
AddPageName.prototype.add = function () {
    if (window.location.href.indexOf('&pageName=') === -1) {
        var newURL = window.location.href + '&pageName=' + jQuery(siteEditorIframe).find('#pageName').text();
        window.location.href = newURL;
    }
}

AddPageName.prototype = Object.create(EditorUpgrade);

// ---------------------------------------- get rid of scrollbars

var RemoveScrollbars = function () {};

// gets rid of other scroll bar
RemoveScrollbars.prototype.siteEditorFrame = function () {
    this.contentFrame.find('iframe#siteEditorIframe').css({
        'height': '99%',
    });
    this.siteEditorIframe.find('iframe#viewer.viewer').css({
        'height': '99%',
    });
};

// gets rid of the 2nd scroll bar in WSM
RemoveScrollbars.prototype.cardFrame = function () {
    this.editor.find('div[template*="generateCardsAndOptions"]').css({
        'overflow': 'visible',
    });
};

RemoveScrollbars.prototype = Object.create(EditorUpgrade);
*/


function addToggleButtons() {
    'use strict';

    var contentFrame = jQuery('iframe#cblt_content').contents();
    var siteEditorIframe = contentFrame.find('iframe#siteEditorIframe').contents();
    var editor = siteEditorIframe.find('#editor-wrapper').find('#editor').contents();
    var pageOutline = jQuery(editor).find('#pageOutline').find('div[template*="generateCardsAndOptions"]');
    var $toggleDeck = jQuery('<button>').attr({
        'type': 'button',
        'class': 'superDuper',
    }).css({
        'position': 'absolute',
        'margin-left': '-35px',
        'width': 'auto',
    }).text('C');

    // clone a copy of the button and add prepend to parent deck
    function cloneButton() {
        if (jQuery(card).find('.deck').text().replace(/\s/g, '') !== '') {
            jQuery(card).prepend($toggleDeck.clone());
        }
    }

    // hide or show card if in memory
    function autoToggleDeck() {
        if (GM_listValues().includes(jQuery(card).attr('id')) && GM_getValue(jQuery(card).attr('id'), false)) {
            jQuery(card).find('.deck').toggle();
        }
    };

    // loop through page outline
    function loopThroughOutline(callBack) {
        jQuery(pageOutline).find('section').each(function (index, card) {
            callBack;
        });
    };

    // remember deck id
    function saveId(cardID, bool) {
        GM_setValue(cardID, bool);
    }

    // retrieve dec if
    function getId(cardID) {
        return GM_getValue(cardID, false) || GM_getValue(cardID, false) === false ? true : false
    }

    // bind buttons
    function bindButtons() {
        editor.find('.superDuper').on('click', function () {
            const cardID = jQuery(this).parent().attr('id');
            let toggle = getId(cardID);
            jQuery(this).parent().find('.deck').toggle();
            saveId(cardID, toggle);
        });
    }

    jQuery(pageOutline).find('section').each(function (index, card) {
        // check if card ID is already stored
        if (GM_listValues().includes(jQuery(card).attr('id')) && GM_getValue(jQuery(card).attr('id'), false)) {
            jQuery(card).find('.deck').toggle();
        }
        // clone a copy of the button and add prepend to parent deck
        if (jQuery(card).find('.deck').text().replace(/\s/g, '') !== '') {
            jQuery(card).prepend($toggleDeck.clone());
        }
    });

    editor.find('.superDuper').on('click', function () {
        const cardID = jQuery(this).parent().attr('id');
        var toggle = GM_getValue(cardID, false) || GM_getValue(cardID, false) === false ? true : false;
        jQuery(this).parent().find('.deck').toggle();
        GM_setValue(cardID, toggle);
    });

    // ----------------------------------------
    // ----------------------------------------

    // other mods

    this.editor.find('div[template*="generateCardsAndOptions"]').css({
        'overflow': 'visible',
    });

    this.contentFrame.find('iframe#siteEditorIframe').css({
        'height': '99%',
    });
    this.siteEditorIframe.find('iframe#viewer.viewer').css({
        'height': '99%',
    });

    if (window.location.href.indexOf('&pageName=') === -1) {
        var newURL = window.location.href + '&pageName=' + jQuery(siteEditorIframe).find('#pageName').text();
        window.location.href = newURL;
    }
}

setTimeout(function () {
    'use strict';

    //    var uiUpgrades = new ToggleCardDeck();

    autoToggleDeck();
    addToggleButtons();
    //
    var $reloadTool = jQuery('<button>').attr({
        'type': 'button',
        'class': 'reloadTool',
    }).css({
        'position': 'absolute',
        'right': '11%',
        'top': '11%',
        'width': 'auto',
    }).text('reload');

    jQuery('.wsmMainHeader').append($reloadTool);

    $reloadTool.on('click', function () {
        addToggleButtons();
    });

}, 2000);
