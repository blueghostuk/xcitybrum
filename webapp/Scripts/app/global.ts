
declare var loadedPage: string;

var pages = {
    index: "XCity Brum",
    train: "XCity Brum: Train",
    station: "XCity Brum: Station"
};

$(function () {
    switchPage(loadedPage);
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

            break;

        case pages.station:
            loadStation();
            break;
    }
}