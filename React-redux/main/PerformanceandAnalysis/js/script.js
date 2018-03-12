$(document).ready(function () {
    $('ul.tabs li').click(function () {
        var tab_id = $(this).attr('data-tab');
        var parent = $(this).closest('.content-area');
        if(parent.length == 0){
            parent = $(this).closest('.content-area1');
        }
        $('ul.tabs li',parent).removeClass('current');
        $('.tab-content',parent).removeClass('current');
        $(this).addClass('current');
        $("#" + tab_id,parent).addClass('current');
    })

    // $(".time-nav").on("click","a",function(e){
    //     e.preventDefault();
    //     var parent = $(this).closest(".time-nav");
    //     $("> div", parent).removeClass("active");
    //     $(this).closest("div").addClass("active");
    // });


    $(".groupnunit").on("click",".highchart-section",function(){
        var parent = $(this).closest(".groupnunit");
        $(".highchart-section", parent).attr("disabled",true);
        $(this).removeAttr("disabled");
    });

    $(".groupnunit .highchart-section").mouseOff(function() {
        // $(".groupnunit .highchart-section").removeAttr("disabled");
        $(".unit.cloneUnit .number", "#upDownCapture").text("_ _ ");
    });

    $(".groupnunit .highchart-section").clickOff(function() {
        $(".groupnunit .highchart-section").removeAttr("disabled");
        $(".unit.cloneUnit .number", "#upDownCapture").text("_ _ ");
    });


    $("#bench_table").on("click",".table_close",function(e){
        e.preventDefault();
        $(this).closest("tr").remove();
    });

})


$.fn.mouseOff = function(callback, selfDestroy) {
    var mouseOvered = false;
    var parent = this;
    var destroy = selfDestroy || true;
    
    parent.mouseover(function() {
        mouseOvered = true;
    });
    
    $(document).mouseover(function(event) { 
        if (!mouseOvered) {
            callback(parent, event);
        }
        if (destroy) {
            //parent.clickOff = function() {};
            //parent.off("click");
            //$(document).off("click");
            //parent.off("clickOff");
        };
        mouseOvered = false;
    });
};



$.fn.clickOff = function(callback, selfDestroy) {
    var clicked = false;
    var parent = this;
    var destroy = selfDestroy || true;
    
    parent.click(function() {
        clicked = true;
    });
    
    $(document).click(function(event) { 
        if (!clicked) {
            callback(parent, event);
        }
        if (destroy) {
            //parent.clickOff = function() {};
            //parent.off("click");
            //$(document).off("click");
            //parent.off("clickOff");
        };
        clicked = false;
    });
};

