//Modificacion para corregir tablas
var _dataTable = new Object();


function setCalendars() {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '&#x3c;Ant',
        nextText: 'Sig&#x3e;',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles', 'Jueves', 'Viernes', 'S&aacute;bado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mi&eacute;', 'Juv', 'Vie', 'S&aacute;b'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S&aacute;'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
};

function send(formName, UID, params, myFunction) {
    // valida parámetros extra
    params = typeof params !== 'undefined' ? params : {};
    params['uid'] = UID;
    var myData = $(formName).serializeArray();
    for (var i = 0; i < myData.length ; i++) {
        params[myData[i].name] = myData[i].value;
    }
    // valida función a ejecutar
    myFunction = typeof myFunction !== 'undefined' ? myFunction : function () { };
    // loader
    Loading(true);
    // llamada asíncrona
    var request;
    request = $.ajax("/a/"+UID, {
        type: "POST",
        async: true,
        cache: false,
        data: params,
        dataType: "script",
        error: function (msg) {
            Loading(false);
            eval(msg);
        },
        success: function (msg) {
            Loading(false);
            myFunction();
        }
    });

    try {
        ga('send', 'pageview', {
            'page': '/a/' + UID,
            'title': '/a/' + UID
        });
    } catch (e) {
        Loading(false);
    }
};

