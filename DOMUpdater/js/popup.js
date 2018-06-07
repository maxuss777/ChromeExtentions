$("#addSiteInput").on("click", addNewSite);
$("#clearNewSiteInput").on("click", clearNewSiteInput);
$(document).ready(renderExistingSites);

window.addEventListener("load", function () { this.onload = function () { }; handleClientLoad(); });
window.addEventListener("readystatechange", function () { if (this.readyState === 'complete') this.onload(); });
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

function changeIcon(event) {
    var collapse = $("#collapse-"+event.target.id.split('-')[1]);
    var span = $("#"+event.target.id);
    if (collapse.attr("aria-expanded") === "true") {
        span.removeClass("glyphicon-minus");
        span.addClass("glyphicon-plus");
    }
    else {
        span.removeClass("glyphicon-plus");
        span.addClass("glyphicon-minus");
    }
}

function applyOption(event) {
    var key = event.delegateTarget.id.split('-')[2];
    switch (event.target.id) {
        case "delete":
            $("#item-path-input-"+key).prop("disabled", false);
            $("#attributes-input-"+key).prop("disabled", true);
            break;
        case "nothing":
            $("#item-path-input-"+key).prop("disabled", true);
            $("#attributes-input-"+key).prop("disabled", true);
            break;
        case "change":
            $("#item-path-input-"+key).prop("disabled", false);
            $("#attributes-input-"+key).prop("disabled", false);
            break;
    }
}

function addNewSite() {

    var newSiteUrl = $('#new-site-url-input').val();
    var newSiteElementSelector = $('#new-site-element-selector').val();
    var newSiteElementAttributes = $('#new-site-element-attributes').val();

    if (!newSiteUrl || !newSiteElementSelector || !newSiteElementAttributes) {
        showMessage('Error: No value specified', false);
        return;
    }
    
    var configurations = { "url" : newSiteUrl, "selector": newSiteElementSelector, "attributes": newSiteElementAttributes };
    var x = Math.floor((Math.random() * 10000) + 1);

    chrome.storage.local.set({ [x]: configurations }, function () {
        clearNewSiteInput();
        showMessage("New site has been added", true);
    });
}

function clearNewSiteInput() {
    $('#new-site-url-input').val('');
    $('#new-site-element-selector').val('');
    $('#new-site-element-attributes').val('');
}

function showMessage(message, isSuccess) {
    if (isSuccess) {
        $('#alert').addClass("alert-success").html("<strong>Success!</strong> " + message);
    }
    else {
        $('#alert').addClass("alert-danger").html("<strong>False!</strong> " + message);
    }

    $('#alert').removeClass("hidden");
    setTimeout(removeAlert, 3000);
}

function removeAlert() {
    $('#alert').addClass("hidden");
    $('#alert').removeClass("alert-success").removeClass("alert-danger");
}

function renderExistingSites() {
    chrome.storage.local.get(null, function (result) {
        var keys = Object.keys(result);
        $.each(keys, function (key) {
            renderSiteConfigurations(keys[key]);
        });
    });
}

function renderSiteConfigurations(key) {
    chrome.storage.local.get([key], function (configurations) {
        $.each(configurations, function (configuration) {
            renderConfiguration(key, configurations[configuration]);
        });
    });
}

function renderConfiguration(key, configuration) {
    $('#accordion > div:nth-child(3)').append('<div class="panel-heading" role="tab" id="heading-'+key+'"><h4 class="panel-title">' + configuration.url +
        '<a target="_blank" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-' + key + '" aria-expanded="false"aria-controls="collapse-' + key + '" ' +
        ' class="collapsed"><span id="glyphicon-'+key+'" class="glyphicon-'+key+' glyphicon-plus"></span></a></h4></div>');
    $('#accordion > div:nth-child(3)').append('<div id="collapse-' + key + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+key+'" aria-expanded="false"><div class="panel-body"><div class="input-group">' +
        '<input id="item-path-input-'+key+'" type="text" value="' + configuration.selector + '" class="form-control" placeholder="item path" disabled><input id="attributes-input-'+key+'" type="text" value="' + configuration.attributes + '" class="form-control" placeholder="attributes" disabled>' +
        '<div id="site-actions-'+key+'" class="btn-group" data-toggle="buttons"><label id="nothing" class="btn btn-primary active"><input type="radio" name="options" autocomplete="off"> Do nothing</label>' +
        '<label id="delete" class="btn btn-primary"><input type="radio" name="options" autocomplete="off"> Delete</label><label id="change" class="btn btn-primary">' +
        '<input type="radio" name="options" autocomplete="off"> Change</label></div></div></div></div>');

    $("#glyphicon-"+key).on("click", changeIcon);
    $("#site-actions-"+key).on("click", applyOption);
}