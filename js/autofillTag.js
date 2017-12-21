/*global document, location, localStorage, Sortable, NodeFilter, window */

var Autofill = (function () {
    'use strict';

    let myURL = 'https://raw.githubusercontent.com/cirept/WSMupgrades/master/json/autofillTags2.json';
    let defaultList = {
        '%DEALER_NAME%': 'SEARCH_FOR_ME',
        '%FRANCHISES%': 'SEARCH_FOR_ME',
        '%STREET%': 'SEARCH_FOR_ME',
        '%CITY%': 'SEARCH_FOR_ME',
        '%STATE%': 'SEARCH_FOR_ME',
        '%ZIP%': 'SEARCH_FOR_ME',
        '%PHONE%': 'SEARCH_FOR_ME',
    };
    defaultValues();

    // ----------------------------------------
    // autofill menu
    // ----------------------------------------
    let wsmEditerTools = document.createElement('div');
    wsmEditerTools.classList.add('customEditorTools');

    let autofillOptionsContainer = document.createElement('div');
    autofillOptionsContainer.classList.add('autofillOptionsContainer');
    autofillOptionsContainer.classList.add('hide');

    // Show list button Icon
    let showIco = document.createElement('i');
    showIco.classList.add('fas', 'fa-eye', 'fa-lg', 'showlist');

    // minimize list element
    let minimizeList_button = document.createElement('button');
    minimizeList_button.classList.add('minimizeList');
    minimizeList_button.classList.add('minorButtons');
    minimizeList_button.classList.add('myButts');
    minimizeList_button.dataset.feature = 'minimizeList';
    minimizeList_button.title = 'hide/show list';
    minimizeList_button.type = 'button';
    minimizeList_button.onclick = maximizeListButtonActions;
    // attach icon
    minimizeList_button.appendChild(showIco);
    //    minimizeList_button.onclick = toggleToolPanel;
//    minimizeList_button.onclick = maximizeListButtonActions;

    let autofillOptionsList = document.createElement('ul');
    autofillOptionsList.id = 'autofillOptions';
    autofillOptionsList.classList.add('autofillOptions');

    let messageDisplay = document.createElement('span');
    messageDisplay.id = 'toolMessageDisplay';
    messageDisplay.textContent = `Autofill tag text replacer tool v${GM_info.script.version}`;

    // Reset button Icon
    let resetIco = document.createElement('i');
    resetIco.classList.add('fas', 'fa-redo', 'fa-lg');

    let defaultReset_button = document.createElement('button');
    defaultReset_button.id = 'defaultReset';
    defaultReset_button.classList.add('myButts');
    defaultReset_button.title = 'Reset Values';
    defaultReset_button.onclick = resetValues;
    // attach button icon
    defaultReset_button.appendChild(resetIco);
    //    defaultReset_button.onclick = reset;

    // Apply button Icon
    let checkIco = document.createElement('i');
    checkIco.classList.add('fas', 'fa-check', 'fa-lg');

    let applyAutofills_button = document.createElement('button');
    applyAutofills_button.id = 'applyAutofills';
    applyAutofills_button.classList.add('myButts');
    applyAutofills_button.type = 'button';
    applyAutofills_button.title = 'apply autofills';
    applyAutofills_button.dataset.feature = 'replace';
    applyAutofills_button.onclick = autofills;
    // attach button icon
    applyAutofills_button.appendChild(checkIco);

    // Add button Icon
    let plusIco = document.createElement('i');
    plusIco.classList.add('fas', 'fa-plus', 'fa-lg');

    let add_button = document.createElement('button');
    add_button.id = 'addAutofill';
    add_button.classList.add('myButts');
    add_button.value = 'addAutofill';
    add_button.title = 'Add Autofill';

    // attach button icon
    add_button.appendChild(plusIco);

    let autofill_dropdown = document.createElement('ul');
    autofill_dropdown.tabIndex = '4';
    autofill_dropdown.classList.add('autofill-dropdown');
    autofill_dropdown.classList.add('hide');
    autofill_dropdown.onblur = hideMe;

    autofillOptionsContainer.appendChild(messageDisplay);
    autofillOptionsContainer.appendChild(autofillOptionsList);
    autofillOptionsContainer.appendChild(defaultReset_button);
    autofillOptionsContainer.appendChild(add_button);
    autofillOptionsContainer.appendChild(autofill_dropdown);

    // Remove Highlight Icon
    let removeHighIco = document.createElement('span');
    removeHighIco.classList.add('fa-layers', 'fa-fw', 'removeHighlight');
    removeHighIco.style.margin = '2px'; // hard code to make it easier to maintain
    let removeHighIcoBg = document.createElement('i');
    removeHighIcoBg.classList.add('fa', 'fa-tint');
    removeHighIcoBg.dataset.faTransform = 'shrink-1';
    let removeHighIcoFg = document.createElement('i');
    removeHighIcoFg.classList.add('red1', 'fas', 'fa-ban');
    removeHighIcoFg.dataset.faTransform = 'grow-8';

    removeHighIco.appendChild(removeHighIcoBg);
    removeHighIco.appendChild(removeHighIcoFg);

    // Hide list Icon
    let hideIco = document.createElement('span');
    hideIco.classList.add('fa-layers', 'fa-fw', 'hideList');
    hideIco.style.margin = '2px'; // hard code to make it easier to maintain
    let hideIcoBg = document.createElement('i');
    hideIcoBg.classList.add('fa', 'fa-eye');
    hideIcoBg.dataset.faTransform = 'shrink-1';
    let hideIcoFg = document.createElement('i');
    hideIcoFg.classList.add('red1', 'fas', 'fa-ban');
    hideIcoFg.dataset.faTransform = 'grow-8';

    hideIco.appendChild(hideIcoBg);
    hideIco.appendChild(hideIcoFg);

    // Add button Icon
    let dropletIco = document.createElement('i');
    dropletIco.classList.add('fas', 'fa-tint', 'fa-lg');
    dropletIco.setAttribute('data-fa-transform', 'shrink-3');

    // highlight autofills
    let highlightAutofills_button = document.createElement('button');
    highlightAutofills_button.classList.add('highlightAutofills');
    highlightAutofills_button.classList.add('minorButtons');
    highlightAutofills_button.classList.add('myButts');
    highlightAutofills_button.dataset.feature = 'highlight';
    highlightAutofills_button.title = 'highlight autofills';
    highlightAutofills_button.type = 'button';
    highlightAutofills_button.onclick = highlightButtonActions;

    // attach button icon
    highlightAutofills_button.appendChild(dropletIco);
    //    highlightAutofills_button.onclick = autofills;

    wsmEditerTools.appendChild(minimizeList_button);
    wsmEditerTools.appendChild(applyAutofills_button);
    wsmEditerTools.appendChild(highlightAutofills_button);
    wsmEditerTools.appendChild(autofillOptionsContainer);

    //    minimizeList_button.onclick = toggleToolPanel;

    // attach tool elements to page
    document.querySelector('header.wsmMainHeader').appendChild(wsmEditerTools);

    /**
     * Function called after 'highlight autofill' button is clicked
     * 1. Will Change the button icon
     * 2. Highlight all autofills on the page
     */
    function highlightButtonActions() {
        let eventType = event.currentTarget.dataset.feature;
        //        console.log(eventType);

        toggleBanIcons(eventType);
        autofills(eventType);
    }

    /**
     * 1. Will Change the button icon
     * 2. Highlight all autofills on the page
     */
    function minimizeListButtonActions() {
        let eventType = event.currentTarget.dataset.feature;
        //        console.log(eventType);

        toggleBanIcons(eventType);
        /* show main tool panel */
        autofillOptionsContainer.classList.toggle('hide');
        //        autofills(eventType);
        minimizeList_button.onclick = maximizeListButtonActions;
    }

    /**
     * 1. Will remove the 'cancel' image from the button icon
     * 2. Highlight all autofills on the page
     */
    function maximizeListButtonActions() {
        let eventType = event.currentTarget.dataset.feature;
        //        console.log(eventType);

        toggleBanIcons(eventType);
        /* show main tool panel */
        autofillOptionsContainer.classList.toggle('hide');
        //        autofills(eventType);
        minimizeList_button.onclick = minimizeListButtonActions;
    }
    //    let contentFrame = jQuery('iframe#cblt_content').contents();
    //    let siteEditorIframe = contentFrame.find('iframe#siteEditorIframe').contents();
    //    let viewerIframe = siteEditorIframe.find('iframe#viewer'); //.contents();
    //    console.log(viewerIframe); //.contents();
    //    let editor = siteEditorIframe.find('#editor-wrapper').find('#editor').contents();

    //    console.log(editor);
    //    let contentFrame = jQuery('iframe#cblt_content').addClass('helloworld').contents();
    ////    debugger;
    //    console.log(contentFrame);
    //    let siteEditorIframe = jQuery(contentFrame).find('iframe#siteEditorIframe').addClass('helloworld').contents();
    //    console.log(siteEditorIframe);
    //    let currentPageFrame = jQuery(siteEditorIframe).find('iframe#viewer').addClass('helloworld');
    //    console.log(currentPageFrame);

    //    let $contentFrame = jQuery('iframe#cblt_content');

    //    $contentFrame.css({
    //        'border': '2px solid rgb(255, 192, 203)',
    //    });

    //    let siteEditorFrame = $contentFrame.contents().find('iframe#siteEditorIframe');
    // ----------------------------------------
    // ----------------------------------------
    //    let siteEditorIframe = jQuery(contentFrame).contents().find('iframe#siteEditorIframe').css({
    //        'border': '2px solid purple',
    //    });
    //
    //    let editor = siteEditorIframe.find('#editor-wrapper').find('#editor').contents();
    //
    //    let pageOutline = jQuery(editor).find('#pageOutline').find('div[template*="generateCardsAndOptions"]');
    //    debugger;
    //    let editor = this.siteEditorIframe.find('#editor-wrapper').find('#editor').contents();
    //    let pageOutline = jQuery(this.editor).find('#pageOutline').find('div[template*="generateCardsAndOptions"]');

    /**
     * jQuery functions for animate css
     */
    $.fn.extend({
        'animateCss': function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function () {
                $(this).removeClass('animated ' + animationName);
            });
            return this;
        },
    });

    /**
     *
     */
    function toggleBanIcons(eventType) {
        //        debugger;
        //        console.log('toggle ban icons');
        //                let elem = event.currentTarget.dataset.feature;
        //                let parentElem = event.currentTarget.parentElement;
        //                elem === 'minimizeList' ? : ;
        console.log(eventType);
        switch (eventType) {
            case 'highlight':
                highlightAutofills_button.innerHTML = removeHighIco.outerHTML;
                break;
            case 'minimizeList':
                minimizeList_button.innerHTML = hideIco.outerHTML;
                break;
        }
    }
    /**
     * Will show or hide the tool's panel
     * will also update the button's icon and hover text
     */
    function toggleToolPanel() {

        /* show main tool panel */
        autofillOptionsContainer.classList.toggle('hide');

        /* change icon depending on current state */
        if (autofillOptionsContainer.classList.contains('hide')) {
            minimizeList_button.innerHTML = '<i class="fas fa-eye fa-lg"></i>';
            minimizeList_button.title = 'show list';
        } else {
            minimizeList_button.innerHTML = '<i class="fas fa-eye-slash fa-lg"></i>';
            minimizeList_button.title = 'hide list';
        }
    }

    /**
     * apply 'hide' class to element
     * @param {object} event - element that will get the 'hide' class added to it class list
     */
    function hideMe(event) {

        if (!event.target.classList.contains('hide')) {
            event.target.classList.add('hide');
        }
        if (add_button.classList.contains('disabled')) {
            add_button.classList.remove('disabled');
        }
    }

    /**
     * Build a generic list item to use through out the tool
     * @param {string} autofill - the text that will be used to fill in the autofillTag div
     * @param {string} text - the text that will be used as the input value
     */
    function listItem(autofill, text) {

        if (!text) {
            text = 'SEARCH_FOR_ME';
        }

        let listElement = document.createElement('li');
        listElement.classList.add('autofillEntry');

        let grabHandle = document.createElement('span');
        grabHandle.classList.add('my-handle');
        grabHandle.title = 'drag to re-order';
        grabHandle.innerHTML = '<i class="fas fa-sort"></i>';

        let label = document.createElement('div');
        label.classList.add('autofillTag');
        label.textContent = autofill;

        let myInput = document.createElement('input');
        myInput.type = 'text';
        myInput.classList.add('regEx');
        myInput.title = 'enter search string';
        myInput.value = text;
        myInput.onkeypress = function () {
            this.style.width = (this.value.length + 1) * 8 + 'px';
        };

        let myPointer = document.createElement('i');
        myPointer.classList.add('fas');
        myPointer.classList.add('fa-long-arrow-alt-right');
        myPointer.classList.add('leftMarg');
        myPointer.classList.add('fa-lg');

        let removeMeContainer = document.createElement('div');
        removeMeContainer.classList.add('js-remove');
        removeMeContainer.title = 'click to remove';

        let removeMe = document.createElement('i');
        removeMe.classList.add('fas');
        removeMe.classList.add('fa-times');
        removeMe.classList.add('fa-lg');

        removeMeContainer.appendChild(removeMe);

        // build list item
        listElement.appendChild(grabHandle);
        listElement.appendChild(myInput);
        listElement.appendChild(myPointer);
        listElement.appendChild(label);
        listElement.appendChild(removeMeContainer);

        return listElement;
    }

    /**
     * save object to local storage
     * @param {object} obj - object to be saved into local storage
     */
    function saveToLocalStorage(myObj) {

        console.log('autofill : saving');
        let saveMe = JSON.stringify(myObj);
        localStorage.setItem('autofillVariables', saveMe);
    }

    /**
     * creating an array of the configured autofill tags
     * Also performs simple validation to prevent empty values being saved
     * return {object} myObj - returns object array of autofill entries in list
     */
    function createArray() {

        let myObj = [];
        let saveAutofill = {};
        let autofillTag = '';
        let myRegex = '';
        let regexInput;
        let $myThis;

        // loop through configured autofills
        for (let z = 0; z < autofillOptionsList.children.length; z += 1) {

            $myThis = jQuery(autofillOptionsList.children[z]);
            autofillTag = jQuery.trim($myThis.find('.autofillTag').text()); // trim it just in case the manual autofill input is triggerd
            regexInput = $myThis.find('.regEx');
            myRegex = regexInput.val().trim();

            // validate input
            // do not save until input  empty
            if (myRegex === '') {
                autofillOptionsList.children[z].classList.add('myError');
                applyAutofills_button.classList.add('disabled');
                messageDisplay.textContent = 'Please enter a word to search for.';
                continue;
            } else {
                if (autofillOptionsList.children[z].classList.contains('myError')) {
                    autofillOptionsList.children[z].classList.remove('myError');
                }
            }

            saveAutofill[autofillTag] = myRegex;
        }

        myObj.push(saveAutofill);

        return myObj;
    }

    /**
     * Scan autofill drop down list and remove disable class
     * @param {object} elem - element that being removed from the configured list
     */
    function removeDisable(elem) {

        let autofillTag = elem.querySelector('.autofillTag').textContent;
        let dropDown = autofill_dropdown.querySelectorAll('.disabled');
        let dropDownLength = dropDown.length;

        for (let z = 0; z < dropDownLength; z += 1) {
            if (autofillTag === dropDown[z].textContent) {
                dropDown[z].classList.remove('disabled');
            }
        }
    }

    /**
     * disabled 'magic' button if an entry is blank
     */
    function toggleMagicButton() {

        autofillOptionsList.getElementsByClassName('myError').length >= 1 ? applyAutofills_button.classList.add('disabled') : applyAutofills_button.classList.remove('disabled');
    }

    /**
     * Validates the autofill list options
     */
    function validateList() {

        if (autofillOptionsList.getElementsByClassName('myError').length > 0) {
            messageDisplay.textContent = 'Please enter a word to search for.';
            $('#toolMessageDisplay').animateCss('flash');
        } else {
            if (applyAutofills_button.classList.contains('disabled')) {
                applyAutofills_button.classList.remove('disabled');
            }

            if (messageDisplay.textContent !== '') {
                messageDisplay.textContent = '';
            }
        }
    }

    // Build Sortable object for use in tool
    let sortable = Sortable.create(autofillOptionsList, {
        'group': 'autofillOptions',
        'handle': '.my-handle',
        'animation': 150,
        'store': {
            /**
             * Get the order of elements. Called once during initialization.
             * @param   {Sortable}  sortable
             * @returns {Array}
             */
            'get': function (sortable) {

                let order = localStorage.getItem(sortable.options.group.name);
                return order ? order.split('|') : [];
            },

            /**
             * Save the order of elements. Called onEnd (when the item is dropped).
             * @param {Sortable}  sortable
             */
            'set': function (sortable) {

                let order;
                if (typeof Storage !== 'undefined') {
                    order = sortable.toArray();
                    localStorage.setItem(sortable.options.group.name, order.join('|'));
                } else {
                    // Sorry! No Web Storage support..
                }
            },
        },
        'filter': '.js-remove',
        /**
         * event, if list item is removed
         */
        'onFilter': function (evt) {

            let item = evt.item;
            let ctrl = evt.target;

            if (Sortable.utils.is(ctrl, '.js-remove')) { // Click on remove button
                item.parentNode.removeChild(item); // remove sortable item
                messageDisplay.textContent = 'Item Removed';
                jQuery(messageDisplay).animateCss('tada');

                // Save state
                sortable.save();
                saveToLocalStorage(createArray());
                removeDisable(item);

            }
        },
        // Called by any change to the list (add / update / remove)
        'onSort': function ( /* evt */ ) {

            // Save state
            sortable.save();
            saveToLocalStorage(createArray());
        },
    });

    /**
     * display message that list have been saved
     */
    function displaySaveMessage() {

        messageDisplay.textContent = 'List Saved';
        jQuery(messageDisplay).animateCss('tada');
    }

    /**
     * save current state of the list, only if the configured list
     * has no errors
     */
    function saveState() {

        sortable.save();
        saveToLocalStorage(createArray());
    }

    /**
     * will bind all new option list with a on text change listener
     * @param {element} elem - new autofill list option
     */
    function bindTextChangeListener(elem) {

        jQuery(elem).find('input').on('change', saveState);
        jQuery(elem).find('input').on('change', toggleMagicButton);
        jQuery(elem).find('input').on('change', validateList);
        jQuery(elem).find('input').on('keyup', saveState);
        jQuery(elem).find('input').on('keyup', toggleMagicButton);
        jQuery(elem).find('input').on('keyup', validateList);
    }

    /**
     * retrive object from local storage
     * retrive object from local storage
     * @param {object} obj - object to be saved into local storage
     */
    function getFromLocalStorage() {

        let returnMe;
        console.log('autofill : get local data');
        if (localStorage.getItem('autofillVariables') === null) {
            console.log('autofill : no local data');
            returnMe = defaultList;
        } else {
            console.log('autofill : local data found');
            returnMe = JSON.parse(localStorage.getItem('autofillVariables'));
            returnMe = returnMe[0];
        }
        return returnMe;
    }

    /**
     * will construct the autofill display area.
     * Will use data in local storage, if it exists
     */
    function buildAutofillOptions() {

        let regReplace = getFromLocalStorage();
        let listElement;

        // build autofill list options IF there is a list that already exists
        if (regReplace) {

            // loop through Legend Content list
            for (let key in regReplace) {
                if (regReplace.hasOwnProperty(key)) {

                    if (key === '') {
                        continue;
                    }

                    listElement = listItem(key, regReplace[key]);

                    // attach to legend list
                    autofillOptionsList.append(listElement);

                    // bind list item elements
                    bindTextChangeListener(listElement);
                }
            }
        }
    }

    /**
     * TEST RESET FUNCTION
     */
    function reset() {
        let callingElement =
            resetValues();
        toggleIcon();
    }

    /**
     *
     */
    function toggleIcon() {

    }
    /**
     * Reset configured autofill tags to the default list
     */
    function resetValues() {

        if (window.confirm('Reset Values?')) {
            // erase current list
            autofillOptionsList.innerHTML = '';
            // remove stored variables from memory
            localStorage.removeItem('autofillVariables');
            // build default list
            buildAutofillOptions();
            // reset apply button if it is disabled
            toggleMagicButton();
            // update display message
            messageDisplay.textContent = 'Values Reset';
            jQuery('#toolMessageDisplay').animateCss('tada');
            // save new values
            saveState();
        }
    }

    /**
     * Converts the autofill tags in local memory to simple array
     * @return {object} autofill - contains a simple array with AUTOFILL tags ONLY
     */
    function localDataToString() {

        var localData = getFromLocalStorage();
        var autofill = [];

        for (let localKey in localData) {
            autofill.push(localKey);
        }

        return autofill;
    }

    /**
     * Creates an active menu item that the tool will use to replace text with autofill tags
     * @param {object} elem - element that will get it's onclick event binded
     */
    function createAutofillDropdownMenu(elem) {

        elem.onclick = function () {
            elem.classList.add('disabled');

            let listElement = listItem(elem.textContent);

            autofillOptionsList.appendChild(listElement);

            let listLength = listElement.children.length;

            for (let y = 0; y < listLength; y += 1) {
                if (listElement.children[y].tagName === 'INPUT') {
                    listElement.children[y].focus();
                }
            }
            // hide drop down menu
            document.querySelector('ul.autofill-dropdown').classList.add('hide');

            // bind list item elements
            bindTextChangeListener(listElement);

            // save state of new list
            saveState();

        };
    }

    /**
     * SUCCESS BINDING EVENT
     * Build out drop down list with data gathered from JSON file
     * @param {OBJECT} listContainer - the UL element that will contain autofill options
     * @param {object} data - the autofill data that will be used to populate the options
     */
    function buildAutofillList(data) {

        let localData = localDataToString();
        // build out drop down menu
        for (let myKey in data[0]) {
            // create 'li' for each autofill tag in the list
            let myListItem = document.createElement('li');
            myListItem.textContent = myKey;
            // if autofill tag is present in the active list, disable it
            if (localData.includes(myKey)) {
                myListItem.classList.add('disabled');
            }
            // add the list element to the 'drop down' list
            autofill_dropdown.appendChild(myListItem);
            // bind listener to 'li' item
            createAutofillDropdownMenu(myListItem);
            // attach new 'li' to main list
            let tooltipText = data[0][myKey] ? data[0][myKey] : '**No tooltip infor available**';
            myListItem.title = tooltipText;
        }
    }

    /**
     * FAILURE BINDING EVENT
     * Will display a prompt message that the user can manually input the autofill tag
     * @return {function} Prompts user for input, upon successfull input, will bind event listeners and save
     */
    function bindAddAutofill() {

        return function () {
            let autofillTag = window.prompt('Enter autofill tag for the new feild.', '%AUTOFILL_TAG_HERE%');

            if (autofillTag === null || autofillTag === '') {
                window.alert('please try again, please enter an autofill tag');
            } else if (localDataToString().includes(autofillTag)) {
                window.alert('please try again, autofill tag already present on list');
            } else {

                let listElement = listItem(autofillTag);

                autofillOptionsList.appendChild(listElement);

                // bind list item elements
                bindTextChangeListener(listElement);

                // save state of new list
                saveState();
            }
        };
    }

    /**
     * Bind onclick function dynamically depending on autofill JSON load
     * @param {bool} bool - boolean variable that will determine what method will be used
     */
    function add_buttonEventListener(bool) {

        if (bool) {
            return function () {
                this.classList.add('disabled');
                autofill_dropdown.classList.remove('hide');
                autofill_dropdown.focus();
            };
        }
        return bindAddAutofill();
    }

    /**
     * read data from json file
     */
    function fetchJSON(url) {

        return new Promise(function (resolve, reject) {

            jQuery.getJSON(url)
                .done( /** resolve data */ function (json) {
                    resolve(json.autofill);
                })
                .fail( /** error */ function (xhr, status, err) {
                    reject(status + err.message);
                });
        });
    }

    /**
     * Start events to build the autofill 'drop down menu'
     */
    function getAutofillList() {

        fetchJSON(myURL).then((data) => {
            console.log('autofill : autofill list loaded.');
            add_button.onclick = add_buttonEventListener(true);
            // build out drop down menu
            buildAutofillList(data);
        }).catch((error) => {
            console.log('autofill : autofill list failed to load, reverting to manual autofill entry method');
            console.log(error);
            add_button.onclick = add_buttonEventListener(false);
        });
    }

    /**
     * create treewalker to navigate DOM and return all TEXT nodes
     * @param {object} base - base element to crawl for text nodes
     * @return {array} wordArray - array containing all text nodes on the page
     */
    function treeWalk(base) {

        let treeWalker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, null, false);
        let wordArray = [];

        while (treeWalker.nextNode()) {
            if (treeWalker.currentNode.nodeType === 3 && treeWalker.currentNode.textContent.trim() !== '') {
                wordArray.push(treeWalker.currentNode);
            }
        }
        return wordArray;
    }

    /**
     * Escape characters to prevent malacious input from user
     */
    RegExp.escape = function (s) {

        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    /**
     * Test if phone number
     * Checked format = 000-0000
     */
    function phoneNumberText(text) {

        let phoneRegex = /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/g;

        if (phoneRegex.test(text)) {
            return RegExp.escape(text);
        }
        return '\\b' + RegExp.escape(text) + '\\b';
    }


    function replaceMarkers(elm) {
        if (elm) {
            elm.innerHTML = elm.innerHTML
                .replace(/~~@(.*?)@~~/g, '<span class="highlightMe">$1</span>');
        }
    }

    /**
     * Replaced matching words/phrases with the corresponding autofill tags
     * @param {array} wordList - array containing all the visible text in the edit area
     * @param {string} regReplace - text string to search for
     */
    function replaceText(wordList, regReplace) {

        //        var self = this;
        //        var pElm;
        //            var text;
        //            var words;
        //        var elm;

        wordList.forEach(function (n) {

            let text = n.nodeValue;
            //            elm = n.parentElement;
            // iterate through autofill array and replace matches in text
            // replace all instances of 'findMe' with 'autofillTag'
            for (let autofillTag in regReplace) {
                let findMe = regReplace[autofillTag];
                // if split phrases are needed
                if (findMe.indexOf('``') > -1) {
                    let findArray = findMe.split('``');
                    let arrayLength = findArray.length;
                    for (let a = 0; a < arrayLength; a += 1) {
                        let searchText = findArray[a].trim();
                        if (searchText === '') {
                            continue;
                        }
                        let findThis = phoneNumberText(findMe);
                        let myRegex = new RegExp(findThis, 'gi');
                        text = text.replace(myRegex, autofillTag); // replace with AUTOFILL Tag
                        //                        text = text.replace(myRegex, `<span class="highlightMe">${text}</span>`); // replace with highlight span
                    }
                } else {
                    let findThis = phoneNumberText(findMe);
                    let myRegex = new RegExp(findThis, 'gi');
                    text = text.replace(myRegex, autofillTag);
                    //                    text = text.replace(myRegex, '~~@$&@~~');
                }
            }
            n.nodeValue = text;

            //            console.log(pElm);
            //            console.log(elm);
            //            if (!pElm) {
            //                pElm = elm;
            //            } else if (!pElm.contains(elm)) {
            //                //                self.replaceMarkers(pElm);
            //                replaceMarkers(pElm);
            //                pElm = elm;
            //            }
        });
    }

    /**
     * Wraps matching words/phrases in a span tag for highlighting possible autofill tags
     * @param {array} wordList - array containing all the visible text in the edit area
     * @param {string} regReplace - text string to search for
     */
    function highlightText(wordList, regReplace) {

        var self = this;
        var pElm;
        //            var text;
        //            var words;
        var elm;

        wordList.forEach(function (n) {

            let text = n.nodeValue;
            elm = n.parentElement;
            // iterate through autofill array and replace matches in text
            // replace all instances of 'findMe' with 'autofillTag'
            for (let autofillTag in regReplace) {
                let findMe = regReplace[autofillTag];
                // if split phrases are needed
                if (findMe.indexOf('``') > -1) {
                    let findArray = findMe.split('``');
                    let arrayLength = findArray.length;
                    for (let a = 0; a < arrayLength; a += 1) {
                        let searchText = findArray[a].trim();
                        if (searchText === '') {
                            continue;
                        }
                        let findThis = phoneNumberText(findMe);
                        let myRegex = new RegExp(findThis, 'gi');
                        //                                                text = text.replace(myRegex, autofillTag);  // replace with AUTOFILL Tag
                        text = text.replace(myRegex, `<span class="highlightMe">${text}</span>`); // replace with highlight span
                    }
                } else {
                    let findThis = phoneNumberText(findMe);
                    let myRegex = new RegExp(findThis, 'gi');
                    //                                        text = text.replace(myRegex, autofillTag);
                    text = text.replace(myRegex, '~~@$&@~~');
                }
            }
            n.nodeValue = text;

            //            console.log(pElm);
            //            console.log(elm);
            if (!pElm) {
                pElm = elm;
            } else if (!pElm.contains(elm)) {
                //                self.replaceMarkers(pElm);
                replaceMarkers(pElm);
                pElm = elm;
            }
        });
    }

    /**
     * loop through word list array and replace text with autofill tags
     * @param {object} baseElem - base element to find and replace text with autofill tags
     * @param {array} regReplace - object array that contains the regExpressions and corresponding autofill tags
     */
    function useAutofillTags(baseElem, regReplace, eventType) {

        let wordList;
        let baseLength = baseElem.length;

        for (let z = 0; z < baseLength; z += 1) {
            // get all visible text on page
            wordList = treeWalk(baseElem[z]);
            eventType === 'replace' ? replaceText(wordList, regReplace) : highlightText(wordList, regReplace);
        }
    }

    /**
     * will walk through edittable portion of WSM window and perform text
     * replacing with data contained in the list area of tool
     */
    function autofills(eventType) {

        //        console.log(event.currentTarget.dataset.feature);
        const contentFrame = jQuery('iframe#cblt_content').contents();
        let siteEditorIframe;
        let viewerIframe;
        let myChild;
        let recordEditWindow;
        let regReplace = getFromLocalStorage(); // get stored autofill tags from local storage
        //        let eventType = event.currentTarget.dataset.feature;

        if (location.pathname.indexOf('editSite') >= 0) {
            siteEditorIframe = contentFrame.find('iframe#siteEditorIframe').contents();
            viewerIframe = siteEditorIframe.find('iframe#viewer').contents();

            // return array of elements that have children
            myChild = viewerIframe.find('body').children().filter(function (index, value) {

                if (value.children.length !== 0) {
                    return this;
                }
            });

            // pass elements with children as base element for autofill replacing
            useAutofillTags(myChild, regReplace, eventType);

        } else {

            recordEditWindow = contentFrame.find('div.main-wrap').find('.input-field').find('div[data-which-field="copy"]');

            // pass elements with children as base element for autofill replacing
            useAutofillTags(recordEditWindow, regReplace, eventType);

            // change focus between text area to trigger text saving.
            let recordLendth = recordEditWindow.length;
            for (let z = 0; z < recordLendth; z += 1) {
                jQuery(recordEditWindow[z]).focus();
            }
        }
    }

    /**
     * css styles for tool
     */
    function styleTools() {

        let animate = document.createElement('link');
        animate.rel = 'stylesheet';
        animate.type = 'text/css';
        animate.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css';


        let toolStyles = `
.customEditorTools {
    position: absolute;
    width: auto;
    color: white;
    background: #EAE8E8;
}

#toolMessageDisplay {
    position: absolute;
    top: 10px;
    left: 130px;
    color: red;
}

#addAutofill {
    width: 90%;
    padding: 5px 30px;
}

.myButts {
    background: #824FD6;
    border-radius: 5px;
    color: #fff;
    border: 1px solid rgb(147, 143, 143);
}

.myButts:hover {
    background: #793CC4;
    cursor: pointer;
    cursor: hand;
}

#applyAutofills {
    width: auto;
    position: relative;
    padding: 5px 30px;
    background: rgb(130, 198, 0);
}

#applyAutofills.disabled {
    background: #333;
}

.minorButtons {
    position: relative;
    padding: 5px 13px;
}

.minimizeList {
    float: right;
}

#defaultReset {
    position: relative;
    float: right;
    width: 10%;
    padding: 5px;
    background: rgb(255, 255, 255);
    color: rgb(130, 79, 214);
}

#defaultReset:hover {
    background: rgb(130, 79, 214);
    color: #fff;
}

.my-handle {
    border: 1px dotted #793CC4;
    padding: 2px 6px 2px 5px;
    cursor: move;
    cursor: -webkit-grabbing;
}

.autofillTag {
    width: 120px;
    display: inline-block;
    text-align: center;
    color: black;
    word-wrap: break-word;
}

.regEx {
    background: #793CC4;
    color: #fff;
    border: 1px solid rgb(255, 255, 255);
    line-height: 1.25rem;
    text-indent: 10px;
    margin: 0 0 0 15px;
    width: 200px;
}

.autofillEntry {
    width: auto;
    padding: 5px 10px;
    border: 1px solid #793CC4;
    margin: 3px 10px;
    color: #793CC4;
}

.js-remove {
    cursor: pointer;
    cursor: hand;
    padding: 0 0 0 10px;
    display: inline-block;
}

.leftMarg {
    margin: 0 0 0 15px;
}

.autofill-dropdown {
    height: 500px;
    width: 100%;
    overflow: auto;
    position: absolute;
    background: #0A0808;
}

.autofill-dropdown:focus {
    outline: 0;
}

.autofill-dropdown li {
    text-align: center;
    font-size: 12px;
    padding: 5px 0;
}

.autofill-dropdown li:hover {
    /*background: rgba(10, 8, 8, .5);*/
    background: rgba(121, 60, 196, .5);
    cursor: pointer;
    cursor: hand;
}

.autofillOptionsContainer {
    width: 450px;
}

.hide {
    display: none;
}

.disabled {
    pointer-events: none;
    background: rgba(0,0,0,.75);
    cursor: no-drop;
}

.myError {
    border: 1px solid red;
}

.red1 {
    color: rgb(255, 107, 107);
}

`;
        const myStyles = document.createElement('style');
        myStyles.type = 'text/css';
        myStyles.innerHTML = toolStyles;

        // attach styles to page
        document.head.append(myStyles);
        document.head.append(animate);
    }

    // run tool
    buildAutofillOptions();
    getAutofillList();
    styleTools();

    /**
     * Get data from 'Settings' to autofill into the defaults list
     */
    function defaultValues() {

        let webID = document.getElementById('siWebId').querySelector('label.displayValue').textContent;
        let siteSettingsURL = `editSiteSettings.do?webId=${webID}&locale=en_US&pathName=editSettings`;

        jQuery.get(siteSettingsURL, function (data) {

            let myDiv = document.createElement('div');
            myDiv.innerHTML = data;
            let franchises = myDiv.querySelector('select#associatedFranchises').options;
            let myLength = franchises.length;
            let myFranchises = [];

            // create dranchises string
            for (let x = 0; x < myLength; x += 1) {
                myFranchises.push(franchises[x].textContent);
            }

            defaultList['%DEALER_NAME%'] = myDiv.querySelector('input[name="name"]').value;
            defaultList['%STREET%'] = myDiv.querySelector('input#contact_address_street1').value;
            defaultList['%CITY%'] = myDiv.querySelector('input#contact_address_city').value;
            defaultList['%ZIP%'] = myDiv.querySelector('input#contact_address_postalCode').value;
            defaultList['%STATE%'] = myDiv.querySelector('select#contact_address_state').value;
            defaultList['%PHONE%'] = myDiv.querySelector('input[name="contact_phone_number"]').value;
            defaultList['%FRANCHISES%'] = myFranchises.join(', ');

        }, 'html');

    }

})();
