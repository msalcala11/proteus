//These are my js client scripts

//This segment changes the active navbar button when it is clicked
	  $(document).ready(function () {
            $('ul.nav > li').click(function (e) {
	      var h = $('a', this).attr('href');
	      
              $('ul.nav > li').removeClass('active');
              $(this).addClass('active');                
      
      //now lets scroll to the appropriate section
          if(h.indexOf('#') == 0) {
            h = h.substring(1);
            if(h == 'home') {
              $('html, body').stop().animate({
                scrollTop: 0
              });
            } else {
              $('html, body').stop().animate({
                scrollTop: $('a[name="' + h + '"]').offset().top -80
              });
            }
            return false;
          }
          return true;
        

            });            
	  });

//script for monthly newsletter subscription click
//$(document).ready(function () {
//function validateSubscription(){
$("#subscribe-input").keyup(function(event){
    if(event.keyCode == 13){
        $("#btn-subscribe").click();
    }
});


    $("#btn-subscribe").click(function(e){
	//    alert("Thank you for subscribing.");


if(!$("#btn-subscribe").hasClass('disabled')){//do not do anything if already submitted email address
    var input = $("#subscribe-input").val();
    function validateEmail(email) {// http://thejimgaudet.com/articles/support/web/jquery-email-validation-without-a-plugin/
	if(email == ""){
	    var isEmail = false;
	    }
	else{
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//	    console.log("return of validateEmail: " + emailReg.test(input));
	    var isEmail = emailReg.test(input);
	    }
	return isEmail;
    }

	
    //var email = jQuery("#input[type='email']").val();
	if(!validateEmail(input)){
	    message = "Please enter a valid email address.";
	    }
	else{
	    message = "Thank you for subscribing!";
	    $('#btn-subscribe').removeClass('btn-primary');
	    $('#btn-subscribe').addClass('disabled');
	    $('#btn-subscribe').addClass('btn-success');
	    $('#btn-subscribe').text("Success!");
	    $('#subscribe-input').prop('disabled', true);
	    }
//	console.log(message);
	$("#subscribe-response p").text(message);
	$("#subscribe-response").removeClass("hidden");
}
	
    });
//}
//});

