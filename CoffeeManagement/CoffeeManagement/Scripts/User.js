
// javascript function show detail of a customer
function DetailPopup(header, id) {
    // Get the popup
    var popup = document.getElementById('myDetailPopup');
    // Get the <span> element that closes the popup
    var span = document.getElementById("span-close-detail");

    //var btn = ducument.getElementById("btn-cancel-detail")

    // Get the <div> header
    var a = document.getElementById('hd-popup-content-detail');
    // Get the <span> content

    a.innerText = header;
    
    popup.style.display = "block";

    $.ajax(
    {
        type: 'POST',
        url: '/User/Detail?id=' + id,
        success: function (result) {
            $('#DetailPopup').html(result);
        },
        error: function () {
            alert('load fail');
        }
    });

    span.onclick = function () {
        popup.style.display = "none";
    }
}

// javascript function for remove a customer out of a shop
function DeletePopup(header, shopUserid) {
    // Get the popup
    var popup = document.getElementById('myDeletePopup');
    // Get the <span> element that closes the popup
    var span = document.getElementById("span-close-delete");

    var btn = document.getElementById('btn-cancel-delete');
    // Get the <div> header
    var a = document.getElementById('hd-popup-content-delete');
    // Get the <span> content
    var b = document.getElementById('bd-popup-content-delete');

    a.innerText = header;
    b.innerText = 'Do you wanna delete this customer?';

    popup.style.display = "block";
    // When the user clicks on <span> (x), close the popup
    span.onclick = function () {
        popup.style.display = "none";
    }
    btn.onclick = function () {
        popup.style.display = "none";
    }

    function handler() {
        $.ajax(
        {
            type: 'POST',
            url: '/User/Removed?shopUserId=' + shopUserid,
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.res == true) {
                    alert("remove successful");
                    GetListUser();
                } else {
                    alert("remove fail");
                }
                
            },
            error: function () {
                alert("remove fail");
            }
        });
        popup.style.display = "none";
        $('#btn-ok-delete').unbind('click', handler);
    }

    $('#btn-ok-delete').bind('click', handler);
}

// javascript fucntion for update a user in to be a customer
function UpdatePopup(header, id, shopid) {
    // Get the popup
    var popup = document.getElementById('myUpdatePopup');
    // Get the <span> element that closes the popup
    var span = document.getElementById("span-close-update");

    var btn = document.getElementById('btn-cancel-update');
    // Get the <div> header
    var a = document.getElementById('hd-popup-content-update');
    // Get the <span> content
    var b = document.getElementById('bd-popup-content-update');

    a.innerText = header;
    b.innerText = 'Do you wanna update this user into be a customer?';

    popup.style.display = "block";
    // When the user clicks on <span> (x), close the popup
    span.onclick = function () {
        popup.style.display = "none";
    }
    btn.onclick = function () {
        popup.style.display = "none";
    }

    function handler() {
        $.ajax(
        {
            type: 'POST',
            url: '/User/Deleted?id=' + id,
            success: function () {
                alert("delete successful");
                GetListUser();
            },
            error: function () {
                alert("delete fail");
            }
        });
        popup.style.display = "none";
        $('#btn-ok-delete').unbind('click', handler);
    }

    $('#btn-ok-delete').bind('click', handler);
}

