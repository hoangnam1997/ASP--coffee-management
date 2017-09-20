// Global Variable
    var stringAction = "<button class='btn btn-danger buttonDel lang' key = 'delete' data-toggle='modal' data-target='#delProductCategory'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button><button style ='margin-left:5px;' class='btn btn-info buttonUpdate lang' key = 'update' data-toggle='modal' data-target='#updateProductCategory'><span class='fa fa-pencil-square-o' aria-hidden='true'></span></button>";
    var idDel = 0;                  // Index of row
    var itemPerPage = 5;            // Items per page
    var listCount = lst.length;     // Total items
    var searchAction = false;       // Search Action
    var lstTemp;                    // LstTemp For Search
    var total_PagesTemp;            // Total_Page For LstTemp
    var total_Pages = (listCount % itemPerPage == 0) ? parseInt(listCount / itemPerPage) : parseInt(listCount / itemPerPage) + 1;
    var ascSort = true;           // Desc Variable
    var index = 0;                // Index of Lst
    var Column = $(".sorting")[0];   // Column name to sort
    var table = document.getElementById("tableContent");    // Get Table 
// Load Page With Pagination
    function LoadPage(startPageNum, totalPagesNum, visiblePagesNum, listCount ,lst) {
    // Jquery Pagination - TWBS
    $('#pagination').twbsPagination({
        startPage: startPageNum,           // Start Page
        totalPages: totalPagesNum,          // Total Pages
        visiblePages: visiblePagesNum,      // Visible Pages
        first: '<span class="glyphicon glyphicon-backward" aria-hidden="true"></span>', 
        prev: '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>',
        next: '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>',
        last: '<span class="glyphicon glyphicon-forward" aria-hidden="true"></span>',
        // Set Event - Click For Each Page
        onPageClick: function (event, page) {
            // Get Length To Loop 
            var length = (listCount > (page * visiblePagesNum)) ? (page * visiblePagesNum) : listCount;
            // Clear Table 
            $("#tableContent").empty();
            // For Loop To Load Row In Table
            for (var i = (page - 1) * visiblePagesNum; i < length; i++) {
                $("#tableContent").append("<tr><td>"+ lst[i].id +"</td><td hidden>" + lst[i].ID + "</td>" +
                                          "<td>" + lst[i].Name + "</td>" +
                                          "<td>" + lst[i].Description + "</td>" +
                                          "<td>" + stringAction + "</td></tr>"
                                         );
            }
            // Load Action For Row
            LoadEvent();
        }
    });
}
// Function Load Event In Button Action
    function LoadEvent() {
    $("table tr button.buttonDel").on('click', function (e) {
        idDel = $(this).closest('td').parent()[0].sectionRowIndex;
    });
    // Get ID Row when click button Update on Row
    $("table tr button.buttonUpdate").on('click', function (e) {
        idDel = $(this).closest('td').parent()[0].sectionRowIndex;
        var row = document.getElementsByTagName("tr")[idDel + 2];
        document.getElementById("nameUpdate").value = row.cells[2].textContent;
        document.getElementById("descriptionUpdate").value = row.cells[3].textContent;
    });
}
// Function Reset Value In Form Add
    function ResetText() {
    $('#formAdd').bootstrapValidator('resetForm', true);
    $("#addProductCategory").modal('hide');
}
// Jquery Document Ready Function After Load All DOM Element
    $(document).ready(function () {
    // Pagination 
    if (lst.length > 0) {
        LoadPage(1 , total_Pages , itemPerPage , listCount , lst);
    }
    // Load Event For Action In Row
    LoadEvent();
    // Validate Form Add And Submit Form
    $('#formAdd').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                    },
                    stringLength: {
                        min: 6,
                        max : 30
                    }
                }
            },
            addDescription: {
                validators: {
                    notEmpty: {
                    },
                    stringLength: {
                        min: 6,
                        max: 100
                    }
                }
            },
        },
        submitHandler: function (validator, form, submitButton) {     
        }
    }).on('success.form.bv', function (e) {
        // Get Name
        var name = document.getElementById("addName").value;
        // Get Description
        var description = document.getElementById("description").value;
        // Get URL
        var URL = "/ProductCategory/AddProductCategory";
        // Create ProductCategory Object
        var productCategory = {
            Name : name , 
            Description : description
        };
        // Ajax For Add
        $.ajax(
            {
                url: URL,
                type: "POST",
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ productCategory: productCategory }),
                success: function (data) {
                    var s = "-1";
                    if (s.localeCompare(data) != 0) {
                        // Add New Row To Table
                        AddRow(data, name, description);
                    }
                },
                error: function (err) {
                    alert("Fail");
                }
            });
        // Prevent Load URL
        e.preventDefault();
        // Close Add Form
        $(".closeAdd").click();
    });
    // Form Update Submit
    $("#updateForm").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                    },
                    stringLength: {
                        min: 6,
                        max : 30
                    }
                }
            },
            updateDescription: {
                validators: {
                    notEmpty: {
                    },
                    stringLength: {
                        min: 6,
                        max: 100
                    }
                }
            },
        },
        submitHandler: function (validator, form, submitButton) {     
        }
    }).on('success.form.bv', function (e) {
        // Get Current Row
        var row = document.getElementsByTagName("tr")[idDel + 2];
        // Get URL 
        var URL = "/ProductCategory/UpdateProductCategory";
        // Get ID in Current Row
        var lastID = row.cells[1].textContent;
        // Get Name
        var name = $("#nameUpdate").val();
        // Get Description
        var description = $("#descriptionUpdate").val();
        // Create ProductCategory object
        var productCategory = {
            ID : lastID , 
            Name : name , 
            Description : description
        }
        // Ajax for Update 
        $.ajax(
                {
                    url: URL,
                    type: "POST",
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ productCategory: productCategory }),
                    success: function (data) {
                        var s = "Success";
                        if (s.localeCompare(data) == 0) {
                            // Update Row in LST 
                            UpdateRow(row, lastID , name , description);
                        }
                    },
                    error: function (err) {
                        alert(err.error);
                    }
                });
        // Prevent Load URL 
        e.preventDefault();
        // Close Update Form
        $("#closeUpdate").click();

    });
    // Set Key Button Del
    $(".buttonDel").keyup(function (e) {
        // Enter = Delete Button
        if (e.keyCode === 13) {
            $(".delBtnYes").click();
        };
        // Esc = Close Button
        if (e.keyCode === 27) {
            $(".delBtnCancle").click();
        }
    });
    // Set Key Button Update
    $(".buttonUpdate").keyup(function (e) {
        // Enter = Update Button
        if (e.keyCode === 13) {
            $(".enterUpdate").click();
        };
        // Esc = Close Button
        if (e.keyCode === 27) {
            $("#closeUpdate").click();
        }
    });
    // Set Key Button Add
    $("#formAdd").keydown(function (e) {
        // Esc = Close Button 
        if (e.keyCode === 27) {
            $(".closeAdd").click();
        };
    });
    // Set Key For Search
    $(".keySearch").keyup(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            $(".search").click();
        };
    });
    // Set Click Event Search
    $(".search").click(function () {
        // Get Key Search
        var searchTerm = $(".keySearch").val();
        // Check Key
        if (searchTerm == "") {
            // Hide Warning
            $("tr.warning").hide();
            // Destroy Pagination
            $("#pagination").twbsPagination('destroy');
            total_Pages = (lst.length % itemPerPage == 0) ? parseInt(lst.length / itemPerPage) : parseInt(lst.length / itemPerPage) + 1;
            // Load Pagination
            if (lst.length > 0) {
                LoadPage(1, total_Pages, itemPerPage, lst.length, lst);
            }
            // Set SearchAction
            searchAction = false;
            // Sort and Return
            Sort(Column , lst);
            return;
        }
        // Filter To New LstTemp 
        lstTemp = lst.filter(function (item) {
            return item.Name.toLowerCase().includes(searchTerm.toLowerCase()) || item.Description.toLowerCase().includes(searchTerm.toLowerCase());
        });
        // Check LstTemp 
        if (lstTemp.length > 0) {
            // Hide Warning
            $("tr.warning").hide();
            // Cal Total_Page
            total_PagesTemp = (lstTemp.length % itemPerPage == 0) ? parseInt(lstTemp.length / itemPerPage) : parseInt(lstTemp.length / itemPerPage) + 1;
            // Destroy Pagination
            $("#pagination").twbsPagination('destroy');
            // LoadPage With LstTemp
            LoadPage(1, total_PagesTemp, itemPerPage, lstTemp.length, lstTemp);
            // Set SearchAction
            searchAction = true;
        } else {
            // Destroy Pagination
            $("#pagination").twbsPagination('destroy');
            // Empty Table
            $("#tableContent").empty();
            // Show Warning
            $("tr.warning").show();
            searchAction = false;
        }
    });
    // Form Delete Submit
    $("#formDel").submit(function (e) {
        // Get Current Row
        var row = document.getElementsByTagName("tr")[idDel + 2];
        // Get ID in Row
        var id = row.getElementsByTagName("td")[1].textContent;
        // Get Name in Row
        var name = row.getElementsByTagName("td")[2].innerText;
        // Get Description in Row
        var description = row.getElementsByTagName("td")[3].textContent;
        // Get URL
        var URL = "/ProductCategory/DeleteProductCategory";
        // Ajax for Delete
        $.ajax(
                {
                    url: URL,
                    type: "POST",
                    dataType: "text",
                    data: { ID: id},
                    success: function (data) {
                        var s = "Success";
                        if (s.localeCompare(data) == 0) {
                            DeleteRow( row ,id, name, description);
                        }
                    },
                    error: function (err) {
                        alert("Fail");
                    }
                });
        // Prevent Load URL
        e.preventDefault();
        // Close Delete Form
        $("#btnDelCancle").click();
    });
    // Form Delete Close
    $("#btnDelCancle").click(function () {
        $(".close").click();
    });
    // Show Entities 
    $(".pagination-page-size > li").on('click',function () {
        // Get Value Option Selected
        var val = parseInt($(this).data('page-size'));
        // Change Select Click
        var text= $(this).text() + '<span class="caret"></span>';
        $("#selectedDropdownItem").html(text);
        // Assign ItemPerPage 
        itemPerPage = val;
        // Destroy Pagination
        $("#pagination").twbsPagination('destroy');
        // Check SearchAction
        if (!searchAction) {
            // Cal Total_Page for Lst
            total_Pages = (lst.length % itemPerPage == 0) ? parseInt(lst.length / itemPerPage) : parseInt(lst.length / itemPerPage) + 1;
            // Load Pagination
            if (lst.length > 0) {
                LoadPage(1, total_Pages, itemPerPage, lst.length, lst);
            }
        } else {
            // Cal Total_Page for LstTemp
            total_PagesTemp = (lstTemp.length % itemPerPage == 0) ? parseInt(lstTemp.length / itemPerPage) : parseInt(lstTemp.length / itemPerPage) + 1;
            // Load Pagination
            LoadPage(1, total_PagesTemp, itemPerPage, lstTemp.length, lstTemp);
        }
    });
    // Close Add Form
    $(".closeAdd").click(function(){
        $('#formAdd').bootstrapValidator('resetForm', true);
        $("#addProductCategory").modal('hide');
    });
    // Close Update Form
    $("#closeUpdate").click(function(){
        $('#updateForm').bootstrapValidator('resetForm', true);
        $("#updateProductCategory").modal('hide');
    });
    // Sorting 
    $(".sorting").each(function(index) {
        $(this).on("click", function(){
            if (!searchAction) {
                ascSort = !ascSort;
                Sort(this , lst);
            } else {
                ascSort = !ascSort;
                Sort(this , lstTemp);
            }
        });
    });


 
});
// function Add On Screen
    function AddRow(data, name, description) {
    searchAction = false;
    $("tr.warning").hide();
    // Add to Lst
    AddList(Column, lst, ascSort , data , name , description);
    // Check Lst 
    if (lst.length > 0 ) {
        $("#pagination").twbsPagination('destroy');
    }
    // Check for go to new page ? 
    total_Pages = (lst.length % itemPerPage == 1) ?( total_Pages + 1) : total_Pages;
    // Load page after add 
    LoadPage(1, total_Pages, itemPerPage, lst.length ,lst);
    // Focus Row after add
    FocusRow(lst, data) ; 
   
}
// function Delete On Screen
    function DeleteRow( row ,id, name, description) {
    counter--;
    // Get PageNumber
    var pageNumber = parseInt($("#pagination > li.active > a")[0].text);
    // Destroy Pagination
    $("#pagination").twbsPagination('destroy'); 
    // Get Index
    var indexLst = lst.findIndex(i => i.ID == id);
    // Update No
    UpdateNo(lst[indexLst].id);
    // Check Search 
    if (!searchAction) {
        // Delete Item In Lst
        lst.splice( indexLst , 1);
        // Check Total_Pages
        total_Pages = (lst.length % itemPerPage == 0) ? total_Pages - 1 : total_Pages;
        // Check PageNumber 
        if (pageNumber == (total_Pages + 1) && pageNumber != 1) {
            pageNumber--;
        } 
        if (lst.length > 0 ) {
            LoadPage(pageNumber, total_Pages, itemPerPage, lst.length , lst);
        } else {
            table.deleteRow(0);
        }
    } else {
        // Get Index
        var indexLstTemp = lstTemp.findIndex(i => i.ID == id);
        // Delete Item In Lst
        lstTemp.splice( indexLstTemp , 1);
        // Delete Item In Lst
        lst.splice( indexLst , 1);
        // Check Total_Pages
        total_Pages = (lst.length % itemPerPage == 0) ? total_Pages - 1 : total_Pages;
        // Check Total_Pages
        total_PagesTemp = (lstTemp.length % itemPerPage == 0) ? total_PagesTemp - 1 : total_PagesTemp;
        // Check PageNumber 
        if (pageNumber == (total_PagesTemp + 1) && pageNumber != 1) {
            pageNumber--;
        }
        // Load Pagination Check Last Row Exists
        if (lstTemp.length > 0) {
            LoadPage(pageNumber, total_PagesTemp, itemPerPage, lstTemp.length , lstTemp);
        }
        else {
            // Show No Result
            table.deleteRow(0);
            $(".search").click();
        }
    } 
}
// function Update On Screen
    function UpdateRow(row, id , name, description) {
    // Get Page Number
    var pageNumber = parseInt($("#pagination > li.active > a")[0].text);
    var index = lst.findIndex(i => i.ID == id);
    lst[index].Name = name;
    lst[index].Description = description;
    // Update Row
    row.cells[2].textContent = name;
    row.cells[3].textContent = description;
    // Sort after Update 
    if (!searchAction) {
        Sort(Column , lst);
        FocusRow(lst , id);
    } else {
        Sort(Column , lstTemp);
        FocusRow(lstTemp , id);
    }
}
// Sort ASC
function SortColumnASC(column , list)
{
    list.sort(function(a , b) {
        if (column.getAttribute("key") == "no") {
            return Number(a.id) - Number(b.id);
        } else {
            return a.Name.localeCompare(b.Name);
        }
    });
}
// Sort DESC
function SortColumnDESC(column , list)
{
    list.sort(function(a , b) {
        if (column.getAttribute("key") == "no") {
            return Number(b.id) - Number(a.id);
        } else {
            return b.Name.localeCompare(a.Name);
        }
    });
}
// function Update ID after Delete
function UpdateNo(no){
    var index = Number(no);
    for (var i = 0 ; i < lst.length; i++) {
        if (index < Number(lst[i].id)) {
            lst[i].id = (Number(lst[i].id) - 1 ).toString();
        }
    }
}
// Function Sort
function Sort(key , list) {
    $(".sorting").not(key).each(function(index){
        $(this).removeClass("sorting_desc");
        $(this).removeClass("sorting_asc");
    });
    if (ascSort) {
        $(key).addClass("sorting_asc");
        $(key).removeClass("sorting_desc");
        SortColumnASC(key , list)
    } else {
        $(key).addClass("sorting_desc");
        $(key).removeClass("sorting_asc");
        SortColumnDESC(key , list);
    }
    $("#pagination").twbsPagination('destroy');
    if (lst.length == list.length) {
        LoadPage(1, total_Pages , itemPerPage , list.length , list);
    } else {
        LoadPage(1, total_PagesTemp , itemPerPage , list.length , list);
    }
    Column = key;
}
// Add item to List
function AddList(Column , list , ascSort , data , name , description){
    counter++;
    lst.push({"id" : counter.toString(),  "ID": data, "Name": name, "Description": description });
    Sort(Column , list);
}
// Change Color background Row
function ChangeBGRow(index)
{
    setTimeout(function() {
        $("tbody tr:nth-child(" + index + ")").effect("highlight", {}, 2000);
    }, 500);
}
// Focus Row
function FocusRow(list , id){
    // Get Last Index to Focus
    var lastIndex = (list.findIndex(i => i.ID == id)) + 1;
    // Get Page to Go
    var pageToGo = Math.ceil(lastIndex/itemPerPage) == 0 ? 1 : Math.ceil(lastIndex/itemPerPage);
    // Go to Page
    $("#pagination").twbsPagination('show', pageToGo);
    // Get Index for per Page
    var indexRowAdd = lastIndex - (itemPerPage * ( pageToGo - 1 ));
    // Change BG
    ChangeBGRow(indexRowAdd);
}