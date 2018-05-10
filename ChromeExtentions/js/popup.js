$("#glyphicon").on("click", changeIcon);
$("#site-actions").on("click", applyOption);

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
            $("#attributes-input").prop("disabled", false);
            break;
    }
}