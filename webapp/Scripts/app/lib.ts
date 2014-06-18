
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

        public isFavourite: KnockoutObservable<boolean>;

        constructor(public crsCode: string, public name: string, public latLng: GeoLocation, isFavourite: boolean = false) {

            this.isFavourite = ko.observable(isFavourite);

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
            return false;
        }
        
    }
}