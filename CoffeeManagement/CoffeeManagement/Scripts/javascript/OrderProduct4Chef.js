
var NumberOfItem = 20;
//function checkisComplete() {
//    var s = $(".tditem").find(".dropbtn");
//    var count = 0;
//    $(s).each(function () {
//        if ($(this).text === "Hoàn Thành")
//            count = count + 1;
//        alert(count);
//    });
//    if (count === $(s).count()) {
//        if (confirm("Đã hoàn thành bạn muốn xóa")) {
//            $(s).hide();
//        }
//        alert(count);
//    }
//}

//var e = $(".item");
//e.each(function () {
//    var a = e.find(".dropbtn");
//    a.each(function () {
//        // sort a byy status
//    });
//});

var valueofItem = 0;
//script for show menudropbox
function ShowStatus(element, b) {
    var e = $(element).parent().find('.' + 'dropcontent' + '');
    $(e).addClass('show');
    valueofItem = b;
}
//event show dropdown menu
function showof(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropcontent");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
    //hide when leave
    $(".item").mouseleave(function () {
        var dropdowns = document.getElementsByClassName("dropcontent");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    });
}
window.onclick = function (event) { showof(event); }
var count = 0;
//  function to change color for item 
function changeColorByStatus(e, user, span) {
    if ($(e).text().trim() === "Đang Làm") {
        $(user).css({
            "background": "#3b3a36",
            "color": "#fff",
            "transition": "1s"
        });
        $(span).css({
            "color": "#c0dfd9"
        });
    }
    if ($(e).text().trim() === "Chưa Làm") {
        $(user).css({
            "background": "#7d4627",
            "color": "#c9d8c5",
            "transition": "1s"
        });
        $(span).css({
            "color": "#edd9c0"
        });
    }

    if ($(e).text().trim() === "Đã Làm") {
        $(user).css({
            "background": "#e9ece5",
            "color": "#173e43",
            "transition": "1s"
        });
        $(span).css({
            "color": "#3b3a36"
        });
    }
}

function changeColor(e, s) {
    if (e === "Đang Làm") {
        $(s).removeClass().addClass("dropcontent dropcontenColor1 show");
    }
    else if (e === "Chưa Làm") {
        $(s).removeClass().addClass("dropcontent dropcontenColor2 show");
    }
    else if (e === "Đã Làm") {
        $(s).removeClass().addClass("dropcontent dropcontenColor3 show");
    }
}

function swapStatus(a) {
    var e = $(a).parent().parent().find('.istatus');
    var s = $(e).parent().next("ul");
    changeColor($(a).text().trim(), s);
    var temp = $(e).text();
    $(e).text($(a).text());
    $(a).text(temp);
    var user = $(a).closest(".user-panel");
    var span = $(a).parent().prev();
    changeColorByStatus(e, user, span);
    $.ajax({
        type: "get",
        url: "/Order/ChangeStatusOrderProduct",
        contentType: "application/json; Charset:utf-8",
        data: { id: valueofItem, status: $(e).text().trim() },
        success: function () {
            console.log("changeStatus");
            ChangeColorSigle(e);
        }
    });
}

//event click script for change status of dropbox menu
$(".dropcontent li").on("click", function () {
    swapStatus(this);
    console.log("changstatus");
});

function onchangeItem(item) {
    var es = $(item).closest(".tditem");
    var flag = true;
    var lstitem = $(".col").last().find("span.idorder").text().trim();
    $(es).find(".item").each(function () {
        var e = $(this).find(".istatus");
        if (e.text().trim() === "Đang Làm" || e.text().trim() === "Chưa Làm") {
            flag = false;
            return false;
        }
// ReSharper disable once NotAllPathsReturnValue
    });
    if (flag === true) {
        var fff = 0;
        var ffff = $(item).closest(".col").find(".item").length;
        if ($(item).closest(".col").hide(1000)) {
            $(".col").each(function () {
                if ($(this).css("display") !== "none") {
                    var ittem = $(this).find(".item").length;
                    fff = fff + ittem;
                }
            });
        }
        fff = fff - ffff;
        NumberOfItem = $("#SELECT_1").val().trim();
        count = NumberOfItem - fff;
        count = Math.abs(count);
        if (fff <= NumberOfItem) {
            $.ajax({
                type: "GET",
                url: "/Order/PartialUpdateTable",
                contentType: "application/json; Charset:utf-8",
                data: { count: count, id: lstitem, index: 1 },
                success: function (result) {
                    $("#tbodyitem").append(result);
                    autochangeColor();
                }
            });
        }
    }
}

$(".itemli").on("click", function () {
    onchangeItem(this);
});



function autochangeColor() {
    var lst = $(".istatus");
    lst.each(function () {
        var e = $(this).text().trim();
        var s = $(this).parent().next(".dropcontent");
        var user = $(this).closest(".user-panel");
        var span = $(this).parent();
        changeColorByStatus(this, user, span);
        if (e === "Đang Làm") {
            $(s).addClass("dropcontenColor1");
        }
        else if (e === "Chưa Làm") {
            $(s).addClass("dropcontenColor2");
        }
    });
}

$(document).ready(function () {
    autochangeColor();
});

$("#SELECT_1").on("change", function () {
    var s = $(this).val().trim();
    var item = $(".col").first().find(".idorder").text();
    console.log(item);
    $.ajax({
        type: "GET",
        url: "/Order/PartialUpdateTable",
        contentType: "application/json; Charset:utf-8",
        data: { count: s, id: item, index: 0 },
        success: function (result) {
            $("#tbodyitem").empty();
            $("#tbodyitem").append(result);
            autochangeColor();
        }
    });
});

function ChangeColorSigle(item) {
    console.log($(item).text());
    var s = $(item).closest(".dropbtn.spanstatus").find(".text-success");
    if ($(item).text().trim() === "Đang Làm") {
        $(s).removeClass().addClass("fa fa-refresh fa-spin text-success");
        //$(s).removeClass().addClass("fa fa-free-code-camp text-success");

    }
    else if ($(item).text().trim() === "Chưa Làm") {
        $(s).removeClass().addClass("fa fa-empire text-success flashit");
    }
    else if ($(item).text().trim() === "Đã Làm") {
        $(s).removeClass().addClass("fa fa-circle text-success");
    }
}

function autochangeIconStatus() {
    $(".istatus").each(function () {
        ChangeColorSigle(this);
    });
}

autochangeIconStatus();
