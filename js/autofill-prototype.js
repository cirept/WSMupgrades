/*global document, location, localStorage, Sortable, NodeFilter */

var Autofill = function () {
    'use strict';
    this.myURL = 'https://raw.githubusercontent.com/cirept/WSMupgrades/master/json/autofillTags2.json';

    this.wsmEditerTools = document.createElement('div');
    this.wsmEditerTools.classList.add('customEditorTools');

    this.autofillOptionsContainer = document.createElement('div');
    this.autofillOptionsContainer.classList.add('autofillOptionsContainer');
    this.autofillOptionsContainer.classList.add('hide');

    this.applyAutofills = document.createElement('button');
    this.applyAutofills.id = 'applyAutofills';
    this.applyAutofills.classList.add('myButts');
    this.applyAutofills.type = 'button';
    this.applyAutofills.title = 'apply autofills';
    this.applyAutofills.innerHTML = '<i class="fal fa-magic fa-lg"></i>';

    this.minimizeList = document.createElement('button');
    this.minimizeList.classList.add('minimizeList');
    this.minimizeList.classList.add('myButts');
    this.minimizeList.title = 'toggle list';
    this.minimizeList.type = 'button';
    this.minimizeList.innerHTML = '<i class="fal fa-user-secret fa-lg"></i>';

    this.activeAutofillList = document.createElement('ul');
    this.activeAutofillList.id = 'activeAutofillListOptions';
    //    this.activeAutofillList.addEventListener('click', function (event) {
    //        console.log(event.target);
    //    });

    this.addButton = document.createElement('button');
    this.addButton.id = 'addAutofill';
    this.addButton.classList.add('myButts');
    this.addButton.value = 'addAutofill';
    this.addButton.title = 'Add Autofill';
    this.addButton.innerHTML = '<i class="fas fa-plus fa-lg"></i>';

    this.autofillOptionsContainer.appendChild(this.activeAutofillList);
    this.autofillOptionsContainer.appendChild(this.addButton);

    this.wsmEditerTools.appendChild(this.minimizeList);
    this.wsmEditerTools.appendChild(this.applyAutofills);
    this.wsmEditerTools.appendChild(this.autofillOptionsContainer);

    // generic list element for cloning
    this.listItem = document.createElement('li');
    this.listItem.classList.add('autofillEntry');

    this.grabHandle = document.createElement('span');
    this.grabHandle.classList.add('my-handle');
    this.grabHandle.title = 'drag to re-order';
    this.grabHandle.innerHTML = '<i class="fas fa-sort"></i>';

    this.label = document.createElement('div');
    this.label.classList.add('autofillTag');
    //    this.label.textContent = elem.textContent;    // set this dynamically during cloning process

    this.myInput = document.createElement('input');
    this.myInput.type = 'text';
    this.myInput.classList.add('regEx');
    this.myInput.title = 'enter search string';

    this.myPointer = document.createElement('i');
    this.myPointer.classList.add('fas');
    this.myPointer.classList.add('fa-long-arrow-alt-right');
    this.myPointer.classList.add('leftMarg');
    this.myPointer.classList.add('fa-lg');

    this.removeMeContainer = document.createElement('div');
    this.removeMeContainer.title = 'click to remove';
    this.removeMeContainer.classList.add('js-remove');

    this.removeMeIcon = document.createElement('i');
    this.removeMeIcon.classList.add('fas');
    this.removeMeIcon.classList.add('fa-times');
    this.removeMeIcon.classList.add('fa-lg');

    this.removeMeContainer.appendChild(this.removeMeIcon);

    // build list item
    this.listItem.appendChild(this.grabHandle);
    this.listItem.appendChild(this.myInput);
    this.listItem.appendChild(this.myPointer);
    this.listItem.appendChild(this.label);
    this.listItem.appendChild(this.removeMeContainer);

    // container for autofill options
    this.autofillOptionsList = document.createElement('ul');
    this.autofillOptionsList.id = 'autofillOptions';
    this.autofillOptionsList.tabIndex = '4';
    this.autofillOptionsList.classList.add('autofill-dropdown');
    this.autofillOptionsList.classList.add('hide');

    //    function sortable(autofillList) {



    //        return sortable;
    //    }

};

