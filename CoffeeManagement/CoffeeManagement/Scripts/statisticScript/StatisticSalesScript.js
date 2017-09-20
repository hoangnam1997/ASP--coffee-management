//<!--Event onclick point in chart-->
document.getElementById("statistic-Chart").onclick=function(evt){
    var activePoints = tempChart.getElementsAtEvent(evt);
    var firstPoint = activePoints[0];
    if(firstPoint==null)return;
    //My event: do anything with lable,  activePoints[0] -> data 1; activePoints[1] -> data 2
    //gotoInfomationStatistic(label);
};
//<!--function push record of table-->
setColumnFortmat(columnFormat);
createPageTable(listStatisticsViewModel);
//search in tabe
function functionSearch(){
    changesText($("#searchTableInput").val());
}
//change page in table
function changeRow(value,element){
    var text = $(element).text() + ' <span class="caret" ></span >';
    $('#selectedDropdownItem').html(text);
    changeCountRowInPage(value);
}
//enter and search
$("#searchTableInput").keyup(function(event)
{
    var code = event.keyCode || event.which;
    if (code === 13)
    {
        $("#btnSearch").click();
    }
});
//<!--funtion click detail-->
//function goto infomation of statistic day
function gotoInfomationStatistic(dayStatistics) {
    var myDay = dayStatistics.split("-").reverse().join("-");
    var win = window.open("/Order/Show?date=" + myDay, '_blank');
    win.focus();
}