var webApi;
var spinner;

var pages = {
    index: "XCity Brum",
    train: "XCity Brum: Train",
    station: "XCity Brum: Station",
    favourites: "XCity Brum: Favourites"
};

var spinOpts = {
    lines: 17,
    length: 13,
    width: 2,
    radius: 0,
    corners: 1,
    rotate: 0,
    direction: 1,
    color: '#000',
    speed: 2.2,
    trail: 17,
    shadow: false,
    hwaccel: false,
    className: 'spinner',
    zIndex: 2e9,
    top: '50%',
    left: '50%'
};

$(function () {
    webApi = new TrainNotifier.XCityBrum.WebApi();
    spinner = new Spinner(spinOpts);
    if (typeof loadedPage != "undefined") {
        switchPage(loadedPage);
    }
});

window.addEventListener('push', function (e) {
    switchPage(e.detail.state.title);
});

function switchPage(page) {
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
