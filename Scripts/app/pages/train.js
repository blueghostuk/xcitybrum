var currentService = new TrainNotifier.XCityBrum.TrainDetailsResult();

function loadTrain() {
    var serviceId = document.location.hash.substr(2);

    spinner.spin($("#app-refresh")[0]);
    currentService.clear();
    webApi.getService(serviceId).done(function (result) {
        currentService.update(result);

        if (ko.dataFor($("#app-train-link")[0]) == null) {
            ko.applyBindings(currentService, $("#app-train-link")[0]);
            ko.applyBindings(currentService, $("#app-train-title")[0]);
            ko.applyBindings(currentService, $("#app-train-card")[0]);
        }
    }).always(function () {
        spinner.stop();
    });
}
//# sourceMappingURL=train.js.map
