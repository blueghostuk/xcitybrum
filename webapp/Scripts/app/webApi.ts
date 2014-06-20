interface GetArrivalDepartureBoardResult {
    platformAvailableField: boolean;
    trainServicesField: TrainService[];
}

interface TrainService {
    originField: TrainLocation;
    destinationField: TrainLocation;
    currentOriginsField: TrainLocation;
    currentDestinationsField: TrainLocation;
    staField: string;
    etaField: string;
    stdField: string;
    etdField: string;
    platformField: number;
    serviceIDField: string;
}

interface TrainLocation {
    locationNameField: string;
    crsField: string;
    viaField: string;
}

interface GetServiceDetailsResult {
    isCancelledField: boolean;
    platformField: number;
    staField: string;
    etaField: string;
    ataField: string;
    stdField: string;
    etdField: string;
    atdField: string;
    previousCallingPointsField: { callingPointField: CallingPoint[] };
    subsequentCallingPointsField: { callingPointField: CallingPoint[] };
}

interface CallingPoint {
    locationNameField: string;
    crsField: string;
    stField: string;
    etField: string;
    atField: string;
}