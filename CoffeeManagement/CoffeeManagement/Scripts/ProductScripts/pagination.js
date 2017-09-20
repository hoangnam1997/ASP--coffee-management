var paging;     
var searchList = [];
// Pagination Lst
function pagination(myList) {
    var pagin = {                                                               // Create Pagination Object
        current: 1,                                                             // Current Page
        pageSize: 5,                                                            // Item Per Page
        list: [],                                                               // Lst
        $pagesContainer: $('.page-pagination').find('.pagination'),             // Pagination Control
        PREVIOUS_PAGE: -1,                                                      // Prev
        NEXT_PAGE: -2,                                                          // Next
        FIRST_PAGE: -3,                                                         // First
        LAST_PAGE: -4,                                                          // Last
        UNSORT: 'unsort',                                                       // Sort - UNSORT
        SORT_ASC: 'sort-asc',                                                   // Sort - ASC
        SORT_DESC: 'sort-desc',                                                 // Sort - DESC
        $currentSort: undefined,                                                // Current Sort Column
        init: function () {                                                     // Init Function
            // Get List
            pagin.list = myList;
            // Render Pagination
            document.getElementsByClassName('page-pagination')[0].innerHTML = pagin.getRenderedPager();
            pagin.$pagesContainer = $('.page-pagination').find('.pagination');
            // Set Pagination OnClick Event
            pagin.$pagesContainer.on("click", "li", pagin.onPageClick);
            // Set Change Page Size Event
            $('.pagination-page-size').on("click", "li", pagin.changePageSize);
            // Init Sort
            pagin.initSort();
            // Set Sort Event
            $('.table-sort-pagination thead tr th[data-sort="unsort"]').on("click", pagin.onSort);
            // Set Default Sort Column
            pagin.$currentSort = $('.table-sort-pagination thead tr th[data-sort-column="No"]');
            // Populate Data
            pagin.populateData();
            // Disable Control
            pagin.toggleDisable();
        },
        // OnPage Click Event
        onPageClick: function () {
            var $p = $(this),
                page = $p.data('page');                         // Check Page
            switch (page) {                                     
                case pagin.PREVIOUS_PAGE:                       // Prev Page
                    pagin.goToPreviousPage();
                    break;
                case pagin.NEXT_PAGE:                           // Next Page
                    pagin.goToNextPage();
                    break;
                case pagin.FIRST_PAGE:                          // First Page
                    pagin.goToFirstPage();
                    break;
                case pagin.LAST_PAGE:                           // Last Page
                    pagin.goToLastPage();
                    break;
                default:                                        // Go To Page Number
                    pagin.goToPage(page);                       
            }
            
        },
        //Chage display number product
        changePageSize: function () {                           // Change PageSize
            var $p = $(this),
                size = $p.data('page-size');
            pagin.pageSize = size;                              
            pagin.goToPage(1);                                  // Go To Page 1 
            var text = $p.text() + ' <span class="caret" ></span >';
            $('#selectedDropdownItem').html(text);              // Change Control Show Entities
        },
        // Disabled Page
        toggleDisable: function () {                            // Disable Control Button Pagination
            var pagesCount = pagin.getPagesCount();
            pagin.findByAttribute(pagin.PREVIOUS_PAGE).classList.toggle('disabled', pagin.current == 1);
            pagin.findByAttribute(pagin.NEXT_PAGE).classList.toggle('disabled', pagin.current == pagesCount);
            pagin.findByAttribute(pagin.FIRST_PAGE).classList.toggle('disabled', pagin.current == 1);
            pagin.findByAttribute(pagin.LAST_PAGE).classList.toggle('disabled', pagin.current == pagesCount);
        },

        getLIs: function () {                                   // Get Lst
            return document.getElementsByClassName('pagination')[0].getElementsByTagName('li');
        },

        getRenderedPager: function () {                         // Get RenderedPager
            return '<ul class="pagination" style="margin: 0;">' + pagin.getRenderedPageNumbers() + '</ul>';
        },

        reRenderPageNumbers: function () {                      // Re RenderPageNumber
            pagin.$pagesContainer.html(pagin.getRenderedPageNumbers());
        },

        getRenderedPageNumbers: function () {                   // Get Render Page Numbers
            var pageNumbers = pagin.getPageNumbersToDisplay()
            result = "";

            result += '<li data-page="' + pagin.FIRST_PAGE + '"><a href="javascipt:void(0)"><span class="glyphicon glyphicon-backward" aria-hidden="true"></span></a></li>' +
                '<li data-page="' + pagin.PREVIOUS_PAGE + '"><a href="javascipt:void(0)"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></a></li>';

            for (i = 0; i < pageNumbers.length; i++) {
                var p = pageNumbers[i];
                result += '<li data-page="' + p + '" ' + (p == pagin.current ? 'class="active"' : '') + '><a href="javascipt:void(0)">' + p + '</a></li>';
            }

            result += '<li data-page="' + pagin.NEXT_PAGE + '"><a href="javascipt:void(0)"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a></li>' +
                '<li data-page="' + pagin.LAST_PAGE + '"><a href="javascipt:void(0)"><span class="glyphicon glyphicon-forward" aria-hidden="true"></span></a></li>';

            return result;
        },
        // 
        getPageNumbersToDisplay: function () {                  // Get Page Number To Display
            var pageNumbers = [],                               // Page Number
                startFromNumber,                                // Start
                pageToShow = 5,                                 // pageToShow
                i = 1,
                pagesCount = pagin.getPagesCount();             // Page Count

            if (pagesCount < 5) {
                pageToShow = pagesCount;
            }
                                                                    
            if (pagin.current === 1 || pagin.current === 2) {   // Page Check 
                startFromNumber = 1;
            } else if (pagin.current === pagesCount) {          // Check current Page  = pageCount
                startFromNumber = pagin.current - (pageToShow - 1);
            } else if (pagesCount - pagin.current === 1 && pagesCount >= 5) {
                startFromNumber = pagin.current - 3;
            } else {
                startFromNumber = pagin.current - 2;
            }
            while (i <= pageToShow) {                           // Check PageNumber
                pageNumbers.push(startFromNumber++);            // Push to Array Page Number
                i++;
            }
            return pageNumbers;                                 // Return Array
        },

        goToPreviousPage: function () {                         // Go Prev Page
            if (pagin.current > 1) {
                pagin.current--;
                pagin.reRenderPageNumbers();
                pagin.populateData();
                pagin.toggleDisable();
            }
        },

        goToNextPage: function () {                             // Go Next Page
            if (pagin.current < pagin.getPagesCount()) {
                pagin.current++;
                pagin.reRenderPageNumbers();
                pagin.populateData();
                pagin.toggleDisable();
            }
        },

        goToFirstPage: function () {                            // Go First Page
            if (pagin.current !== 1) {
                pagin.goToPage(1);
            }
        },

        goToLastPage: function () {                             // Go Last Page
            var pagesCount = pagin.getPagesCount();
            if (pagin.current !== pagesCount) {
                pagin.goToPage(pagesCount);
            }
        },

        goToPage: function (pageNumber) {                       // Go To Page
            pagin.current = pageNumber;
            pagin.reRenderPageNumbers();
            pagin.populateData();
            pagin.toggleDisable();
        },

        getPagesCount: function () {                            // Get Page Count
            return Math.ceil(pagin.list.length / pagin.pageSize);
        },

        findByAttribute: function (value) {                     // Find By Page Number
            var all = pagin.getLIs();
            for (i = 0; i < all.length; i++) {
                if (all[i].dataset.page == value) {
                    return all[i];
                }
            }
        },
        // 
        populateData: function () {                             // Put Data Into Table
            var length = pagin.list.length;
            var body = document.getElementsByClassName('table-pagination')[0].getElementsByTagName('tbody')[0];
            var start, end;
            body.innerHTML = "";
            start = (pagin.current - 1) * pagin.pageSize;
            end = (start + pagin.pageSize >= length) ? (length) : (start + pagin.pageSize);
            for (i = start; i < end; i++) {
                body.innerHTML += addRow(
                    pagin.list[i].No,
                    pagin.list[i].ID,
                    pagin.list[i].Name,
                    pagin.list[i].ProductCategory,
                    pagin.list[i].UnitPrice,
                    pagin.list[i].Discount,
                    pagin.list[i].Image,
                    pagin.list[i].Description,
                    pagin.list[i].Startday,
                    pagin.list[i].Endday
                );
            }
        },
        
        insertData: function () {                               // Insert Data After Ajax 
            pagin.list = lst;
            var ID = pagin.list[pagin.list.length - 1].ID;
            if (pagin.$currentSort.attr('data-sort') == 'sort-desc') {
                pagin.sortDescending(pagin.$currentSort.data('sort-column'));
            } else {
                pagin.sortAscending(pagin.$currentSort.data('sort-column'));
            }
            var index = lst.findIndex(i => i.ID == ID);
            var page = Math.ceil((index + 1) / pagin.pageSize);
            pagin.goToPage(page);
        },

        updateData: function (index) {                          // Update Data After Ajax
            var page = Math.ceil((index + 1) / pagin.pageSize);
            pagin.goToPage(page);
        },

        removeData: function (ID) {                             // Remove Data By ID
            var index = lst.findIndex(i => i.ID == ID);
            var no = lst[index].No;
            
            if (pagin.list === searchList) {
                alert('here');
                lst.splice(index, 1);
            }
            index = pagin.list.findIndex(i => i.ID == ID);
            pagin.list.splice(index, 1);
            for (i = 0; i < lst.length; i++) {                  // Update No 
                if (lst[i].No > no) {
                    lst[i].No--;
                }
            }
            if (pagin.current === pagin.getPagesCount() + 1) {      // Go Page
                if (pagin.current === 1) {
                    pagin.goToPage(1);
                } else {
                    pagin.goToPreviousPage();
                }
            } else {
                pagin.populateData();
            }
        },

        initSort: function () {                                                                 // Init Sort
            var ths = document.getElementsByClassName('table-sort-pagination')[0]
                .getElementsByTagName('th');
            for (i = 0; i < ths.length; i++) {
                if (ths[i].hasAttribute('data-sort-column')) {
                    ths[i].setAttribute('data-sort', pagin.UNSORT);
                    ths[i].innerHTML += '<i class="unsort"></i>';
                }
            }
        },

        onSort: function () {                                                                   // OnSort Event
            var $th = $(this),
                sort = $th.attr('data-sort'),
                column = $th.data('sort-column');
            switch (sort) {
                case pagin.UNSORT:
                    $th.find('i').toggleClass(pagin.SORT_ASC);
                    $th.find('i').toggleClass(pagin.UNSORT);
                    $th.attr('data-sort', pagin.SORT_ASC);
                    if (column !== pagin.$currentSort.data('sort-column')) {
                        pagin.$currentSort.find('i').removeClass(pagin.SORT_ASC);
                        pagin.$currentSort.find('i').removeClass(pagin.SORT_DESC);
                        pagin.$currentSort.find('i').addClass(pagin.UNSORT);
                        pagin.$currentSort.attr('data-sort', pagin.UNSORT);
                    }
                    pagin.sortAscending(column);
                    break;
                case pagin.SORT_ASC:
                    $th.find('i').toggleClass(pagin.SORT_ASC);
                    $th.find('i').toggleClass(pagin.SORT_DESC);
                    $th.attr('data-sort', pagin.SORT_DESC);
                    pagin.sortDescending(column);
                    break;
                default:
                    $th.find('i').toggleClass(pagin.SORT_ASC);
                    $th.find('i').toggleClass(pagin.SORT_DESC);
                    $th.attr('data-sort', pagin.SORT_ASC);
                    pagin.sortAscending(column);
            }
            pagin.$currentSort = $th;
            pagin.goToPage(1);

        },

        sortAscending: function (column) {                                              // Sort ASC
            pagin.list.sort(function (a, b) {
                if (column == 'Discount' || column == 'No' || column == 'UnitPrice')
                    return Number(a[column]) - Number(b[column]);
                else if (column == 'Startday' || column == 'Endday') {
                    return new Date(a[column]).getTime() - new Date(b[column]).getTime();
                } else {
                    return a[column].localeCompare(b[column]);
                }
            });
        },

        sortDescending: function (column) {                                             // Sort DESC
            pagin.list.sort(function (a, b) {
                //if (column != 'No' && column != "UnitPrice" && column != "Discount") {
                //    return b[column].localeCompare(a[column]);
                //} else {
                //    return b[column] - a[column];
                //}  
                    if(column == 'Discount' || column == 'No' || column == 'UnitPrice')
                        return Number(b[column]) - Number(a[column]);
                    else if (column == 'Startday' || column == 'Endday') {
                        return new Date(b[column]).getTime() - new Date(a[column]).getTime();
                    } else {
                        return b[column].localeCompare(a[column]);
                    }

                }
            );
        }

    }

    return pagin;
}
// AddRow
function addRow(counter, ID, Name, ProductCategory, UnitPrice, Discount, Image, Description, Startday, Endday) {
    var string = "";
    string = "<tr>";
    string += "<td>" + counter + "</td>";
    string += "<td hidden>" + ID + "</td>";
    string += "<td>" + Name + "</td>";
    string += "<td>" + ProductCategory + "</td>";
    string += "<td>" + '<img src="../../Images/' + Image + '" width="200" height="150" />' + "</td>";
    string += "<td>" + UnitPrice + "</td>";
    string += "<td>" + Discount + "</td>";
    string += "<td>" + Description + "</td>";
    string += "<td>" + Startday + "</td>";
    string += "<td>" + Endday + "</td>";
    string += "<td>";
    string += '<div class="btn-group" role="group" aria-label="...">';
    string += "<button  class='btn btn-info' data-toggle='modal'  data-target='#modal_update' aria-label='Left Align'  onclick='LoadInfo(this);' ><span class='glyphicon glyphicon-edit' aria-hidden='true' style='width:20px'></span></button> <button class='btn btn-danger' data-toggle='modal'  data-target='#modal_delete' onclick='DeleteRow(this);'> <span class='glyphicon glyphicon-remove-sign' aria-hidden='true' style='width:20px'></span></button>";
    string += "</div>";
    string += "</td>";
    string += "</tr>";
    return string;
}
// Create Pagination
function createPagination() {
    paging = new pagination(lst);
    paging.init();
}
// Search And Pagination
function searchPagination() {
    var div = document.getElementsByClassName('search-pagination')[0];
    var text = div.getElementsByTagName('input')[0].value.removeMark();
    searchList = [];
    if (text !== '') {
        lst.forEach(function (item) {
            if ((item.ID.toString().search(text) !== -1)
                || (item.Name.removeMark().search(text) !== -1)
                || (item.ProductCategory.removeMark().search(text) !== -1)
                || (item.UnitPrice.removeMark().search(text) !== -1)
                || (item.Discount.removeMark().search(text) !== -1)
                || (item.Description.removeMark().search(text) !== -1)) {
                searchList.push(item);
            }
        });
        paging.list = searchList;
        paging.goToPage(1);
    } else {
        if (lst.length !== paging.list.length) {
            paging.list = lst;
            paging.goToPage(1);
        }
    }
}
// Remove Mark In String
String.prototype.removeMark = function () {
    var str = this + '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
}
