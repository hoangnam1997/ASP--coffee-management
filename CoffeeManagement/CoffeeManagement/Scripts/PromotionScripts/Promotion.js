

var id = 0; //0--Update Promotion   1--Add Promotion  2--Clone(tạo 1 bản sao Khuyến mãi mới với thông tin như khuyến mãi cũ)
var currentRow; // biến chứa dòng hiện tại trên table promotion được gán khi click button Edit thực hiện chức năng sửa thông tin Khuyến mãi
var newProID; // biến chứa ID của Promotion vừa được thêm


// Hàm định dạng lại 1 chuỗi day-month-year thành year-month-day
dateInPut = function (dateSTR) {
    var day = dateSTR.substr(0, 2);
    var month = dateSTR.substr(3, 2);
    var year = dateSTR.substr(6, 4);
    var date = year + "-" + month + "-" + day;
    return date;
}

// Hàm định dạng lại dateObject thành chuỗi day-month-year
dateOutPut = function (dateObject) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth() + 1;
    var day = dateObject.getDate();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    var date = day + "-" + month + "-" + year;
    return date;
}

// Hàm định dạng 1 dateObject thành chuỗi Year-Month-Day
function dateFormat(dateObject) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth() + 1;
    var day = dateObject.getDate();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    var date = year + "-" + month + "-" + day;
    return date;
}

// Validate on Modal, set Min for date
function setStartDate() {
    var temp = new Date();
    var date = dateFormat(temp);
    $("#dtStartDate").attr("min", date);

}

// Hàm load thông tin Khuyến mãi khi thực hiện chức năng Edit hoặc Clone Promotion
function loadInFo(editButton) {

    currentRow = editButton.parentNode.parentNode;
    // Câu lệnh điều kiện dưới kiểm tra, nếu hành vi vừa thực hiện trên button Edit, hoặc Clone thì thực hiện reset lại thông tin modal tương ứng
    if ((currentRow.cells[7].title).localeCompare("currentPro") == 0)   // currentPro - gán lúc addRow trong phân trang, chỉ ra khuyển mãi đang áp dụng
    {
        id = 0;
        $("#btnAddUpdate").html("Update");
        $("h4.modal-title").html("Edit Promotion Info");
    } else {
        id = 1;
        $("#btnAddUpdate").html("Clone");
        $("h4.modal-title").html("Edit Promotion Info");
    }



    //document.getElementById("txtName").value=currentRow.cells[1].innerHTML; viết bằng javascript thông thường
    $("#txtName").val(currentRow.cells[1].innerHTML); // viết bằng cú pháp Jquery
    document.getElementById("nDiscount").value = currentRow.cells[2].innerText;
    document.getElementById("nBasePurchase").value = currentRow.cells[3].innerText;
    var str = currentRow.cells[4].innerText; // lấy date ra dưới dạng text.
    var date = dateInPut(str);
    document.getElementById("dtStartDate").value = date;
    str = currentRow.cells[5].innerText;
    date = dateInPut(str);
    document.getElementById("dtEndDate").value = date;
    $("#txtDescription").val(currentRow.cells[6].innerText);

}

// Reset Content Modal when call AddPromotion()
function reSetAllText() {
    $("h4.modal-title").html("Add Promotion Info");
    $("#btnAddUpdate").html("Add");
    $("#txtName").val("");
    $("#nDiscount").val("");
    $("#nBasePurchase").val("");
    $("#txtDescription").val("");
    $("#dtStartDate").val("");
    $("#dtEndDate").val("");
    setStartDate(); // set StartDate(Min=today)
    id = 1;
}

// Hàm thực thi chức năng cập nhật khuyến mãi
function updatePromotion(endate) {

    var date = document.getElementById("dtStartDate").valueAsDate;
    var stdate = dateOutPut(date);
    var Index = paging.list.findIndex(i => i.ID == currentRow.cells[0].title);

    paging.list[Index].Name = $("#txtName").val();
    paging.list[Index].Discount = $("#nDiscount").val();
    paging.list[Index].BasePurchase = $("#nBasePurchase").val();
    paging.list[Index].StartDate = stdate;
    paging.list[Index].EndDate = endate;
    paging.list[Index].Description = $("#txtDescription").val();

    paging.updateData(Index); // Gọi hàm update promotion theo index
}

// Hàm thực thi chức năng thêm khuyến mãi
function insertPromotion(endate) {

    var date = document.getElementById("dtStartDate").valueAsDate;
    var stdate = dateOutPut(date);
    var CellNo = lst.length + 1; // No của NewPromotion sẽ là độ dài hiện tại của list +1
    var CellID = newProID; // ID của NewPromotion sẽ đc trả về từ AddNewPromotion Controller
    var CellName = $("#txtName").val();
    var CellDiscount = $("#nDiscount").val();
    var CellBasePurchase = $("#nBasePurchase").val();
    var CellStartDate = stdate;
    var CellEndDate = endate;
    var CellDescription = $("#txtDescription").val();
    if (lst[0] != undefined) {
        if (lst[0].EndDate.localeCompare("Đến nay") == 0) // Set lại view tablePromotion, giá trị EndDate của KM cũ là StartDate của KM mới
            lst[0].EndDate = CellStartDate;
    }


    // thêm dòng mới vào List, thêm vào đầu List
    lst.unshift({
        "No": CellNo,
        "ID": CellID,
        "Name": CellName,
        "Discount": CellDiscount,
        "BasePurchase": CellBasePurchase,
        "StartDate": CellStartDate,
        "EndDate": CellEndDate,
        "Description": CellDescription,

    });
    createPagination(); // gọi lại phân trang
}

