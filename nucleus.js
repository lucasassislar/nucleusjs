// Global variables

var cpfMask = "999.999.999-99";
var dateMask = "dd/mm/yyyy";
var __nukeLocker = false;

// A collection of every component that has an error
var nukeErrors = [];
var __nukeFormState = false;

// Makes a random string of the specified size
// length: The size of the string to make
function makeRandomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function nukeUpdateCycle() {
    for (var i = 0; i < __nukeTrackers.length; i++) {
        try {
            var obj = __nukeTrackers[i];
            var dataName = obj.dataName;
            var currentData = eval(dataName);
            var lastData = obj.value;

            if (lastData != currentData) {
                obj.event(currentData);
                obj.value = currentData;
            }
        }
        catch (ex) {
        }
    }

    setTimeout(nukeUpdateCycle, 100);
}

var Async = function (func, p1, p2, p3, p4, p5, p6, p7, p8) {
    var as = {};
    as.code = "";
    as.func = func;
    as.onSuccess = function (data) {
        this.data = data;
        for (var i = 0; i < as.queue.length; i++) {
            as.queue[i](data, as);
        }
    }

    as.get = function () {
        return data;
    }
    as.queue = [];
    as.func(as, p1, p2, p3, p4, p5, p6, p7, p8);
    return as;
}

function async(func, p1, p2, p3, p4, p5, p6, p7, p8) {
    return new Async(func, p1, p2, p3, p4, p5, p6, p7, p8);
}

// Method to show a float as money (R$ -> Brazilian Real)
// fl: The float
function nukeGetMoney(fl) {
    var val = parseFloat(fl);
    if (!isNaN(val)) {
        return 'R$' + val.toFixed(2);
    }
    else {
        return fl;
    }
}


// Executes an Ajax Post using JQuery (expects default ResponseObject)
// url: The url to post
// data: The data to post
// onSuccess: Function to be called if sucess is achieved
// onError: Function to be called if shit happens
function nukePost(url, data, onSuccess, onError) {
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function (result) {
            //async return result;
            if (result.returnCode == 0) {
                if (!isnull(onSuccess)) {
                    onSuccess(result);
                }
            } else {
                if (!isnull(onError)) {
                    onError(result);
                }
            }
        },
        error: function (err) {
            if (!isnull(onError)) {
                onError(err);
            }
        }
    });
}

function aPost(onSuccess, url, data, onError) {
    return nukePost(url, data, onSuccess, onError);
}

// Executes an Ajax Get using JQuery (expects default ResponseObject)
// url: The url to post
// data: The data to post
// onSuccess: Function to be called if sucess is achieved
// onError: Function to be called if shit happens
function nukeGet(url, onSuccess, onError) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (result) {
            if (result.returnCode == 0) {
                if (!isnull(onSuccess)) {
                    onSuccess(result);
                }
            } else {
                if (!isnull(onError)) {
                    onError(result);
                }
            }
        },
        error: function (err) {
            if (!isnull(onError)) {
                onError(err);
            }
        }
    });
}

function aGet(asyncObj, url, onError) {
    return nukeGet(url, asyncObj.onSuccess, onError);
}

// Checks if an object is null, undefined, empty ("") or NaN
function isnull(obj) {
    return obj == null || obj == undefined || obj === "";
}

// Replaces a character at the specified position by the specified string/char
// index: The index of the character to remove and start replacting
// character: The character/string to replace at the index
String.prototype.replaceAt = function (index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
}



// Converts a String to a Boolean correctly
// string: The string to convert to boolean. Acceped values:
//          true, yes, 1 for true
//          false, no, 0 for false
// Trivia: JavaScript default conversion converts 'anything' that isn't empty to true, 
// so: var str = (Boolean)'false'; gets the result 'true';
function nukeStringToBoolean(string) {
    if (typeof string === 'string' || string instanceof String) {
        switch (string.toLowerCase().trim()) {
            case "true": case "yes": case "1": return true;
            case "false": case "no": case "0": case null: return false;
            default: return Boolean(string);
        }
    }
    return string;
}

