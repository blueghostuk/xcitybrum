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
                return $.ajax(Settings.apiBaseUrl + "darwin/service/request", {
                    type: "POST",
                    contentType: "application/json",
                    data: {
                        ServiceId: serviceId
                    }
                });
            };
            return WebApi;
        })();
        XCityBrum.WebApi = WebApi;
    })(TrainNotifier.XCityBrum || (TrainNotifier.XCityBrum = {}));
    var XCityBrum = TrainNotifier.XCityBrum;
})(TrainNotifier || (TrainNotifier = {}));
