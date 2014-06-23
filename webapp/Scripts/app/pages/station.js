var currentStation = new TrainNotifier.XCityBrum.StationResult();

function loadStation() {
    var stationCrs = document.location.hash.substr(2, 3);
    var station = TrainNotifier.XCityBrum.StationHelper.findStationByCRSCode(stationCrs);

    spinner.spin($("#app-refresh")[0]);
    currentStation.clear();
    webApi.getStationStatus(station).done(function (result) {
        currentStation.update(station, result[0], result[1]);

        if (ko.dataFor($("#app-station-title")[0]) == null) {
            ko.applyBindings(currentStation, $("#app-station-title")[0]);
            ko.applyBindings(currentStation, $("#app-station-card")[0]);
        }
    }).always(function () {
        spinner.stop();
    });
    ;
}
//# sourceMappingURL=station.js.map