// Validates if the provided string is an email
// email: String to test to see if it's an email
function nukeValidateEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

// Gets all the URL variables in an array
function nukeGetUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// Formats a date to a specific format. Parses the date if it's not a Date object
// date: The date object/string to format
// format: The pattern to format the date with
function nukeFormatDate(date, format) {
    var dat = date;
    if (!(date instanceof Date)) {
        // parse
        dat = new Date(date);
    }

    return dat.format(format);
}

// Parses a date with brazilian format (dd/MM/YYYY)
// date: The date to format
function nukeParseDate(date) {
    var split = date.split('/');

    var day = split[0];
    var month = split[1];
    var year = split[2];

    return new Date(year, month, day);
}
// Removes all repeated characters on a string
// str: The string to check for repeated characters
function nukeStringRemoveRepeatedChars(str) {
    var toRet = '';
    for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        if (toRet.indexOf(ch) == -1) {
            toRet += ch;
        }
    }
    return toRet;
}
// Removes all instances of characters on the designated pattern.
// Though the pattern is supposed to be a string, the checking is made on specific characters
// str: The string to modify
// pattern: The pattern to remove characters from the str
function nukeStringRemoveAllInstancesOff(str, pattern) {
    var toRet = '';
    for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        if (pattern.indexOf(ch) == -1) {
            toRet += ch;
        }
    }
    return toRet;
}
// Removes a mask from the masked string
// str: The string to remove the mask from
// mask: The mask to remove from the string
//
// Trivia: Doesn't work with characters for now
function nukeRemoveMask(str, mask) {
    var digits = mask.replace(/\d+/g, '')
    var single = nukeStringRemoveRepeatedChars(digits);
    return nukeStringRemoveAllInstancesOff(str, single);
}

// nukeGetCleanJQuery with a simpler name
function nj(id) {
    return nukeGetCleanJQuery(id);
}

// Always returns a jQuery object
// id: The id/object to return as jquery
function nukeGetCleanJQuery(id) {
    if (typeof id === 'string') {
        if (id.indexOf('#') != 0 &&
            id.indexOf('.') != 0) { // dont try to add id selector to classes
            id = '#' + id;
        }
        var ret = $(id);
        if (ret.length == undefined || ret.length > 1) {
            return ret;
        }
        else {
            return ret[0];
        }
    }
    if (id instanceof jQuery) {
        if (id.length != undefined) {
            return id[0];
        }
        return id;
    }

    return $(id);
}
// Gets the text from a component, cleaned of it's mask (if it exists)
// id: The id to get the text from
function nukeGetCleanTextValue(id) {
    var obj = nukeGetCleanJQuery(id);
    var value = obj[0].value;
    var maskData = $(obj).data('mask');
    if (maskData != null) {
        var mask = maskData.mask;
        value = nukeRemoveMask(value, mask);
    }
    return value;
}

var __nukeRanOnce;
var __nukeDict = [];
var __nukeOptions = {};
__nukeOptions.clickSetRadio = true;

// Initializes the Nucleus environment, setting up variables that may
// be needed
function nukeSetUp() {
    nukeUpdateCycle();

    if (__nukeOptions.clickSetRadio) {
        $(document).on('click', '.nukeClickInput', function () {
            var parent = $(this).parent();
            var radio = parent.find('input');
            radio.prop('checked', true);
        });
    }
}


