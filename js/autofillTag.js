/*global document, location, localStorage, Sortable, NodeFilter */

(function () {
    'use strict';

    // ----------------------------------------
    // autofill menu
    // ----------------------------------------
    let $wsmEditerTools = jQuery('<div>').attr({
        'class': 'customEditorTools',
    });

    let $autofillOptions = jQuery('<div>').attr({

    });

    let $autofillOptionsList = jQuery('<ul>').attr({
        'id': 'autofillOptions',
    });

    let $button = jQuery('<button>').attr({
        'id': 'addAutofill',
        'value': 'addAutofill',
        'title': 'Add Autofill',
    }).html('<i class="fas fa-plus fa-lg"></i>');

    let $applyAutofills = jQuery('<button>').attr({
        'type': 'button',
        'class': 'applyAutofills',
        'title': 'apply autofills',
    }).html('<i class="fal fa-magic fa-lg"></i>');

    let $minimizeList = jQuery('<button>').attr({
        'type': 'button',
        'class': 'minimizeList',
        'title': 'toggle list',
    }).html('<i class="fal fa-user-secret fa-lg"></i>');

    $autofillOptions.append($autofillOptionsList);

    $wsmEditerTools.append($minimizeList).append($applyAutofills).append($autofillOptions);

    $autofillOptions.hide();

    jQuery('.wsmMainHeader').append($wsmEditerTools);

    $applyAutofills.on('click', function () {
        // use autofill tags
        autofills();
    });

    $minimizeList.on('click', function () {
        // use autofill tags
        $autofillOptions.slideToggle();
    });

    buildAutofillOptions($autofillOptionsList);

    /**
     * will construct the autofill display area.
     * Will use data in local storage, if it exists
     * @para {OBJECT ARRAY} $autofillOptionsList - autofill container div
     */
    function buildAutofillOptions(optionsList) {

        let regReplace = getFromLocalStorage();

        // attach 'add button'
        optionsList.after($button);

        // build autofill list options IF there is a list that already exists
        if (regReplace) {

            // loop through Legend Content list
            for (let key in regReplace) {
                if (regReplace.hasOwnProperty(key)) {

                    let secondArray = regReplace[key];

                    for (let key2 in secondArray) {

                        if (key2 === '') {
                            continue;
                        }
                        // build elements
                        let $listItem = jQuery('<li>').attr({
                            'class': 'autofillEntry',
                        });

                        let $grabHandle = jQuery('<span>').attr({
                            'class': 'my-handle',
                            'title': 'drag to re-order',
                        }).html('<i class="fas fa-sort"></i>');

                        let $label = jQuery('<div>').attr({
                            'class': 'autofillTag',
                        }).text(key2);

                        let $myInput = jQuery('<input>').attr({
                            'type': 'text',
                            'class': 'regEx',
                            'value': secondArray[key2],
                            'title': 'enter search string',
                        });

                        let $myPointer = jQuery('<i>').attr({
                            'class': 'fas fa-long-arrow-alt-right leftMarg fa-lg',
                        });

                        let $removeMe = jQuery('<i>').attr({
                            'class': 'fas fa-times fa-lg js-remove',
                            'title': 'click to remove',
                        });

                        // build list item
                        $listItem.append($grabHandle).append($myInput).append($myPointer).append($label).append($removeMe);


                        // attach to legend list
                        optionsList.append($listItem);

                        // bind list item
                        bindTextChangeListener($listItem);

                    }
                }
            }

        } else {

            for (let key3 in regReplace) {
                if (regReplace.hasOwnProperty(key3)) {

                    // build elements
                    let $listItem = jQuery('<li>').attr({
                        'class': key3,
                    }).css({
                        'width': '305px',
                    });

                    let $grabHandle = jQuery('<span>').attr({
                        'class': 'my-handle',
                        'title': 'drag to re-order',
                    }).html('<i class="fas fa-sort"></i>');

                    let $label = jQuery('<div>').attr({
                        'class': 'autofillTag',
                    }).text(key3);

                    let $myInput = jQuery('<input>').attr({
                        'type': 'text',
                        'value': '',
                        'class': 'regEx',
                        'title': 'enter search string',
                    });

                    let $myPointer = jQuery('<i>').attr({
                        'class': 'fas fa-long-arrow-alt-right leftMarg fa-lg',
                    });

                    let $removeMe = jQuery('<i>').attr({
                        'class': 'fas fa-times fa-lg js-remove',
                        'title': 'click to remove',
                    });

                    // build listing
                    $listItem.append($grabHandle).append($myInput).append($myPointer).append($label).append($removeMe);
                    // attach to legend list
                    optionsList.append($listItem);
                }
            }
        }
    }

    /**
     * creating an array of the autofill list options to store into memory
     * return {object} myObj - returns object array of autofill entries in list
     */
    function createArray() {
        const autofillList = jQuery('#autofillOptions li');
        const myObj = [];
        let saveAutofill = {};
        let autofillTag = '';
        let myRegex = '';
        let $myThis;

        for (let z = 0; z < autofillList.length; z += 1) {

            $myThis = jQuery(autofillList[z]);
            autofillTag = $myThis.find('.autofillTag').text();
            myRegex = typeof $myThis.find('.regEx').val() === 'undefined' ? '' : $myThis.find('.regEx').val(); // add validation checker to this value

            saveAutofill[autofillTag] = myRegex;
        }

        myObj.push(saveAutofill);

        return myObj;
    }

    // ----------------------------------------
    // sortable object
    // ----------------------------------------
    let autofillList = document.getElementById('autofillOptions');

    let sortable = Sortable.create(autofillList, {
        'group': 'autofillList',
        'handle': '.my-handle',
        'animation': 150,
        'store': {
            /**
             * Get the order of elements. Called once during initialization.
             * @param   {Sortable}  sortable
             * @returns {Array}
             */
            get: function (sortable) {
                let order = localStorage.getItem(sortable.options.group.name);
                return order ? order.split('|') : [];
            },

            /**
             * Save the order of elements. Called onEnd (when the item is dropped).
             * @param {Sortable}  sortable
             */
            set: function (sortable) {
                let order;
                if (typeof (Storage) !== 'undefined') {
                    order = sortable.toArray();
                    localStorage.setItem(sortable.options.group.name, order.join('|'));
                } else {
                    // Sorry! No Web Storage support..
                }
            }
        },
        'filter': '.js-remove',
        'onFilter': function (evt) {
            let item = evt.item;
            let ctrl = evt.target;

            if (Sortable.utils.is(ctrl, '.js-remove')) { // Click on remove button
                item.parentNode.removeChild(item); // remove sortable item

                saveState();
            }
        },
        // Called by any change to the list (add / update / remove)
        'onSort': function ( /**Event*/ evt) {

            // Save state
            saveState();

            // same properties as onUpdate
        },
    });

    /**
     * save object to local storage
     * @param {object} obj - object to be saved into local storage
     */
    function saveToLocalStorage(myObj) {
        let saveMe = JSON.stringify(myObj);
        localStorage.setItem('autofillVariables', saveMe);
    }

    /**
     * save current state of the list
     * @param {paramType} paramDescription
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
        jQuery(elem).find('input').on('change', function () {
            saveState();
        });
    }

    /**
     * retrive object from local storage
     * @param {object} obj - object to be saved into local storage
     */
    function getFromLocalStorage() {
        return JSON.parse(localStorage.getItem('autofillVariables'));
    }

    /**
     * will walk through edittable portion of WSM window and perform text
     * replacing with data contained in the list area of tool
     */
    function autofills() {
        const contentFrame = jQuery('iframe#cblt_content').contents();
        let siteEditorIframe;
        let viewerIframe;
        let myChild;
        let recordEditWindow;
        let regReplace;

        if (location.pathname.indexOf('editSite') >= 0) {
            siteEditorIframe = contentFrame.find('iframe#siteEditorIframe').contents();
            viewerIframe = siteEditorIframe.find('iframe#viewer').contents();

            // return array of elements that have children
            myChild = viewerIframe.find('body').children().filter(function (index, value) {
                if (value.children.length !== 0) {
                    return this;
                }
            });

            // get stored autofill tags from local storage
            regReplace = getFromLocalStorage();

            // pass elements with children as base element for autofill replacing
            useAutofillTags(myChild, regReplace[0]);

        } else {

            recordEditWindow = contentFrame.find('div.main-wrap').find('.input-field').find('div[data-which-field="copy"]');

            // get stored autofill tags from local storage
            regReplace = getFromLocalStorage();

            // pass elements with children as base element for autofill replacing
            useAutofillTags(recordEditWindow, regReplace[0]);

            // change focus between text area to trigger text saving.
            for (let z = 0; z < recordEditWindow.length; z += 1) {
                jQuery(recordEditWindow[z]).focus();
            }
        }
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
     * loop through word list array and replace text with autofill tags
     * @param {object} baseElem - base element to find and replace text with autofill tags
     * @param {array} regReplace - object array that contains the regExpressions and corresponding autofill tags
     */
    function useAutofillTags(baseElem, regReplace) {
        let wordList;

        for (let z = 0; z < baseElem.length; z += 1) {
            // get all visible text on page
            wordList = treeWalk(baseElem[z]);

            wordList.forEach(function (n) {
                let text = n.nodeValue;

                // iterate through autofill array and replace matches in text
                // replace all instances of 'findMe' with 'autofillTag'
                for (let autofillTag in regReplace) {

                    let findMe = regReplace[autofillTag];

                    if (findMe.indexOf('``') > -1) {
                        let findArray = findMe.split('``');
                        for (let a = 0; a < findArray.length; a += 1) {
                            let myRegex = new RegExp(findArray[a], 'gi');

                            text = text.replace(myRegex, autofillTag);
                        }

                    } else {

                        let myRegex = new RegExp(findMe, 'gi');

                        text = text.replace(myRegex, autofillTag);
                    }
                }

                n.nodeValue = text;
            });
        }
    }

    /**
     * creates a new autofill entry for the autofill tool,
     * triggers save event once entry has been created
     */
    document.getElementById('addAutofill').onclick = function () {
        let autofillTag = prompt('Enter autofill tag for the new feild.', '%AUTOFILL_TAG_HERE%');

        if (autofillTag === null || autofillTag === '') {
            alert('please try again, enter an autofill tag');
        } else {

            let el = document.createElement('li');
            el.classList.add('autofillEntry');

            el.innerHTML = '<span class="my-handle" title="drag to re-order"><i class="fas fa-sort"></i></span><input class="regEx" type="text" title="enter search string"><i class="fas fa-long-arrow-alt-right leftMarg fa-lg"></i><div class="autofillTag">' + autofillTag + '</div><i class="fas fa-times fa-lg js-remove" title="click to remove"></i>';
            let $autofillOptionsList = jQuery('#autofillOptions');

            $autofillOptionsList.append(el);
            bindTextChangeListener(el);
        }

        saveState();

    };

    /**
     * read data from json file
     */
    function readJson() {
        var autofillURL = 'https://raw.githubusercontent.com/cirept/WSMupgrades/master/json/autofillTags.json';
        var jsonMe;
        jQuery.getJSON(autofillURL, function (data) {
            console.log(data.autofill);
            jsonMe = data.autofill;
        });
//        console.log(jsonMe);
    }

    readJson();

    /**
     * css styles for tool
     */
    const $myStyles = jQuery('<style>').attr({
        'type': 'text/css',
    }).text(`
.customEditorTools {
    position: absolute;
    left: 57%;
    width: auto;
    color: white;
    background: linear-gradient(to top, #2193b0, #6dd5ed);
}

#addAutofill {
    width: 100%;
    padding: 5px 30px;
}

.applyAutofills {
    width: auto;
    position: relative;
    padding: 5px 30px;
}

.minimizeList {
    position: relative;
    float: right;
    padding: 5px 30px;
}

.my-handle {
    border: 1px dotted rgb(255, 255, 255);
    padding: 2px 6px 2px 5px;
    cursor: move;
    cursor: -webkit-grabbing;
}

.autofillTag {
    width: 120px;
    display: inline-block;
    text-align: center;
    color: black;
}

.regEx {
    background: rgb(109, 213, 237);
    border: 1px solid rgb(255, 255, 255);
    line-height: 1.25rem;
    text-indent: 10px;
    margin: 0 0 0 15px;
}

.autofillEntry {
    width: auto;
    padding: 5px 10px;
    border: 1px solid rgb(255, 255, 255);
    margin: 10px;
}

.js-remove {
    cursor: pointer;
    cursor: hand;
    padding: 0 0 0 10px;
}

.leftMarg {
    margin: 0 0 0 15px;
}
`);
    jQuery('head').append($myStyles);
})();
