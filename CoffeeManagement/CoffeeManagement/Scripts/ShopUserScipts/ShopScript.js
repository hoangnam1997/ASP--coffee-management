var currentRow;

function SetCurrentRow(row)
{
    currentRow = row.parentNode.parentNode;
}

function DeleteRow()
{
    var URL = "/ShopUser/DeleteUser";
    $.ajax(
        {
            type: "POST",
            url: URL,
            dataType: "text",
            data: { ID: currentRow.cells[0].title },
            success: function (data) {
                var s = "Success" ;
                if (s.localeCompare(data) == 0)
                {
                    $("#modal_remove").toggle("modal");
                    $(".modal-backdrop").remove(); 
                    $(currentRow).remove();
                }
            },
            error: function () {
                alert("fail nè");
            }
        });
}

$(document).ready(function () {
    //ajax khi chọn City
    $("#City").change(function () {
        
        if ($("#City").val() != "") {
            var Url = "/ShopUser/GetDistrict";
            $.ajax(
                {
                    
                    type: "GET",
                    url: Url,
                    async: false, // dừng việc bất đồng bộ, --> chạy lần lượt từng luồng
                    data: {
                        ID: $("#City").val()
                    },
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        var s = "";
                        s += "<option value=''>Please select District</option>";
                        for (var i = 0; i < data.length; i++) {
                            s += "<option value='" + data[i].ID + "'>" + data[i].Name + "</option>";
                        }
                        $("#District").html(s);
                    },
                });
        } else {
            //$("#divDistrict").fadeOut(200);
        }
    });
    //ajax khi chon District
    $("#District").change(function () {
        
        if ($("#District").val() != "") {
            var Url = "/ShopUser/GetWard";
            $.ajax(
                {
                    type: "GET",
                    url: Url,
                    async: false, // dừng việc bất đồng bộ, --> chạy lần lượt từng luồng
                    data: {
                        ID: $("#District").val()
                    },
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        var s = "";
                        s += "<option value=''>Please select Ward</option>";
                        for (var i = 0; i < data.length; i++) {
                            s += "<option value='" + data[i].ID + "'>" + data[i].Name + "</option>";
                        }
                        $("#WardID").html(s);
                    },
                });
        } else {
            //$("#divWard").fadeOut(200);
        }
    });

    // form Update User
    $("#formUpdate").submit(function (e) {
        alert("oi la"); 
        var URL = "/ShopUser/Edit";
        var _id = cells[0].innerText;
        $.ajax(
            {
                url: URL,
                type: "POST",
                datatype: "text",
                data: { id: _id, 
                    name: $("#txtName").val(), 
                    birthday: $("#txtBirthday").val(), 
                    identiy: $("#txtIdentiy").val(), 
                    phone: $("#txtphone").val(), 
                    description: $("#txtDescription").val(), 
                    detailAddress: $("#detailAddress").val(), 
                },
                success: function (data) {
                },
                error: function (err) {
                    alert("Lỗi cập nhật");
                }
            });
        e.preventDefault();
        $("#closeUpdate").click();
    });

    // Search function
    $("#btnSearch").click(function () {
        searchPagination();
    });

    $("#txtSearch").keyup(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            $("#btnSearch").click();
        }
    });

    createPagination(); // thực hiện phân trang
});
function LoadInfo(editButton) {
    currentRow = editButton.parentNode.parentNode;

    $("#txtName").val(currentRow.cells[1].innerHTML);
    $("#txtBirthday").val(currentRow.cells[2].innerHTML);

    if (currentRow.cells[3].innerHTML.localeCompare("Nam") == 0 || currentRow.cells[3].innerHTML.localeCompare("Male") == 0)
    {
        $("#sexFemale").removeAttr("checked", "false");
        $("#sexOther").removeAttr("checked", "false");
        $("#sexMale").attr("checked", "checked");
        
    }
    else if (currentRow.cells[3].innerHTML.localeCompare("Other") == 0)
    {
        $("#sexFemale").removeAttr("checked", "false");
        $("#sexMale").removeAttr("checked", "false");
        $("#sexOther").attr("checked", "checked");
    }
    else
    {
        
        $("#sexMale").removeAttr("checked");
        $("#sexOther").removeAttr("checked", "false");
        $("#sexFemale").attr("checked", "checked");
    }

    $("#txtIdentiy").val(currentRow.cells[4].innerHTML);
    $("#txtphone").val(currentRow.cells[6].innerHTML);
    $("#txtDescription").val(currentRow.cells[12].innerHTML);
    $("#detailAddress").val(currentRow.cells[13].innerHTML);
}
function InsertData()
{
    var CellID = $("#tblTableList tr").length;
    var CellCity = $("#City option:selected").text();
    var CellDistrict = $("#District option:selected").text();
    var CellWard = $("#Ward").val();
    var CellDescription = $("#Description").val();
    $("#tblTableList").append("<tr><td>" + CellID + "</td><td>" + CellWard + "</td><td>" + CellDistrict + "</td><td>" + CellCity + "</td><td>" + CellDescription + "</td><td><button type='button' class='btn btn-info' data-toggle='modal' data-target='#modal_update' aria-label='Left Align'><span class='glyphicon glyphicon-edit' aria-hidden='true'></span></button><button type='button' class='btn btn-danger' data-toggle='modal' data-target='#modal_remove'><span class='glyphicon glyphicon-remove-sign' aria-hidden='true'></span></button></td></tr>");
}