// Changes the state of form components to hide
// every component that shouldn't be shown if the form is readonly or not
// * How it works *
// You make just 1 screen for editting/just visualizing an object, but make both fields for editting and viewing.
// Every label that just shows data you add the class nukeView
// Every textBox/input/etc you add the class nukeEdit
// If you want to disable/readonly components, use class nukeRead
// If you want to reverse disable/readonly components, use class nukeReadR
// Call this method to updated everything depending on the state needed for the form.
function nukeChangeState(readOnly) {
    readOnly = nukeStringToBoolean(readOnly); // be sure it's a boolean
    __nukeFormState = readOnly;

    if (readOnly) {
        $('.nukeView').each(function (i) {
            $(this).show();
        });
        $('.nukeEdit').each(function (i) {
            $(this).hide();
        });
    }
    else {
        $('.nukeView').each(function (i) {
            $(this).hide();
        });
        $('.nukeEdit').each(function (i) {
            $(this).show();
        });
    }

    $('.nukeRead').each(function (i) {
        $(this).attr('readonly', readOnly);
        $(this).attr('disabled', readOnly);
    });
    $('.nukeReadR').each(function (i) {
        $(this).attr('readonly', !readOnly);
        $(this).attr('disabled', !readOnly);
    });
}


function changeScriptParent(str) {
    var scriptTag = document.getElementsByTagName('script');
    scriptTag = scriptTag[scriptTag.length - 1];
    var parentTag = scriptTag.parentNode;
    parentTag.innerHTML = str;
}

var __nukeHandlers = {};
var __nukeSupressLogs = false;

__nukeHandlers.foreach = function (words, parent) {
    var meself = $(parent);
    var arrayName = words[1];
    var myId = meself.attr('id');
    if (isnull(myId)) {
        myId = makeRandomString(10);
        meself.attr('id', myId);
    }

    var html;
    if (__nukeRanOnce) {
        html = __nukeDict[myId];
        if (isnull(html)) {
            // get inner html maybe?
            html = parent.innerHTML;
            __nukeDict[myId] = html;
        }
    } else {
        html = parent.innerHTML;
        __nukeDict[myId] = html;
    }
    parent.innerHTML = '';

    var array;
    try {
        array = eval(arrayName);
    }
    catch (ex) {
        return; // object doesnt exist (yet?)
    }

    if (!__nukeSupressLogs) {
        if (array instanceof String) {
            console.log('Data provided is not an array. Its a string. Did you intend to loop a String?');
        }
    }

    if (array.length == undefined) {

    }

    for (i = 0; i < array.length; i++) {
        var element = array[i];
        var thtml = html;

        var start = 0;
        var index = 0;

        for (; ;) {
            index = thtml.indexOf('$', start);
            if (index == -1) {
                break;
            }
            if (index > 0) {
                var bf = thtml[index - 1];
                if (bf == 'R') {
                    start = index + 1;
                    continue;
                }
            }

            var endIndex = thtml.indexOf('$', index + 1);
            if (endIndex == -1) {
                break;
            }
            var word = thtml.substring(index + 1, endIndex);

            var isNukeBlock = false;
            // check if we are inside a NUKE block
            var nIndex = thtml.lastIndexOf('"', index);
            if (nIndex > 5) {
                var nWords = thtml.substring(nIndex - 5, nIndex);
                if (nWords == 'nuke=') {
                    isNukeBlock = true;
                }
            }

            var value = word;
            if (word.indexOf('__index') != -1) {
                value = value.replace('__index', i);
            }
            else {
                if (value.indexOf('@') != -1) {
                    value = value.replace(/@/g, arrayName + '[' + i + '].');
                } else {
                    value = arrayName + '[' + i + '].' + value;
                }
            }

            if (value.indexOf('async') != -1) {
                // async method
                asyncCode = value.substring(value.lastIndexOf(')') + 1, value.length);
                value = value.substring(0, value.lastIndexOf(')') + 1);
                value = eval(value);
                value.code = asyncCode;
                value.key = makeRandomString(10);
                value.div = '<div id=' + value.key + '></div>';

                value.queue.push(function (data, as) {
                    value = eval('data' + as.code);
                    var inp = $('#' + as.key);
                    inp[0].outerHTML = value;
                });
                value = value.div;
            } else {
                if (!isNukeBlock) {
                    value = eval(value);
                }
            }

            if (isNukeBlock) {
                var ni = index + value.length + 2;
                start = ni;
                thtml = thtml.replace('$' + word + '$', '$' + value + '$');
            }
            else {
                thtml = thtml.replace('$' + word + '$', value);
            }
        }

        meself.append(thtml);
    }

    nukeRefresh(meself);
}

