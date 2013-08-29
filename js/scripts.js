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
	    $('#subscribe-response').addClass('alert-error');
	    message = "Please enter a valid email address.";
	}
	else{
	    //lets post the email and store it in db

	    function myCallback(response){
		if(response === 'success'){
		    message = "<strong>Success!</strong> Thank you for subscribing!";
		    $('#btn-subscribe').removeClass('btn-primary');
		    $('#btn-subscribe').addClass('disabled');
		    $('#btn-subscribe').addClass('btn-success');
		    $('#btn-subscribe').text("Success!");
		    $('#subscribe-input').prop('disabled', true);
		    
		    $("#response-text").html(message);
		    if($('#subscribe-response').hasClass('alert-error')){
			$('#subscribe-response').removeClass('alert-error');
		    }
		    $('#subscribe-response').addClass('alert-success');
		    $("#subscribe-response").removeClass("hidden");
		}
		else{
		    message = "It looks like you've already signed up with " + input+ ". However, you're welcome to subscribe again with a different email address!";
		    $("#response-text").text(message);
		    $('#subscribe-response').addClass('alert-error');
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
	$("#response-text").text(message);
	$("#subscribe-response").removeClass("hidden");
	$(".alert").show();
    }
    e.preventDefault();
});

$(function(){
    $(".close").on("click", function(){
	//console.log('triggered');
	$(this).parent().hide();
        /*
         * The snippet above will hide all elements with the class specified in data-hide,
         * i.e: data-hide="alert" will hide all elements with the alert property.
         *
         * Xeon06 provided an alternative solution:
         * $(this).closest("." + $(this).attr("data-hide")).hide();
         * Use this if are using multiple alerts with the same class since it will only find the closest element
         * 
         * (From jquery doc: For each element in the set, get the first element that matches the selector by
         * testing the element itself and traversing up through its ancestors in the DOM tree.)
        */
    });
});

