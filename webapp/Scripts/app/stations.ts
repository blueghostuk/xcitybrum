var allStations = new Array<TrainNotifier.XCityBrum.Station>();

allStations.push(new TrainNotifier.XCityBrum.Station(
    "LIF",
    "Lichfield Trent Valley",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "LIC",
    "Lichfield City",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "SEN",
    "Shenstone",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "BKT",
    "Blake Street",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "BUL",
    "Butlers Lane",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "FOK",
    "Four Oaks",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "SUT",
    "Sutton Coldfield",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "WYL",
    "Wylde Green",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "CRD",
    "Chester Road",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "ERD",
    "Erdington",
    { lat: 52, lng: 1 },
    false));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "GVH",
    "Gravelly Hill",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "AST",
    "Aston",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "DUD",
    "Duddeston",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "BHM",
    "Birmingham New St.",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "FWY",
    "Five Ways",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "UNI",
    "University",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "SLY",
    "Selly Oak",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "BRV",
    "Bournville",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "KNN",
    "Kings Norton",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "NFD",
    "Northfield",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "LOB",
    "Longbridge",
    { lat: 52, lng: 1 }));

allStations.push(new TrainNotifier.XCityBrum.Station(
    "BTG",
    "Barnt Green",
    { lat: 52, lng: 1 }));

module TrainNotifier.XCityBrum {
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
                return station.crsCode.toUpperCase().indexOf(query) > -1 || station.name.toUpperCase().indexOf(query) > -1;
            });
        }
    }
}