__nukeHandlers.exists = function (words, parent) {
    var meself = $(parent);
    var js = words[1];

    if (js.indexOf('isReadOnly') != -1) {
        js = js.replace('isReadOnly', __nukeFormState);
    }

    var doExist = eval(js);
    if (!doExist) {
        // delete
        meself.remove();
    }
}

function nukeRemoveAll(toRmv, toReplace, str) {
    while (str.indexOf(toRmv) != -1) {
        str = str.replace(toRmv, toReplace);
    }
    return str;
}

__nukeHandlers.select = function (words, parent) {
    var meself = $(parent);
    var arrayName = words[1];
    var name = words[2];
    var indexName = null;
    var selected = null;

    if (words.length > 3) {
        indexName = words[3];
        if (words.length > 4) {
            selected = words[4];
        }
    }

    var varName = null;

    if (arrayName.indexOf('.') != -1) {
        var split = arrayName.split('.');
        arrayName = split[0];
        varName = split[1];
    }

    var array;
    try {
        array = eval(arrayName);
    }
    catch (ex) {
        console.log(ex);
        return; // object doesnt exist (yet?)
    }

    if (!__nukeSupressLogs) {
        if (array instanceof String) {
            console.log('Data provided is not an array. Its a string. Did you intend to loop a String?');
        }
    }

    selected = nukeRemoveAll('$', '', selected);
    selected = eval(selected);

    var html = '';
    var classes = $(meself).attr("class");
    var nukeCmds = $(meself).attr("nuke");
    var splot = nukeCmds.split(',');
    var allNuke = '';
    var first = false;
    for (var i = 0; i < splot.length ; i++) {
        var s = splot[i];
        if (s[0] == ' ') {
            s = s.substring(1, s.length);
        }

        if (s.indexOf('select') == 0) {
            continue;
        }
        if (first) {
            allNuke += ',';
        }
        first = true;
        allNuke += s;
    }



    if (name[0] == '#') {
        html = '<select nuke="' + allNuke + '"  class="' + classes + '" id="' + name + '">';
    } else {
        html = '<select nuke="' + allNuke + '"  class="' + classes + '" name="' + name + '">';
    }

    var i = 0;
    for (var arr in array) {
        var obj = array[arr];

        var index = i;
        if (!isnull(indexName)) {
            index = eval('obj.' + indexName);
        }
        if (!isnull(arrayName)) {
            obj = eval('obj.' + varName);
        }

        if (selected == index) {
            html += '<option selected="selected" value="' + index + '" >' + obj + '</option>'
        }
        else {
            html += '<option value="' + index + '" >' + obj + '</option>'
        }

        i++;
    }
    html += "</select>";
    parent.outerHTML = html;

    //meself.append(html);
    //var sel = $(name);
    //$(sel).attr("class", $(meself).attr("class"));
    //$(meself).removeClass();
}

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

__nukeHandlers.populate = function (words, parent) {
    var meself = $(parent);
    var dataName = words[1];

    while (dataName.indexOf('$') != -1) {
        dataName = dataName.replace('$', '');
    }



    var data;
    try {
        data = eval(dataName);
    }
    catch (ex) {
        console.log(ex);
        return; // object doesnt exist (yet?)
    }

    var trackerObj = {};
    trackerObj.dataName = dataName;
    trackerObj.value = data;
    __nukeTrackers.push(trackerObj);

    if (words.length > 2) {
        nukePopulateForm(data, words[2]);
        trackerObj.event = function (d) {
            nukePopulateForm(d, words[2]);
        }
    }
    else {
        nukePopulateForm(data, meself);
        trackerObj.event = function (d) {
            nukePopulateForm(d, meself);
        }
    }
}


