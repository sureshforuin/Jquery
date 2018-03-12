$(document).ready(function(){
    var dateFormat = "yyyy-mm-dd",
    fromCA = $( "#fromCA" )
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true
      })
      .on( "change", function() {
        toCA.datepicker( "option", "minDate", getDate( this ) );
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest('.dateRange').addClass("active");
      }),
    toCA = $( "#toCA" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
    })
    .on( "change", function() {
      fromCA.datepicker( "option", "maxDate", getDate( this ) );
      var parent = $(this).closest(".time-nav");
      $("> div", parent).removeClass("active");
      $(this).closest('.dateRange').addClass("active");
    });

});