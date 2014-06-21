
function loadTrain() {
    var serviceId = document.location.hash.substr(2);

    webApi.getService(serviceId)
        .done(function (result: GetServiceDetailsResult) {
            var service = new TrainNotifier.XCityBrum.TrainDetailsResult(result);            

            ko.cleanNode($("#app-train-title")[0]);
            ko.cleanNode($("#app-train-card")[0]);
            ko.applyBindings(service, $("#app-train-title")[0]);
            ko.applyBindings(service, $("#app-train-card")[0]);
        });
} 