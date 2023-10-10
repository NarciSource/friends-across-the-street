window.addEventListener('DOMContentLoaded', event => {
    const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스

    let options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(37.56597160000006, 126.97508960000013), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
    };
    let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴



    overlays = { }
    function displayMarker(position, name) {
        var content = '<div><img class="pulse" draggable="false" unselectable="on" src="https://ssl.pstatic.net/static/maps/m/pin_rd.png" alt=""></div>';

        if (overlays[name]) {
            overlays[name].setPosition(position)
        }
        else {
            var overlay = new kakao.maps.CustomOverlay({
                position,
                content,
                map,
            });
            overlays[name] = overlay;
            overlay.setMap(map);
        }
    }


    function displayCircle(latLng) {
        // 지도에 표시할 원을 생성합니다
        var circle = new kakao.maps.Circle({
            center : latLng,  // 원의 중심좌표 입니다 
            radius: 50, // 미터 단위의 원의 반지름입니다 
            strokeWeight: 5, // 선의 두께입니다 
            strokeColor: '#75B8FA', // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'dashed', // 선의 스타일 입니다
            fillColor: '#CFE7FF', // 채우기 색깔입니다
            fillOpacity: 0.7  // 채우기 불투명도 입니다   
        }); 
    
        // 지도에 원을 표시합니다 
        circle.setMap(map); 
    }


    var firstAccess = true;
    setInterval(() => {
        console.log("connect... Where are the people?");

        $.ajax({
            type: 'GET',
            url: '/wherePeople',
            dataType : 'JSON',
            success: function(data) {
                userPositions = data.userPositions;
                console.log("userPositions", userPositions)

                userPositions = Object.entries(userPositions).map(([ip, [name, lat, lon]])=> [name||ip, new kakao.maps.LatLng(lat, lon)]);

                var bounds = new kakao.maps.LatLngBounds();

                $('#users').children('ul').empty();
                $('#users').children('ul').append(
                    $('<li>', {
                        html: '<b><u>전체 사용자</u></b>',
                        click: ()=> map.setBounds(bounds),
                    })
                )

                for (let [name, position] of userPositions) {                    
                    $('#users').children('ul').append(
                        $('<li>', {
                            html: `<b><u>${name}</u> :</b>&nbsp;&nbsp;${position.Ma}, ${position.La}`,
                            click: ()=> map.panTo(position),
                        }))

                    displayMarker(position, name);
                    bounds.extend(position)
                }

                if (firstAccess) {
                    firstAccess = false;
                    map.setBounds(bounds);
                }
            },
            error: function(request, status, error){
                alert('ajax 통신 실패', error);
            }
        });

        $.ajax({
            type: 'GET',
            url: '/whereCrosswalk',
            dataType : 'JSON',
            success: function(data) {
                crosswalks = data.crosswalks;

                console.log("crosswalks", crosswalks);

                for (var [lat,lon] of crosswalks) {
                    displayCircle(new kakao.maps.LatLng(lat, lon))
                }
            }
        })

    }, 5000);
});
