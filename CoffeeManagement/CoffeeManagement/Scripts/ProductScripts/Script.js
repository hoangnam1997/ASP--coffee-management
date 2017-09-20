var currentRow;                                                                     // Current Row
var cells;                                                                          // Cells on Current Row

function resetAllAdd()                                                              // Reset Modal Add
{                                                                                   // Reset all content in form
    $("#txtProduct").val("");                                                       // Reset Name Product
    //$("#txtCategory option:selected").text("");
    //$("#txtShop  option:selected").text("");
    //document.getElementById('txtShop').options[0].selected = 'selected';
    document.getElementById('txtCategory').options[0].selected = 'selected';        // Reset Name Product Category
    $("#txtImage").val("");                                                         // Reset Image 
    $("#txtPrice").val("");                                                         // Reset Price
    $("#txtDiscount").val("");                                                      // Reset Discount
    $("#txtDescription").val("");                                                   // Reset Description
    $("#startdate").val("");                                                        // Reset StartDate
    $("#enddate").val("");                                                          // Reset EndDate
}
// Alert
function alertSomething() {
    alert("none");
}
// Insert Data
function InsertData(data) {
    var CellID = $("#tblTableList tr").length+1;                                    // Get ID 
    var CellName = $("#txtProduct").val();                                          // Get Name
    var CellProCategory = $("#txtCategory option:selected").text();                 // Get Product Cateogory
    var CellImage = data;                                                           // Get Image's name
    var CellPrice = $("#txtPrice").val();                                           // Get Price
    var CellDiscount = $("#txtDiscount").val();                                     // Get Discount
    var CellDescription = $("#txtDescription").val();                               // Get Description
    var CellStartdate = $("#startdate").val();                                      // Get StartDate
    var CellEnddate = $("#enddate").val();                                          // Get EndDate
    // Append to Table
    $("#tblTableList").append("<tr><td>"+lst[lst.length-1].No+"</td><td hidden>" + CellID +
        "</td><td>" + CellName +
        "</td><td>" + CellProCategory +
        "</td><td>" + "<img src='../../Images/"+CellImage+"' width='200' height='150'/>" +
        "</td><td>" + CellPrice +
        "</td><td>" + CellDiscount +
        "</td><td>" + CellDescription +
        "</td><td>" + CellStartdate +
        "</td><td>" + CellEnddate +
        "</td><td><button  class='btn btn-info' data-toggle='modal'  data-target='#modal_update' aria-label='Left Align'  onclick='LoadInfo(this);' ><span class='glyphicon glyphicon-edit' aria-hidden='true' style='width:20px'></span></button> <button class='btn btn-danger' data-toggle='modal'  data-target='#Modal_Del' onclick='DeleteRow(this);'> <span class='glyphicon glyphicon-remove-sign' aria-hidden='true' style='width:20px'></span></button></td></tr>");
    // Hide Modale
    $("#modal_add").modal("hide");
    // Remove
    $("div.modal-backdrop").remove();
}

// Update row
function UpdateRow(name, ProductCategory, image, price, discount, description, startday, endday) {
    // Update row by agr 
    cells["2"].innerText = name;                                                    // Name
    cells["3"].innerText = ProductCategory;                                         // ProductCategory
    cells["4"].getElementsByTagName("img")[0].src = "../../Images/" + image;        // Image
    cells["5"].innerText = price;                                                   // Price
    cells["6"].innerText = discount;                                                // Discount
    cells["7"].innerText = description;                                             // Description
    cells["8"].innerText = startday;                                                // StartDay
    cells["9"].innerText = endday;                                                  // EndDay
    $("#modal_update").modal("hide");                                               // Hide Modal
    $("div.modal-backdrop").remove();                                               // Remove
}
// Get Current Row and Cells By Delete
function DeleteRow(btn)
{
    currentRow = btn.parentNode.parentNode.parentNode;                              // Get Current Row
    cells = currentRow.getElementsByTagName("td");                                  // Get Cells on Row
 }
