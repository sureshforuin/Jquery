$(document).ready(function(){
    var dateFormat = "yyyy-mm-dd",
    fromCF = $( "#fromCF" )
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true
      })
      .on( "change", function() {
        toCF.datepicker( "option", "minDate", getDate( this ) );
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest('.dateRange').addClass("active");
      }),
    toCF = $( "#toCF" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
    })
    .on( "change", function() {
      fromCF.datepicker( "option", "maxDate", getDate( this ) );
      var parent = $(this).closest(".time-nav");
      $("> div", parent).removeClass("active");
      $(this).closest('.dateRange').addClass("active");
    });

});