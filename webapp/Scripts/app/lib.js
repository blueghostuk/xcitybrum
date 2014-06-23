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
            function StationResult() {
                this.stationName = ko.observable(null);
                this.approachingTrains = ko.observableArray();
                this.recentTrains = ko.observableArray();
            }
            StationResult.prototype.clear = function () {
                this.stationName(null);
                this.approachingTrains.removeAll();
                this.recentTrains.removeAll();
            };

            StationResult.prototype.update = function (station, arrivals, departures) {
                this.stationName(station.name);

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

                this.approachingTrains.removeAll();
                var approachingTrains = _.take(allTrains.filter(function (t) {
                    return !t.isPast;
                }).sort(function (a, b) {
                    return a.departure.isBefore(b.departure) ? -1 : 1;
                }), 4);
                for (var i = 0; i < approachingTrains.length; i++)
                    this.approachingTrains.push(approachingTrains[i]);

                this.recentTrains.removeAll();
                var recentTrains = _.take(allTrains.filter(function (t) {
                    return t.isPast;
                }).sort(function (a, b) {
                    return a.departure.isAfter(b.departure) ? -1 : 1;
                }), 4);
                for (var i = 0; i < recentTrains.length; i++)
                    this.recentTrains.push(recentTrains[i]);
            };
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
                this.departure = moment((expectedDeptField.toLowerCase() == TrainServiceResult.onTime || expectedDeptField.toLowerCase() == TrainServiceResult.cancelled) ? departureField : expectedDeptField, "HH:mm");
                this.isPast = this.departure.isBefore(moment());
                this.due = this.departure.fromNow();

                if ((trainService.etaField && trainService.etaField.toLowerCase() == TrainServiceResult.cancelled) || trainService.etdField && trainService.etdField.toLowerCase() == TrainServiceResult.cancelled) {
                    this.due = null;
                    this.delayClass = "badge-negative";
                    this.delay = "cancelled";
                } else {
                    var difference = expectedDeptField.toLowerCase() == TrainServiceResult.onTime ? 0 : moment(expectedDeptField, "HH:mm").diff(moment(departureField, "HH:mm"), "minutes");
                    if (difference > 0) {
                        this.delay = "+" + difference;
                        this.delayClass = "badge-negative";
                    } else if (difference < 0) {
                        this.delay = difference.toString();
                        this.delayClass = "badge-positive";
                    } else {
                        this.delay = "RT";
                        this.delayClass = null;
                    }
                }
            }
            TrainServiceResult.onTime = "on time";
            TrainServiceResult.cancelled = "cancelled";
            return TrainServiceResult;
        })();
        XCityBrum.TrainServiceResult = TrainServiceResult;

        var TrainDetailsResult = (function () {
            function TrainDetailsResult() {
                this.title = ko.observable(null);
                this.headline = ko.observable(null);
                this.headlineCss = ko.observable(null);
                this.delay = ko.observable(null);
                this.delayClass = ko.observable(null);
                this.previousCrsCode = ko.observable(null);
                this.callingAt = ko.observableArray();
                this.previousCallingPoints = ko.observableArray();
            }
            TrainDetailsResult.prototype.clear = function () {
                this.title(null);
                this.headline(null);
                this.headlineCss(null);
                this.delay(null);
                this.delayClass(null);
                this.previousCrsCode(null);
                this.callingAt.removeAll();
                this.previousCallingPoints.removeAll();
            };

            TrainDetailsResult.prototype.update = function (trainDetails) {
                this.previousCrsCode(trainDetails.crsField);

                var destination = trainDetails.subsequentCallingPointsField.length > 0 ? _.last(trainDetails.subsequentCallingPointsField[0].callingPointField) : trainDetails;

                var destStation = StationHelper.findStationByCRSCode(destination.crsField);

                // if terminates then use sta
                this.title((trainDetails.stdField ? trainDetails.stdField : trainDetails.staField) + " to " + destStation.name);

                if (trainDetails.isCancelledField) {
                    this.headline("Cancelled" + trainDetails.disruptionReasonField ? trainDetails.disruptionReasonField : "");
                    this.delay(null);
                    this.delayClass(null);
                    this.headlineCss("star badge-negative");
                } else {
                    var etaField = trainDetails.etaField ? trainDetails.etaField : trainDetails.staField ? trainDetails.staField : trainDetails.etdField ? trainDetails.etdField : trainDetails.stdField;
                    var expectedArrival = moment((etaField.toLowerCase() == TrainDetailsResult.onTime ? (trainDetails.staField ? trainDetails.staField : trainDetails.stdField) : etaField), "HH:mm");

                    var isPast = expectedArrival.isBefore(moment());
                    this.headline((isPast ? "Arrived " : "Due ") + expectedArrival.fromNow() + (trainDetails.platformField ? " on P" + trainDetails.platformField : ""));

                    var completed = trainDetails.ataField != null;
                    var startsHere = trainDetails.etaField == null;
                    var diffField = completed ? trainDetails.ataField : !startsHere ? trainDetails.etaField : trainDetails.etdField;
                    var difference = diffField.toLowerCase() == TrainDetailsResult.onTime ? 0 : moment(diffField, "HH:mm").diff(moment(!startsHere ? trainDetails.staField : trainDetails.stdField, "HH:mm"), "minutes");
                    if (difference > 0) {
                        this.delay("+" + difference);
                        this.delayClass("badge-negative");
                    } else if (difference < 0) {
                        this.delay(difference.toString());
                        this.delayClass("badge-positive");
                    } else {
                        this.delay("RT");
                        this.delayClass(null);
                    }
                }

                this.previousCallingPoints.removeAll();
                if (trainDetails.previousCallingPointsField.length > 0) {
                    var previousCallingPoints = trainDetails.previousCallingPointsField[0].callingPointField.sort(function (a, b) {
                        return moment(a.stField, "HH:mm").isBefore(moment(b.stField, "HH:mm")) ? 1 : -1;
                    }).map(function (cp) {
                        var station = StationHelper.findStationByCRSCode(cp.crsField);
                        var completed = cp.atField != null;
                        var diffField = completed ? cp.atField : cp.etField;
                        var difference = diffField.toLowerCase() == TrainDetailsResult.onTime ? 0 : moment(diffField, "HH:mm").diff(moment(cp.stField, "HH:mm"), "minutes");

                        return new TrainDetailsStop(station.name, (diffField.toLowerCase() == TrainDetailsResult.onTime ? cp.stField : diffField), completed, difference);
                    });
                    for (var i = 0; i < previousCallingPoints.length; i++) {
                        this.previousCallingPoints.push(previousCallingPoints[i]);
                    }
                }

                this.callingAt.removeAll();
                if (trainDetails.subsequentCallingPointsField.length > 0) {
                    var callingAt = trainDetails.subsequentCallingPointsField[0].callingPointField.sort(function (a, b) {
                        return moment(a.stField, "HH:mm").isBefore(moment(b.stField, "HH:mm")) ? -1 : 1;
                    }).map(function (cp) {
                        var station = StationHelper.findStationByCRSCode(cp.crsField);
                        var completed = cp.atField != null;
                        var diffField = completed ? cp.atField : cp.etField;
                        var difference = diffField.toLowerCase() == TrainDetailsResult.onTime ? 0 : moment(diffField, "HH:mm").diff(moment(cp.stField, "HH:mm"), "minutes");

                        return new TrainDetailsStop(station.name, (diffField.toLowerCase() == TrainDetailsResult.onTime ? cp.stField : diffField), completed, difference);
                    });
                    for (var i = 0; i < callingAt.length; i++) {
                        this.callingAt.push(callingAt[i]);
                    }
                }
            };
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
                } else if (time.toLowerCase() == TrainDetailsStop.cancelled) {
                    this.timeSuffixClass = "badge-negative";
                    this.timeSuffix = "Cancelled";
                    this.time = null;
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
            TrainDetailsStop.cancelled = "cancelled";
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
