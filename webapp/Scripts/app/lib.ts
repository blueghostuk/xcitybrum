
interface GeoLocation {
    lat: number;
    lng: number;
}

module TrainNotifier.XCityBrum {

    export class TrainStop {

        constructor(public completed: boolean, public stationName: string, public platform: string, public expected: Duration, public actual: Duration) { }

    }

    export class Train {

        constructor(public time: Duration, public fromStationName: string, public toStationName, private stops: TrainStop[]) { }

        getCallingAtStops() {
            return this.stops.filter(function (stop) {
                return !stop.completed;
            });
        }

        getPreviousStops() {
            return this.stops.filter(function (stop) {
                return stop.completed;
            });
        }

    }

    export class Station {

        public starClass: KnockoutComputed<string>;

        public isFavourite = ko.observable(false);

        constructor(public crsCode: string, public name: string, public nextCrs: string, public latLng: GeoLocation, public fullName: string = "") {
            var self = this;
            this.starClass = ko.computed(function () {
                return self.isFavourite() ? "icon-star-filled" : "icon-star";
            });
        }

        toggleFavourite() {
            if (this.isFavourite()) {
                this.isFavourite(false);
                favouriteStations.remove(this);
            } else {
                this.isFavourite(true);
                favouriteStations.push(this);
            }
            Storage.setStationFavourites(favouriteStations());
        }

    }

    export class StationResult {

        public stationName = ko.observable<string>(null);
        public approachingTrains = ko.observableArray<TrainServiceResult>();
        public recentTrains = ko.observableArray<TrainServiceResult>();

        constructor() { }

        clear() {
            this.stationName(null);
            this.approachingTrains.removeAll();
            this.recentTrains.removeAll();
        }

        update(station: Station, arrivals: GetArrivalDepartureBoardResult, departures: GetArrivalDepartureBoardResult) {
            this.stationName(station.name);

            var arrivalTrains: TrainServiceResult[];
            if (arrivals.trainServicesField) {
                arrivalTrains = arrivals.trainServicesField.map(function (arrival) {
                    return new TrainServiceResult(arrival);
                });
            } else {
                arrivalTrains = [];
            }
            var departureTrains: TrainServiceResult[];
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
        }

    }

    export class TrainServiceResult {

        private static onTime = "on time";
        private static cancelled = "cancelled";

        public serviceId: string;
        public platform: string;
        public destination: string;
        public expectedDeparture: string;
        public departure: Moment;
        public due: string;
        public isPast: boolean;
        public delay: string;
        public delayClass: string;

        constructor(trainService: TrainService) {
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

            if ((trainService.etaField && trainService.etaField.toLowerCase() == TrainServiceResult.cancelled) ||
                trainService.etdField && trainService.etdField.toLowerCase() == TrainServiceResult.cancelled) {
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

    }

    export class TrainDetailsResult {

        private static onTime = "on time";

        public title = ko.observable<string>(null);
        public headline = ko.observable<string>(null);
        public headlineCss = ko.observable<string>(null);
        public delay = ko.observable<string>(null);
        public delayClass = ko.observable<string>(null);

        public previousCrsCode = ko.observable<string>(null);

        public callingAt = ko.observableArray<TrainDetailsStop>();
        public previousCallingPoints = ko.observableArray<TrainDetailsStop>();

        constructor() { }

        clear() {
            this.title(null);
            this.headline(null);
            this.headlineCss(null);
            this.delay(null);
            this.delayClass(null);
            this.previousCrsCode(null);
            this.callingAt.removeAll();
            this.previousCallingPoints.removeAll();
        }

        update(trainDetails: GetServiceDetailsResult) {
            this.previousCrsCode(trainDetails.crsField);

            var destination: CrsField = trainDetails.subsequentCallingPointsField.length > 0 ?
                _.last(trainDetails.subsequentCallingPointsField[0].callingPointField) : trainDetails;

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
                var expectedArrival = moment(
                    (etaField.toLowerCase() == TrainDetailsResult.onTime ? (trainDetails.staField ? trainDetails.staField : trainDetails.stdField) : etaField),
                    "HH:mm");

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
        }
    }

    export class TrainDetailsStop {

        private static noReport = "no report";
        private static cancelled = "cancelled";

        public timeSuffixClass: string;
        public timeSuffix: string;

        constructor(public stationName: string, public time: string, public completed: boolean, delay: number) {
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

    }

    export class StationHelper {
        static findStationByCRSCode(crsCode: string) {
            crsCode = crsCode.toUpperCase();
            return _.find(allStations, function (station) {
                return station.crsCode == crsCode;
            });
        }

        static searchStations(query: string) {
            query = query.toUpperCase();

            return allStations.filter(function (station) {
                return station.crsCode.toUpperCase().indexOf(query) > -1
                    || station.name.toUpperCase().indexOf(query) > -1
                    || station.fullName.toUpperCase().indexOf(query) > -1;
            });
        }
    }

    export class Storage {

        static getFavouriteStations() {
            var favs = new Array<Station>();
            var storageValue = <string>localStorage.getItem("fav-stations");
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
        }

        static setStationFavourites(stations: Array<Station>) {
            var crsCodes = stations.map(function (station) {
                return station.crsCode;
            });
            localStorage.setItem("fav-stations", crsCodes.join(","));
        }
    }
}