var __nukeHandlersChange = [];
var __nukeTrackers = [];

__nukeHandlers.event = function (words, parent) {
    //var meself = $(parent);
    //var eventName = words[1];
    //var parentName = words[2];
    //var action = words[3];

    //var obj = {};
    //obj.parentName = parentName;
    //obj.action = action;

    //if (eventName == 'change'){
    //    __nukeHandlersChange.push(obj);
    //}
}

// Update every component with the nuke property
// parentId: The parent id to limit search for. Will be the whole document if ommited/null
// * How it works *
// Declare the nuke property on every component you want to run code
// Commands:
// - foreach [array]
//      The foreach command will loop the array provided, and repeat the
//      components inner html for each object in the array. 
//      On the HTML inside the foreach parent, you can use:
//      - $varName$ to access variables of the current object on the loop
//      - $__index$ to get the index on the loop
//      You can execute code inside the $$ brackets, but you will always have to start with the varName.
//      For example, this is doable:  $isBlocked ? 'Blocked' : 'Not Blocked'$
//
//      Though, you cannot do a foreach inside another foreach
//      
// - exists [boolean]
//      The exists command will evaluate your boolean parameter, and delete
//      the component if it shouldn't exist
//
// - select [array.varName] [name/id] optional: [indexVarName] [selectedByID]
//      The select command will make a <select> component based on elements of an array
//      
//
function nukeRefresh(parentId, self) {
    parentId = typeof parentId !== 'undefined' ? parentId : document;
    self = typeof self !== 'undefined' ? self : false;

    if (parentId.indexOf != undefined) {
        if (parentId.indexOf('$') != -1) {
            while (parentId.indexOf('$') != -1) {
                parentId = parentId.replace('$', '');
            }
            var first = '';
            if (parentId.indexOf('#') == 0) {
                first = '#';
                parentId = parentId.substring(1, parentId.length);
            }

            parentId = eval(parentId);
            parentId = parentId + first;
        }
    }

    var parent = nukeGetCleanJQuery(parentId);

    var divs = $(parent).find("[nuke]");
    for (var i = 0; i < divs.length; i++) {
        var meself = divs[i];

        // see if any of our parents has a nuke attribute
        var parents = $(meself).parents();
        if (parents.length != 0) {
            //var any = $(meself).parents('[nuke]');
            if (parents[parents.length - 1].nodeName != 'HTML') {
                continue;
            }
        }

        var att = $(meself).attr('nuke');
        __nukeExecNukeString(att, meself);
    }

    // check if ourselves actually have a nuke too
    if (self) {
        var nk = $(parent).attr('nuke');
        if (!isnull(nk)) {
            if (parent.length != undefined) {
                parent = parent[0];
            }
            __nukeExecNukeString(nk, parent);
        }
    }

    __nukeRanOnce = true;

    nukeChangeState(__nukeFormState);
}

function parseNumber(str) {
    return parseFloat(str.replace(/[^\d.-]/g, ''));
}

