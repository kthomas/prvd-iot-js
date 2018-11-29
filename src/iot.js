import { Goldmine } from 'provide-js';

const main = (() => {
    const bearerToken = '';
    const contractId = '';
    const walletId = '';
    const deviceId = 101;
    const methodParams = [deviceId];
    const executionParams = {
        method: 'getLatestDeviceData',
        params: methodParams,
        value: 0,
        wallet_id: walletId,
    }

    const goldmine = new Goldmine(bearerToken);

    var points = [];
    var coordinates = [];
    var bounds = new google.maps.LatLngBounds()
    var polyline = new google.maps.Polyline()
    var openInfoWindow = null
    var intervals = {}
    var initialHistorySize = 500
    var lastCurrentLocation = null

    const defaultMapOpts = {
        center: {lat: 33.753746, lng: -84.386330},
        zoom: 6
    }

    const map = new google.maps.Map(document.getElementById('map'), defaultMapOpts)

    const zoomToBestFit = () => {
        if (coordinates.length > 0) {
            for (var i = 0; i < coordinates.length - 1; i++) {
                bounds.extend(coordinates[i])
            }
        }
        map.fitBounds(bounds)
    }

    const render = (pt, isCurrentLocation) => {
        const coord = new google.maps.LatLng(pt.latitude, pt.longitude)
        coordinates.push(coord)

        const marker = new google.maps.Marker({
            position: coord,
            map: map,
            title: pt.deviceName,
            zIndex: points.length,
            icon: {
                url: 'https://s3.amazonaws.com/provide.services/img/presskit/provide-logo-hex-black-letters-white-bg.png',
                scaledSize: new google.maps.Size(30, 30),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0, 0)
            }
        })

        if (isCurrentLocation) {
            marker.title = 'Current Location'
            marker.icon.url = 'https://s3.amazonaws.com/provide.services/img/presskit/provide-logo-hex-dark-blue.png'

            if (lastCurrentLocation) {
                lastCurrentLocation.icon.url = 'https://s3.amazonaws.com/provide.services/img/presskit/provide-logo-hex-black-letters-white-bg.png'
            }

            lastCurrentLocation = marker
        }

        const infowindow = new google.maps.InfoWindow()
        const content = 'temperature: ' + pt.temperature + String.fromCharCode('\\u2109') + '; humidity: ' + pt.humidity + ' (' + pt.timestamp + ')'

        const evts = ['click', 'mouseover']
        for (var i = 0; i < evts.length - 1; i++) {
          const evt = evts[i]
          google.maps.event.addListener(marker, evt,
              (function(_marker, _content, _infowindow) {
                  return () => {
                      if (openInfoWindow) {
                          openInfoWindow.close()
                          openInfoWindow = null
                      }
                      _infowindow.setContent(_content);
                      _infowindow.open(map, _marker)
                      openInfoWindow = _infowindow
                  }
              })(marker, content, infowindow)
          )

          google.maps.event.addListener(marker, 'mouseout',
            (function(_marker, _content, _infowindow) {
                return () => {
                    if (openInfoWindow) {
                        openInfoWindow.close()
                        openInfoWindow = null
                    }
                }
            })(marker, content, infowindow)
          )
        }

        renderPolyline()
        zoomToBestFit()
    }

    const renderPolyline = () => {
        if (polyline == null) {
            polyline = new google.maps.Polyline({
                map: map,
                path: coordinates,
                geodesic: true,
                strokeColor: 'darkBlue',
                strokeOpacity: 1.0,
                strokeWeight: 5.0
            })
        } else {
            const path = polyline.getPath();
            path.push(coordinates[coordinates.length - 1])
        }
    }

    const watchHistory = () => {
        if (coordinates.length == initialHistorySize) {
            clearInterval(intervals.historyWatcher)
            delete intervals.historyWatcher

            intervals.mainLoop = setInterval(mainLoop, 60000)
        }
    }

    const loadHistory = () => {
        intervals.historyWatcher = setInterval(watchHistory, 200)

        goldmine.executeContract(contractId, {
            wallet_id: walletId,
            method: 'getHistorySize',
            params: [deviceId],
            value: 0
        }).then((response) => {
            const i = JSON.parse(response.responseBody).response
            const x = initialHistorySize
            const start = initialHistorySize > i ? 0 : i - x
            initialHistorySize = Math.min(i, initialHistorySize)
            console.log('Found ' + i + ' historical datapoints; fetching last ' + x)
            for (var y = start; y < i; y++) {
                goldmine.executeContract(contractId, {
                    wallet_id: walletId,
                    method: 'getDataAtIndex',
                    params: [deviceId, y],
                    value: 0
                }).then((response) => {
                    const resp = JSON.parse(response.responseBody).response
                    processPoint(resp)
                }).catch((err) => {
                    console.log('Error!')
                    console.log(err)
                })
            }
        }).catch((err) => {
            console.log('Error!')
            console.log(err)
        })
    }

    const processPoint = (resp, isCurrentLocation) => {
        var deviceName = resp[0];
        var timestamp = new Date(resp[1] * 1000); // UTC date - multiply by 1000 to include millis.
        var temp = resp[2] / 100;
        var humidity = resp[3] / 100;
        var lat = resp[4] / 100000;
        var lng = resp[5] / 100000;
        var accuracy = resp[6];

        let pt = {
                   deviceName: deviceName,
                   deviceId: deviceId,
                   timestamp: timestamp,
                   temperature: temp,
                   humidity: humidity,
                   latitude: lat,
                   longitude: lng,
                   accuracy: accuracy
        };

        points.push(pt)
        render(pt, isCurrentLocation)
    }

    const mainLoop = () => {
        goldmine.executeContract(contractId, executionParams).then((response) => {
            const resp = JSON.parse(response.responseBody).response
            processPoint(resp, true)
        }).catch((err) => {
          console.log('Error!');
          console.log(err);
        })
    }

    loadHistory()
})()

export default main
