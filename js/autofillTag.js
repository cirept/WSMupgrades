/*global document */

(function () {
    'use strict';

    // ----------------------------------------
    // use autofills
    // ----------------------------------------
    function autofills() {
        var contentFrame = jQuery('iframe#cblt_content').contents();
        var siteEditorIframe = contentFrame.find('iframe#siteEditorIframe').contents();
        var viewerIframe = siteEditorIframe.find('iframe#viewer').contents();

        // return only elements that have children
        var myChild = viewerIframe.find('body').children().filter(function (index, value) {
            if (value.children.length !== 0) {
                return this;
            }
        });

        let regReplace = getFromLocalStorage();
        console.log(regReplace[0]);
        useAutofillTags(myChild, regReplace[0]);
    }

    /**
     * loop through word list array and replace text with autofill tags
     * @param {object} baseElem - base element to find and replace text with autofill tags
     * @param {array} regReplace - object array that contains the regExpressions and corresponding autofill tags
     */
    function useAutofillTags(baseElem, regReplace) {
        for (let z = 0; z < baseElem.length; z += 1) {
            // get all visible text on page
            var wordList = treeWalk(baseElem[z]);

            wordList.forEach(function (n) {
                var text = n.nodeValue;

                // iterate through autofill array and replace matches in text
                // replace all instances of 'findMe' with 'autofillTag'
                for (let autofillTag in regReplace) {

                    let findMe = regReplace[autofillTag];

                    if (findMe.indexOf('`') > -1) {
                        let findArray = findMe.split('`');
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
     * create treewalker to navigate DOM and return all TEXT nodes
     * @param {object} base - base element to crawl for text nodes
     * @return {array} wordArray - array containing all text nodes on the page
     */
    function treeWalk(base) {
        var treeWalker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, null, false);
        var wordArray = [];

        while (treeWalker.nextNode()) {
            if (treeWalker.currentNode.nodeType === 3 && treeWalker.currentNode.textContent.trim() !== '') {
                wordArray.push(treeWalker.currentNode);
            }
        }
        return wordArray;
    }

    // ----------------------------------------
    // autofill menu
    // ----------------------------------------
    var $wsmEditerTools = jQuery('<div>').attr({
        'class': 'customEditorTools',
    });

    var $autofillOptions = jQuery('<div>').attr({

    });

    var $autofillOptionsList = jQuery('<ul>').attr({
        'id': 'autofillOptions',
    });

    var $button = jQuery('<button>').attr({
        'id': 'addAutofill',
        'value': 'addAutofill',
    }).text('Add Autofill');

    var $applyAutofills = jQuery('<button>').attr({
        'type': 'button',
        'class': 'applyAutofills',
        'title': 'apply autofills',
    }).html('<i class="fal fa-magic fa-2x"></i>');

    var $minimizeList = jQuery('<button>').attr({
        'type': 'button',
        'class': 'minimizeList',
    }).text('toggle list');

    $autofillOptions.append($autofillOptionsList);

    $wsmEditerTools.append($minimizeList).append($applyAutofills).append($autofillOptions);

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

    /**
     * save current state of the list
     * @param {paramType} paramDescription
     */
    function saveState() {
        sortable.save();
        saveToLocalStorage(createArray());
    }
    /**
     * save object to local storage
     * @param {object} obj - object to be saved into local storage
     */
    function saveToLocalStorage(myObj) {
        var saveMe = JSON.stringify(myObj);
        localStorage.setItem('autofillVariables', saveMe);
    }

    /**
     * retrive object from local storage
     * @param {object} obj - object to be saved into local storage
     */
    function getFromLocalStorage() {
        return JSON.parse(localStorage.getItem('autofillVariables'));
    }

    // ----------------------------------------
    // sortable object
    // ----------------------------------------
    var el = document.getElementById('autofillOptions');

    var sortable = Sortable.create(el, {
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
                var order = localStorage.getItem(sortable.options.group.name);
                return order ? order.split('|') : [];
            },

            /**
             * Save the order of elements. Called onEnd (when the item is dropped).
             * @param {Sortable}  sortable
             */
            set: function (sortable) {

                if (typeof (Storage) !== 'undefined') {
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group.name, order.join('|'));
                } else {
                    // Sorry! No Web Storage support..
                }
            }
        },
        'filter': '.js-remove',
        'onFilter': function (evt) {
            var item = evt.item,
                ctrl = evt.target;

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
     * will bind all new option list with a on text change listener
     * @param {element} el - new autofill list option
     */
    function bindTextChangeListener(el) {
        jQuery(el).find('input').on('change', function (e) {
            console.log(e);

            saveState();
        })
    }

    document.getElementById('addAutofill').onclick = function () {
        var autofillTag = prompt('Enter autofill tag for the new feild.', '%DEALERNAME%');

        if (autofillTag === null || autofillTag === '') {
            alert('please enter an autofill tag');
        } else {

            var el = document.createElement('li');
            el.classList.add('autofillEntry');

            el.innerHTML = '<span class="my-handle" title="drag to re-order"><i class="fal fa-sort"></i></span><div class="autofillTag">' + autofillTag + '</div><input class="regEx" type="text" title="enter search string"> <i class="js-remove" title="click to remove"> ✖ </i>';
            var $autofillOptionsList = jQuery('#autofillOptions');

            $autofillOptionsList.append(el);
            bindTextChangeListener(el);
        }

        saveState();

    };

    /**
     * will construct the autofill display area.
     * Will use data in local storage, if it exists
     * @para {OBJECT ARRAY} $autofillOptionsList - autofill container div
     */
    function buildAutofillOptions($autofillOptionsList) {

        //        let key = '';
        //        let value = '';

        var regReplace = getFromLocalStorage();

        // attach 'add button'
        $autofillOptionsList.after($button);

        // build autofill list options IF there is a list that already exists
        if (regReplace) {

            // loop through Legend Content list
            for (let key in regReplace) {
                if (regReplace.hasOwnProperty(key)) {
                    //                    let value = regReplace[key];

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
                        }).html('<i class="fal fa-sort"></i>');

                        let $label = jQuery('<div>').attr({
                            'class': 'autofillTag',
                        }).text(key2);

                        let $myInput = jQuery('<input>').attr({
                            'type': 'text',
                            'class': 'regEx',
                            'value': secondArray[key2],
                            'title': 'enter search string',
                        });

                        let $removeMe = jQuery('<i>').attr({
                            'class': 'js-remove',
                            'title': 'click to remove',
                        }).text(' ✖ ');

                        // build list item
                        $listItem.append($grabHandle).append($label).append($myInput).append($removeMe);


                        // attach to legend list
                        $autofillOptionsList.append($listItem);

                        // bind list item
                        bindTextChangeListener($listItem);

                    }
                }
            }

        } else {

            for (let key3 in regReplace) {
                if (regReplace.hasOwnProperty(key3)) {
                    //                    value = regReplace[key3];

                    // build elements
                    let $listItem = jQuery('<li>').attr({
                        'class': key3,
                    }).css({
                        'width': '305px',
                    });

                    let $grabHandle = jQuery('<span>').attr({
                        'class': 'my-handle',
                        'title': 'drag to re-order',
                    }).html('<i class="fal fa-sort"></i>');

                    let $label = jQuery('<div>').attr({
                        'class': 'autofillTag',
                    }).text(key3);

                    let $myInput = jQuery('<input>').attr({
                        'type': 'text',
                        'value': '',
                        'class': 'regEx',
                        'title': 'enter search string',
                    });

                    let $removeMe = jQuery('<i>').attr({
                        'class': 'js-remove',
                        'title': 'click to remove',
                    }).text(' ✖ ');

                    // attach to legend list
                    $autofillOptionsList.append($listItem.append($grabHandle).append($label).append($myInput).append($removeMe));
                }
            }
        }
    }

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
    background: rgba(0, 0, 0, 0);
    border: 1px solid rgb(255, 255, 255);
    line-height: 1.25rem;
    text-indent: 10px;
}

.autofillEntry {
    width: auto;
    padding: 5px 10px;
}

.js-remove {
    cursor: pointer;
    cursor: hand;
}
`);
    jQuery('head').append($myStyles);
})();
