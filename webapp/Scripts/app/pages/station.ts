
var currentStation = ko.observable<TrainNotifier.XCityBrum.Station>();

function loadStation() {
    var stationCrs = document.location.hash.substr(2, 3);

    var station = TrainNotifier.XCityBrum.StationHelper.findStationByCRSCode(stationCrs);

    currentStation(station);

    ko.applyBindings(currentStation, $("#app-station-title")[0]);
}