// Hàm thực thi chức năng Thêm hoặc cập nhật khuyến mãi
function executeUpdateOrInsert(endate) {

    if (id == 1) {
        insertPromotion(endate);
        id = 0;
    } else {
        updatePromotion(endate);
    }
    $("#myModal").modal("hide");
    $(".modal-backdrop").remove();

}

// Hàm thực thi chức năng tìm kiếm trên tablePromotion view
function searchFunct() {

    searchPagination();

    var jobCount = $('#tblListPromotion tbody tr').length;
    if (jobCount == '0') {
        $('.no-result').show();
    } else {
        $('.no-result').hide();
    }
}

//Thực thi tìm kiếm khi nhấn Enter sau khi nhập, không cần nhấn nút Search
function searchEnter(e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
        searchFunct();
    }
}

// Validate Set Ngày Kết Thúc của Khuyến Mãi phải bằng hoặc sau ngày Bắt Đầu trên Modal
function setEndDate() {
    var day = $("#dtStartDate").val();
    $("#dtEndDate").attr("min", day);
}


// Hàm thực thi chức năng xóa Khuyến Mãi
function deletePromotion(selectedRow) {
    var confirmation = confirm("Do you want to delete this promotion?");
    var row = selectedRow.parentNode.parentNode;
    if (confirmation == true) {

        var URL = "/Promotion/DeletePromotion";

        $.ajax(
            {
                type: "POST",
                url: URL,
                data: { ID: row.cells[0].title },
                dataType: "text",
                success: function (data) {
                    var s = "Success";
                    if (s.localeCompare(data) == 0) {
                        paging.removeData(row.cells[0].title);
                    }
                },
                error: function () {
                    alert("Delete Promotion Fail");
                }
            });

    }
}


// Thực thi khi các tag, element của trang đã được load
$(document).ready(function () {

    lst.reverse(); // đảo ngược list để in ra hợp với yêu cầu
    createPagination(); // Gọi hàm phân trang

    $("#fmInfoPromotion").bootstrapValidator({
        feedbackIcons:
        {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:
        {
            // Validate dựa trên name của control được khai báo bên giao diện.
            txtName:
            {
                validators: {

                    notEmpty: {
                        message: 'Please supply your promotion name'
                    }
                }
            },
            nDiscount:
            {
                validators: {

                    notEmpty: {
                        message: 'Please supply your discount'
                    }
                }
            },
            nBasePurchase:
            {
                validators: {

                    notEmpty: {
                        message: 'Please supply your base purchase'
                    }
                }
            },
            dtStartDate:
            {
                validators: {

                    notEmpty: {
                        message: 'Please supply your start date'
                    }
                }
            },
            //dtEndDate:
            //{
            //    validators: {

            //        notEmpty: {
            //            message: 'Please supply your end date'
            //        }
            //    }
            //}

        }
    }).on("success.form.bv", function () {
        // Declare Var_Temp
        var Data;
        var dataEndDate;
        var endate; // biến chứa endDate truyền ngược lại tableview

        if ($("#dtEndDate").val().localeCompare("") == 0) { //Nếu dtEndDate chưa nhập thì không gửi giá trị vào biến EndDate lên Server
            endate = "Đến nay";
            Data = { Name: $("#txtName").val(), ShopID: currentShopID, Discount: $("#nDiscount").val(), BasePurchase: $("#nBasePurchase").val(), StartDate: $("#dtStartDate").val(), Description: $("#txtDescription").val() };
        } else {           
            dataEndDate = document.getElementById("dtEndDate").valueAsDate; endate = dateOutPut(dataEndDate); dataEndDate = dataEndDate.toDateString();
            Data = { Name: $("#txtName").val(), ShopID: currentShopID, Discount: $("#nDiscount").val(), BasePurchase: $("#nBasePurchase").val(), StartDate: $("#dtStartDate").val(), EndDate: dataEndDate, Description: $("#txtDescription").val() };
        }


        if (id == 1) {
            var URL = "/Promotion/AddPromotion";

            $.ajax(
                {
                    type: "POST",
                    url: URL,
                    data: Data,
                    dataType: "text",
                    success: function (data) {

                        if (parseInt(data) > -1) {
                            newProID = data;
                            executeUpdateOrInsert(endate);
                            
                        }
                    },
                    error: function () {
                        alert("Add Promotion Fail");
                    }
                });
        }
        else {
            var URL = "/Promotion/UpdatePromotion";

            $.ajax(
                {
                    type: "POST",
                    url: URL,
                    data: { ID: currentRow.cells[0].title, Name: $("#txtName").val(), ShopID: currentShopID, Discount: $("#nDiscount").val(), BasePurchase: $("#nBasePurchase").val(), StartDate: $("#dtStartDate").val(), EndDate: dataEndDate, Description: $("#txtDescription").val() },
                    dataType: "text",
                    success: function (data) {
                        var s = "Success";
                        if (s.localeCompare(data) == 0) {
                            executeUpdateOrInsert(endate);
                        }
                    },
                    error: function () {
                        alert("Update Promotion Fail");
                    }
                });
        }

        e.preventDefault(); // Dừng việc gửi yêu cầu lên server --> tránh load lại trang
    });

   

    $("#myModal").on("shown.bs.modal", function () {
        $('#fmInfoPromotion').data('bootstrapValidator').resetForm();
        $("#txtName").focus();
    });

   

});

