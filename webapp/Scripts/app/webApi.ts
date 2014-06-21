interface GetArrivalDepartureBoardResult {
    platformAvailableField: boolean;
    trainServicesField: TrainService[];
}

interface TrainService {
    originField: TrainLocation[];
    destinationField: TrainLocation[];
    currentOriginsField: TrainLocation[];
    currentDestinationsField: TrainLocation[];
    staField: string;
    etaField: string;
    stdField: string;
    etdField: string;
    platformField: string;
    serviceIDField: string;
}

interface TrainLocation extends CrsField {
    locationNameField: string;
    viaField: string;
}

interface CrsField {
    crsField: string;
}

interface GetServiceDetailsResult extends CrsField {
    isCancelledField: boolean;
    platformField: string;
    staField: string;
    etaField: string;
    ataField: string;
    stdField: string;
    etdField: string;
    atdField: string;
    previousCallingPointsField: { callingPointField: CallingPoint[] }[];
    subsequentCallingPointsField: { callingPointField: CallingPoint[] }[];
}

interface CallingPoint extends CrsField {
    stField: string;
    etField: string;
    atField: string;
}

module TrainNotifier.XCityBrum {

    export class WebApi {

        getStationStatus(station: Station) {
            return $.getJSON("api/station/" + station.crsCode + "/" + station.nextCrs);
        }

        getService(serviceId: string) {
            return $.getJSON("api/services/", { serviceId: serviceId });
        }

    }

}