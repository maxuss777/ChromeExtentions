$("#glyphicon").on("click", changeIcon);
$("#site-actions").on("click", applyOption);
$("#addSiteInput").on("click", addNewSite);
$("#clearNewSiteInput").on("click", clearNewSiteInput);
$(document).ready(renderExistingSites);

function changeIcon() {
    var collapseOne = $("#collapseOne");
    var span = $("#glyphicon");
    if (collapseOne.attr("aria-expanded") === "true") {
        span.removeClass("glyphicon-minus");
        span.addClass("glyphicon-plus");
    }
    else {
        span.removeClass("glyphicon-plus");
        span.addClass("glyphicon-minus");
    }
}

function applyOption(event) {
    switch (event.target.id) {
        case "deleteOption":
            $("#item-path-input").prop("disabled", false);
            $("#attributes-input").prop("disabled", true);
            break;
        case "doNothingOption":
            $("#item-path-input").prop("disabled", true);
            $("#attributes-input").prop("disabled", true);
            break;
        default:
            $("#item-path-input").prop("disabled", false);
            $("#attributes-input").prop("disabled", false);
            break;
    }
}

function addNewSite() {

    var newSiteUrl = $('#new-site-url-input').val();
    var newSiteElementSelector = $('#new-site-element-selector').val();
    var newSiteElementAttributes = $('#new-site-element-attributes').val();

    if (!newSiteUrl && !newSiteElementSelector && !newSiteElementAttributes) {
        showMessage('Error: No value specified', false);
        return;
    }
    var configurations =[];
    configurations.push({ "url" : newSiteUrl, "selector": newSiteElementSelector, "attributes": newSiteElementAttributes });
    var x = Math.floor((Math.random() * 10000) + 1);

    chrome.storage.local.set({ [x]: configurations }, function () {
        clearNewSiteInput();
        showMessage("New site has been added", true);
    });
}

function clearNewSiteInput() {
    $('#new-site-path-input').val('');
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
    console.log(key +' : '+configuration);
    $('#accordion > div:nth-child(3)').append('<div class="panel-heading" role="tab" id="heading-'+key+'"><h4 class="panel-title">' + configuration.url +
        '<a target="_blank" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-' + configuration.url + '" aria-expanded="false"aria-controls="collapse-' + key + '" ' +
        ' class="collapsed"><span id="glyphicon" class="glyphicon glyphicon-plus"></span></a></h4></div>');
    $('#accordion > div:nth-child(3)').append('<div id="collapse-' + key + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+key+'" aria-expanded="false"><div class="panel-body"><div class="input-group">' +
        '<input id="item-path-input" type="text" value="' + configuration.selector + '" class="form-control" placeholder="item path" disabled><input id="attributes-input" type="text" value="' + configuration.attributes + '" class="form-control" placeholder="attributes" disabled>' +
        '<div id="site-actions" class="btn-group" data-toggle="buttons"><label id="doNothingOption" class="btn btn-primary active"><input type="radio" name="options" autocomplete="off"> Do nothing</label>' +
        '<label id="deleteOption" class="btn btn-primary"><input type="radio" name="options" autocomplete="off"> Delete</label><label id="changeOption" class="btn btn-primary">' +
        '<input type="radio" name="options" autocomplete="off"> Change</label></div></div></div></div>');
}