// javascript function for edit infor for a customer
function EditPopup(element, header, id) {
    // Get the popup
    var popup = document.getElementById('myPopup');
    // Get the <span> element that closes the popup
    var span = document.getElementById("span-close-popup");

    // Get the <div> header
    var a = document.getElementById('hd-popup-content');
    // Get the <span> content

    a.innerText = header;

    popup.style.display = "block";

    $.ajax(
    {
        type: 'POST',
        url: '/User/Edit?id=' + id,
        success: function (result) {
            $('#UserPopup').html(result);
            $('#btn-cancel-edit').click(function () {
                popup.style.display = "none";
            });
            $('#btn-ok-edit').bind('click', handler);
        },
        error: function () {
            alert('load fail');
        }
    });


    span.onclick = function () {
        popup.style.display = "none";
    }

    function handler() {
        if (!validateEdit()) {
            return;
        }

        var user = {
            ID: id,
            Name: $('#NameUserEdit').val(),
            Identity: $('#IdentityUserEdit').val(),
            Email: $('#EmailUserEdit').val(),
            WardID: $('#WardIDUser').val(),
            DetailAddress: $('#DetailAddressUserEdit').val(),
            PhoneNumber: $('#PhoneNumberUserEdit').val(),
            BirthDay: $('#BirthDayUserEdit').val(),
            Sex: $('#SexUserEdit').val(),
            Description: $('#DescriptionUserEdit').val(),

        };
        $.ajax(
        {
            type: 'POST',
            url: '/User/Edited',
            data: user,
            processData: true,
            success: function (result) {
                alert("edit successful");
                var a = $(element).parent().parent().find('td');
                $(a[0]).text(result.Name);
                $(a[1]).text(result.Email);
                $(a[2]).text(result.Sex);
                $(a[3]).text(result.BirthDay);
                $(a[4]).text(result.PhoneNumber);             
            },
            error: function () {
                alert("edit fail");
            }
        });
        popup.style.display = "none";
        $('#btn-ok-edit').unbind('click', handler);
    }

}

// javascript function for add a customer to a shop
function CreatePopup(header) {
    // Get the popup
    var popup = document.getElementById('myPopup');
    // Get the <span> element that closes the popup
    var span = document.getElementById("span-close-popup");
    // Get the <div> header
    var a = document.getElementById('hd-popup-content');
    // Get the <span> content

    a.innerText = header;

    popup.style.display = "block";

    $.ajax(
    {
        type: 'POST',
        url: '/User/Create',
        cache: false,
        success: function (result) {
            $('#UserPopup').html(result);
            $('#btn-cancel-create').click(function () {
                popup.style.display = "none";
            });
            $('#btn-ok-create').bind('click', Handler);

        },
        error: function () {
            alert('load fail');
        }
    });

    span.onclick = function () {
        popup.style.display = "none";
    }

    function Handler() {

        if (!validateCreate()) {
            return;
        }

        var user = {
            Name: $('#NameUserCreate').val(),
            Password: $('#PasswordUserCreate').val(),
            Email: $('#EmailUserCreate').val(),
            WardID: $('#WardIDUser').val(),
            DetailAddress: $('#DetailAddressUserCreate').val(),
            PhoneNumber: $('#PhoneNumberUserCreate').val(),
            BirthDay: $('#BirthDayUserCreate').val(),
            Sex: $('#SexUserCreate').val()
        };

        $.ajax(
        {
            type: 'POST',
            url: '/Account/RegisterCustomer',
            data: user,
            dataType: 'json',
            cache: false,
            processData: true,
            success: function (data) {
                if (data.flag == true) {
                    alert("create successful");
                    GetListUser();
                } else {
                    alert("create not successful!\n The email is existed");
                }           
            },
            error: function () {
                alert("create fail");
            }
        });
        popup.style.display = "none";
    }

    $('#btn-ok-create').unbind('click', Handler);
}


function GetListUser() {
    $.ajax(
        {
            type: 'POST',
            url: '/User/ListUser',
            success: function (result) {
                $('#table-list').html(result);
            },
            error: function () {
                alert('load user fail');
            }
        });
}

function GetListDistrict() {
    $.ajax({
        type: 'POST',
        url: '/User/ListDistrict',
        data: {
            cityid: $('#City').val()
        },
        success: function (result) {
            $('#District').html(result)
        },
        error: function () {
            alert('load district fail');
        }
    });
}

function GetListWard() {
    $.ajax({
        type: 'post',
        url: '/User/ListWard',
        data: {
            districtid: $('#District').val()
        },
        success: function (result) {
            $('#WardIDUser').html(result);
        },
        error: function () {
            alert('load ward fail');
        }
    })
}

