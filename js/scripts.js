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
		    //once we recieve the server response to our previous post:  
			callback(response);
		    }  		
		}); 
	    } 	    
	    myConnection(myCallback);	    
	}
	$("#response-text").text(message);
	$("#subscribe-response").removeClass("hidden");
	$("#subscribe-response").show();
    }
    e.preventDefault();
});

//Function to handle the opening and closing of alert boxes by hiding them temporarily
//rather than dismissing them permanently
$(function(){
    $(".alertClose").on("click", function(){
	$(this).parent().hide();
    });
});

//This snippet prevents the body from scrolling in the background when myModal is open
$("#myModal").on("show", function () {
  $("body").addClass("modal-open");
}).on("hidden", function () {
  $("body").removeClass("modal-open")
});

//This snippet handles the "Let's talk business form"
$("#letsTalkBizForm").submit(function(e){
    var name = $("#name").val();
    var organization = $("#organization").val();
    var email = $("#email").val();
    var project_description = $("#project_description").val();
    
    //a quick little function to ensure the email follows a valid format
    // http://thejimgaudet.com/articles/support/web/jquery-email-validation-without-a-plugin/
    function validateEmail(email) {
	if(email === ""){
	    var isEmail = false;
	}
	else{
	    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	    var isEmail = emailReg.test(email);
	}
	return isEmail;
    }

    //lets write our form validation code for each field
    var nameError = "Please enter your name.";
    var emailError = "Please enter a valid email address.";
    var projectError = "Please enter a brief description of your project.";
    var message = '';

    if(name === ''){//if no name was given
	message = message + nameError + '</br>';
    }
    if(!validateEmail(email)){//if invalid email
	message = message + emailError + '</br>';
    }
    if(project_description === ''){//if no project description was given
	message = message + projectError;
    }
	
	if(message !== ""){//if at least one error, then display the error to the user
	    $('#inquiry-validation-response').addClass('alert-error');	    
	    $("#inquiry-response-text").html(message);
	    $("#inquiry-validation-response").removeClass("hidden");
	    $("#inquiry-validation-response").show();
	    $('.modal-body').animate({ scrollTop: "0px"});  
	}
	else{
	    //lets store information in database and display confirmation to the user
	    function myCallback(response){
		if(response === 'success'){
		    $("#letsTalkBizFormContainer").fadeOut( "slow" );
		    $("#myModalLabel").text("Success!");
		    $("#submitConfirmation").fadeIn("slow");
		    $("#modalCloseBtn").fadeIn("slow");
		    $("#letsTalkBizFormSubmit").fadeOut("slow");
		    $("#myModalSaveChanges").fadeOut("slow");
		}
		else{		    	    
		    /*
		     Still need to add error response here in case of no internet connection
		     ie "Can't connect to our servers. Please check your internet connection."
		     */
		}
	    }
	    
	    function myConnection(callback){
		$.ajax({  
		    type: "POST",  
		    url: "/new_inquiry",  
		    data: {"name": name,"organization": organization, "email": email, "project_description": project_description},   
		    success: function(response) {  
		    //once we recieve the server response to our post run the callback fx above
			callback(response);
		    }  		
		}); 
	    } 	    
	    myConnection(myCallback);	    
	}
    e.preventDefault();
});

