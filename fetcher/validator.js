function validateCountryCode(input) {
    if(input.match(/^[a-zA-Z]+$/)){
        return true;
    }
    else{
        return false;
    }
}

function validateIndicator(input) {
    if(input.match(/^[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+$/)){
        return true;
    }
    else{
        return false;
    }
}

module.exports = {
    validateCountryCode,
    validateIndicator
};