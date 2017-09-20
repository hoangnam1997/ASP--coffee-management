// KeyWord to Change

var arrLang = {
    'en_US.js': {
        'title': 'Shop management',
        'toggle': 'Toggle navigation',
        'order': 'Order',
        'product': 'Product',
        'product_category': 'Product Category',
        'shop': 'Shop',
        'account': 'Account',
        'search': 'Search',
        'id': 'ID',
        'name': 'Name',
        'description': 'Description',
        'created_by': 'Created by',
        'created_date': 'Created date',
        'vendor': 'Vendor',
        'action': 'Action',
        'no_results': 'No result',
        'add_title': 'Add Product Category',
        'add': 'Add',
        'products': 'Products',
        'close': 'Close',
        'del_title': 'Delete Product Category',
        'warning_del': 'Do you want to delete this category ?',
        'del_yes': 'Yes',
        'del_no': 'No',
        'updateButton': 'Update',
        'update_title': 'Update Product Category',
        'choose_language': 'Language',
        'key_word': 'Search for ...',
        'descriptionInput': 'Type product description ... ',
        'English': 'English',
        'Vietnamese': 'Vietnamese',
        'showEntities': 'Show Entities : ',
        '5_entities': '5 entities',
        '10_entities': '10 entities',
        '15_entities': '15 entities',
        '20_entities': '20 entities'
    },
    'vi_VN.js': {
        'title': 'Quản lý coffee',
        'toggle': 'Thu gọn',
        'order': 'Hóa đơn',
        'product': 'Sản phẩm',
        'product_category': 'Loại sản phẩm',
        'shop': 'Cửa hàng',
        'account': 'Tài khoản',
        'search': 'Tìm kiếm',
        'id': 'Mã số',
        'name': 'Tên sản phẩm',
        'description': 'Mô tả',
        'created_by': 'Tạo bởi',
        'created_date': 'Ngày tạo',
        'vendor': 'Nhà cung cấp',
        'action': 'Hành động',
        'no_results': 'Không tìm thấy kết quả nào phù hợp',
        'add_title': 'Thêm loại sản phẩm',
        'add': 'Thêm',
        'products': 'Số lượng',
        'close': 'Thoát',
        'del_title': 'Xóa loại sản phẩm',
        'warning_del': 'Bạn chắc chắn muốn xóa loại sản phẩm này ?',
        'del_yes': 'Xác nhận',
        'del_no': 'Thoát',
        'update_title': 'Cập nhật loại sản phẩm',
        'updateButton' : 'Cập nhật',
        'choose_language': 'Ngôn ngữ',
        'key_word': 'Từ khóa ...',
        'descriptionInput': 'Nhập mô tả loại sản phẩm ... ',
        'English': 'Tiếng Anh',
        'Vietnamese': 'Việt Nam',
        'showEntities': 'Số hàng : ',
        '5_entities': '5 hàng',
        '10_entities': '10 hàng',
        '15_entities': '15 hàng',
        '20_entities': '20 hàng'

    }
};


$(function(){
    // Change language 
    var val = $(".translate option:selected").val();
    $('.translate').change(function () {
        val = $(".translate option:selected").val();
        var URL = "/ProductCategory/ChangeLanguage";
        $.ajax(
            {
                url: URL,
                type: "POST",
                dataType: "text",
                data: { Language: val },
                success: function (data) {
                    var s = "Success";
                    if (s.localeCompare(data) == 0) {
                    }
                },
                error: function (err) {
                    alert("Fail");
                }
            });
        location.reload();
    });
    $('.lang').each(function (index, element) {
        $(this).text(arrLang[val][$(this).attr("key")])
    })
    $('.langInput').each(function (index, element) {
        $(this).attr('placeholder', arrLang[val][$(this).attr("key")]);
    })
})