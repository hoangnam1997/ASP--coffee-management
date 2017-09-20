//show dialog confirm
//<return>true is accept</return>
var Dialog = {
    closedEvent: function () { },
    Show: function (content, returnCallBack) {
        //assign callback when dialog close
        this.closedEvent = function (dialogResult) {
            $("#popup").html("");
            $("#popup").modal("hide");
            returnCallBack(dialogResult);
        }
        var formatContent = "<div class=\"modal-dialog\" role=\"document\">" +
            "<div class=\"modal-content\">" +
            "<div class=\"modal-header\">" +
            "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" onclick=\"closedEvent(false)\"><span aria-hidden=\"true\">&times;</span></button>" +
            "<h4 class=\"modal-title\" id=\"gridSystemModalLabel\">Thông báo</h4>" +
            "</div>" +
            "<div class=\"modal-body\">" +
            content +
            "</div>" +
            "<div class=\"modal-footer\">" +
            "<button type=\"button\" class=\"btn btn-default\" id=\"btnClose\" data-dismiss=\"modal\" onclick=\"Dialog.closedEvent(true)\">Đồng ý</button>" +
            "<button type=\"button\" class=\"btn btn-primary\" id=\"btnSave\" onclick=\"Dialog.closedEvent(false)\">Hủy</button>" +
            "</div>" +
            "</div><!-- /.modal-content -->" +
            "</div><!-- /.modal-dialog -->";
        //show dialog
        $("#popup").html(formatContent);
    }
}