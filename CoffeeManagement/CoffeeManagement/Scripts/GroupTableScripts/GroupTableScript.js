
 var currentRow; // dòng tr hiện tại được chọn
 var id = 0; // id = 1 +> gọi hàm thêm. Ngược lại gọi hàm Update

// Thực hiện load dữ liệu của dòng được chọn vào modal khi nhấn nút "edit" của dòng tương ứng
    function TakeInfo(EditButton) {
        $('h4.modal-title').html('Edit Group Table Info');
        $('#btnEditGroupTable').val('Update');
        id = 0;
      currentRow = EditButton.parentNode.parentNode;
      $("#txtName").val(currentRow.cells[1].innerHTML);
      $("#txtDescription").val(currentRow.cells[2].innerHTML);
      $("#txtSurcharge").val(currentRow.cells[3].innerHTML);

      

    }

//Thực hiện update dữ liệu của dòng được chọn vào modal khi nhất nút "update" của dòng tương ứng
    function UpdateInfo(){
      currentRow.cells[1].innerHTML = $("#txtName").val();
      currentRow.cells[2].innerHTML = $("#txtDescription").val();
      currentRow.cells[3].innerHTML = $("#txtSurcharge").val();
    }

// Thực hiện xóa một dòng dữ liệu trong table khi nhấn nút delete
    function DeleteRow(selectedRow){
      var confirmation = confirm("Do you want to remove this row?");
      if(confirmation == true) 
      {
          var URL = "/GroupTable/DeleteGroupTable";
          var row = selectedRow.parentNode.parentNode;
          $.ajax(
              {
                  type: "POST",
                  url: URL,
                  dataType: "text",
                  data: {ID: row.cells[0].title},
                  success: function(data)
                  {
                      var S = "Success"
                      if (data.localeCompare(S) == 0)
                      {
                          paging.removeData(row.cells[0].title)
                      }
                  },
                  error: function()
                  {
                      alert("nát");
                  }
              });
      }
    }
    
//Thực hiện insert dữ liệu của dòng được chọn vào modal khi nhấn nút "add" của dòng tương ứng
    function InsertData(GroupTableID)
    {
      var CellID = $("#tblTableList tr").length - 1;
      var CellName = $("#txtName").val();
      var CellDescription = $("#txtDescription").val();
      var CellSurcharge = $("#txtSurcharge").val();

      $("#tblTableList").append("<tr><td title ='" + GroupTableID + "'>" + CellID + "</td><td>" + CellName + "</td><td>" + CellDescription + "</td><td>" + CellSurcharge + "</td><td><button class='btn btn-info' data-toggle='modal' data-target='#myModal' onclick='TakeInfo(this);'' ><i class='glyphicon glyphicon-edit' style='width:30px'></i></button> <button class='btn btn-danger' onclick='DeleteRow(this);''><i class='glyphicon glyphicon-remove-circle' style='width:30px'></i></button></td></tr>");

      lst.push({
          "ID": GroupTableID,
          "Name": CellName,
          "Description": CellDescription,
          "Surcharge": CellSurcharge,
          });
    }

//Thực hiện reset toàn bộ dữ liệu của modal khi nhấn "add"
    function ResetText()
    {
        $('h4.modal-title').html('Add Group Table Info');
        $('#btnEditGroupTable').val('Add');

      $("#txtName").val("");
      $("#txtDescription").val("");
      $("#txtSurcharge").val("");
      
      id = 1;
    }

// Thực hiện kiểm tra modal đang mở là modal để add hay update và gọi chức năng tương ứng
    function Execute(GroupTableID)
    {
      if(id == 1)
      {
        InsertData(GroupTableID);
        id = 0;
      }
      else
      {
        UpdateInfo();
      }
      $("#myModal").modal("hide");
      $("div.modal-backdrop").remove();
    }
