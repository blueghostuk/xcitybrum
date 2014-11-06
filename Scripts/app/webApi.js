var TrainNotifier;
(function (TrainNotifier) {
    (function (XCityBrum) {
        var WebApi = (function () {
            function WebApi() {
            }
            WebApi.prototype.getStationStatus = function (station) {
                return $.getJSON(Settings.apiBaseUrl + "darwin/station/" + station.crsCode + "/" + station.nextCrs);
            };

            WebApi.prototype.getService = function (serviceId) {
                return $.getJSON(Settings.apiBaseUrl + "darwin/services/", { serviceId: serviceId });
            };
            return WebApi;
        })();
        XCityBrum.WebApi = WebApi;
    })(TrainNotifier.XCityBrum || (TrainNotifier.XCityBrum = {}));
    var XCityBrum = TrainNotifier.XCityBrum;
})(TrainNotifier || (TrainNotifier = {}));
//# sourceMappingURL=webApi.js.map
