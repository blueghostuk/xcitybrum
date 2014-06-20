
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

        constructor(public crsCode: string, public name: string, public nextCrs:string, public latLng: GeoLocation, public fullName: string = "") {
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