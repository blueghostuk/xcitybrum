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
            function Station(crsCode, name, latLng, fullName) {
                if (typeof fullName === "undefined") { fullName = ""; }
                this.crsCode = crsCode;
                this.name = name;
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
                return false;
            };
            return Station;
        })();
        XCityBrum.Station = Station;
    })(TrainNotifier.XCityBrum || (TrainNotifier.XCityBrum = {}));
    var XCityBrum = TrainNotifier.XCityBrum;
})(TrainNotifier || (TrainNotifier = {}));
//# sourceMappingURL=lib.js.map