// Thực hiện khi DOM của trang web được load lên hết
$(document).ready(function() {
  $("fmEditGroupEdit").keyup(function(e)
  {
    var code = e.keyCode || e.which;

    if( code == 13)
    {
      $("btnEditGroupTable").click();
    }

    if(code == 27)
    {
        $("btnCancel").click();
    }
  });
    //
  $(".search").click(function () {
      searchPagination();
		  });

  $("#txtSearch").keyup(function(e)
  {
      
    var code = e.keyCode || e.which;
    if ( code == 13)
    {
      $("#btnSearch").click();
    }
  });
    // chặn nhấn phim khác ngoài số
  $("#txtSurcharge").keypress(function (e) {
      var code = e.keyCode || e.which;
      if ((code < 48 || code > 57) &&  (code != 13 && code != 8))
      {
          e.preventDefault();
      }
  });
    // Dùng plugin validate của bootstrap 
  $("#fmEditGroupTable").bootstrapValidator(
      {
          feedbackIcons:
              {
                  valid: "glyphicon glyphicon-ok",
                  invalid: "glyphicon glyphicon-remove",
                  validating: "glyphicon glyphicon-refresh"
              },
          fields:
              {
                  // validate thông tin sử dụng name đc khai bao bên giao diện
                  txtName:
                      {
                          validators:
                              {
                                  notEmpty:
                                      {
                                          message: "Please input Group Table Name"
                                      }
                              }
                      },
                  txtSurcharge:
                      {
                          validators:
                              {
                                  notEmpty:
                                      {
                                          message: "Please input surcharge price"
                                      }
                              }
                      }
              }
      }).on("success.form.bv", function (e) // sự kiện xảy ra khi validate thành công và thực hiện submit form (tương tự hàm submit của jquery)
      {
          if (id == 1) // thực hiện add GroupTable sử dụng ajax
          {
              var URL = "/GroupTable/AddGroupTable";
              $.ajax(
                  {
                      type: "POST",
                      url: URL,
                      data: {
                          Name: $("#txtName").val(),
                          Description: $("#txtDescription").val(),
                          Surcharge: $("#txtSurcharge").val()
                      },
                      dataType: "json",
                      success: function(data)
                      {
                          /*
                          data trả về là 1 obj bao gồm :
                          - Result: chỉ ra trạng thái thành công hay thất bại (Sucesss hoặc Fail)
                          - ID: chỉ ra ID của GroupTable vừa đc thêm vào
                          */
                          var success = "Success";
                          if(data.Result.localeCompare(success) == 0)
                          {
                              lst.push(
                                        {
                                            "No": lst.length + 1,
                                            "ID": data.ID,
                                            "Name": $("#txtName").val(),
                                            "Description": $("#txtDescription").val(),
                                            "Surcharge": $("#txtSurcharge").val()
                                        });
                              paging.insertData();
                              $("#myModal").modal("toggle");
                          }
                      },
                      error: function()
                      {
                          alert("thêm thật bại");
                      }
                      
                  });
          }
          else //thực hiện update GroupTable sử dụng ajax
          {
              var URL = "/GroupTable/UpdateGroupTable";
              $.ajax(
                  {
                      type: "POST",
                      url: URL,
                      data: {
                          ID: currentRow.cells[0].title,
                          Name: $("#txtName").val(),
                          Description: $("#txtDescription").val(),
                          Surcharge: $("#txtSurcharge").val()
                      },
                      dataType: "text",
                      success: function (data) {
                          /*
                          data trả về là 1 obj bao gồm :
                          - Result: chỉ ra trạng thái thành công hay thất bại (Sucesss hoặc Fail)
                          - ID: chỉ ra ID của GroupTable vừa đc thêm vào
                          */
                          var success = "Success";
                          if (data.localeCompare(success) == 0) {
                              var Index = paging.list.findIndex(i => i.ID == currentRow.cells[0].title);
      
                              paging.list[Index].Name = $("#txtName").val();
                              paging.list[Index].Description = $("#txtDescription").val();
                              paging.list[Index].Surcharge = $("#txtSurcharge").val();

                              paging.updateData(Index); // update hàng theo index
                              $("#myModal").modal("toggle"); // tắt modal
                          }
                      },
                      error: function () {
                          alert("update thật bại");
                      }

                  });
          }
          $("#fmEditGroupTable").data("bootstrapValidator").resetForm(); //reset validate form 
          e.preventDefault();
      });
    // sự kiện shown.bs.modal xảy ra khi modal đã đc hiển thị. Khi đó sẽ thực hiện reset form (tránh hiển thị lại validate trước đó)
  $("#myModal").on("shown.bs.modal", function (e)
  {
      $("#fmEditGroupTable").data("bootstrapValidator").resetForm(); //reset validate data
      $("#txtName").focus();
  });
  createPagination(); //thực hiện phân trang
});
