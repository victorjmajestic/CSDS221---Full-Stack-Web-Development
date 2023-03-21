$(document).ready(function(){
    let adults = 1;
    let checkin;
    let checkout;
    let days;
    let cost;

    // calculate the number of days between checkin and checkout
    function calcNumDays(){
        if(checkin && checkout){
            days = checkout.diff(checkin,"days");
            $('#daydisplay').val(days + " days");
        }
    }

    // calculate the cost of the visit based on # of adults and checkin/checkout
    function calcCost(){
        if(adults && checkin && checkout){
            cost = 150 * adults * days;
            $('#costdisplay').val(cost);
        }
    }

    // update the text when checkin is changed
    $('#checkin').change(function(){
        checkin = moment($(this).val());
        calcNumDays();
        calcCost();
    })

    // update the text when checkout is changed
    $('#checkout').change(function(){
        checkout = moment($(this).val());
        calcNumDays();
        calcCost();
    })
    
    // update the text when adults is changed
    $('#adults').change(function(){
        adults = $('#adults option:selected').val();
        calcCost();
    })

    // validator --> intended to check all the requirements but does not properly work.
    // issues with toastr.
    const validator = $("#form").validate({
        rules:{
            costdisplay:{
                min:1
            }
        },
        messages:{
            username:"",
            firstName:"",
            lastName:"",
            inputPhone:"",
            inputFax:"",
            inputEmail:"",
            displayCost:"",
        },
        highlight: function (element, errorClass) {
            // checks for required information
            const name = $(element).attr('name')
            let errorMSG = name + " is not filled!";
            // checks for nonexistent or negative cost
            if(name === "displayCost"){
                errorMSG = "Cost does not exist"
                if(cost<=0){
                    errorMSG = "Cost is negative"
                }
            }
            // displays error message
            toastr["error"](errorMSG, "", {
                "closeButton": true,
                "positionClass": "toast-top-right",
            });
            $(element).closest('.form-group').addClass('has-error');
        },
        // removes highlight when error is not present
        unhighlight: function (element, errorClass) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        
        // submits the form
        submitHandler: function(form){
            toastr["success"]("The form was submitted.", "", {
            "closeButton": true,
            "positionClass": "toast-top-full-width",
            });
            form.submit;
        },
    })
  
    // resets the page when the reset button is clicked
    $("#reset").click(function(){
        toastr["info"]("The fields were cleared.", "", {
            "closeButton": true,
            "positionClass": "toast-top-full-width",
        });
        adults = 1;
        checkin = null;
        checkout = null;   
        days = null;
        cost = null;
        $('#daydisplay').html("Displays days...");
        $('#costdisplay').html("Displays cost...");
        validator.resetForm(true);
    })
})