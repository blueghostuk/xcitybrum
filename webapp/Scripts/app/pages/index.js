﻿var nearestStations = ko.observableArray();
var stationSearchResults = ko.observableArray();

var indexModel = {
    favourites: favouriteStations,
    nearest: nearestStations,
    searchResults: stationSearchResults
};

function loadIndex() {
    nearestStations.removeAll();
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var nearest = _.take(allStations.sort(function (a, b) {
                var aDist = getDistanceFromLatLonInKm(position, a.latLng);
                var bDist = getDistanceFromLatLonInKm(position, b.latLng);
                return aDist > bDist ? 1 : -1;
            }), 2);
            for (var i = 0; i < nearest.length; i++) {
                nearestStations.push(nearest[i]);
            }
        });
    }
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

// http://stackoverflow.com/a/27943/117127
function getDistanceFromLatLonInKm(position, location) {
    var R = 6371;
    var dLat = deg2rad(location.lat - position.coords.latitude);
    var dLon = deg2rad(location.lng - position.coords.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(position.coords.latitude)) * Math.cos(deg2rad(location.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
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
