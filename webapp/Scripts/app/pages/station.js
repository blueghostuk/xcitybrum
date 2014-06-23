function loadStation() {
    var stationCrs = document.location.hash.substr(2, 3);

    var station = TrainNotifier.XCityBrum.StationHelper.findStationByCRSCode(stationCrs);

    spinner.spin($("#app-refresh")[0]);
    webApi.getStationStatus(station).done(function (result) {
        var currentStation = new TrainNotifier.XCityBrum.StationResult(station, result[0], result[1]);

        ko.applyBindings(currentStation, $("#app-station-title")[0]);
        ko.applyBindings(currentStation, $("#app-station-card")[0]);
    }).always(function () {
        spinner.stop();
    });
    ;
}
//# sourceMappingURL=station.js.map
