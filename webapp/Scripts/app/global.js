var pages = {
    index: "XCity Brum",
    train: "XCity Brum: Train",
    station: "XCity Brum: Station"
};

$(function () {
    switchPage(loadedPage);
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
            break;

        case pages.station:
            loadStation();
            break;
    }
}
//# sourceMappingURL=global.js.map
