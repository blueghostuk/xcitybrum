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

        var StationResult = (function () {
            function StationResult(station, arrivals, departures) {
                this.station = station;
                var arrivalTrains;
                if (arrivals.trainServicesField) {
                    arrivalTrains = arrivals.trainServicesField.map(function (arrival) {
                        return new TrainServiceResult(arrival);
                    });
                } else {
                    arrivalTrains = [];
                }
                var departureTrains;
                if (departures.trainServicesField) {
                    var departureTrains = departures.trainServicesField.map(function (arrival) {
                        return new TrainServiceResult(arrival);
                    });
                } else {
                    departureTrains = [];
                }

                var allTrains = arrivalTrains.concat(departureTrains);

                this.approachingTrains = allTrains.filter(function (t) {
                    return !t.isPast;
                }).sort(function (a, b) {
                    return a.departure.isBefore(b.departure) ? -1 : 1;
                });
                this.recentTrains = allTrains.filter(function (t) {
                    return t.isPast;
                }).sort(function (a, b) {
                    return a.departure.isAfter(b.departure) ? -1 : 1;
                });

                this.approachingTrains = _.take(this.approachingTrains, 4);
                this.recentTrains = _.take(this.recentTrains, 4);
            }
            return StationResult;
        })();
        XCityBrum.StationResult = StationResult;

        var TrainServiceResult = (function () {
            function TrainServiceResult(trainService) {
                this.serviceId = trainService.serviceIDField;
                this.platform = trainService.platformField ? "P" + trainService.platformField : "";
                this.destination = StationHelper.findStationByCRSCode(trainService.destinationField[0].crsField).name;

                // if terminates etdField is null
                var expectedDeptField = trainService.etdField ? trainService.etdField : trainService.etaField;
                var departureField = trainService.stdField ? trainService.stdField : trainService.staField;

                this.expectedDeparture = departureField;
                this.departure = moment(expectedDeptField.toLowerCase() == TrainServiceResult.onTime ? departureField : expectedDeptField, "HH:mm");
                this.isPast = this.departure.isBefore(moment());
                this.due = this.departure.fromNow();
            }
            TrainServiceResult.onTime = "on time";
            return TrainServiceResult;
        })();
        XCityBrum.TrainServiceResult = TrainServiceResult;

        var TrainDetailsResult = (function () {
            function TrainDetailsResult(trainDetails) {
                this.previousCrsCode = trainDetails.crsField;

                var destination = trainDetails.subsequentCallingPointsField.length > 0 ? _.last(trainDetails.subsequentCallingPointsField[0].callingPointField) : trainDetails;

                var destStation = StationHelper.findStationByCRSCode(destination.crsField);

                // if terminates then use sta
                this.title = (trainDetails.stdField ? trainDetails.stdField : trainDetails.staField) + " to " + destStation.name;

                // sometimes estimate is null ???
                var etaField = trainDetails.etaField ? trainDetails.etaField : trainDetails.staField;

                var expectedArrival = moment((etaField.toLowerCase() == TrainDetailsResult.onTime ? trainDetails.staField : etaField), "HH:mm");

                var isPast = expectedArrival.isBefore(moment());

                this.headline = (isPast ? "Arrived " : "Due ") + expectedArrival.fromNow() + (trainDetails.platformField ? " on P" + trainDetails.platformField : "");

                this.previousCallingPoints = trainDetails.previousCallingPointsField[0].callingPointField.sort(function (a, b) {
                    return moment(a.stField, "HH:mm").isBefore(moment(b.stField, "HH:mm")) ? 1 : -1;
                }).map(function (cp) {
                    var station = StationHelper.findStationByCRSCode(cp.crsField);
                    var completed = cp.atField != null;
                    var diffField = completed ? cp.atField : cp.etField;
                    var difference = diffField.toLowerCase() == TrainDetailsResult.onTime ? 0 : moment(diffField, "HH:mm").diff(moment(cp.stField, "HH:mm"), "minutes");

                    return new TrainDetailsStop(station.name, (diffField.toLowerCase() == TrainDetailsResult.onTime ? cp.stField : diffField), completed, difference);
                });

                if (trainDetails.subsequentCallingPointsField.length > 0) {
                    this.callingAt = trainDetails.subsequentCallingPointsField[0].callingPointField.sort(function (a, b) {
                        return moment(a.stField, "HH:mm").isBefore(moment(b.stField, "HH:mm")) ? -1 : 1;
                    }).map(function (cp) {
                        var station = StationHelper.findStationByCRSCode(cp.crsField);
                        var completed = cp.atField != null;
                        var diffField = completed ? cp.atField : cp.etField;
                        var difference = diffField.toLowerCase() == TrainDetailsResult.onTime ? 0 : moment(diffField, "HH:mm").diff(moment(cp.stField, "HH:mm"), "minutes");

                        return new TrainDetailsStop(station.name, (diffField.toLowerCase() == TrainDetailsResult.onTime ? cp.stField : diffField), completed, difference);
                    });
                } else {
                    this.callingAt = [];
                }
            }
            TrainDetailsResult.onTime = "on time";
            return TrainDetailsResult;
        })();
        XCityBrum.TrainDetailsResult = TrainDetailsResult;

        var TrainDetailsStop = (function () {
            function TrainDetailsStop(stationName, time, completed, delay) {
                this.stationName = stationName;
                this.time = time;
                this.completed = completed;
                if (time.toLowerCase() == TrainDetailsStop.noReport) {
                    this.timeSuffixClass = "badge-primary";
                    this.timeSuffix = "NA";
                } else {
                    if (delay < 0) {
                        this.timeSuffixClass = "badge-positive";
                        this.timeSuffix = delay.toString();
                    } else if (delay > 0) {
                        this.timeSuffixClass = "badge-negative";
                        this.timeSuffix = "+" + delay.toString();
                    } else {
                        this.timeSuffixClass = null;
                        this.timeSuffix = "RT";
                    }
                }
            }
            TrainDetailsStop.noReport = "no report";
            return TrainDetailsStop;
        })();
        XCityBrum.TrainDetailsStop = TrainDetailsStop;

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