function __nukeExecNukeString(str, meself) {
    var allNuke = str.split(',');

    for (var j = 0; j < allNuke.length; j++) {
        var whole = allNuke[j];
        if (whole[0] == ' ') {
            whole = whole.substring(1, whole.length);
        }

        var spllited = whole.split(' ');
        var first = spllited[0];

        try {
            var handler = __nukeHandlers[first];
            if (!isnull(handler)) {
                handler(spllited, meself);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
}

$(document).on('change', '[nuke]', function (ev) {
    var att = $(ev.target).attr('nuke');
    if (isnull(att)) {
        att = $(this).attr('nuke');
        if (isnull(att)) {
            return;
        }
    }

    var nukeCmds = att.split(',');
    for (var i = 0; i < nukeCmds.length; i++) {
        var str = nukeCmds[i];
        var spllited = str.split(' ');
        var word = spllited[0];

        if (word == 'value') {
            // parse the name and evaluate
            var rest = str.substring(word.length, str.length);
            while (rest.indexOf('$') != -1) {
                rest = rest.replace('$', '');
            }

            __internalInitializeArray(rest);
            var val;

            if (ev.target.type == 'checkbox') {
                val = ev.target.checked;
            }
            else {
                val = ev.target.value;
            }
            eval(rest + ' = val');
        }
        else if (word == 'checkbox') {
            if (__nukeLocker) {
                return;
            }

            __nukeLocker = true;
            var checkBoxSel = spllited[1];
            var selector = nukeGetCleanJQuery(checkBoxSel);
            $(selector).prop('checked', this.checked).change();
            var classes = this.className.split(/\s+/);

            for (var i = 0; i < classes.length; i++) {
                var classSelector = $(nukeGetCleanJQuery('.' + classes[i]));
                $(classSelector).prop('checked', this.checked);
            }

            if (spllited.length > 2) {
                var eventName = spllited[2];
                eval(eventName + '()');
            }

            __nukeLocker = false;
        }
        else if (word == 'event') {
            var eventName = spllited[1];
            if (eventName == 'change') {
                var command = spllited[2];

                if (command == 'redo') {
                    var cmdId = spllited[3];
                    nukeRefresh(cmdId, true);
                }
            }
        }
    }
});

// Populates every input/div component with the name property equals to the variable name on the data, 
// based on the data provided
//  data: Data to populate form with
//  formId: An specific component to limit search to. If null/ommited will search through all $(document)
function nukePopulateForm(data, formId) {
    formId = typeof formId !== 'undefined' ? formId : document;
    var jform = nukeGetCleanJQuery(formId);

    for (var name in data) {
        var inputs = $(jform).find('[name="' + name + '"]');
        if (inputs.length > 0) {
            var value = eval('data.' + name);
            if (value instanceof Date) {
                value = value.format(dateMask);
            }

            for (var i = 0; i < inputs.length; i++) {
                var inp = inputs[i];
                var nmask = $(inp).attr('nmask');
                var val = value;
                var isAsync = false;
                var asyncCode = '';

                if (!isnull(nmask)) {
                    val = nmask;
                    var start = 0;
                    var index = 0;

                    for (; ;) {
                        index = nmask.indexOf('$', start);
                        if (index == -1) {
                            break;
                        }
                        if (index > 0) {
                            var bf = nmask[index - 1];
                            if (bf == 'R') { // quick hack for not breaking with R$
                                start = index + 1;
                                continue;
                            }
                        }

                        var endIndex = nmask.indexOf('$', index + 1);
                        var word = nmask.substring(index + 1, endIndex);

                        var vat = word;
                        var valIndex = vat.indexOf('value');
                        if (valIndex != -1) {
                            vat = vat.replace(/value/g, value);
                        }

                        val = val.replace('$' + word + '$', vat);
                        start = endIndex + 1;
                    }

                    var asyncInd = val.indexOf('async');
                    if (asyncInd != -1) {
                        isAsync = true;
                    }

                    if (isAsync) {
                        asyncCode = val.substring(val.lastIndexOf(')') + 1, val.length);
                        val = val.substring(0, val.lastIndexOf(')') + 1);
                        val = eval(val);
                        val.code = asyncCode;
                        val.input = inp;

                        val.queue.push(function (data, as) {
                            val = eval('data' + as.code);
                            if (as.input.localName == 'div') {
                                as.input.innerHTML = val;
                            }
                            else {
                                if (as.input.type == 'checkbox') {
                                    $(as.input).attr('checked', as.input);
                                }
                                else {
                                    as.input.value = val;
                                }
                            }
                        });
                    }
                    else {
                        val = eval(val);
                    }
                }

                if (!isAsync) {
                    if (inp.localName == 'div') {
                        inp.innerHTML = val;
                    }
                    else {
                        if (inp.type == 'checkbox') {
                            $(inp).attr('checked', inp);
                        }
                        else {
                            inp.value = val;
                        }
                    }
                }
            }
        }
    }
}

function __internalInitializeArray(id, pre) {
    pre = typeof pre !== 'undefined' ? pre : '';

    var bracketInd = id.indexOf('[');
    if (bracketInd != -1) {
        // get array name
        var arrayName = id.substring(0, bracketInd);
        // check if it's an actual array
        if (id.lastIndexOf("'") < bracketInd) {
            // check if it exists
            var array = eval(pre + arrayName);
            if (isnull(array)) {
                eval(pre + arrayName + ' = []');
            }
        }
        else {
            // dictionary, just initialize the object
            // check if it exists
            try {
                var array = eval(pre + arrayName);
                if (isnull(array)) {
                    eval(pre + arrayName + ' = {}');
                }
            }
            catch (ex) {
                eval(pre + arrayName + ' = {}');
            }

        }
    }
}

// Extracts information from input components
// formId: An specific component to limit search to. If null/ommited will search through all $(document)
function nukeGetFormData(formId) {
    formId = typeof formId !== 'undefined' ? formId : document;

    var data = {};
    var jform = $(formId);

    var found = jform.find('input');
    var inputs = jform.filter('input').add(found);


    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];

        if (input.id in nukeErrors) {
            return false;
        }
        var id = input.id;
        if (isnull(id)) {
            continue;
        }

        __internalInitializeArray(id, 'data.');

        // check for mask
        var str = '';
        if (input.type == 'checkbox') {
            str = 'data.' + id + ' = \'' + $(input).prop('checked') + '\'';
        }
        else {
            var value = nukeGetCleanTextValue(input);
            if (isnull(value)) {
                continue;
            }
            str = 'data.' + id + ' = \'' + value + '\'';
        }
        eval(str);
    }

    inputs = jform.find('select');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];

        if (input.id in nukeErrors) {
            return false;
        }
        var id = input.id;
        if (isnull(id)) {
            continue;
        }

        __internalInitializeArray(id, 'data.');

        // check for mask
        var value = $(input).val();
        eval('data.' + id + ' = ' + value);
    }

    return data;
}



