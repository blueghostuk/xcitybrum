
var nearestStations = ko.observableArray<TrainNotifier.XCityBrum.Station>();
var stationSearchResults = ko.observableArray<TrainNotifier.XCityBrum.Station>();

var indexModel = {
    favourites: favouriteStations,
    nearest: nearestStations,
    searchResults: stationSearchResults
}

// TEMP:
nearestStations.push(TrainNotifier.XCityBrum.StationHelper.findStationByCRSCode("FWY"));
nearestStations.push(TrainNotifier.XCityBrum.StationHelper.findStationByCRSCode("BHM"));


function loadIndex() {
    stationSearchResults.removeAll();
    ko.applyBindings(indexModel, $("#app-index")[0]);

    $("#app-index-station-search").unbind();
    $("#app-index-station-search").on('keyup', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
        updateSearchResults($(this).val());
    });
}

function updateSearchResults(query: string) {
    stationSearchResults.removeAll();
    if (query.length > 0) {
        var searchResults = TrainNotifier.XCityBrum.StationHelper.searchStations(query);
        for (var i = 0; i < searchResults.length; i++) {
            stationSearchResults.push(searchResults[i]);
        }
    }
}