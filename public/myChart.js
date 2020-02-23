// Define a function called logCountryCode. This function takes no arguments 
// (the brackets after the function name are empty). When the function is called, 
// the two indented lines of code are executed.
function logCountryCode () {
    // Define a variable called countryCode. Put into it the value that is in the 
    //HTML element with id 'country'.
    var countryCode = document.getElementById('country').value;
    // Print the value of the variable countryCode into the console.
    console.log(countryCode);
}

// Add an event listener to the HTML element with the id 'renderBtn'. That's our 
// button. When the event 'click' happens (when the button is clicked), run the 
// function 'logCountryCode'.
document.getElementById('renderBtn').addEventListener('click', logCountryCode);