// Validation functions for input
// ----- ### -------
// Validates a Numeric input
// id: The id of the numeric input
// minSize: The minimum length the numeric input should have to validate
// maxSize: The maximum length the numeric input should have to validate
function nukeRegErrorCheck_Numeric(id, minSize, maxSize) {
    validateInput(id, minSize, maxSize,
        function (value, parent, min, max) {
            var errors = [];
            if (!val.match(/^\d+$/)) {
                errors.push('numeric');
            }
            if (value.length >= min) {
                errors.push('small');
            }
            if (value.length < max) {
                errors.push('big');
            }
            return errors;
        });
}

// Validates a text input
// id: The id of the text input
// minSize: The minimum length the text input should have to validate
// maxSize: The maximum length the text input should have to validate
function nukeRegErrorCheck_Text(id, minSize, maxSize) {
    validateInput(id, minSize, maxSize,
        function (value, parent, min, max) {
            var errors = [];
            if (value.length >= min) {
                errors.push('small');
            }
            if (value.length < max) {
                errors.push('big');
            }
            return errors;
        });
}

// Validates an email text input
// id: The id of the text input
// minSize: The minimum length the text input should have to validate
// maxSize: The maximum length the text input should have to validate
function nukeRegErrorCheck_Email(id, minSize, maxSize) {
    validateInput(id, minSize, maxSize,
        function (value, parent, min, max) {
            var errors = [];
            if (!nukeValidateEmail(value)) {
                errors.push('email');
            }
            if (value.length >= min) {
                errors.push('small');
            }
            if (value.length < max) {
                errors.push('big');
            }
            return errors;
        });
}

