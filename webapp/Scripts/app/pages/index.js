var nearestStations = ko.observableArray();
var stationSearchResults = ko.observableArray();

var indexModel = {
    favourites: favouriteStations,
    nearest: nearestStations,
    searchResults: stationSearchResults
};

// TEMP:
nearestStations.push(TrainNotifier.XCityBrum.StationHelper.findStationByCRSCode("FWY"));
nearestStations.push(TrainNotifier.XCityBrum.StationHelper.findStationByCRSCode("BHM"));

$(function () {
    $("#app-index-station-search").on('keyup', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
        updateSearchResults($(this).val());
    });
});

function loadIndex() {
    ko.applyBindings(indexModel, $("#app-index")[0]);
}

function updateSearchResults(query) {
    stationSearchResults.removeAll();
    if (query.length > 0) {
        var searchResults = TrainNotifier.XCityBrum.StationHelper.searchStations(query);
        for (var i = 0; i < searchResults.length; i++) {
            stationSearchResults.push(searchResults[i]);
        }
    }
}
//# sourceMappingURL=index.js.map
