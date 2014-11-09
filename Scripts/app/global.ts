
declare var loadedPage: string;

var webApi: TrainNotifier.XCityBrum.WebApi;
var spinner: Spinner;

var pages = {
    index: "XCity Brum",
    train: "XCity Brum : Train",
    station: "XCity Brum : Station",
    favourites: "XCity Brum : Favourites",
};

var spinOpts = {
    lines: 17, // The number of lines to draw
    length: 13, // The length of each line
    width: 2, // The line thickness
    radius: 0, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 2.2, // Rounds per second
    trail: 17, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};

$(function () {
    webApi = new TrainNotifier.XCityBrum.WebApi();
    spinner = new Spinner(spinOpts);
    if (typeof loadedPage != "undefined") {
        switchPage(loadedPage);
    }
});

window.addEventListener('push', function (e : CustomEvent) {
    switchPage(e.detail.state.title);
});

function switchPage(page: string) {
    switch (page) {
        case pages.index:
            loadIndex();
            break;

        case pages.train:
            loadTrain();
            break;

        case pages.station:
            loadStation();
            break;

        case pages.favourites:
            loadFavs();
            break;
    }
}