// Load Data On Modal Update
function LoadInfo(element) {                                                        // Element - Button for per Row  
    DeleteRow(element);                                                             // Get Current Row and Cells
    $("#txtProductUpdate").val(cells["2"].innerText);                               // Load Product Name 
    $("#txtCategory option").each(function () {                                     // Load Product Category
        if ($(this).text().localeCompare(cells["3"].innerText) === 0) {
            $(this).prop("selected", "selected");
            return;
        }
    });
    $("#txtPriceUpdate").val(cells["5"].innerText);                                 // Load Price
    $("#txtDiscountUpdate").val(cells["6"].innerText);                              // Load Discount
    $("#txtDescriptionUpdate").val(cells["7"].innerText);                           // Load Description
    $("#txtStartUpdate").val(cells["8"].innerText);                                 // Load StartDate
    $("#txtEndUpdate").val(cells["9"].innerText);                                   // Load EndDate
}
// DOM Ready JQuery
$(document).ready(function () {
    createPagination();                                                             // Create Pagination
    advancedSearchEvents();                                                         // Load Advance Search Event
    $(".search-pagination button").click(function () {
        searchPagination();                                                         // Search Product Information
    });
   // Form Add Product
    $("#formAdd").submit(function (e) {
        var URL = "/Product/AddProduct";                                            // URL to Call Controller Add
        var file = $("#txtImage").prop("files")[0];                                 // Get File Upload
        var fr = new FileReader();                                                  // New File Reader
        var binary;                                                                 // Binary String for File Upload
        var str;                                                                    // Str binary of Image
        fr.readAsDataURL(file);                                                     // Event Read Data from File Upload
        fr.onload = function (e) {                                                  // Event - OnLoad Callback function
            str = e.target.result;                                                  // Data String Base64
            var product = {                                                         // Create Product Object
                Name: $("#txtProduct").val(),
                Description: $("#txtDescription").val(),
                ProductCategoryID: $("#txtCategory option:selected").val(),
                UnitPrice: $("#txtPrice").val(),
                Discount: $("#txtDiscount").val(),
                StartDay: $("#startdate").val(),
                EndDate: $("#enddate").val(),
                Image: str
            };
            $.ajax(                                                                 // Ajax For Add
            {
                url: URL,
                async: false,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({product: product}),
                success: function (response) {
                    if (response.ID !== "0") {                                      // Check Success ? 
                        lst.push({                                                  // Push to Lst
                            "No": lst.length+1,
                            "ID": response.ID,
                            "Name": $("#txtProduct").val(),
                            "ProductCategory": $("#txtCategory option:selected").text(),
                            "Image": response.img,
                            "UnitPrice": $("#txtPrice").val(),
                            "Discount":  $("#txtDiscount").val(),
                            "Description": $("#txtDescription").val(),
                            "Startday": $("#startdate").val(),
                            "Endday": $("#enddate").val() 
                        })
                        paging.insertData();                                        // Insert And Pagination
                        $("#modal_add").modal("hide");                              // Hide Modal
                    } else {
                        alert('khong the Add.');                                    // Alert Not Success
                    }
                },
                error: function (err) {                                             // Alert Error
                    alert("Lỗi Add");                                                   
                }
            }
            );
        }
        e.preventDefault();                                                         // Prevent Load Page
        $("#closeAdd").click();                                                     // Close Form Add
    });

   
    $("#formDel").submit(function (e) {                                             // Form Delete Product
        var URL = "/Product/DeleteProduct";                                         // URL Delete to call Controller Delete
        var id = parseInt(cells["1"].innerText);                                    // Get ID for Delete
        $.ajax(                                                                     // Ajax For Delete
            {
                url: URL,
                type: "POST",
                datatype: "text",
                data: { ID: id },                   
                success: function (data){                                           // Check Success ? 
                    var s = "Success";
                    if (s.localeCompare(data) === 0) {
                        paging.removeData(id);                                      // Paging Remove
                        $("#Modal_Del").modal("hide");                              // Hide Modal
                    }
                },
                error: function (err) {
                    alert("lỗi Delete");                                            // Alert Error
                }
            });
        e.preventDefault();                                                         // Prevent Load Page
        $("#CloseDel").click();                                                     // Close Form Delete
    });
    $("#formUpdateProduct").submit(function (e) {                                   // Form Update Product
        var URL = "/Product/UpdateProductWithoutImage";                             // URL Call Update With Default Image Controller
        var URL1 = "/Product/UpdateProductWithImage";                               // URL Call Update With Another Image Controller
        var id = cells["1"].innerText;                                              // ID For Update
        var strImage = cells["4"].getElementsByTagName("img")[0].getAttribute("src");           // Get Src Name on Row
        var imgName = strImage.substring(strImage.lastIndexOf("/") + 1, strImage.length);       // Get Image Name With Extension
        var file = $("#txtImageUpdate").prop("files")[0];                                       // Get File from Update
        if (file == null) {                                                         // File Null - Update Without Image
            var product = {                                                         // Create Product Object
                ID : id,
                Name: $(".txtProductUpdate").val(),
                Description: $("#txtDescriptionUpdate").val(),
                ProductCategoryID: $(".txtCategoryProduct option:selected").val(),
                UnitPrice: $("#txtPriceUpdate").val(),
                Discount: $("#txtDiscountUpdate").val(),
                StartDay: $("#txtStartUpdate").val(),
                EndDate: $("#txtEndUpdate").val(),
                Image : imgName
            };
            $.ajax(                                                                 // Ajax for Update
            {
                url: URL,
                type: "POST",
                datatype: "text",
                contentType: "application/json",
                data: JSON.stringify({ product: product }),
                success: function (data) {                                          // Check Success ? 
                    var index = paging.list.findIndex(i=>i.ID == id);               // Update to Paging Lst With Index
                    paging.list[index].Name = $("#txtProductUpdate").val();
                    paging.list[index].ProductCategory = $(".txtCategoryProduct option:selected").text();
                    paging.list[index].UnitPrice = $("#txtPriceUpdate").val();
                    paging.list[index].Discount = $("#txtDiscountUpdate").val();
                    paging.list[index].Description = $("#txtDescriptionUpdate").val();
                    paging.list[index].Startday = $("#txtStartUpdate").val();
                    paging.list[index].Endday = $("#txtEndUpdate").val();
                    paging.updateData(index);                                       // Update Date In Paging Lst
                },
                error: function (err) {
                    alert("Lỗi UpdateProductWithoutImage");                         // Alert Error
                }
            });
            e.preventDefault();                                                     // Prevent Load Page
        } else {                                                                    // File Is Not Null - Update With Another Image
            var fr = new FileReader();                                              // File Reader Instance
            var binary;                                                             // Binary Str Image
            var str;                                                                // Str Binary 
            fr.readAsDataURL(file);                                                 // Read Data from File
            fr.onload = function (e) {                                              // OnLoad Function Callback File Reader
                str = e.target.result;                                              // Data String Base64 
                var product = {                                                     // Create Product Object
                    ID: id,
                    Name: $(".txtProductUpdate").val(),
                    Description: $("#txtDescriptionUpdate").val(),
                    ProductCategoryID: $(".txtCategoryProduct option:selected").val(),
                    UnitPrice: $("#txtPriceUpdate").val(),
                    Discount: $("#txtDiscountUpdate").val(),
                    StartDay: $("#txtStartUpdate").val(),
                    EndDate: $("#txtEndUpdate").val(),
                    Image: str
                };
                $.ajax(                                                             // Ajax For Update
                {
                    url: URL1,
                    type: "post",
                    dataType: "text",
                    contentType: "application/json",
                    data: JSON.stringify({ product: product }),
                    success: function (data) {                                      // Check Success ? 
                        var index = paging.list.findIndex(i=>i.ID == id);           // Update Data On Paging Lst with Index
                        paging.list[index].Name = $("#txtProductUpdate").val();
                        paging.list[index].ProductCategory = $(".txtCategoryProduct option:selected").text();
                        paging.list[index].Image = data;
                        paging.list[index].UnitPrice = $("#txtPriceUpdate").val();
                        paging.list[index].Discount = $("#txtDiscountUpdate").val();
                        paging.list[index].Description = $("#txtDescriptionUpdate").val();
                        paging.list[index].Startday = $("#txtStartUpdate").val();
                        paging.list[index].Endday = $("#txtEndUpdate").val();
                        paging.updateData(index);                                   // Update Data Paging Lst
                    },
                    error: function (err) {
                        alert("lỗi UpdateProductWithImage");                        // Alert Error
                    }
                }
                );
            }
            e.preventDefault();                                                     // Prevent Load Page
        }
        
        $("#closeUpdate").click();                                                  // Close Update Form
    })

    // Function only input number PRICE
    $("#txtPrice").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl/cmd+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    // Function only input number DISCOUNT
    $("#txtDiscount").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    // only input 0-100 DISCOUNT modal ADD
    var t = false
    // Show error when Discount > 100 and < 0
    $("#txtDiscount").focus(function () {
        var $this = $(this)
        t = setInterval(
        function () {
            if (($this.val() < 0 || $this.val() > 100) && $this.val().length != 0) {
                if ($this.val() < 0) {
                    $this.val(0)
                }
                if ($this.val() > 100) {
                    $this.val(100)
                }
                $('.pWarning').fadeIn(1000, function () {
                    $(this).fadeOut(500)
                });
            }
        }, 50);
    });
    // Clear Interval T 
    $("#txtDiscount").blur(function () {
        if (t != false) {
            window.clearInterval(t)
            t = false;
        }
    });
    //only input 0-100 DISCOUNT modal UPDATE
    $("#txtDiscountUpdate").focus(function () {
        var $this = $(this)
        t = setInterval(
        function () {
            if (($this.val() < 0 || $this.val() > 100) && $this.val().length != 0) {
                if ($this.val() < 0) {
                    $this.val(0)
                }
                if ($this.val() > 100) {
                    $this.val(100)
                }
                $('.pWarning').fadeIn(1000, function () {
                    $(this).fadeOut(500)
                });
            }
        }, 50);
    });
    // Clear Interval 
    $("#txtDiscountUpdate").blur(function () {
        if (t != false) {
            window.clearInterval(t)
            t = false;
        }
    });

    //validate startdate-edndate modal ADD
    var today = new Date();

    //$('#startdate').datepicker({
    //    onSelect: function (dateText, inst) {
    //        $('#enddate').datepicker('option', 'minDate', new Date(dateText));
    //    },
    //});

    //$('#enddate').datepicker({
    //    onSelect: function (dateText, inst) {
    //        $('#startdate').datepicker('option', 'maxDate', new Date(dateText));
    //    }
    //});
    ////validate startdate-edndate modal UPDATE
    //$('#txtStartUpdate').datepicker({
    //    onSelect: function (dateText, inst) {
    //        $('#txtEndUpdate').datepicker('option', 'minDate', new Date(dateText));
    //    },
    //});

    //$('#txtEndUpdate').datepicker({
    //    onSelect: function (dateText, inst) {
    //        $('#txtStartUpdate').datepicker('option', 'maxDate', new Date(dateText));
    //    }
    //});

    // Datepicker Advanced Search
    $('#search-startdate').datepicker({
        onSelect: function (dateText, inst) {
            $('#search-enddate').datepicker('option', 'minDate', new Date(dateText));
        },
    });
    $('#search-enddate').datepicker({
        onSelect: function (dateText, inst) {
            $('#search-startdate').datepicker('option', 'maxDate', new Date(dateText));
        }
    });
});

