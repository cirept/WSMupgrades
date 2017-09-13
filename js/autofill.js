/*global document*/

var autofillReplace = {
    'init': function () {
        'use strict';

        this.createElements();
        this.cacheDOM();
        this.buildElements();
        this.attachTools();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    'createElements': function () {
        'use strict';

        autofillReplace.config = {

            'myURL': 'https://raw.githubusercontent.com/cirept/WSMupgrades/master/json/autofillTags2.json',
            'autofillOptionsContainer': document.createElement('div'),
            'activeAutofillList': document.createElement('ul'),
            'addButton': document.createElement('button'),
            'minimize': document.createElement('button'),
            'applyAutofills': document.createElement('button'),
            'wsmEditerTools': document.createElement('div'),
            'autofillOptionsList': document.createElement('ul'),

            'listItem': document.createElement('li'),


            'grabHandle': document.createElement('span'),

            'label': document.createElement('div'),


            'myInput': document.createElement('input'),


            'myPointer': document.createElement('i'),


            'removeMeContainer': document.createElement('div'),


            'removeMeIcon': document.createElement('i'),


            //            removeMeContainer.appendChild(removeMeIcon),

            // build list item
            //            listItem.appendChild(grabHandle),
            //            listItem.appendChild(myInput),
            //            listItem.appendChild(myPointer),
            //            listItem.appendChild(label),
            //            listItem.appendChild(removeMeContainer),

            //        return listItem,
            //    },
            //            '$legendContainer': jQuery('<div>').attr({
            //                'class': 'legendContainer',
            //            }),
            //            '$toolboxContainer': jQuery('<div>').attr({
            //                'class': 'toolboxContainer',
            //                'id': 'showToolbox',
            //            }),
            //            '$changeLogUpdateContainer': jQuery('<div>').attr({
            //                'id': 'overlayContainer',
            //            }),
            //            '$changeLogDisplay': jQuery('<div>').attr({
            //                'id': 'changeLog',
            //            }),
            //            // ----------------------------------------
            //            // Toolbar Resources
            //            // ----------------------------------------
            //            '$toolboxStyles': jQuery('<style></style>').attr({
            //                'id': 'qa_toolbox',
            //                'type': 'text/css',
            //            }),
            //            '$myFont': jQuery('<link>').attr({
            //                'id': 'toolFont',
            //                'href': 'https://fonts.googleapis.com/css?family=Montserrat',
            //                'rel': 'stylesheet',
            //            }),
            //            '$fontAw': jQuery('<link>').attr({
            //                'id': 'fontAwe',
            //                'href': 'https://cdn.rawgit.com/cirept/QA_Toolbox/master/resources/font-awesome-4.7.0/css/font-awesome.css',
            //                'rel': 'stylesheet',
            //            }),
            //            '$jQueryUIcss': jQuery('<link>').attr({
            //                'id': 'jqueryUI',
            //                'href': 'https://cdn.rawgit.com/cirept/QA_Toolbox/master/resources/jquery-ui-1.12.1.custom/jquery-ui.min.css',
            //                'rel': 'stylesheet',
            //            }),
            //            '$toolStyles': jQuery('<link>').attr({
            //                'id': 'toolStyles',
            //                //                    'href': 'https://rawgit.com/cirept/QA_Toolbox/master/assets/css/toolbox.css', // eslint-disable-line new-cap
            //                'href': 'https://rawgit.com/cirept/QA_Toolbox/' + GM_info.script.version + '/assets/css/toolbox.css', // eslint-disable-line camelcase
            //                'rel': 'stylesheet',
            //                'type': 'text/css',
            //            }),
            //            '$animate': jQuery('<link>').attr({
            //                'id': 'animate',
            //                'href': 'https://rawgit.com/cirept/animate.css/master/animate.css',
            //                'rel': 'stylesheet',
            //            }),
        };
    },
    'cacheDOM': function () {
        'use strict';

        this.WSMhead = document.querySelector('header.wsmMainHeader');

    },
    'buildElements': function () {
        'use strict';
        // container for bottom portion of tool
        autofillReplace.config.autofillOptionsContainer.classList.add('autofillOptionsContainer', 'hide');
        // list of autofill options that will be applied to page
        autofillReplace.config.activeAutofillList.id = 'activeAutofillListOptions';
        // list of all autofill options
        autofillReplace.config.autofillOptionsList.id = 'autofillOptions';
        autofillReplace.config.autofillOptionsList.tabIndex = '4';
        autofillReplace.config.autofillOptionsList.classList.add('autofill-dropdown');
        autofillReplace.config.autofillOptionsList.classList.add('hide');
        // autofill add button
        autofillReplace.config.addButton.id = 'addAutofill';
        autofillReplace.config.addButton.classList.add('myButts');
        autofillReplace.config.addButton.value = 'addAutofill';
        autofillReplace.config.addButton.title = 'Add Autofill';
        autofillReplace.config.addButton.innerHTML = '<i class="fas fa-plus fa-lg"></i>';
        // attach elements to bottom container
        autofillReplace.config.autofillOptionsContainer.appendChild(autofillReplace.config.activeAutofillList);
        autofillReplace.config.autofillOptionsContainer.appendChild(autofillReplace.config.addButton);
        autofillReplace.config.autofillOptionsContainer.appendChild(autofillReplace.config.autofillOptionsList);
        // minimize tool button
        autofillReplace.config.minimize.classList.add('minimizeList');
        autofillReplace.config.minimize.classList.add('myButts');
        autofillReplace.config.minimize.title = 'toggle list';
        autofillReplace.config.minimize.type = 'button';
        autofillReplace.config.minimize.innerHTML = '<i class="fal fa-user-secret fa-lg"></i>';
        // apply autofill to WSM page
        autofillReplace.config.applyAutofills.id = 'applyAutofills';
        autofillReplace.config.applyAutofills.classList.add('myButts');
        autofillReplace.config.applyAutofills.type = 'button';
        autofillReplace.config.applyAutofills.title = 'apply autofills';
        autofillReplace.config.applyAutofills.innerHTML = '<i class="fal fa-magic fa-lg"></i>';
        // main tool container
        autofillReplace.config.wsmEditerTools.classList.add('customEditorTools');
        // attach elements to main tool container
        autofillReplace.config.wsmEditerTools.appendChild(autofillReplace.config.minimize);
        autofillReplace.config.wsmEditerTools.appendChild(autofillReplace.config.applyAutofills);
        autofillReplace.config.wsmEditerTools.appendChild(autofillReplace.config.autofillOptionsContainer);
// generic list item to be used throughout the tool
        autofillReplace.config.listItem.classList.add('autofillEntry');
// grab element
        autofillReplace.config.grabHandle.classList.add('my-handle');
        autofillReplace.config.grabHandle.title = 'drag to re-order';
        autofillReplace.config.grabHandle.innerHTML = '<i class="fas fa-sort"></i>';

        autofillReplace.config.label.classList.add('autofillTag');

        autofillReplace.config.myInput.type = 'text';
        autofillReplace.config.myInput.classList.add('regEx');
        autofillReplace.config.myInput.title = 'enter search string';

        autofillReplace.config.myPointer.classList.add('fas');
        autofillReplace.config.myPointer.classList.add('fa-long-arrow-alt-right');
        autofillReplace.config.myPointer.classList.add('leftMarg');
        autofillReplace.config.myPointer.classList.add('fa-lg');

        autofillReplace.config.removeMeContainer.title = 'click to remove';
        autofillReplace.config.removeMeContainer.classList.add('js-remove');

        autofillReplace.config.removeMeIcon.classList.add('fas');
        autofillReplace.config.removeMeIcon.classList.add('fa-times');
        autofillReplace.config.removeMeIcon.classList.add('fa-lg');
    },
    'attachTools': function () {
        'use strict';

        this.WSMhead.appendChild(autofillReplace.config.autofillOptionsContainer);
        this.WSMhead.appendChild(autofillReplace.config.activeAutofillList);

    },
};

autofillReplace.init();
