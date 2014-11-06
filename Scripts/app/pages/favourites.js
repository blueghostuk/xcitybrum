var favsModel = {
    favourites: favouriteStations,
    searchResults: stationSearchResults
};

function loadFavs() {
    stationSearchResults.removeAll();
    ko.applyBindings(favsModel, $("#app-favs")[0]);

    $("#app-favs-station-search").unbind();
    $("#app-favs-station-search").on('keyup', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
        updateFavouriteSearchResults($(this).val());
    });
}

function updateFavouriteSearchResults(query) {
    stationSearchResults.removeAll();
    if (query.length > 0) {
        var searchResults = TrainNotifier.XCityBrum.StationHelper.searchStations(query);
        for (var i = 0; i < searchResults.length; i++) {
            stationSearchResults.push(searchResults[i]);
        }
    }
}
