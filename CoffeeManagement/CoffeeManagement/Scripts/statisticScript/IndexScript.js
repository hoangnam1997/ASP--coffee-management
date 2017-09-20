//<!--get infomation and get chart-->
//change show or hide advanced of statistics
$("#lblAdvanceSearch").click(function() {
    $("#fAdvancedMenu").children().toggle();
    $("#lblAdvanceSearch").text() === "»" ? $("#lblAdvanceSearch").text("«") : $("#lblAdvanceSearch").text("»");
});
$(document).ready(function() {
    $("#fAdvancedMenu").children().toggle();
    $("input:radio[value=days]").prop('checked', true);
});
//get statistic
function getStatistic() {
    //hide loader
    var loaderDiv = document.getElementById('loaderStatistic');
    if (loaderDiv != null) {
        loaderDiv.setAttribute('style', 'display:none');
    }
    var start = $("#startDay").val();
    var end = $("#endDay").val();
    var startDay = start.split("-");
    var endDay = end.split("-");
    if (start === "" || end === "") {
        $("#messageValidate").html("Vui lòng chọn thời gian thống kê");
        return;
    }
    var dateStart = new Date(startDay[0], startDay[1] - 1, startDay[2]);
    var dateEnd = new Date(endDay[0], endDay[1] - 1, endDay[2]);
    if (dateStart.getTime() > dateEnd.getTime()) {
        $("#messageValidate").html("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc");
        return;
    }
    //load loader
    if (loaderDiv != null) {
        loaderDiv.setAttribute('style', 'display:inline-block');
    }
    $("#messageValidate").html("");
    //get radio checked
    var valueChecked = $('input[name=radioAdvanced]:checked', '#fAdvancedMenu').val();
    $.ajax({
        type: "GET",
        data: { startDay: start, endDay: end, statisticStyle: valueChecked },
        contentType: "application/json; Charset:utf-8",
        cache: false,
        url: "/Statistics/StatisticSalse",
        success: function(re) {
            //hide loader
            if (loaderDiv != null) {
                loaderDiv.setAttribute('style', 'display:none');
            }
            $("#chartStatistic").html(re);
        }
    });
}