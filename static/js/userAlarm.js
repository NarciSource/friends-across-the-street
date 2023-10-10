window.addEventListener('DOMContentLoaded', event => {    

    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    postdata = { }

    noticeBtn = document.getElementById('btn');
    noticeBtn.addEventListener('click', enableAlarm);

    function enableAlarm(event) {
        function alarm() {
            
            var audio = new Audio('/static/assets/sounds/audio.mp3');
            audio.play();


            event.target.classList.add('red', 'blink');


            if (navigator.vibrate) {
                navigator.vibrate([500,500,500,500,500,500,500]);
            }
            else {
                alert("진동을 지원하지 않는 기종 입니다.");
            }
        }

        $.ajax({
            type: 'POST',
            url: '/postGPS',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                //alert('통신 성공:'+data.result2)
                if (data.result2 == "inbound") {
                    alarm()
                }
            },
            error: function(request, status, error){
                alert('ajax 통신 실패', error);
            }
        })
    }

    console.log(navigator.geolocation)
    navigator.geolocation.watchPosition(function(position) {
        console.log(1)
        noticeBtn.textContent = "X: " + position.coords.latitude + ' Y: ' + position.coords.longitude;
        console.log(position.coords.latitude)
        postdata.latitude = position.coords.latitude;
        postdata.longitude = position.coords.longitude;
        console.log(111,postdata)
    });
});
