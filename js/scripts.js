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

	var input = $("#subscribe-input").val();
	if(input.search("@") == -1){
	    message = "Please enter a valid email address.";
	    }
	else{
	    message = "Thank you for subscribing!";
	    }
	console.log(message);
	$("#subscribe-response p").text(message);
	$("#subscribe-response").removeClass("hidden");
    });
//}
//});

