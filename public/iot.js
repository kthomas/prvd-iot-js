(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiClientResponse = (function () {
    function ApiClientResponse(requestBody, requestHeaders, responseBody, responseHeaders, xhr) {
        this.requestBody = requestBody;
        this.responseBody = responseBody;
        this.responseHeaders = responseHeaders;
        this.xhr = xhr;
        var requestHeadersString = '';
        requestHeaders.forEach(function (value, header) {
            requestHeadersString += header + ": " + value + "\n";
        });
        if (requestHeadersString !== '')
            this.requestHeaders = requestHeadersString;
    }
    return ApiClientResponse;
}());
exports.ApiClientResponse = ApiClientResponse;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_client_response_1 = require("./api-client-response");
var ApiClient = (function () {
    function ApiClient(apiToken, scheme, host, path) {
        if (scheme === void 0) { scheme = ApiClient.DEFAULT_SCHEME; }
        if (host === void 0) { host = ApiClient.DEFAULT_HOST; }
        if (path === void 0) { path = ApiClient.DEFAULT_PATH; }
        this.baseUri = scheme + "://" + host + "/" + path + "/";
        this.requestHeaders = new Map();
        this.requestHeaders.set('Authorization', "bearer " + apiToken);
        this.requestHeaders.set('Content-Type', 'application/json');
    }
    ApiClient.toQuery = function (paramObject) {
        var paramList = [];
        for (var p in paramObject)
            if (paramObject.hasOwnProperty(p))
                paramList.push(encodeURIComponent(p) + "=" + encodeURIComponent(paramObject[p]));
        if (paramList.length > 0)
            return paramList.join("&");
        else
            return '';
    };
    ApiClient.prototype.get = function (uri, params) {
        return this.makeRequest('GET', uri, params);
    };
    ApiClient.prototype.post = function (uri, params) {
        return this.makeRequest('POST', uri, params);
    };
    ApiClient.prototype.put = function (uri, params) {
        return this.makeRequest('PUT', uri, params);
    };
    ApiClient.prototype.delete = function (uri) {
        return this.makeRequest('DELETE', uri);
    };
    ApiClient.prototype.makeRequest = function (method, uri, params) {
        var _this = this;
        if (params === void 0) { params = null; }
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, _this.baseUri + uri);
            _this.requestHeaders.forEach(function (value, header) {
                xhr.setRequestHeader(header, value);
            });
            var requestBody;
            if (params === null)
                requestBody = undefined;
            else if (method === "GET")
                requestBody = ApiClient.toQuery(params);
            else
                requestBody = JSON.stringify(params);
            xhr.onload = function () { return resolve(new api_client_response_1.ApiClientResponse(requestBody, _this.requestHeaders, xhr.response, xhr.getAllResponseHeaders(), xhr)); };
            xhr.onerror = function () { return reject(new api_client_response_1.ApiClientResponse(requestBody, _this.requestHeaders, xhr.response, xhr.getAllResponseHeaders(), xhr)); };
            if (requestBody === undefined)
                xhr.send();
            else
                xhr.send(requestBody);
        });
    };
    ApiClient.DEFAULT_SCHEME = 'https';
    ApiClient.DEFAULT_HOST = 'provide.services';
    ApiClient.DEFAULT_PATH = 'api/v1';
    return ApiClient;
}());
exports.ApiClient = ApiClient;

},{"./api-client-response":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_client_1 = require("./api-client");
var Goldmine = (function () {
    function Goldmine(apiToken, scheme, host, path) {
        if (!host)
            host = Goldmine.DEFAULT_HOST;
        this.client = new api_client_1.ApiClient(apiToken, scheme, host, path);
    }
    Goldmine.prototype.fetchBridges = function (params) {
        return this.client.get('bridges', (params || {}));
    };
    Goldmine.prototype.fetchBridgeDetails = function (bridgeId) {
        return this.client.get("bridges/" + bridgeId, {});
    };
    Goldmine.prototype.createBridge = function (params) {
        return this.client.post('bridges', params);
    };
    Goldmine.prototype.fetchConnectors = function (params) {
        return this.client.get('connectors', (params || {}));
    };
    Goldmine.prototype.fetchConnectorDetails = function (connectorId) {
        return this.client.get("connectors/" + connectorId, {});
    };
    Goldmine.prototype.createConnector = function (params) {
        return this.client.post('connectors', params);
    };
    Goldmine.prototype.deleteConnector = function (connectorId) {
        return this.client.delete("connectors/" + connectorId);
    };
    Goldmine.prototype.fetchContracts = function (params) {
        return this.client.get('contracts', (params || {}));
    };
    Goldmine.prototype.fetchContractDetails = function (contractId) {
        return this.client.get("contracts/" + contractId, {});
    };
    Goldmine.prototype.createContract = function (params) {
        return this.client.post('contracts', params);
    };
    Goldmine.prototype.executeContract = function (contractId, params) {
        return this.client.post("contracts/" + contractId + "/execute", params);
    };
    Goldmine.prototype.fetchNetworks = function (params) {
        return this.client.get('networks', (params || {}));
    };
    Goldmine.prototype.createNetwork = function (params) {
        return this.client.post('networks', params);
    };
    Goldmine.prototype.updateNetwork = function (networkId, params) {
        return this.client.put("networks/" + networkId, params);
    };
    Goldmine.prototype.fetchNetworkDetails = function (networkId) {
        return this.client.get("networks/" + networkId, {});
    };
    Goldmine.prototype.fetchNetworkAccounts = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/accounts", params);
    };
    Goldmine.prototype.fetchNetworkBlocks = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/blocks", params);
    };
    Goldmine.prototype.fetchNetworkBridges = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/bridges", params);
    };
    Goldmine.prototype.fetchNetworkConnectors = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/connectors", params);
    };
    Goldmine.prototype.fetchNetworkContracts = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/contracts", params);
    };
    Goldmine.prototype.fetchNetworkContractDetails = function (networkId, contractId) {
        return this.client.get("networks/" + networkId + "/contracts/" + contractId, {});
    };
    Goldmine.prototype.fetchNetworkOracles = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/oracles", params);
    };
    Goldmine.prototype.fetchNetworkTokens = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/tokens", params);
    };
    Goldmine.prototype.network_transactions = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/transactions", params);
    };
    Goldmine.prototype.fetchNetworkTransactionDetails = function (networkId, transactionId) {
        return this.client.get("networks/" + networkId + "/transactions/" + transactionId, {});
    };
    Goldmine.prototype.fetchNetworkStatus = function (networkId) {
        return this.client.get("networks/" + networkId + "/status", {});
    };
    Goldmine.prototype.fetchNetworkNodes = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/nodes", (params || {}));
    };
    Goldmine.prototype.createNetworkNode = function (networkId, params) {
        return this.client.post("networks/" + networkId + "/nodes", params);
    };
    Goldmine.prototype.fetchNetworkNodeDetails = function (networkId, nodeId) {
        return this.client.get("networks/" + networkId + "/nodes/" + nodeId, {});
    };
    Goldmine.prototype.fetchNetworkNodeLogs = function (networkId, nodeId) {
        return this.client.get("networks/" + networkId + "/nodes/" + nodeId + "/logs", {});
    };
    Goldmine.prototype.deleteNetworkNode = function (networkId, nodeId) {
        return this.client.delete("networks/" + networkId + "/nodes/" + nodeId);
    };
    Goldmine.prototype.fetchOracles = function (params) {
        return this.client.get('oracles', (params || {}));
    };
    Goldmine.prototype.fetchOracleDetails = function (oracleId) {
        return this.client.get("oracles/" + oracleId, {});
    };
    Goldmine.prototype.createOracle = function (params) {
        return this.client.post('oracles', params);
    };
    Goldmine.prototype.fetchTokens = function (params) {
        return this.client.get('tokens', (params || {}));
    };
    Goldmine.prototype.fetchTokenDetails = function (tokenId) {
        return this.client.get("tokens/" + tokenId, {});
    };
    Goldmine.prototype.createToken = function (params) {
        return this.client.post('tokens', params);
    };
    Goldmine.prototype.createTransaction = function (params) {
        return this.client.post('transactions', params);
    };
    Goldmine.prototype.fetchTransactions = function (params) {
        return this.client.get('transactions', (params || {}));
    };
    Goldmine.prototype.fetchTransactionDetails = function (transactionId) {
        return this.client.get("transactions/" + transactionId, {});
    };
    Goldmine.prototype.fetchWalletBalance = function (walletId, tokenId) {
        return this.client.get("wallets/" + walletId + "/balances/" + tokenId, {});
    };
    Goldmine.prototype.fetchWallets = function (params) {
        return this.client.get('wallets', (params || {}));
    };
    Goldmine.prototype.fetchWalletDetails = function (walletId) {
        return this.client.get("wallets/" + walletId, {});
    };
    Goldmine.prototype.createWallet = function (params) {
        return this.client.post('wallets', params);
    };
    Goldmine.DEFAULT_HOST = 'goldmine.provide.services';
    return Goldmine;
}());
exports.Goldmine = Goldmine;

},{"./api-client":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_client_1 = require("./api-client");
var Ident = (function () {
    function Ident(apiToken, scheme, host, path) {
        if (!host)
            host = Ident.DEFAULT_HOST;
        this.client = new api_client_1.ApiClient(apiToken, scheme, host, path);
    }
    Ident.prototype.createApplication = function (params) {
        return this.client.post('applications', params);
    };
    Ident.prototype.updateApplication = function (app_id, params) {
        return this.client.put("applications/" + app_id, params);
    };
    Ident.prototype.fetchApplications = function (params) {
        return this.client.get('applications', params);
    };
    Ident.prototype.fetchApplicationDetails = function (app_id) {
        return this.client.get("applications/" + app_id, {});
    };
    Ident.prototype.fetchApplicationTokens = function (app_id) {
        return this.client.get("applications/" + app_id + "/tokens", {});
    };
    Ident.prototype.authenticate = function (params) {
        return this.client.post('authenticate', params);
    };
    Ident.prototype.fetchTokens = function (params) {
        return this.client.get('tokens', params);
    };
    Ident.prototype.fetchTokenDetails = function (token_id) {
        return this.client.get("tokens/" + token_id, {});
    };
    Ident.prototype.deleteToken = function (token_id) {
        return this.client.delete("tokens/" + token_id);
    };
    Ident.prototype.createUser = function (params) {
        return this.client.post('users', params);
    };
    Ident.prototype.fetchUsers = function () {
        return this.client.get('users', {});
    };
    Ident.prototype.fetchUserDetails = function (user_id) {
        return this.client.get("users/" + user_id, {});
    };
    Ident.prototype.updateUser = function (user_id, params) {
        return this.client.put("users/" + user_id, params);
    };
    Ident.DEFAULT_HOST = 'ident.provide.services';
    return Ident;
}());
exports.Ident = Ident;

},{"./api-client":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_client_1 = require("./api-client");
exports.ApiClient = api_client_1.ApiClient;
var goldmine_1 = require("./goldmine");
exports.Goldmine = goldmine_1.Goldmine;
var ident_1 = require("./ident");
exports.Ident = ident_1.Ident;

},{"./api-client":2,"./goldmine":3,"./ident":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _provideJs = require("provide-js");

var main = function () {
  var bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7fSwiZXhwIjpudWxsLCJpYXQiOjE1NDI2MzM1NTUsImp0aSI6IjQxODc4MDZmLTg4ZDYtNDBhOS1hNjU0LWQ5MWVjMWJlMTQ2ZSIsInN1YiI6ImFwcGxpY2F0aW9uOjQ2MTUwYTcyLTUzYzAtNDJlNy1iMDFhLWQyNWRjOTM0ZTgyNiJ9.VJAfabyONEkiWy9J_8BeUm5E_MXBv0RctxevV9vq-HE';
  var contractId = '3dcbad0d-75ae-470c-a164-439c476b8702';
  var walletId = '47dba0c5-c2af-4fd4-a20c-21d8aca09b4f';
  var deviceId = 101;
  var methodParams = [deviceId];
  var executionParams = {
    method: 'getLatestDeviceData',
    params: methodParams,
    value: 0,
    wallet_id: walletId
  };
  var goldmine = new _provideJs.Goldmine(bearerToken);
  var points = [];
  var coordinates = [];
  var bounds = new google.maps.LatLngBounds();
  var polyline = new google.maps.Polyline();
  var openInfoWindow = null;
  var intervals = {};
  var initialHistorySize = 500;
  var lastCurrentLocation = null;
  var defaultMapOpts = {
    center: {
      lat: 33.753746,
      lng: -84.386330
    },
    zoom: 6
  };
  var map = new google.maps.Map(document.getElementById('map'), defaultMapOpts);

  var zoomToBestFit = function zoomToBestFit() {
    if (coordinates.length > 0) {
      for (var i = 0; i < coordinates.length - 1; i++) {
        bounds.extend(coordinates[i]);
      }
    }

    map.fitBounds(bounds);
  };

  var render = function render(pt, isCurrentLocation) {
    var coord = new google.maps.LatLng(pt.latitude, pt.longitude);
    coordinates.push(coord);
    var marker = new google.maps.Marker({
      position: coord,
      map: map,
      title: pt.deviceName,
      zIndex: points.length,
      icon: {
        url: 'https://s3.amazonaws.com/provide.services/img/presskit/provide-logo-hex-black-letters-white-bg.png',
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
      }
    });

    if (isCurrentLocation) {
      marker.title = 'Current Location';
      marker.icon.url = 'https://s3.amazonaws.com/provide.services/img/presskit/provide-logo-hex-dark-blue.png';

      if (lastCurrentLocation) {
        lastCurrentLocation.icon.url = 'https://s3.amazonaws.com/provide.services/img/presskit/provide-logo-hex-black-letters-white-bg.png';
      }

      lastCurrentLocation = marker;
    }

    var infowindow = new google.maps.InfoWindow();
    var content = 'temperature: ' + pt.temperature + String.fromCharCode("\\u2109") + '; humidity: ' + pt.humidity + ' (' + pt.timestamp + ')';
    var evts = ['click', 'mouseover'];

    for (var i = 0; i < evts.length - 1; i++) {
      var evt = evts[i];
      google.maps.event.addListener(marker, evt, function (_marker, _content, _infowindow) {
        return function () {
          if (openInfoWindow) {
            openInfoWindow.close();
            openInfoWindow = null;
          }

          _infowindow.setContent(_content);

          _infowindow.open(map, _marker);

          openInfoWindow = _infowindow;
        };
      }(marker, content, infowindow));
      google.maps.event.addListener(marker, 'mouseout', function (_marker, _content, _infowindow) {
        return function () {
          if (openInfoWindow) {
            openInfoWindow.close();
            openInfoWindow = null;
          }
        };
      }(marker, content, infowindow));
    }

    renderPolyline();
    zoomToBestFit();
  };

  var renderPolyline = function renderPolyline() {
    if (polyline == null) {
      polyline = new google.maps.Polyline({
        map: map,
        path: coordinates,
        geodesic: true,
        strokeColor: 'darkBlue',
        strokeOpacity: 1.0,
        strokeWeight: 5.0
      });
    } else {
      var path = polyline.getPath();
      path.push(coordinates[coordinates.length - 1]);
    }
  };

  var watchHistory = function watchHistory() {
    if (coordinates.length == initialHistorySize) {
      clearInterval(intervals.historyWatcher);
      delete intervals.historyWatcher;
      intervals.mainLoop = setInterval(mainLoop, 60000);
    }
  };

  var loadHistory = function loadHistory() {
    intervals.historyWatcher = setInterval(watchHistory, 200);
    goldmine.executeContract(contractId, {
      wallet_id: walletId,
      method: 'getHistorySize',
      params: [deviceId],
      value: 0
    }).then(function (response) {
      var i = JSON.parse(response.responseBody).response;
      var x = initialHistorySize;
      var start = initialHistorySize > i ? 0 : i - x;
      initialHistorySize = Math.min(i, initialHistorySize);
      console.log('Found ' + i + ' historical datapoints; fetching last ' + x);

      for (var y = start; y < i; y++) {
        goldmine.executeContract(contractId, {
          wallet_id: walletId,
          method: 'getDataAtIndex',
          params: [deviceId, y],
          value: 0
        }).then(function (response) {
          var resp = JSON.parse(response.responseBody).response;
          processPoint(resp);
        }).catch(function (err) {
          console.log('Error!');
          console.log(err);
        });
      }
    }).catch(function (err) {
      console.log('Error!');
      console.log(err);
    });
  };

  var processPoint = function processPoint(resp, isCurrentLocation) {
    var deviceName = resp[0];
    var timestamp = new Date(resp[1] * 1000); // UTC date - multiply by 1000 to include millis.

    var temp = resp[2] / 100;
    var humidity = resp[3] / 100;
    var lat = resp[4] / 100000;
    var lng = resp[5] / 100000;
    var accuracy = resp[6];
    var pt = {
      deviceName: deviceName,
      deviceId: deviceId,
      timestamp: timestamp,
      temperature: temp,
      humidity: humidity,
      latitude: lat,
      longitude: lng,
      accuracy: accuracy
    };
    points.push(pt);
    render(pt, isCurrentLocation);
  };

  var mainLoop = function mainLoop() {
    goldmine.executeContract(contractId, executionParams).then(function (response) {
      var resp = JSON.parse(response.responseBody).response;
      processPoint(resp, true);
    }).catch(function (err) {
      console.log('Error!');
      console.log(err);
    });
  };

  loadHistory();
}();

var _default = main;
exports.default = _default;

},{"provide-js":5}]},{},[6]);
