var currentRow;
//
/**
 * Reset Modal when clicking add button
 */
function ResetModal() {
    // change title
    $("#addShopModal h4.modal-title").html("Add new shop");
    // change save button value
    $("#saveButton").html("Add");
    $("#saveButton").val("Add");
    if ($('#saveButton').hasClass('btn-info')) {
        $('#saveButton').toggleClass('btn-info');
        $('#saveButton').toggleClass('btn-success');
    }

    // reset and disabled combobox ward, district, city
    resetSelectBoxById('cmbCity');
    document.getElementById("cmbDistrict").innerHTML = '';
    document.getElementById("cmbDistrict").disabled = true;
    document.getElementById("cmbWard").innerHTML = '';
    document.getElementById("cmbWard").disabled = true;
    document.getElementById("shopName").value = '';
    document.getElementById('detailAddress').value = '';
    document.getElementById("description").value = '';
}


$(document).ready(function () {
    // create pagination
    createPagination();
    // set advanced search events
    advancedSearchEvents();
    // set address events
    wardDistrictCity();

    //search
    $('.search-pagination button').click(function () {
        searchPagination();
    });

    // activate dropdown list
    $('.dropdown-toggle').dropdown();
});

/**
 * Load District by CityID using AJAX
 */
function loadDistrict(i) {
    // get address div
    var div = document.getElementsByClassName('ward-district-city')[i];
    //get city id
    var id = div.getElementsByClassName('city')[0].getElementsByTagName('select')[0].value;
    if (id == 0) {
        // disable district combobox
        div.getElementsByClassName('district')[0].getElementsByTagName('select')[0].disabled = true;
        div.getElementsByClassName('district')[0].getElementsByTagName('select')[0].innerHTML = "";
    } else {
        // activate district combobox
        div.getElementsByClassName('district')[0].getElementsByTagName('select')[0].disabled = false;
        $.ajax({
            type: "POST",
            async: false,
            url: "/Shop/ShowDistrict",
            data: JSON.stringify({ CityID: id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var s = "";
                s += '<option value="">-- Chọn quận --</option>';
                for (var i = 0; i < response.length; i++) {
                    s += "<option value='" + response[i].ID + "'>" + response[i].Name + "</option>";
                }
                // render district combobox
                div.getElementsByClassName('district')[0].getElementsByTagName('select')[0].innerHTML = s;
            },
            failure: function () {
                alert("Fail");
            },
            error: function () {
                alert("Error");
            }
        });
    }
}
/*
* Show ward
*/
function loadWard(i) {
    // get address div
    var div = document.getElementsByClassName('ward-district-city')[i];
    var id = div.getElementsByClassName('district')[0].getElementsByTagName('select')[0].value;
    var disable = div.getElementsByClassName('district')[0].getElementsByTagName('select')[0].disabled;
    if (disable || id == 0) {
        // disable ward combobox
        div.getElementsByClassName('ward')[0].getElementsByTagName('select')[0].disabled = true;
        div.getElementsByClassName('ward')[0].getElementsByTagName('select')[0].innerHTML = "";
    } else {
        // activate ward combobox
        div.getElementsByClassName('ward')[0].getElementsByTagName('select')[0].disabled = false;
        $.ajax({
            type: "POST",
            async: false,
            url: "/Shop/ShowWard",
            data: JSON.stringify({ DistrictID: id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var s = "";
                s += '<option value="">-- Chọn phường --</option>';
                for (var i = 0; i < response.length; i++) {
                    s += "<option value='" + response[i].ID + "'>" + response[i].Name + "</option>";
                }

                // render ward combobox
                div.getElementsByClassName('ward')[0].getElementsByTagName('select')[0].innerHTML = s;
            },
            failure: function () {
                alert("Fail");
            },
            error: function () {
                alert("Error");
            }
        });
    }
}
/**
 * Load Ward Information
 * @param {any} editButton
 */
function loadInfo(editButton) {
    $("#addShopModal h4.modal-title").html("Update shop");
    $("#saveButton").html("Update");
    $("#saveButton").val("Update");
    if ($('#saveButton').hasClass('btn-success')) {
        $('#saveButton').toggleClass('btn-info');
        $('#saveButton').toggleClass('btn-success');
    }
    // get current row
    currentRow = editButton.parentNode.parentNode.parentNode;
    // set shop name
    $("#shopName").val(currentRow.cells[2].innerHTML);
    $('#detailAddress').val(currentRow.cells[3].innerHTML);
    // set selected city
    setSelectBoxById('cmbCity', currentRow.cells[6].dataset.id);
    // show and set selected district
    loadDistrict(1);
    setSelectBoxById('cmbDistrict', currentRow.cells[5].dataset.id);
    // ward
    loadWard(1);
    setSelectBoxById('cmbWard', currentRow.cells[4].dataset.id);
    // set discription
    $('#description').val(currentRow.cells[7].innerHTML);
}

/**
 * Set selected option
 * @param {any} eid Element ID
 * @param {any} etxt Element text
 */
function setSelectBoxByText(eid, etxt) {
    var element = document.getElementById(eid);
    for (var i = 0; i < element.options.length; ++i) {
        if (element.options[i].text == etxt) {
            element.options[i].selected = true;
            break;
        }
    }
}

function setSelectBoxById(eid, id) {   
    var element = document.getElementById(eid);
    for (i = 0; i < element.options.length; i++) {
        if (element.options[i].value == id) {
            element.options[i].selected = true;
            break;
        }
    }
}

/**
 * Reset combobox
 * @param {any} eid Element ID
 */
function resetSelectBoxById(eid) {
    document.getElementById(eid).options[0].selected = 'selected';
}

/**
 * Remove combobox values
 * @param {any} selectbox
 */
function removeOptions(selectbox) {
    for (var i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
    }
}

// Save
function saveChanges() {
    // get save button value
    var val = document.getElementById("saveButton").value;
    // get ward id
    var WardID = document.getElementById("cmbWard").value;
    // get district id
    var DistrictID = document.getElementById("cmbDistrict").value;
    // get city id
    var CityID = document.getElementById("cmbCity").value;
    // get shop name
    var Name = document.getElementById("shopName").value;
    // get detail address
    var DetailAddress = document.getElementById("detailAddress").value;
    // get description
    var Description = document.getElementById("description").value;
    // get ward name
    var WardName = document.getElementById('cmbWard').options[document.getElementById('cmbWard').selectedIndex].textContent;
    // get district name
    var DistrictName = document.getElementById('cmbDistrict').options[document.getElementById('cmbDistrict').selectedIndex].textContent;
    // get city name
    var CityName = document.getElementById('cmbCity').options[document.getElementById('cmbCity').selectedIndex].textContent;

    /// ADD
    if (val == 'Add') {
        // create shop object
        var shop = {
            Name: Name,
            DetailAddress: DetailAddress,
            WardID: WardID,
            Description: Description
        };
        // ajax
        $.ajax({
            type: "POST",
            async: false,
            url: "/Shop/AddShop",
            data: JSON.stringify({ shop: shop }),
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (response) {
                if (response != '0') {             
                    // push shop information to list
                    lst.push({
                        "No": lst.length + 1,
                        "ID": response,
                        "Name": Name,
                        "DetailAddress": DetailAddress,
                        "Ward": WardName,
                        "District": DistrictName,
                        "City": CityName,
                        "Description": Description,
                        "WardID": WardID,
                        "DistrictID": DistrictID,
                        "CityID": CityID
                    });

                    // render pagination and load page
                    paging.insertData();

                    // hide modal
                    $('#addShopModal').modal('hide');

                } else {
                    alert("Cannot add new shop. Please try again later!");
                }
            },
            failure: function () {
                alert("Fail");
            },
            error: function () {
                alert("Error");
            }
        });
        // UPDATE
    } else if (val == 'Update') {
        // get shop id
        var ID = currentRow.cells[1].innerHTML;
        // create shop object
        var shop = {
            ID: ID,
            Name: Name,
            DetailAddress: DetailAddress,
            WardID: WardID,
            Description: Description
        };
        // ajax
        $.ajax({
            type: "POST",
            async: false,
            url: "/Shop/UpdateShop",
            data: JSON.stringify({ shop: shop }),
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (response) {
                if (response == '1') {
                    // get index
                    var index = paging.list.findIndex(i => i.ID == ID);

                    // update object
                    paging.list[index].Name = Name;
                    paging.list[index].DetailAddress = DetailAddress;
                    paging.list[index].Ward = WardName;
                    paging.list[index].District = DistrictName;
                    paging.list[index].City = CityName;
                    paging.list[index].Description = Description;
                    paging.list[index].WardID = WardID;
                    paging.list[index].DistrictID = DistrictID;
                    paging.list[index].CityID = CityID;

                    // render pagination and load page
                    paging.updateData(index);
                    // hide modal
                    $('#addShopModal').modal('hide');
                } else {
                    alert("Cannot update this shop. Please try again later!");
                }
            },
            failure: function () {
                alert("Fail");
            },
            error: function () {
                alert("Error");
            }
        });
    }
}

// Trigger delete
function triggerDelete(deleteButton) {
    currentRow = deleteButton.parentNode.parentNode.parentNode;
}
// Delete
function DeleteShop() {
    // get id
    var ID = currentRow.cells[1].innerHTML;
    // ajax
    $.ajax({
        type: "POST",
        async: false,
        url: "/Shop/DeleteShop",
        data: JSON.stringify({ ID: ID }),
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (response) {
            if (response == '1') {
                // render pagination and load page
                paging.removeData(ID);
            } else {
                alert("Cannot delete this shop. Please try again later!");
            }
            $('#deleteShopModal').modal('hide');
        },
        failure: function () {
            alert("Fail");
        },
        error: function () {
            alert("Error");
        }
    });
}

/**
 * set advanced search events
 */
function advancedSearchEvents() {
    // get expand button 
    var button = document.getElementsByClassName('btn-advanced-search-expand')[0];
    // set expand button event
    button.addEventListener('click', function () {
        var $div = $('.advanced-search');
        if ($div.is(":hidden")) {
            $div.slideDown("slow");
            button.innerHTML = '<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>'
        } else {
            $div.slideUp("slow");
            button.innerHTML = '<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>';
        }

    });

    // get advanced search button
    var buttonSearch = document.getElementsByClassName('btn-advanced-search')[0];
    // set advanced search button event
    buttonSearch.addEventListener('click', function () {
        advancedSearch();
    });
}

/**
 * address events
 */
function wardDistrictCity() {
    // get address div
    var div = document.getElementsByClassName('ward-district-city');
    var city, district, ward, selectCity, selectDistrict;
    // set events
    for (i = 0; i < div.length; i++) {
        city = div[i].getElementsByClassName('city')[0];
        district = div[i].getElementsByClassName('district')[0];
        ward = div[i].getElementsByClassName('ward')[0];
        selectCity = city.getElementsByTagName('select')[0];
        selectDistrict = district.getElementsByTagName('select')[0];
        selectDistrict.setAttribute('onchange', 'loadWard(' + i + ')');
        selectCity.setAttribute('onchange', 'onChangeCity(' + i + ')');
    }
}

/// on change city event
function onChangeCity(i) {
    // load district
    loadDistrict(i);
    var selectDistrict = document.getElementsByClassName('ward-district-city')[i].getElementsByClassName('district')[0].getElementsByTagName('select')[0];
    selectDistrict.onchange();
}


/**
 * advanced search
 */
function advancedSearch() {
    // get inputs
    var inputs = document.getElementsByClassName('advanced-search-data')[0].getElementsByTagName('input');
    // get address
    var wdc = document.getElementsByClassName('advanced-search-cmb')[0].getElementsByTagName('select');
    // get shop name
    var name = inputs[0].value;
    // get detail address
    var detailAddress = inputs[1].value;
    // get description
    var description = inputs[2].value;
    // get address value (id)
    var city, district, ward, cityValue, districtValue, wardValue, index;
    cityValue = wdc[0].value;
    districtValue = (cityValue === '') ? '' : wdc[1].value;
    wardValue = (districtValue === '') ? '' : wdc[2].value;

    // set search list
    searchList = [];
    if (name !== ''
        || detailAddress !== ''
        || description !== ''
        || city !== ''
        || district !== ''
        || ward !== '') {
        
        lst.forEach(function (item) {
            if ((item.Name.search(name) !== -1)
                && (item.DetailAddress.search(detailAddress) !== -1)
                && (item.WardID == wardValue || wardValue === '')
                && (item.DistrictID == districtValue || districtValue === '')
                && (item.CityID == cityValue || cityValue === '')
                && (item.Description.search(description) !== -1)) {
                // push result to search list
                searchList.push(item);
            }
        })
        // render pagination and load page
        paging.list = searchList;
        paging.goToPage(1);
    } else {
        if (lst.length !== paging.list.length) {
            paging.list = lst;
            paging.goToPage(1);
        }
    }
}

//helper

function showBasicHelper(element) {
    if (element.style.display !== 'active') {
        element.classList.toggle('active');
        var li = document.getElementsByClassName('helper-tab')[0].getElementsByTagName('li')[1];
        li.classList.toggle('active');

        var divBasic = document.getElementsByClassName('shop-helper-basic')[0];
        divBasic.style.display = "block";

        var divAdvanced = document.getElementsByClassName('shop-helper-advanced-search')[0];
        divAdvanced.style.display = "none";
    }
}

function showAdvancedSearchHelper(element) {
    if (element.style.display !== 'active') {
        element.classList.toggle('active');
        var li = document.getElementsByClassName('helper-tab')[0].getElementsByTagName('li')[0];
        li.classList.toggle('active');

        var divBasic = document.getElementsByClassName('shop-helper-advanced-search')[0];
        divBasic.style.display = "block";

        var divAdvanced = document.getElementsByClassName('shop-helper-basic')[0];
        divAdvanced.style.display = "none";
    }
}

/// Recover deleted shop
function createRecoverShopRow(shop) {
    var body = document.getElementById('shopTableBody');
    var string = '<tr id="recoverRow" class="warning"><td colspan="8">Click <a id="recoverShop" href="#">here</a> to recover deleted shop. (Shop: ' + shop.Name + ')</td></tr>';
    body.innerHTML = string + body.innerHTML;
    document.getElementById('recoverRow').style.textAlign = "center";
    document.getElementById('recoverShop').addEventListener('click', function () {
        recoverShop(shop);
    });
}

function recoverShop(shop) {
    // ajax
    $.ajax({
        type: "POST",
        async: false,
        url: "/Shop/RecoverShop",
        data: JSON.stringify({ ID: shop.ID }),
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (response) {
            if (response == '1') {
                // push shop information to list
                paging.recoverShop(shop);

                // render pagination and load page
            } else {
                alert("Cannot recover this shop. Please try again later!");
            }
        },
        failure: function () {
            alert("Fail");
        },
        error: function () {
            alert("Error");
        }
    });
}