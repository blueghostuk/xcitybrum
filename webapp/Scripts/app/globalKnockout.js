var favouriteStations = ko.observableArray();

var storageStations = TrainNotifier.XCityBrum.Storage.getFavouriteStations();
for (var i = 0; i < storageStations.length; i++) {
    favouriteStations.push(storageStations[i]);
}
//# sourceMappingURL=globalKnockout.js.map
