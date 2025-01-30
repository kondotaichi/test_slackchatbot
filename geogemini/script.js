let map;
let userMarker;
let targetMarker;
const targetLocation = { lat: 35.6895, lng: 139.6917 };  // 東京の位置

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.0, lng: 137.0 },  // 日本中心の初期位置
        zoom: 5,
    });

    // ターゲット位置のピン（東京）
    targetMarker = new google.maps.Marker({
        position: targetLocation,
        map: map,
        title: "東京",
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }
    });

    // 検索機能の設定
    const input = document.getElementById("locationInput");
    const searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        map.setCenter(place.geometry.location);
        addUserMarker(place.geometry.location);
        calculateDistance(place.geometry.location);
    });

    document.getElementById("searchButton").addEventListener("click", () => {
        const location = input.value;
        searchLocation(location);
    });
}

// ユーザーの位置にピンを立てる
function addUserMarker(location) {
    if (userMarker) {
        userMarker.setMap(null);
    }
    userMarker = new google.maps.Marker({
        position: location,
        map: map,
        title: "検索位置"
    });
}

// ターゲット地点までの距離を計算
function calculateDistance(selectedLocation) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(selectedLocation.lat(), selectedLocation.lng()),
        new google.maps.LatLng(targetLocation.lat, targetLocation.lng)
    );

    document.getElementById("distanceInfo").textContent = `距離: ${(distance / 1000).toFixed(2)} km`;
}

// 住所検索用の関数
function searchLocation(location) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK") {
            const location = results[0].geometry.location;
            map.setCenter(location);
            addUserMarker(location);
            calculateDistance(location);
        } else {
            alert("場所が見つかりませんでした: " + status);
        }
    });
}

// ページ読み込み時に地図を初期化
window.initMap = initMap;