function Search() {
    $.ajax({
        type: 'post',
        url: '/User/Search',
        data: {
            searchString: $('#search-text').val()
        },
        success: function (result) {
            $('#table-list').html(result);
        },
        error: function () {
            alert('search fail');
        }
    });
}

function isMail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isPassword(pass) {
    var re = /^(?=.*[0-9])[a-zA-Z0-9!?#$%^&*]{8,25}$/;
    return re.test(pass);
}

function isEmpty(str) {
    return !str.replace(/^\s+/g, '').length;
}

function isPhoneNumber(phone) {
    var re = /^[0][0-9]{9,10}$/;
    return re.test(phone);
}

function isIdentity(cmnd) {
    var re = /^[0-9]{9}$/;
    var rec = /^[0-9]{12}$/;

    if (re.test(cmnd)) {
        return true;
    } else {
        if (rec.test(cmnd)) {
            return true;
        }
        return false;
    }
}

function isDate(date) {
    if (!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

function validateCreate() {
    var name = $('#NameUserCreate').val();
    var email = $("#EmailUserCreate").val();
    var phone = $('#PhoneNumberUserCreate').val();
    var birthday = $('#BirthDayUserCreate').val();
    var pass = $('#PasswordUserCreate').val();

    if (isEmpty(name)) {
        $('#NameUserCreate').css("border-color", "red");
        alert('the name can not empty');
        return false;
    }

    if (!isMail(email)) {
        $("#EmailUserCreate").css("border-color", "red");
        alert('the email is not valid');
        return false;
    }

    if (!isPassword(pass)) {
        $('#PasswordUserCreate').css("border-color", "red");
        alert('the password is 8-25 characters and has least 1 digit');
        return false;
    }

    if (!isPhoneNumber(phone)) {
        $('#PhoneNumberUserCreate').css("border-color", "red");
        alert('the phone number is 10-11 digits');
        return false;
    }

    if (birthday == '') {
        $('#BirthDayUserCreate').css("border-color", "red");
        alert('the birthday can not empty');
        return false;
    }

    var currentTime = new Date();
    var inputdate = new Date(birthday)
    if (currentTime.getFullYear() - inputdate.getFullYear() < 12 || currentTime.getFullYear() - inputdate.getFullYear() > 90) {
        $('#BirthDayUserCreate').css("border-color", "red");
        alert('the age must more than or equal 12');
        return false;
    }
    return true;
}

function validateEdit() {
    var name = $('#NameUserEdit').val();
    var email = $("#EmailUserEdit").val();
    var phone = $('#PhoneNumberUserEdit').val();
    var birthday = $('#BirthDayUserEdit').val();
    var identity = $('#IdentityUserEdit').val();

    if (isEmpty(name)) {
        $('#NameUserEdit').css("border-color", "red");
        alert('the name can not empty');
        return false;
    }

    if (!isMail(email)) {
        $("#EmailUserEdit").css("border-color", "red");
        alert('the email is not valid');
        return false;
    }

    if (!isPhoneNumber(phone)) {
        $('#PhoneNumberUserEdit').css("border-color", "red");
        alert('the phone number is 10-11 digits');
        return false;
    }

    if (!isIdentity(identity)) {
        $('#IdentityUserEdit').css("border-color", "red");
        alert('the identity is 9 or 12 digits')
        return false;
    }

    if (birthday == '') {
        $('#BirthDayUserEdit').css("border-color", "red");
        alert('the birthday can not empty');
        return false;
    }

    var currentTime = new Date();
    var inputdate = new Date(birthday)
    if (currentTime.getFullYear() - inputdate.getFullYear() < 12) {
        $('#BirthDayUserEdit').css("border-color", "red");
        alert('the age must more than or equal 12');
        return false;
    }

    return true;
}