//Advanced search events
function advancedSearchEvents() {
    // Get Button Expand Advance Search
    var button = document.getElementsByClassName('btn-advanced-search-expand')[0];
    // Check Event for Button 
    button.addEventListener('click', function () {
        var div = document.getElementsByClassName('advanced-search')[0];
        var display = div.style.display;
        // Show Div And Hide Div on Click
        if (display === 'block') {
            div.style.display = 'none';
            button.innerHTML = '<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>';
        } else {
            div.style.display = 'block';
            button.innerHTML = '<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>'
        }
    });
    // Get Button Search Advance
    var buttonSearch = document.getElementsByClassName('btn-advanced-search')[0];
    // Add Event - advanceSearch Function on Click
    buttonSearch.addEventListener('click', function () {
        advancedSearch();
    });
}
// Function Advance Search
function advancedSearch() {
    // Get 3 Input Product, Start Day, End Day
    var inputs = document.getElementsByClassName('advanced-search')[0].getElementsByTagName('input');
    // Get 3 Object Combobox
    var selects = document.getElementsByClassName('advanced-search')[0].getElementsByTagName('select');
    // Get Product Name
    var name= inputs[0].value.removeMark();
    // Get Product Category
    var index = selects[0].selectedIndex;
    var productCategory = '';
    productCategory = selects[0].options[index].value;

    // Get Price
    var minPrice, maxPrice;
    index = selects[1].selectedIndex;
    // Check minPrice and maxPrice
    if(selects[1].options[index].value == 0){
        minPrice = 0;
        maxPrice = Number.MAX_SAFE_INTEGER;
    }else{
        minPrice = Number(selects[1].options[index].getAttribute("data-min-value"));
        maxPrice = Number(selects[1].options[index].getAttribute("data-max-value"));
        maxPrice = (minPrice < maxPrice) ? maxPrice : Number.MAX_SAFE_INTEGER;
    }

    // Get Discount
    var minDiscount, maxDiscount;
    index = selects[2].selectedIndex;
    if(selects[2].options[index].value==0){
        minDiscount = 0;
        maxDiscount= 100;
    }else{
        minDiscount = Number(selects[2].options[index].getAttribute("data-min-value"));
        maxDiscount = Number( selects[2].options[index].getAttribute("data-max-value"));
        maxDiscount = (minDiscount < maxDiscount) ? maxDiscount : 100;
    }

    // Get Start Day
    var startday = inputs[1].value;
    if (startday == '') {
        startday = '01/01/1970';
    }
    // Get End Day
    var endday = inputs[2].value;
    if (endday == '') {
        endday = new Date().toString();
    }

    // Advance Search Condition
    searchList = [];
    if(name != ""
        || startday != ""
        || endday != ""
        || selects[0].value!=0
        || selects[1].value!=0
        || selects[2].value != 0) {   
        lst.forEach(function (item) {
            if ((item.Name.removeMark().search(name) != -1)
                && ((item.ProductCategoryID == productCategory) || (productCategory == 0))
                && (Number(item.UnitPrice) >= minPrice && Number(item.UnitPrice) <= maxPrice)
                && (Number(item.Discount) >= minDiscount && Number(item.Discount) <= maxDiscount)
                && (new Date(startday).getTime() <= new Date(item.Startday).getTime())
                && (new Date(endday).getTime() >= new Date(item.Startday).getTime())
                && (new Date(startday).getTime() <= new Date(item.Endday).getTime())
                && (new Date(endday).getTime() >= new Date(item.Endday).getTime())) {
                searchList.push(item);
            }
        });

        paging.list = searchList;           
        paging.goToPage(1);
    } else {
        if (lst.length != paging.list.length) {
            paging.list = lst;
            paging.goToPage(1);
        }
    }
}