
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

        public approachingTrains: TrainServiceResult[];
        public recentTrains: TrainServiceResult[];

        constructor(public station: Station, arrivals: GetArrivalDepartureBoardResult, departures: GetArrivalDepartureBoardResult) {
            var arrivalTrains = arrivals.trainServicesField.map(function (arrival) {
                return new TrainServiceResult(arrival);
            });
            var departureTrains = departures.trainServicesField.map(function (arrival) {
                return new TrainServiceResult(arrival);
            });

            var allTrains = arrivalTrains.concat(departureTrains);

            this.approachingTrains = allTrains.filter(function (t) {
                return !t.isPast;
            }).sort(function (a, b) {
                    return a.expectedDeparture.isBefore(b.expectedDeparture) ? -1 : 1;
                });
            this.recentTrains = allTrains.filter(function (t) {
                return t.isPast;
            }).sort(function (a, b) {
                    return a.expectedDeparture.isAfter(b.expectedDeparture) ? -1 : 1;
                });
        }

    }

    export class TrainServiceResult {

        private static onTime = "on time";

        public serviceId: string;
        private platform: string;
        private destination: string;
        private plannedDeparture: Duration;
        public expectedDeparture: Moment;

        public isPast: boolean;

        public displayString: string;

        constructor(trainService: TrainService) {
            this.serviceId = trainService.serviceIDField;
            this.platform = trainService.platformField;
            this.destination = StationHelper.findStationByCRSCode(trainService.destinationField[0].crsField).name;
            this.plannedDeparture = moment.duration(trainService.stdField);
            var expectedDeparture = trainService.etdField.toLowerCase() == TrainServiceResult.onTime ? trainService.stdField : trainService.etdField;

            this.expectedDeparture = moment(expectedDeparture, "HH:mm");
            this.isPast = this.expectedDeparture.isBefore(moment());

            this.displayString = (this.platform ? "P" + this.platform + " " : "") + trainService.stdField + " to " + this.destination + (this.isPast ? " " : " due ") + this.expectedDeparture.fromNow();
        }

    }

    export class TrainDetailsResult {

        public title: string;
        public headline: string;

        public callingAt: string[];
        public previousCallingPoints: string[];

        constructor(trainDetails: GetServiceDetailsResult) {
            var destination = _.last(trainDetails.subsequentCallingPointsField[0].callingPointField);

            var destStation = StationHelper.findStationByCRSCode(destination.crsField);

            this.title = trainDetails.stdField + " to " + destStation.name;

            this.headline = "Due in 1 min";

            this.callingAt = [];
            this.previousCallingPoints = [];
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