// Generic validation function, use it to implement other validations 
// (see nukeRegErrorCheck_Text for example)
function validateInput(id, minSize, maxSize, evalFunc) {
    minSize = typeof minSize !== 'undefined' ? minSize : 0;
    maxSize = typeof minSize !== 'undefined' ? maxSize : 99999;

    $(document).on('input', id, function () {
        var value = nukeGetCleanTextValue(id);
        var parent = $(id).parent();

        var errorId = id + '_erro';
        var errorLabel = $(errorId)[0];

        var errors = evalFunc(value, parent, minSize, maxSize);

        if (errors.length == 0) {
            if (errorLabel != null) {
                errorLabel.html('');
            }
            parent.removeClass('has-error');
            delete nukeErrors[id];
        } else {
            if (errorLabel != null) {
                errorLabel.innerHTML = getErrorMsg(errors);
            }

            parent.addClass('has-error');
            nukeErrors.push(id);
        }
    });
}

// Returns an error message based on an array of messages
// errors: Array of errors
function getErrorMsg(errors) {
    var error = '';

    if (errors.contains('email')) {
        error += ",Texto digitado não é um email";
    }
    if (errors.contains('numeric')) {
        error += ",Letras não são permitidas";
    }
    if (errors.contains('small')) {
        error += ",Texto digitado é pequeno demais";
    }
    if (errors.contains('big')) {
        error += ",Texto digitado é muito grande";
    }

    if (error.indexOf(',') == 0) {
        error = error.substring(1);
    }
    var last = error.lastIndexOf(',');
    if (last != 0) {
        error.replaceAt(last, ' e');
    }

    return error;
}

function arrayNForeach(array, func) {
    var last = null;

    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (i != array.length - 1){
            var next = array[i + 1];
        }
        var nval = func(i, el, last, next);

        array[i] = nval;
        last = nval;
    }
}

// Calculates values on an array, where each value is the sum of the last value + the current value.
// Fn = Fn-1 + Fn-2
// array: The array to calculate
function fibonacciArray(array) {
    arrayNForeach(array, function (i, element, last, next) {
        if (last != null) {
            return last + element;
        }
        return element;
    });
}

function arrayPresence(array, varName) {
    var newArr = {};
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        var data = eval('obj.' + varName);
        eval('newArr.' + data + ' = true');
    }
    return newArr;
}

function arrayIndexBy(array, varName) {
    var newArr = {};
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        var data = eval('obj.' + varName);
        eval('newArr["' + data + '"]  = obj');
    }
    return newArr;
}

function arrayfyProperty(array, varName) {
    var variable;
    if (varName.indexOf(',') == -1) {
        variable = [varName];
    }
    else {
        variable = varName.split(',');
        for (var i = 0; i < variable.length; i++) {
            variable[i] = variable.replace(/ /g, '');
        }
    }

    var newArr = [];
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];

        for (var j = 0; j < variable.length; j++) {
            var data = eval('obj.' + variable[j]);

            if (variable.length == 1) {
                newArr[i] = data;
            }
            else {
                eval('newArr[i].' + variable[j] + ' = data');
            }
        }
    }
    return newArr;
}

function arrayfyObject(data) {
    var newArr = [];
    var i = 0;
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var obj = data[key];
            newArr[i] = obj;
            i++;
        }
    }
    return newArr;
}

Array.prototype.presence = function (varName) {
    return arrayPresence(this, varName);
}

Array.prototype.indexBy = function (varName) {
    return arrayIndexBy(this, varName);
}

Array.prototype.arrafyProperty = function (varName) {
    return arrayfyProperty(this, varName);
}

// DataTables extensions
function destroyTable(tableId) {
    var tb = nukeGetCleanJQuery(tableId);
    var table = $(tb).dataTable();
    if ($.fn.dataTable.isDataTable(tb)) {
        table.fnDestroy();
    }
}

// Library for Date formatting
// Date Format library
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};