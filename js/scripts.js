//These are my js client scripts

//This segment changes the active navbar button when it is clicked
$(document).ready(function () {
    $('ul.nav > li').click(function (e) {
	var h = $('a', this).attr('href');	
        $('ul.nav > li').removeClass('active');
        $(this).addClass('active');                
	
	//now lets scroll to the appropriate section
        if(h.indexOf('#') === 0) {
            h = h.substring(1);
            if(h === 'home') {
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


//Lets handle the monthly newsletter subscription
$("#newsletter-form").submit(function(e){

    if(!$("#btn-subscribe").hasClass('disabled')){//do not do anything if already submitted email address
	var input = $("#subscribe-input").val();
	function validateEmail(email) {// http://thejimgaudet.com/articles/support/web/jquery-email-validation-without-a-plugin/
	    if(email === ""){
		var isEmail = false;
	    }
	    else{
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var isEmail = emailReg.test(input);
	    }
	    return isEmail;
	}
	var message = '';
	
	if(!validateEmail(input)){
	    message = "Please enter a valid email address.";
	}
	else{
	    //lets post the email and store it in db

	    function myCallback(response){
		if(response === 'success'){
		    message = "Thank you for subscribing!";
		    $('#btn-subscribe').removeClass('btn-primary');
		    $('#btn-subscribe').addClass('disabled');
		    $('#btn-subscribe').addClass('btn-success');
		    $('#btn-subscribe').text("Success!");
		    $('#subscribe-input').prop('disabled', true);
		    
		    $("#subscribe-response p").text(message);
		    $("#subscribe-response").removeClass("hidden");
		}
		else{
		    message = "It looks like you've already signed up with " + input+ ". However, you're welcome to subscribe again with a different email address!";
		    $("#subscribe-response p").text(message);
		    $("#subscribe-response").removeClass("hidden");
		}
	    }
	    
	    function myConnection(callback){

		$.ajax({  
		    type: "POST",  
		    url: "/new_newsletter_subscriber",  
		    data: {"email":input},  
		    success: function(response) {  
		    //we implement the success action below  
			callback(response);
		}  
		
		}); 
	    } 
	    
	    myConnection(myCallback);
	    
	}
	$("#subscribe-response p").text(message);
	$("#subscribe-response").removeClass("hidden");
    }
    e.preventDefault();
});


