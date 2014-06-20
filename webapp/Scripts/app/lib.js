var TrainNotifier;
(function (TrainNotifier) {
    (function (XCityBrum) {
        var TrainStop = (function () {
            function TrainStop(completed, stationName, platform, expected, actual) {
                this.completed = completed;
                this.stationName = stationName;
                this.platform = platform;
                this.expected = expected;
                this.actual = actual;
            }
            return TrainStop;
        })();
        XCityBrum.TrainStop = TrainStop;

        var Train = (function () {
            function Train(time, fromStationName, toStationName, stops) {
                this.time = time;
                this.fromStationName = fromStationName;
                this.toStationName = toStationName;
                this.stops = stops;
            }
            Train.prototype.getCallingAtStops = function () {
                return this.stops.filter(function (stop) {
                    return !stop.completed;
                });
            };

            Train.prototype.getPreviousStops = function () {
                return this.stops.filter(function (stop) {
                    return stop.completed;
                });
            };
            return Train;
        })();
        XCityBrum.Train = Train;

        var Station = (function () {
            function Station(crsCode, name, nextCrs, latLng, fullName) {
                if (typeof fullName === "undefined") { fullName = ""; }
                this.crsCode = crsCode;
                this.name = name;
                this.nextCrs = nextCrs;
                this.latLng = latLng;
                this.fullName = fullName;
                this.isFavourite = ko.observable(false);
                var self = this;
                this.starClass = ko.computed(function () {
                    return self.isFavourite() ? "icon-star-filled" : "icon-star";
                });
            }
            Station.prototype.toggleFavourite = function () {
                if (this.isFavourite()) {
                    this.isFavourite(false);
                    favouriteStations.remove(this);
                } else {
                    this.isFavourite(true);
                    favouriteStations.push(this);
                }
                Storage.setStationFavourites(favouriteStations());
            };
            return Station;
        })();
        XCityBrum.Station = Station;

        var StationHelper = (function () {
            function StationHelper() {
            }
            StationHelper.findStationByCRSCode = function (crsCode) {
                crsCode = crsCode.toUpperCase();
                return _.find(allStations, function (station) {
                    return station.crsCode == crsCode;
                });
            };

            StationHelper.searchStations = function (query) {
                query = query.toUpperCase();

                return allStations.filter(function (station) {
                    return station.crsCode.toUpperCase().indexOf(query) > -1 || station.name.toUpperCase().indexOf(query) > -1 || station.fullName.toUpperCase().indexOf(query) > -1;
                });
            };
            return StationHelper;
        })();
        XCityBrum.StationHelper = StationHelper;

        var Storage = (function () {
            function Storage() {
            }
            Storage.getFavouriteStations = function () {
                var favs = new Array();
                var storageValue = localStorage.getItem("fav-stations");
                if (storageValue) {
                    var crsCodes = storageValue.split(",");
                    for (var i = 0; i < crsCodes.length; i++) {
                        var station = StationHelper.findStationByCRSCode(crsCodes[i]);
                        if (station) {
                            station.isFavourite(true);
                            favs.push(station);
                        }
                    }
                }
                return favs;
            };

            Storage.setStationFavourites = function (stations) {
                var crsCodes = stations.map(function (station) {
                    return station.crsCode;
                });
                localStorage.setItem("fav-stations", crsCodes.join(","));
            };
            return Storage;
        })();
        XCityBrum.Storage = Storage;
    })(TrainNotifier.XCityBrum || (TrainNotifier.XCityBrum = {}));
    var XCityBrum = TrainNotifier.XCityBrum;
})(TrainNotifier || (TrainNotifier = {}));
//# sourceMappingURL=lib.js.map
