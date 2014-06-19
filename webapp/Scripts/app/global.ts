
var pages = {
    index: "XCity Brum",
    train: "XCity Brum: Train",
    station: "XCity Brum: Station"
};

window.addEventListener('push', function (e : CustomEvent) {
    switch (e.detail.state.title) {
        case pages.index:
            loadIndex();
            break;

        case pages.train:

            break;

        case pages.station:

            break;
    }
});