let sortable = Sortable.create(Autofill.activeAutofillList, {
        'group': 'activeAutofillListOptions',
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
            //            let self = this;

            if (Sortable.utils.is(ctrl, '.js-remove')) { // Click on remove button
                item.parentNode.removeChild(item); // remove sortable item

                Autofill.saveState();
//                this.saveState();

                //                this.options.store.set();
            }
        },
        // Called by any change to the list (add / update / remove)
        'onSort': function ( /**Event*/ evt) {
            //            let self = this;

            //            console.log(self);
            //            console.log(this);

            // Save state
            //             this.options.store.set(self.sortable);
            //            this.options.store();
            Autofill.saveState();
//            this.saveState();
        },
    });

Autofill.prototype = {
    'init': function () {
        'use strict';

        let localData = this.getFromLocalStorage()[0];

        this.attachStyles();
        this.attachTool();
        //        this.sortable();  // need to configure this to work correctly
        this.getAutofillData();

        this.activeAutofillOptions(localData);

        //        this.bindRemoveMeListener();
        this.bindButtonEvents();
    },
    'attachTool': function () {
        'use strict';

        document.querySelector('header.wsmMainHeader').appendChild(this.wsmEditerTools);
    },
    /**
     * Build drop down menu
     */
    'getAutofillData': function () {
        'use strict';

        this.fetchJSON(this.myURL).then((data) => {
            //            let autofillDropdown = document.createElement('ul');

            // build out drop down menu
            this.buildAutofillList(data);
            //            this.addRemoveEvents();

        }).catch((error) => {
            return error;
            // prompt user for autofill tag

        });
    },
    /**
     * read data from json file
     */
    'fetchJSON': function (url) {
        'use strict';

        return new Promise(function (resolve, reject) {
            jQuery.getJSON(url)
                .done( /** resolve data */ function (json) {
                    resolve(json.autofill);
                })
                .fail( /** error */ function (xhr, status, err) {
                    reject(status + err.message);
                });
        });
    },
    /**
     * Build out drop down list with data gathered from JSON file
     * @param {OBJECT} listContainer - the UL element that will contain autofill options
     * @param {object} data - the autofill data that will be used to populate the options
     */
    'buildAutofillList': function (data) {
        'use strict';

        let tooltipText;
        let self = this;

        //        console.log('build autofill list entered');

        // build out drop down menu
        for (let myKey in data[0]) {

            // create 'li' for each autofill tag in the list
            let myListItem = document.createElement('li');

            myListItem.textContent = myKey;

            /* TODO - apply disable class to autofills that already exist in the list
            if (this.disableListItem(myKey)) {
                this.myListItem.classList.add('disabled');
            }
            */

            tooltipText = data[0][myKey] ? data[0][myKey] : '**No tooltip information available**';
            myListItem.title = tooltipText;

            // attach new 'li' to main list
            self.autofillOptionsList.appendChild(myListItem);
            // bind listener to 'li' item
            //            this.createAutofillDropdownMenu(myListItem);    // TODO
        }
        // attach to tool
        this.addButton.parentNode.appendChild(this.autofillOptionsList);

        //        console.log('build autofill list complete');
    },
    'activeAutofillOptions': function (regReplace) {
        'use strict';

        let listItem;

        // build autofill list options IF there is a list that already exists
        if (regReplace) {
            // loop through Legend Content list
            for (let key in regReplace) {
                if (regReplace.hasOwnProperty(key)) {

                    if (key === '') {
                        continue;
                    }

                    listItem = this.createListItemClone();
                    this.setAutofillTagLabel(listItem, key);
                    this.setRegexInputValue(listItem, regReplace[key]);
                    // attach to legend list
                    this.activeAutofillList.append(listItem);

                    // bind list item
                    this.bindTextChangeListener(listItem);
                    // can't bind each individually because font awe changes them once page loads
                    this.bindRemoveMeListener(listItem);
                }
            }

        }
        /*
        -- RUN THIS IS LOCAL STORAGE EXISTS
        -- SHOULD NOT MATTER AS THE USER CAN JUST ADD NEW ITEMS VIA THE DROP DOWN
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
                    this.activeAutofillList.append($listItem);
                    //                    optionsList.append($listItem);
                }
            }
        }
        */
    },
    /**
     * will set the autofill portion of the listitem to the desired text
     * @param {object} elem - The current list item that will be updated
     * @param {string} text - string to use for autofillTag value
     */
    'setAutofillTagLabel': function (elem, text) {
        'use strict';

        elem.querySelector('.autofillTag').textContent = text;
    },
    /**
     * Will set the input value to the desired text value
     * @param {object} elem - The current list item that will be updated
     * @param {string} text - string to use for reGex value
     */
    'setRegexInputValue': function (elem, text) {
        'use strict';

        elem.querySelector('.regEx').value = text;
    },
    /**
     * will bind all new option list with a on text change listener
     * @param {element} elem - new autofill list option
     */
    'bindTextChangeListener': function (elem) {
        'use strict';

        let self = this;

        elem.querySelector('input.regEx').addEventListener('keyup', function () {
            return self.saveState();
        });
        elem.querySelector('input.regEx').addEventListener('change', function () {
            return self.saveState();
        });
    },
    /**
     * will bind all new option list item with the remove event listener for the 'X'
     * @param {element} elem - new autofill list option
     */
    'bindRemoveMeListener': function (elem) {
        'use strict';

        let self = this;

        elem.querySelector('.js-remove').addEventListener('click', function () {
            return self.removeMyself(elem);
        });
    },
    // ----------------------------------------
    // ---------------------------------------- PUT THINGS BETWEEN HERE
    // ----------------------------------------
    /**
     * Binds all the buttons within the tool
     */
    'bindButtonEvents': function () {
        'use strict';
        let self = this;
        //        debugger;
        //        console.log(this.minimizeList);
        //        return function () {
        //            this.autofillOptionsContainer.classList.toggle('hide');
        //        };
        //        this.minimizeList.onclick = this.minimize(this.autofillOptionsContainer);
        this.minimizeList.addEventListener('click', this.minimize(this.autofillOptionsContainer));

        this.autofillOptionsList.addEventListener('click', function (e) {
            //            console.log(e.target);
        });

        /**
         * binds add autofill button to...
         * 1. show autofill list
         * 2. disable itself
         * 3. force focus to the autofill list
         */
        this.addButton.addEventListener('click', function () {
            self.autofillOptionsList.classList.toggle('hide');
            self.addButton.classList.toggle('disabled');
            self.autofillOptionsList.focus();
        });
        /**
         * when focus leaves the autofill list...
         * 1. the autofill list will hide itself
         * 2. the add button will be enabled
         */
        this.autofillOptionsList.addEventListener('blur', function () {
            self.autofillOptionsList.classList.toggle('hide');
            self.addButton.classList.toggle('disabled');
        });
    },
    /**
     * Will remove the element from the page
     * @param {object} elem - elem that will be removed from the page
     */
    'removeMyself': function (elem) {
        'use strict';

        let self = elem;
        let parent = self.parentElement;
        parent.removeChild(self);
        this.saveState();
    },
    // ----------------------------------------
    // ---------------------------------------- 9/12/2017
    // ----------------------------------------
    /**
     * SUCCESS BINDING EVENT
     */
    'createAutofillDropdownMenu': function (elem) {
        'use strict';

        elem.onclick = function () {
            elem.classList.add('disabled');

            label.textContent = elem.textContent;

            var listItemDup = this.createListItemClone();

            //            console.log(listItemDup);

            document.getElementById('autofillOptions').appendChild(el);

            for (let y = 0; y < el.children.length; y += 1) {
                if (el.children[y].tagName === 'INPUT') {
                    el.children[y].focus();
                }
            }
            // hide drop down menu
            document.querySelector('ul.autofill-dropdown').classList.add('hide');
            // bind 'remove' feature of new list item
            removeMe.onclick = this.removeMyself(el);
            // save state of new list
            this.saveState();

        };
    },
    /**
     * Clone elements for new list item
     */
    'createListItemClone': function () {
        'use strict';

        return this.listItem.cloneNode(true);
    },
    /**
     * save object to local storage
     * @param {object} obj - object to be saved into local storage
     */
    'saveToLocalStorage': function (myObj) {
        'use strict';

        let saveMe = JSON.stringify(myObj);
        localStorage.setItem('autofillVariables', saveMe);
    },
    /**
     * save current state of the list
     * @param {paramType} paramDescription
     */
    'saveState': function () {
        'use strict';

        this.sortable.options.store();
        this.saveToLocalStorage(this.createArray());
    },
    /**
     * retrive object from local storage
     * @param {object} obj - object to be saved into local storage
     */
    'getFromLocalStorage': function () {
        'use strict';

        return JSON.parse(localStorage.getItem('autofillVariables'));
    },
    /**
     * will walk through edittable portion of WSM window and perform text
     * replacing with data contained in the list area of tool
     */
    'autofills': function () {
        'use strict';

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
            //            regReplace = getFromLocalStorage();
            // have the tool check the values in the tool itself vs the local storage.  This will allow to validate the text before testing
            document.getElementById('autofillOptions');

            // pass elements with children as base element for autofill replacing
            this.useAutofillTags(myChild, regReplace[0]);

        } else {

            recordEditWindow = contentFrame.find('div.main-wrap').find('.input-field').find('div[data-which-field="copy"]');

            // get stored autofill tags from local storage
            regReplace = this.getFromLocalStorage();

            // pass elements with children as base element for autofill replacing
            this.useAutofillTags(recordEditWindow, regReplace[0]);

            // change focus between text area to trigger text saving.
            for (let z = 0; z < recordEditWindow.length; z += 1) {
                jQuery(recordEditWindow[z]).focus();
            }
        }
    },
    /**
     * create treewalker to navigate DOM and return all TEXT nodes
     * @param {object} base - base element to crawl for text nodes
     * @return {array} wordArray - array containing all text nodes on the page
     */
    'treeWalk': function (base) {
        'use strict';

        let treeWalker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, null, false);
        let wordArray = [];

        while (treeWalker.nextNode()) {
            if (treeWalker.currentNode.nodeType === 3 && treeWalker.currentNode.textContent.trim() !== '') {
                wordArray.push(treeWalker.currentNode);
            }
        }
        return wordArray;
    },

    /**
     * loop through word list array and replace text with autofill tags
     * @param {object} baseElem - base element to find and replace text with autofill tags
     * @param {array} regReplace - object array that contains the regExpressions and corresponding autofill tags
     */
    'useAutofillTags': function (baseElem, regReplace) {
        'use strict';

        let wordList;

        for (let z = 0; z < baseElem.length; z += 1) {
            // get all visible text on page
            wordList = this.treeWalk(baseElem[z]);

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
    },
    /**
     * FAILURE BINDING EVENT
     */
    'bindAddAutofill': function (elem) {
        'use strict';

        //        console.log('failure binding event');

        return elem.onclick = function () {
            let autofillTag = prompt('Enter autofill tag for the new feild.', '%AUTOFILL_TAG_HERE%');

            if (autofillTag === null || autofillTag === '') {
                alert('please try again, enter an autofill tag');
            } else {

                let el = document.createElement('li');
                el.classList.add('autofillEntry');

                // ----------------------------------------
                // build elements
                let grabHandle = document.createElement('span');
                grabHandle.classList.add('my-handle');
                grabHandle.title = 'drag to re-order';
                grabHandle.innerHTML = '<i class="fas fa-sort"></i>';

                let myInput = document.createElement('input');
                myInput.type = 'text';
                myInput.classList.add('regEx');
                myInput.title = 'enter search string';

                let myPointer = document.createElement('i');
                myPointer.classList.add('fas');
                myPointer.classList.add('fa-long-arrow-alt-right');
                myPointer.classList.add('leftMarg');
                myPointer.classList.add('fa-lg');

                let label = document.createElement('div');
                label.classList.add('autofillTag');
                label.textContent = elem.textContent;

                let removeMe = document.createElement('i');
                removeMe.classList.add('fas');
                removeMe.classList.add('fa-times');
                removeMe.classList.add('fa-lg');
                removeMe.classList.add('js-remove');
                removeMe.title = 'click to remove';

                // build list item
                el.appendChild(grabHandle);
                el.appendChild(myInput);
                el.appendChild(myPointer);
                el.appendChild(label);
                el.appendChild(removeMe);

                document.getElementById('autofillOptions').appendChild(el);
                this.bindTextChangeListener(el);
            }
        };
    },
    /**
     * apply 'hide' class to element
     * @param {object} event - element that will get the 'hide' class added to it class list
     */
    //    'hideMe': function (elem) {
    //        'use strict';
    //        //        let addButton = document.getElementById('addAutofill');
    //
    //        //        if (!elem.classList.contains('hide')) {
    //        //            elem.classList.add('hide');
    //        //        }
    //
    //        elem.classList.toggle('hide');
    //
    //        //        if (!event.target.classList.contains('hide')) {
    //        //            event.target.classList.add('hide');
    //        //        }
    //
    //        //        if (addButton.classList.contains('disabled')) {
    //        //            addButton.classList.remove('disabled');
    //        //        }
    //    },
    /**
     * Disable autofil list options if it has already been chosen
     * @param {object} autofillTag - autofill text to check if it is already in local storage
     * @return {bool} Returns true/false if autofill tag is already in local storage
     */
    'disableListItems': function () {
        'use strict';

        var localData = this.getFromLocalStorage()[0];
        var autofill = [];
        var autofillList = document.getElementsByClassName('autofill-dropdown');

        for (let localKey in localData) {
            autofill.push(localKey);
        }

        for (let z = 0; z < autofillList.length; z += 1) {
            if (autofill.includes(autofillList[z].textContent) && !autofillList[z].contains('disabled')) {
                autofillList[z].classList.add('disabled');
            } else if (autofillList[z].contains('disabled')) {
                autofillList[z].classList.remove('disabled');
            }
        }
        debugger;
    },
    /**
     * Disable list items during building of the autofill drop down options
     */
    'disableListItem': function (myKey) {
        'use strict';

        var localData = this.getFromLocalStorage()[0];
        var autofill = [];
        //        var autofillList = document.getElementsByClassName('autofill-dropdown');

        for (let localKey in localData) {
            autofill.push(localKey);
        }

        if (autofill.includes(myKey)) {
            return true;
        }
        return false;
    },
    /**
     * Bind all onclick events for buttons
     */
    'bindEvents': function () {
        'use strict';

        // bind 'add list item button' to show the new drop down menu
        document.getElementById('addAutofill').onclick = function () {
            let dropdown = document.querySelector('ul.autofill-dropdown');
            this.classList.add('disabled');
            dropdown.classList.remove('hide');
            dropdown.focus();
        };
        // apply autofills
        document.getElementById('applyAutofills').onclick = function () {
            this.autofills();
            //            let dropdown = document.querySelector('ul.autofill-dropdown');
            //            this.classList.add('disabled');
            //            dropdown.classList.remove('hide');
            //            dropdown.focus();
        };
    },
    /**
     * bind all 'js-remove' buttons (X buttons) to remove the li element
     */
    'addRemoveEvents': function () {
        'use strict';

        let removeElems = document.getElementsByClassName('js-remove');
        for (let p = 0; p < removeElems.length; p += 1) {
            removeElems[p].onclick = this.removeMyself(removeElems[p].parentElement);
            this.disableListItems();
        }
    },
    /**
     * creating an array of the autofill list options to store into memory
     * return {object} myObj - returns object array of autofill entries in list
     */
    'createArray': function () {
        'use strict';

        let autofillList = jQuery('#autofillOptions li');
        let myObj = [];
        let saveAutofill = {};
        let autofillTag = '';
        let myRegex = '';
        let $myThis;

        for (let z = 0; z < autofillList.length; z += 1) {

            $myThis = jQuery(autofillList[z]);
            autofillTag = $myThis.find('.autofillTag').text();
            myRegex = typeof $myThis.find('.regEx').val() === 'undefined' ? 'Please Enter a Value' : $myThis.find('.regEx').val(); // add validation checker to this value

            saveAutofill[autofillTag] = myRegex;
        }

        myObj.push(saveAutofill);

        return myObj;
    },
    /**
     * Bind the minimize button event
     * Minimizes the tool
     * @param {object} autofillOptionsContainer - container element for the tool
     * @return Callback function that will minimize the list
     */
    'minimize': function (autofillOptionsContainer) {
        'use strict';

        return function () {
            autofillOptionsContainer.classList.toggle('hide');
        };
    },
    /**
     *
     */
    'addAutofill': function () {
        'use strict';

        //        return function () {
        //
        //        }
    },
    /**
     * css styles for tool
     */
    'attachStyles': function () {
        'use strict';

        const $myStyles = jQuery('<style>').attr({
            'type': 'text/css',
        }).text(`
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
}

.minusZ {
    z-index: 0;
}
`);
        jQuery('head').append($myStyles);
    },
};

var autofill = new Autofill();
autofill.init();
//autofill.attachStyles();
//autofill.bindButtonEvents();
//autofill.activeAutofillOptions(autofillOptionsList);
