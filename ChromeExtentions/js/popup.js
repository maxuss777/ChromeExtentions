$("#glyphicon").on("click", changeIcon);
$("#site-actions").on("click", applyOption);

var result=[];
$(document).ready(function () {
   getAllChromeLocalStorageKeys();
   alert(result[0]);

    renderKey(result[0]);

    // $().each(keys, function(index, value){
    //     var items = getItemsFromChromeLocalStorage(value);
    //     renderKey(value);
    //     $().each(items, function(index, value){
    //         renderItem(value);
    //     });
    // });
})

var renderKey = function(key) {
    $("#accordion > div").append(
        '<div class="panel-heading" role="tab" id="headingOne"><h4 class="panel-title"> ' + key +
        ' <a target="_blank" role="button" data-toggle="collapse"' +
        'data-parent="#accordion" href="#collapseOne" aria-expanded="false"aria-controls="collapseOne" class="collapsed"><span id="glyphicon"' +
        'class="glyphicon glyphicon-plus"></span></a></h4></div>'
    );   
}
var renderItem = function(item) {
    $("#accordion > div").append(
        '<div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne" aria-expanded="false"><div class="panel-body">' +
        '<div class="input-group"><input id="item-path-input" type="text" value="' + item.path + '" class="form-control" placeholder="item path" disabled><input id="attributes-input"' +
        'type="text" value="' + item.styles + '" class="form-control" placeholder="attributes" disabled><div id="site-actions" class="btn-group" data-toggle="buttons">' +
        '<label id="doNothingOption" class="btn btn-primary active"><input type="radio" name="options" autocomplete="off"> Do nothing</label>' +
        '<label  id="deleteOption" class="btn btn-primary"><input type="radio" name="options"autocomplete="off">' +
        'Delete</label><label id="changeOption" class="btn btn-primary"><input type="radio" name="options" autocomplete="off">' +
        'Change</label></div></div></div></div>'
    );
}

var changeIcon = function () {
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

var applyOption = function (event) {
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
            $("#attributes-input").prop("disabled", false);
            break;
    }
}

var getAllChromeLocalStorageKeys = function () {
    
    
    chrome.storage.local.get(null, function (keys) {        
        $.each(Object.keys(keys),function(index, value){
            result.push(value);
        });
    });

    
}

var getItemsFromChromeLocalStorage = function (key) {
    chrome.storage.local.get(key, function (result) {
        return Object.values(result).toArray();
    });
}