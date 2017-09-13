/*global document, location, localStorage, Sortable, NodeFilter */

var Autofill = (function () {
    'use strict';

    let myURL = 'https://raw.githubusercontent.com/cirept/WSMupgrades/master/json/autofillTags2.json';
    // ----------------------------------------
    // autofill menu
    // ----------------------------------------
    let wsmEditerTools = document.createElement('div');
    wsmEditerTools.classList.add('customEditorTools');

    let autofillOptionsContainer = document.createElement('div');
    autofillOptionsContainer.classList.add('autofillOptionsContainer');
    autofillOptionsContainer.classList.add('hide');

    let autofillOptionsList = document.createElement('ul');
    autofillOptionsList.id = 'autofillOptions';

    let addButton = document.createElement('button');
    addButton.id = 'addAutofill';
    addButton.classList.add('myButts');
    addButton.value = 'addAutofill';
    addButton.title = 'Add Autofill';
    addButton.innerHTML = '<i class="fas fa-plus fa-lg"></i>';

    let applyAutofills = document.createElement('button');
    applyAutofills.id = 'applyAutofills';
    applyAutofills.classList.add('myButts');
    applyAutofills.type = 'button';
    applyAutofills.title = 'apply autofills';
    applyAutofills.innerHTML = '<i class="fal fa-magic fa-lg"></i>';
    applyAutofills.onclick = autofills;

    // minimize list element
    let minimizeList = document.createElement('button');
    minimizeList.classList.add('minimizeList');
    minimizeList.classList.add('myButts');
    minimizeList.title = 'toggle list';
    minimizeList.type = 'button';
    minimizeList.innerHTML = '<i class="fal fa-user-secret fa-lg"></i>';
    minimizeList.onclick = function () {
        autofillOptionsContainer.classList.toggle('hide');
    };

    let autofillDropdown = document.createElement('ul');
    autofillDropdown.tabIndex = '4';
    autofillDropdown.classList.add('autofill-dropdown');
    autofillDropdown.classList.add('hide');
    autofillDropdown.onblur = hideMe;

    autofillOptionsContainer.appendChild(autofillOptionsList);
    autofillOptionsContainer.appendChild(addButton);
    autofillOptionsContainer.appendChild(autofillDropdown);

    wsmEditerTools.appendChild(minimizeList);
    wsmEditerTools.appendChild(applyAutofills);
    wsmEditerTools.appendChild(autofillOptionsContainer);

    // attach tool elements to page
    document.querySelector('header.wsmMainHeader').appendChild(wsmEditerTools);

    /**
     * apply 'hide' class to element
     * @param {object} event - element that will get the 'hide' class added to it class list
     */
    function hideMe(event) {
        //        let addButton = document.getElementById('addAutofill');

        if (!event.target.classList.contains('hide')) {
            event.target.classList.add('hide');
        }
        if (addButton.classList.contains('disabled')) {
            addButton.classList.remove('disabled');
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

        let myPointer = document.createElement('i');
        myPointer.classList.add('fas');
        myPointer.classList.add('fa-long-arrow-alt-right');
        myPointer.classList.add('leftMarg');
        myPointer.classList.add('fa-lg');

        let removeMeContainer = document.createElement('div');
        removeMeContainer.classList.add('js-remove');

        let removeMe = document.createElement('i');
        removeMe.classList.add('fas');
        removeMe.classList.add('fa-times');
        removeMe.classList.add('fa-lg');
        removeMe.title = 'click to remove';

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
        let saveMe = JSON.stringify(myObj);
        localStorage.setItem('autofillVariables', saveMe);
    }

    /**
     * creating an array of the autofill list options to store into memory
     * return {object} myObj - returns object array of autofill entries in list
     */
    function createArray() {
        let myObj = [];
        let saveAutofill = {};
        let autofillTag = '';
        let myRegex = '';
        let $myThis;

        for (let z = 0; z < autofillOptionsList.children.length; z += 1) {

            $myThis = jQuery(autofillOptionsList.children[z]);
            autofillTag = $myThis.find('.autofillTag').text();
            myRegex = typeof $myThis.find('.regEx').val() === 'undefined' ? 'Please Enter a Value' : $myThis.find('.regEx').val(); // add validation checker to this value

            saveAutofill[autofillTag] = myRegex;
        }

        myObj.push(saveAutofill);

        return myObj;
    }

    // Build Sortable object for use in tool
    let sortable = Sortable.create(autofillOptionsList, {
        'group': 'autofillList',
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
        'onFilter': function (evt) {
            let item = evt.item;
            let ctrl = evt.target;

            if (Sortable.utils.is(ctrl, '.js-remove')) { // Click on remove button
                item.parentNode.removeChild(item); // remove sortable item

                // Save state
                sortable.save();
                saveToLocalStorage(createArray());
            }
        },
        // Called by any change to the list (add / update / remove)
        'onSort': function ( /**Event*/ evt) {

            // Save state
            sortable.save();
            saveToLocalStorage(createArray());
        },
    });

    /**
     * save current state of the list
     * @param {paramType} paramDescription
     */
    function saveState() {
        sortable.save();
        saveToLocalStorage(createArray());
    }

    /**
     * Will remove the element from the page
     * @param {object} elem - elem that will be removed from the page
     */
    function removeMyself(elem) {
        let self = elem;
        let parent = self.parentElement;
        return function () {
            parent.removeChild(self);
            saveState();
        };
    }

    /**
     * will bind all new option list with a on text change listener
     * @param {element} elem - new autofill list option
     */
    function bindTextChangeListener(elem) {
        jQuery(elem).find('input').on('change', function () {
            saveState();
        });
        jQuery(elem).find('input').on('keyup', function () {
            saveState();
        });
    }

    /**
     * will bind all new option list item with the remove event listener for the 'X'
     * @param {element} elem - new autofill list option
     */
    function bindRemoveMeListener(elem) {
        jQuery(elem).find('.js-remove').on('click', function () {
            removeMyself(elem);
            saveState();
        });
    }

    /**
     * retrive object from local storage
     * @param {object} obj - object to be saved into local storage
     */
    function getFromLocalStorage() {
        let returnMe;

        if (localStorage.getItem('autofillVariables') === null) {
            returnMe = '';
        } else {
            returnMe = JSON.parse(localStorage.getItem('autofillVariables'));
            returnMe = returnMe[0];
        }
        return returnMe;

        //                    return JSON.parse(localStorage.getItem('autofillVariables'));
    }

    /**
     * will construct the autofill display area.
     * Will use data in local storage, if it exists
     * @para {OBJECT ARRAY} $autofillOptionsList - autofill container div
     */
    function buildAutofillOptions(optionsList) {

        let regReplace = getFromLocalStorage()[0];
        let listElement;

        // attach 'add button'
        optionsList.after(document.getElementById('addAutofill'));

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
                    optionsList.append(listElement);

                    // bind list item
                    bindTextChangeListener(listElement);
                    bindRemoveMeListener(listElement);
                }
            }

        }
        /*
        else {

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
        */
    }

    /**
     * Converts the autofill tags in local memory to simple array
     * @return {object} autofill - contains a simple array with AUTOFILL tags ONLY
     */
    function localDataToString() {
        var localData = getFromLocalStorage()[0];
        var autofill = [];

        for (let localKey in localData) {
            autofill.push(localKey);
        }

        return autofill;
    }
    /**
     * Disable list items during building of the autofill drop down options
     */
    function disableListItem(myKey) {

        if (localDataToString().includes(myKey)) {
            return true;
        }
        return false;
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

            for (let y = 0; y < listElement.children.length; y += 1) {
                if (listElement.children[y].tagName === 'INPUT') {
                    listElement.children[y].focus();
                }
            }
            // hide drop down menu
            document.querySelector('ul.autofill-dropdown').classList.add('hide');

            // bind list item
            bindTextChangeListener(listElement);
            bindRemoveMeListener(listElement);

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
        // build out drop down menu
        for (let myKey in data[0]) {
            // create 'li' for each autofill tag in the list
            let myListItem = document.createElement('li');
            myListItem.textContent = myKey;
            // if autofill tag is present in the active list, disable it
            if (disableListItem(myKey)) {
                myListItem.classList.add('disabled');
            }
            // add the list element to the 'drop down' list
            autofillDropdown.appendChild(myListItem);
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
            let autofillTag = prompt('Enter autofill tag for the new feild.', '%AUTOFILL_TAG_HERE%');

            if (autofillTag === null || autofillTag === '') {
                alert('please try again, please enter an autofill tag');
            } else if (localDataToString().includes(autofillTag)) {
                alert('please try again, autofill tag already present on list');
            } else {

                let listElement = listItem(autofillTag);

                autofillOptionsList.appendChild(listElement);

                // bind list item
                bindTextChangeListener(listElement);
                bindRemoveMeListener(listElement);

                // save state of new list
                saveState();
            }
        };
    }

    /**
     * Bind onclick function dynamically depending on autofill JSON load
     * @param {bool} bool - boolean variable that will determine what method will be used
     */
    function addButtonEventListener(bool) {
        if (bool) {
            return function () {
                this.classList.add('disabled');
                autofillDropdown.classList.remove('hide');
                autofillDropdown.focus();
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
     * Build drop down menu
     */
    function getAutofillList() {
        fetchJSON(myURL).then((data) => {
            addButton.onclick = addButtonEventListener(true);
            // build out drop down menu
            buildAutofillList(data);
        }).catch((error) => {
            console.log('autofill file failed to load, reverting to manual autofill entry method');
            console.log(error);
            addButton.onclick = addButtonEventListener(false);
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

    RegExp.escape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    /**
     * Replaced matching words/phrases with the corresponding autofill tags
     * @param {array} wordList - array containing all the visible text in the edit area
     * @param {string} regReplace - text string to search for
     */
    function replaceText(wordList, regReplace) {

        wordList.forEach(function (n) {
            let text = n.nodeValue;

            // iterate through autofill array and replace matches in text
            // replace all instances of 'findMe' with 'autofillTag'
            for (let autofillTag in regReplace) {

                let findMe = regReplace[autofillTag];
                // if split phrases are needed
                if (findMe.indexOf('``') > -1) {
                    let findArray = findMe.split('``');
                    for (let a = 0; a < findArray.length; a += 1) {
                        let findThis = '\\b' + RegExp.escape(findArray[a]) + '\\b';

                        let myRegex = new RegExp(findThis, 'gi');

                        text = text.replace(myRegex, autofillTag);
                    }

                } else {

                    let findThis = '\\b' + RegExp.escape(findMe) + '\\b';
                    let myRegex = new RegExp(findThis, 'gi');

                    text = text.replace(myRegex, autofillTag);
                }
            }
            n.nodeValue = text;
        });
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

            replaceText(wordList, regReplace);
        }
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
     * css styles for tool
     */
    let toolStyles = `
.customEditorTools {
    position: absolute;
    left: 57%;
    width: auto;
    color: white;
    background: #EAE8E8;
    /*background: linear-gradient(to top, #2193b0, #6dd5ed);*/
}

#addAutofill {
    width: 100%;
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
}

.minimizeList {
    position: relative;
    float: right;
    padding: 5px 30px;
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
}

.autofillEntry {
    width: auto;
    padding: 5px 10px;
    border: 1px solid #793CC4;
    margin: 10px;
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
    width: 400px;
}

.hide {
    display: none;
}

.disabled {
    pointer-events: none;
    background: rgba(0,0,0,.75);
}`;
    const myStyles = document.createElement('style');
    myStyles.type = 'text/css';
    myStyles.innerHTML = toolStyles;
    document.head.append(myStyles);


    // run tool
    buildAutofillOptions(autofillOptionsList);
    getAutofillList();
})();
