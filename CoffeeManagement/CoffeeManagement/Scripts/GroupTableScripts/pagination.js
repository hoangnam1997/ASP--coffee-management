var paging;
var searchList = [];
function pagination(myList) {
    var pagin = {
        current: 1,
        pageSize: 5,
        list: [],
        $pagesContainer: $('.page-pagination').find('.pagination'),
        PREVIOUS_PAGE: -1,
        NEXT_PAGE: -2,
        FIRST_PAGE: -3,
        LAST_PAGE: -4,
        UNSORT: 'unsort',
        SORT_ASC: 'sort-asc',
        SORT_DESC: 'sort-desc',
        $currentSort: undefined,

        init: function () {
            // get List
            pagin.list = myList;
            // Render pagination
            document.getElementsByClassName('page-pagination')[0].innerHTML = pagin.getRenderedPager();
            pagin.$pagesContainer = $('.page-pagination').find('.pagination');
            // set pagination onclick event
            pagin.$pagesContainer.on("click", "li", pagin.onPageClick);
            // set change page size event
            $('.pagination-page-size').on("click", "li", pagin.changePageSize);
            // init sort
            pagin.initSort();
            // set sort event
            $('.table-sort-pagination thead tr th[data-sort="unsort"]').on("click", pagin.onSort);
            // set default sort column
            pagin.$currentSort = $('.table-sort-pagination thead tr th[data-sort-column="No"]');
            // populate data
            pagin.populateData();
            pagin.toggleDisable();
        },

        onPageClick: function () {
            var $p = $(this),
                page = $p.data('page');
            switch (page) {
                case pagin.PREVIOUS_PAGE:
                    pagin.goToPreviousPage();
                    break;
                case pagin.NEXT_PAGE:
                    pagin.goToNextPage();
                    break;
                case pagin.FIRST_PAGE:
                    pagin.goToFirstPage();
                    break;
                case pagin.LAST_PAGE:
                    pagin.goToLastPage();
                    break;
                default:
                    pagin.goToPage(page);
            }
            pagin.toggleDisable();
        },

        changePageSize: function () {
            var $p = $(this),
                size = $p.data('page-size');
            pagin.pageSize = size;
            pagin.goToPage(1);

            var text = $p.text() + ' <span class="caret" ></span >';
            $('#selectedDropdownItem').html(text);
        },

        toggleDisable: function () {
            var pagesCount = pagin.getPagesCount();
            pagin.findByAttribute(pagin.PREVIOUS_PAGE).classList.toggle('disabled', pagin.current == 1);
            pagin.findByAttribute(pagin.NEXT_PAGE).classList.toggle('disabled', pagin.current == pagesCount);
            pagin.findByAttribute(pagin.FIRST_PAGE).classList.toggle('disabled', pagin.current == 1);
            pagin.findByAttribute(pagin.LAST_PAGE).classList.toggle('disabled', pagin.current == pagesCount);
        },

        getLIs: function () {
            return document.getElementsByClassName('pagination')[0].getElementsByTagName('li');
        },

        getRenderedPager: function () {
            return '<ul class="pagination" style="margin: 0;">' + pagin.getRenderedPageNumbers() + '</ul>';
        },

        reRenderPageNumbers: function () {
            pagin.$pagesContainer.html(pagin.getRenderedPageNumbers());
        },

        getRenderedPageNumbers: function () {
            var pageNumbers = pagin.getPageNumbersToDisplay()
            result = "";

            result += '<li data-page="' + pagin.FIRST_PAGE + '"><a href="#"><span class="glyphicon glyphicon-backward" aria-hidden="true"></span></a></li>' +
                '<li data-page="' + pagin.PREVIOUS_PAGE + '"><a href="#"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></a></li>';

            for (i = 0; i < pageNumbers.length; i++) {
                var p = pageNumbers[i];
                result += '<li data-page="' + p + '" ' + (p == pagin.current ? 'class="active"' : '') + '><a href="#">' + p + '</a></li>';
            }

            result += '<li data-page="' + pagin.NEXT_PAGE + '"><a href="#"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a></li>' +
                '<li data-page="' + pagin.LAST_PAGE + '"><a href="#"><span class="glyphicon glyphicon-forward" aria-hidden="true"></span></a></li>';

            return result;
        },

        getPageNumbersToDisplay: function () {
            var pageNumbers = [],
                startFromNumber,
                pageToShow = 5,
                i = 1,
                pagesCount = pagin.getPagesCount();

            if (pagesCount < 5) {
                pageToShow = pagesCount;
            }
            if (pagin.current === 1 || pagin.current === 2) {
                startFromNumber = 1;
            } else if (pagin.current === pagesCount) {
                startFromNumber = pagin.current - (pageToShow - 1);
            } else if (pagesCount - pagin.current === 1 && pagesCount >= 5) {
                startFromNumber = pagin.current - 3;
            } else {
                startFromNumber = pagin.current - 2;
            }
            while (i <= pageToShow) {
                pageNumbers.push(startFromNumber++);
                i++;
            }
            return pageNumbers;
        },

        goToPreviousPage: function () {
            if (pagin.current > 1) {
                pagin.current--;
                pagin.reRenderPageNumbers();
                pagin.populateData();
            }
        },

        goToNextPage: function () {
            if (pagin.current < pagin.getPagesCount()) {
                pagin.current++;
                pagin.reRenderPageNumbers();
                pagin.populateData();
            }
        },

        goToFirstPage: function () {
            if (pagin.current !== 1) {
                pagin.goToPage(1);
            }
        },

        goToLastPage: function () {
            var pagesCount = pagin.getPagesCount();
            if (pagin.current !== pagesCount) {
                pagin.goToPage(pagesCount);
            }
        },

        goToPage: function (pageNumber) {
            pagin.current = pageNumber;
            pagin.reRenderPageNumbers();
            pagin.populateData();
        },

        getPagesCount: function () {
            return Math.ceil(pagin.list.length / pagin.pageSize);
        },

        findByAttribute: function (value) {
            var all = pagin.getLIs();
            for (i = 0; i < all.length; i++) {
                if (all[i].dataset.page == value) {
                    return all[i];
                }
            }
        },

        populateData: function () {
            var length = pagin.list.length;
            var body = document.getElementsByClassName('table-pagination')[0].getElementsByTagName('tbody')[0];
            var start, end;
            body.innerHTML = "";
            start = (pagin.current - 1) * pagin.pageSize;
            end = (start + pagin.pageSize >= length) ? (length) : (start + pagin.pageSize);
            for (i = start; i < end; i++) 
                {
                body.innerHTML += addRow(
                    pagin.list[i].No,
                    pagin.list[i].ID,
                    pagin.list[i].Name,
                    pagin.list[i].Description,
                    pagin.list[i].Surcharge
                );
            }
        },
        
        insertData: function () {
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

        updateData: function (index) {
            var page = Math.ceil((index + 1) / pagin.pageSize);
            pagin.goToPage(page);
        },

        removeData: function (ID) {
            var index = lst.findIndex(i => i.ID == ID);
            var no = lst[index].No;
            
            if (pagin.list === searchList) {
                alert('here');
                lst.splice(index, 1);
            }
            index = pagin.list.findIndex(i => i.ID == ID);
            pagin.list.splice(index, 1);
            for (i = 0; i < lst.length; i++) {
                if (lst[i].No > no) {
                    lst[i].No--;
                }
            }
            if (pagin.current === pagin.getPagesCount() + 1) {
                if (pagin.current === 1) {
                    pagin.goToPage(1);
                } else {
                    pagin.goToPreviousPage();
                }
            } else {
                pagin.populateData();
            }
        },

        initSort: function () {
            var ths = document.getElementsByClassName('table-sort-pagination')[0]
                .getElementsByTagName('th');
            for (i = 0; i < ths.length; i++) {
                if (ths[i].hasAttribute('data-sort-column')) {
                    ths[i].setAttribute('data-sort', pagin.UNSORT);
                    ths[i].innerHTML += '<i class="unsort"></i>';
                }
            }
        },

        onSort: function () {
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

        sortAscending: function (column) {
            pagin.list.sort(function (a, b) {
                if (column != 'No' && column != "Surcharge") {
                    return a[column].localeCompare(b[column]);
                } else {
                    return a[column] - b[column];
                }
            });
        },

        sortDescending: function (column) {
            pagin.list.sort(function (a, b) {
                if (column != 'No' && column != "Surcharge") {
                    return b[column].localeCompare(a[column]);
                } else {
                    return b[column] - a[column];
                }
            });
        }

    }

    return pagin;
}

function addRow(counter, GroupTableID, CellName, CellDescription, CellSurcharge) {
    var s = "";
    s = "<tr>";
    s += "<td title='" + GroupTableID + "'>" + counter + "</td>";
    s += "<td>" + CellName + "</td>";
    s += "<td>" + CellDescription + "</td>";
    s += "<td>" + CellSurcharge + "</td>";
    s += "<td><button type='button' class='btn btn-info' data-toggle='modal' data-target='#myModal' onclick='TakeInfo(this);'><i class='glyphicon glyphicon-edit' style='width:30px'></i></button>";
    s += " <button type='button' class='btn btn-danger' onclick='DeleteRow(this);'><i class='glyphicon glyphicon-remove-circle' style='width:30px'></i></button></td>";
    s += "</tr>";
    return s;
}

function createPagination() {
    paging = new pagination(lst);
    paging.init();
}

function searchPagination() {
    var div = document.getElementsByClassName('search-pagination')[0];
    var text = div.getElementsByTagName('input')[0].value.toLowerCase();
    searchList = [];
    if (text !== '') {
        lst.forEach(function (item) {
            if ((item.ID.toString().toLowerCase().search(text) !== -1)
                || (item.Name.toLowerCase().search(text) !== -1)
                || (item.Description.toLowerCase().search(text) !== -1)
                || (item.Surcharge.toLowerCase().search(text) !== -1)) {
                searchList.push(item);
            }
        })

        paging.list = searchList;
        paging.goToPage(1);
    } else {
        if (lst.length !== paging.list.length) {
            paging.list = lst;
            paging.goToPage(1);
        }
    }
}

