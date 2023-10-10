window.addEventListener('DOMContentLoaded', event => {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    var name = prompt("당신의 이름은 무엇인가요?");
    position = { }

    noticeBtn = document.getElementById('btn');
    noticeBtn.addEventListener('click', enableAlarm);

    function enableAlarm(event) {
        function alarm() {
            
            // audio alarm
            var audio = new Audio('/static/assets/sounds/audio.mp3');
            audio.play();

            // visible alarm
            event.target.classList.add('red', 'blink');

            // vibrate alarm
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
            data: JSON.stringify([name, position]),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                if (data.isInbound == "inbound") {
                    alarm()
                }
            },
            error: function(request, status, error){
                alert('ajax 통신 실패', error);
            }
        })
    }

    navigator.geolocation.watchPosition(function(p) {
        noticeBtn.textContent = `${p.coords.latitude}, ${p.coords.longitude}`

        position.latitude = p.coords.latitude;
        position.longitude = p.coords.longitude;
    });
});
