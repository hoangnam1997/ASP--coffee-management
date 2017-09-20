  var currentRow; // là dòng tr hiện tại được chọn.
  var id = 0; // id = 1 => Gọi hàm thêm. Ngược lại gọi hàm Update

  // Thực hiện load dữ liệu của dòng được chọn vào modal khi nhấn nút edit của dòng tương ứng.
  function LoadInfo(editButton)
  {
    $("h4.modal-title").html("Edit table info");
    $("#btnUpdateTable").html("Update");
    
    currentRow = editButton.parentNode.parentNode;

    $("#txtName").val(currentRow.cells[1].innerHTML);
    $("#sltGroupTable option").each(function ()
    {
        if ($(this).text().localeCompare(currentRow.cells[2].innerText) == 0)
        {
            $(this).prop("selected", "selected");
            return;
        }
    });

    $("#txtDescription").val(currentRow.cells[3].innerHTML);
  }

  // Thực hiện reset toàn bộ dữ liệu của modal khi nhấn nút add.
  function ResetAllText() 
  {
    $("#txtName").val("");
    $("#sltGroupTable").val("");
    $("#txtDescription").val("");
    id = 1;

    $("h4.modal-title").html("Add table info");
    $("#btnUpdateTable").html("Add");
  }

  // Thực hiện update dữ liệu lên table khi nhấn nút update trong modal.
  function UpdateData()
  {
    currentRow.cells[1].innerHTML = $("#txtName").val();
    currentRow.cells[2].innerHTML = $("#sltGroupTable option:selected").text();
    currentRow.cells[3].innerHTML = $("#txtDescription").val();
  }

  // Thực hiện insert dữ liệu vào table khi nhấn nút add trong modal.
  function InsertData(TableID)
  {
    var CellID = $("#tblListTable tr").length - 1;
    var CellName = $("#txtName").val();
    var CellGroupTableName = $("#sltGroupTable option:selected").text();
    var CellGroupTableID = $("#sltGroupTable").val();
    var CellDes = $("#txtDescription").val();

    var s = "<tr>";

    s += "<td title='" + TableID + "'>" + CellID + "</td>";
    s += "<td>" + CellName + "</td>";
    s += "<td title='" + CellGroupTableID + "'>" + CellGroupTableName + "</td>";
    s += "<td>" + CellDes + "</td>";
    s += "<td><button type='button' class='btn btn-info' data-toggle='modal' data-target='#myModal' onclick='LoadInfo(this);'><i class='glyphicon glyphicon-edit' style='width:30px'></i></button>";
    s += " <button type='button' class='btn btn-danger' onclick='DeleteRow(this);'><i class='glyphicon glyphicon-remove-circle' style='width:30px'></i></button></td>";
    s += "</tr>";
  }
  
  // Thực hiện kiểm tra modal đang mở là modal để add hay update và gọi chức năng tương ứng.
  function ExecuteFunction(TableID) 
  {
    if (id == 1)
    {
      InsertData(TableID);
      id = 0;
    }
    else
    {
      UpdateData();
    }
    $("#myModal").modal("toggle");
  }

  // Thực hiện xoá 1 dòng dữ liệu trong table khi nhấn nút delete.
  function DeleteRow(selectedRow)
  {
    var answer = confirm('Bạn có thực sự muốn xoá không???');

    if (answer)
    {
        var URL = "/Table/DeleteTable";
        var row = selectedRow.parentNode.parentNode;
        $.ajax(
            {
                type: "POST",
                url: URL,
                dataType: "text",
                data: { ID: row.cells[0].title },
                success: function(data)
                {
                    var s = "Success";
                    if (data.localeCompare(s) == 0)
                    {
                        //paging.removeData(row.cells[0].title);
                    }
                },
                error: function()
                {
                    alert("fail");
                }
            });
      
    }
  }

  // Thực hiện khi DOM của trang web được load lên hết.
  $(document).ready(function() 
  {
    // Nhấn enter trong form sẽ tự submit
    $("#fmInfoTable").keyup(function(event)
    {
      var code = event.keyCode || event.which;

      if (code == 13)
      {
        $("#btnUpdateTable").click();
      }

      if (code == 27)
      {
          $("#btnCancel").click();
      }
    });

    // Search function
    $("#btnSearch").click(function () 
    {
        searchPagination(); 
    });

    // Nhấn enter sẽ tự tìm kiếm mà không cần nhấn nút Search
    $("#txtSearch").keyup(function(e) 
      {
        var code = e.keyCode || e.which;
        if (code == 13)
        {  
          $("#btnSearch").click();
        }
    });

    // Chỉ cho phép nhập số và nhấn phím xoá
    $("#sltGroupTable").keypress(function (event)
    {
        return (event.which >= 48 && event.which <= 57) || event.which == 13;
    });

    // Sử dụng plugin validate của bootstrap
    $('#fmInfoTable').bootstrapValidator(
    {
      // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
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
              message: 'Please supply your table name'
            }
          }
        },
        sltGroupTable: 
        {
          validators: {

            notEmpty: {
              message: 'Please choose your group table name'
            }
          }
        }
      }
    }).on('success.form.bv', function(e) // Sự kiện success.form.bv xảy ra khi validate thành công và sẽ thực hiện submit form (tương tự sự kiện submit của jquery)
    {
        var TableName = $("#txtName").val();
        var TableGroupID = $("#sltGroupTable").val();
        var TableGroupTableName = $("#sltGroupTable option:selected").text();
        var TableDes = $("#txtDescription").val();

        if (id == 1) // Thực hiện add table bằng ajax
        {
            var URL = "/Table/AddTable";
            $.ajax(
            {
                type: "POST",
                url: URL,
                data:
                    JSON.stringify({
                        Name: $("#txtName").val(),
                        GroupTableID: $("#sltGroupTable").val(),
                        ShopID: CurrentShopID,
                        Description: $("#txtDescription").val()
                    }),
                dataType: "json",
                contentType: "application/json",
                success: function (data)
                {
                    /*
                     * data trả về là 1 object bao gồm:
                     * + Result: chỉ ra trạng thái thành công hay thất bại (Success hoặc Fail)
                     * + ID: chỉ ra ID của table vừa được thêm vào.
                     */
                    var success = "Success";

                    if (data.Result.localeCompare(success) == 0) {

                        lst.push(
                                {
                                    "No": lst.length + 1,
                                    "ID": data.ID,
                                    "Name": TableName,
                                    "GroupTableID": TableGroupID,
                                    "GroupTableName": TableGroupTableName,
                                    "Description": TableDes
                                });
                        paging.insertData(); // thực hiện insert data vào table
                        $("#myModal").modal("toggle"); // tắt modal
                    }


                },
                error: function ()
                {
                    alert("Thêm thất bại");
                }
            });
        }
        else // thực hiện update table bằng ajax
        {
            var URL = "/Table/UpdateTable";

            $.ajax(
            {
                type: "POST",
                url: URL,
                data:
                    {
                        ID: currentRow.cells[0].title,
                        Name: $("#txtName").val(),
                        GroupTableID: $("#sltGroupTable").val(),
                        ShopID: CurrentShopID,
                        Description: $("#txtDescription").val()
                    },
                dataType: "text",
                success: function (data) {
                    var success = "Success";

                    if (data.localeCompare(success) == 0) {

                        var Index = paging.list.findIndex(i => i.ID == currentRow.cells[0].title);

                        paging.list[Index].Name = $("#txtName").val();
                        paging.list[Index].GroupTableID = $("#sltGroupTable").val();
                        paging.list[Index].GroupTableName = $("#sltGroupTable option:selected").text();
                        paging.list[Index].Description = $("#txtDescription").val();

                        paging.updateData(Index); // Gọi hàm update table theo index
                        $("#myModal").modal("toggle"); // tắt modal
                    }
                },
                error: function () {
                    alert("update thất bại");
                }
            });
        }
        
        $('#fmInfoTable').data('bootstrapValidator').resetForm(); // reset validate form

        // Prevent form submission
        e.preventDefault();
        });

    $('#fmInfoTable').on('error.form.bv', function(e) 
      {
        //$('#fmInfoTable').data('bootstrapValidator').resetForm();
        e.preventDefault();
      });

    // Sự kiện shown.bs.modal xảy ra khi modal đã được hiển thị. Khi đó sẽ thực hiện reset form (tránh hiển thị lại validate cũ trước đó)
    $("#myModal").on("shown.bs.modal", function (e) 
      {
        $('#fmInfoTable').data('bootstrapValidator').resetForm(); // reset validate data 
        $("#txtName").focus();
      });

    createPagination(); // thực hiện phân trang
  });