function sendFiles(formName, uidRep, files, params, myFunction) {
    // valida función a ejecutar
    myFunction = typeof myFunction !== 'undefined' ? myFunction : function () { };
    // valida params
    params = typeof params !== 'undefined' ? params : {};
    
    //valida files
    var numFiles = 0;
    Loading(true);

    numFiles = typeof files !== 'undefined' ? files.length : 0;

    var data = new FormData();

    if (numFiles > 0) {
        if (numFiles == 1) {
            $.each(files, function (key, value) {
                data.append(key, value);
            });
        } else if (numFiles > 1) {
            for (var i = 0; i < files.length; i++) {
                data.append("tmp_file_" + i, files[i]);
            }
        }

        data.append("uidRep", uidRep);

        for (var i = 0; i < params.length; i++) {
            data.append(params[i].name, params[i].value);
        }

        var myData = $(formName).serializeArray();

        for (var i = 0; i < myData.length ; i++) {
            if (typeof myData[i].name !== 'undefined') {
                data.append(myData[i].name, myData[i].value);
            }
        }

        $.ajax({
            url: "/u/" + uidRep,
            type: "POST",
            data: data,
            dataType: "script",
            mimeType: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success: function (data, textStatus, jqXHR) {
                myFunction();
                Loading(false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Loading(false);
            }
        });
    } else {
        myFunction();
    }
}

function sendFilesFirmado(formName, uidRef, rfc, password, files, params, myFunction) {
    // valida función a ejecutar
    myFunction = typeof myFunction !== 'undefined' ? myFunction : function () { };
    // valida params
    params = typeof params !== 'undefined' ? params : {};
    params['uidRef'] = uidRef;
    params['rfc'] = rfc;
    params['password'] = password;

    //valida files
    var numFiles = 0;
    Loading(true);

    numFiles = typeof files !== 'undefined' ? files.length : 0;

    var data = new FormData();
    data.append("uidRef", uidRef);
    data.append("rfc", rfc);
    data.append("password", password);

    if (numFiles > 0) {
        if (numFiles == 1) {
            $.each(files, function (key, value) {
                data.append(key, value);
            });
        } else if (numFiles > 1) {
            for (var i = 0; i < files.length; i++) {
                data.append("tmp_file_" + i, files[i]);
            }
        }

        var myData = $(formName).serializeArray();

        for (var i = 0; i < myData.length ; i++) {
            if (typeof myData[i].name !== 'undefined') {
                data.append(myData[i].name, myData[i].value);
            }
        }

        for (var i = 0; i < params.length; i++) {
            data.append(params[i].name, params[i].value);
        }


        $.ajax({
            url: "/sys/ulf.ashx",
            type: "POST",
            data: data,
            dataType: "script",
            mimeType: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success: function (data, textStatus, jqXHR) {
                myFunction();
                Loading(false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Loading(false);
            }
        });
    } else {
        myFunction();
    }
}

function get(UID, params, myFunction) {
    var request = null;
    // valida parámetros extra
    params = typeof params !== 'undefined' ? params : {};
    params['uid'] = UID;
    // valida función a ejecutar
    myFunction = typeof myFunction !== 'undefined' ? myFunction : function () { };
    // loader
    Loading(true);
    // llamada asíncrona
    request = $.ajax({
        type: "POST",
        url: "/a/"+UID,
        async: true,
        cache: false,
        data: params,
        dataType: "script",
        error: function (msg) {
            Loading(false);
            eval(msg);
        },
        success: function (msg) {
            Loading(false);
            myFunction();
        }
    });

    try {
        ga('send', 'pageview', {
            'page': '/a/' + UID,
            'title': '/a/' + UID
        });
    } catch (e) {

    }
};


// bind Form Elements
function bF(elementName, value) {
    var tipo;

    try {
        tipo = $(elementName).get(0).tagName.toLowerCase();
        if (tipo == 'label' || tipo == 'h1' || tipo == 'h2' || tipo == 'h3' || tipo == 'h4' || tipo == 'h5' || tipo == 'button') {
            $(elementName).text(value);
        } else if (tipo == 'input' || tipo == 'textarea' || tipo == 'select' || tipo == 'checkbox' || tipo == 'radio') {
            if ($(elementName).is(':radio')) {
                console.log('control: ' + elementName.substring(1) + '; valor: ' + value);
                $("input:radio[name=" + elementName.substring(1) + "-RB][value=" + value + "]").prop('checked', true);
                $("input:radio[name=" + elementName.substring(1) + "-RB]").each(function () {
                    $(this).parent('.btn').removeClass('active');
                });
                $("input:radio[name=" + elementName.substring(1) + "-RB][value=" + value + "]").parent('.btn').addClass('active');
            } else if (tipo == 'select') {
                if ($(elementName).is("[multiple]")) {
                    var myVal = value.split(',');
                    $(elementName).val(myVal);
                    try {
                        $('.chosen-select').trigger("chosen:updated");
                        $(elementName).select2('val', myVal);
                    } catch (ex) { }
                } else {
                    $(elementName).val(value);
                    try {
                        $('.chosen-select').trigger("chosen:updated");
                        $(elementName).select2('val', value);
                    } catch (e) {
                        //alert(e);
                    }
                }
            } else {
                $(elementName).val(value);
            }

            if ($(elementName).is(":hidden")) {
                $(elementName).trigger('change');
            }


        } else if (tipo == 'div' || tipo == 'span' || tipo == 'table' || tipo == 'p' || tipo == 'a') {
            $(elementName).html(value);
        } else if (tipo == 'img') {
            $(elementName).attr('src', value);
        }
    } catch (exc) {

    }
    tipo = null;
}

// bind Combo
function bC(elementName, data) {
    var options = '';
    for (var i = 0; i < data.length; i++) {
        options += '<option value="' + data[i].oV + '">' + data[i].oD + '</option>';
    }
    $(elementName).html(options);
    $(elementName).prop("selectedIndex", -1);
    options = null;
    try {
        $('.chosen-select').chosen({ width: "100%", disable_search_threshold: 10, no_results_text: "Sin registros" });
        $('.chosen-select').trigger("chosen:updated");
    } catch (e) { }

}


// bind Grid
function bG(elementName, data) {
    var nr = 0;
    var nc = 0;
    var myItem = '';
    var oldItem = '';
    var newItem = '';
    var idxItem = '';
    var allItems = '';
    var arrAllItems = [];

    myItem = $(elementName + '-TPL').html();
    oldItem = $(elementName + '-TPL')[0].outerHTML;
    $(elementName).children().remove();

    if (data != null) {

        if (myItem != null && myItem.length > 0 && myItem != 'none') {
            nr = data.length;
            for (property in data[0]) {
                nc++;
            }
            for (var i = 0; i < nr; i++) {
                //newItem = null;
                newItem = myItem;
                for (var j = 0; j < nc; j++) {
                    idxItem = 'data\\[' + j + '\\]';
                    newItem = newItem.replace(new RegExp(idxItem, 'g'), data[i][j]);
                }
                arrAllItems.push('<tr> \n');
                arrAllItems.push(newItem);
                arrAllItems.push(' \n</tr>\n');
            }
            $(elementName).html(arrAllItems.join('') + oldItem);
            arrAllItems = null;
            allItems = null;
        }
    } else {
        $(elementName).append(oldItem + '<tr><td> Sin registros </td> </tr>');
    }
}

// clean Grid
function cG(elementName) {
    $(elementName).children(':not(.sysTemplate)').remove();
    $(elementName).append('<tr><td> Sin registros </td> </tr>');
}

// bind Template

function bTPL(elementName, data) {
    var nr = 0;
    var nc = 0;
    var myItem = '';
    var oldItem = '';
    var newItem = '';
    var idxItem = '';
    var allItems = '';
    var arrAllItems = [];

    myItem = $(elementName + '-TPL').html();
    oldItem = $(elementName + '-TPL')[0].outerHTML;
    //$(elementName).children(':not(' + elementName + '-TPL)').remove();
    $(elementName).children().remove();
    //$(elementName).html('');
    //alert(oldItem);
    if (data != null) {

        if (myItem != null && myItem.length > 0 && myItem != 'none') {
            nr = data.length;
            for (property in data[0]) {
                nc++;
            }
            for (var i = 0; i < nr; i++) {
                //newItem = '';
                newItem = myItem;
                for (var j = 0; j < nc; j++) {
                    idxItem = 'data\\[' + j + '\\]';
                    newItem = newItem.replace(new RegExp(idxItem, 'g'), data[i][j]);
                }
                arrAllItems.push(newItem);
                //allItems += newItem + '\n';
            }
            $(elementName).html(arrAllItems.join('') + oldItem);
            //$(elementName).html(''+arrAllItems.join(''));
            arrAllItems = null;
            allItems = null;
        } else {
            $(elementName).append('<div style="padding: 10px;">Sin template</div>');
        }
    } else {
        $(elementName).append(oldItem + '<div style="padding: 10px;">Sin datos</div>');
    }
}

// Filtrar
function filter(selector, query) {
    query = $.trim(query); //trim white space
    query = query.replace(/ /gi, '|'); //add OR for regex query
    $(selector).each(function () {
        ($(this).text().search(new RegExp(query, "i")) < 0) ? $(this).hide().removeClass('visible') : $(this).show().addClass('visible');
    });
}

// Cargar Snippet
function getSnippet(target, url, params, myFunction) {
    params = typeof params !== 'undefined' ? params : {};
    myFunction = typeof myFunction !== 'undefined' ? myFunction : function () { };

    $(target).load(url, params, myFunction);

    try {
        ga('send', 'pageview', {
            'page': '/f/' + url,
            'title': '/f/' + url
        });
    } catch (e) {

    }
}

// Cargar Snippet desde el fileHandler
function getResource(target, urlUID, params, myFunction, fade) {
    params = typeof params !== 'undefined' ? params : {};
    params['uid'] = urlUID;
    myFunction = typeof myFunction !== 'undefined' ? myFunction : function () { };
    fade = typeof fade !== 'undefined' ? fade : false;
    if (fade) {
        $(target).addClass('animated fadeOut');
        setTimeout(function () {
            $(target).css('visibility', 'hidden');
            $(target).removeClass('animated fadeOut');
            $(target).empty();
            $(target).load('/f/'+urlUID, params, myFunction);
            setTimeout(function () {
                $(target).addClass('animated fadeIn');
                $(target).css('visibility', 'visible');
            }, 400);
        }, 400);
    } else {
        $(target).empty();
        $(target).load('/f/'+urlUID, params, myFunction);
    }

    try {
        ga('send', 'pageview', {
            'page': '/f/' + urlUID,
            'title': '/f/' + urlUID
        });
    } catch (e) {

    }
}


function showInfo(msg) {
    try {
        $('body').pgNotification({
            style: 'simple',
            message: '<div style="float:left;"><img src="/img/alert/info_2x.png" width="40" height="40"></div><div class="p-l-5" style="float:left;"><strong>Información</strong><br/>' + msg + '</div>',
            position: 'top-right',
            type: 'info',
            title: 'Información', 
            thumbnail: '<img width="40" height="40" style="display: inline-block;" src="/img/alert/info_2x.png" data-src="/img/alert/info.png" data-src-retina="/img/alert/info_2x.png" alt=""> ',
            timeout: 4200
        }).show();
    } catch (e) {
        alert('Información: ' + msg);
    }
}

function showOk(msg) {
    try {
        $('body').pgNotification({
            style: 'simple',
            message: '<div style="float:left;"><img src="/img/alert/ok_2x.png" width="40" height="40"></div><div class="p-l-5" style="float:left;"><strong>Éxito</strong><br/>' + msg + '</div>',
            position: 'top-right',
            type: 'success',
            title: 'Éxito',
            thumbnail: '<img width="40" height="40" style="display: inline-block;" src="/img/alert/ok_2x.png" data-src="/img/alert/ok.png" data-src-retina="/img/alert/ok_2x.png" alt=""> ',
            timeout: 5000
        }).show();
    } catch (e) {
        alert('Éxito: ' + msg);
    }
}

function showWarning(msg) {
    try {
        $('body').pgNotification({
            style: 'simple',
            message: '<div style="float:left;"><img src="/img/alert/warning_2x.png" width="40" height="40"></div><div class="p-l-5" style="float:left;"><strong>Cuidado</strong><br/>' + msg + '</div>',
            position: 'top-right',
            type: 'warning',
            title: 'Cuidado',
            thumbnail: '<img width="40" height="40" style="display: inline-block;" src="/img/alert/warning_2x.png" data-src="/img/alert/warning.png" data-src-retina="/img/alert/warning_2x.png" alt=""> ',
            timeout: 7200
        }).show();
    } catch (e) {
        alert('Cuidado: ' + msg);
    }
}

function showError(msg) {
    try {
        $('body').pgNotification({
            style: 'simple',
            message: '<div style="float:left;"><img src="/img/alert/error_2x.png" width="40" height="40"></div><div class="p-l-5" style="float:left;"><strong>Error</strong><br/>' + msg + '</div>',
            position: 'top-right',
            type: 'danger',
            title: 'Error',
            thumbnail: '<img width="40" height="40" style="display: inline-block;" src="/img/alert/error_2x.png" data-src="/img/alert/errorg.png" data-src-retina="/img/alert/error_2x.png" alt=""> ', 
            timeout: 0
        }).show();
    } catch (e) {
        alert('Error: ' + msg);
    }
}