/**
* Convert From/To Binary/Decimal/Hexadecimal in JavaScript
* https://gist.github.com/faisalman
*
* Copyright 2012-2015, Faisalman <fyzlman@gmail.com>
* Licensed under The MIT License
* http://www.opensource.org/licenses/mit-license
*/

(function(){

    var ConvertBase = function (num) {
        return {
            from : function (baseFrom) {
                return {
                    to : function (baseTo) {
                        return parseInt(num, baseFrom).toString(baseTo);
                    }
                };
            }
        };
    };
        
    // binary to decimal
    ConvertBase.bin2dec = function (num) {
        return ConvertBase(num).from(2).to(10);
    };
    
    // binary to hexadecimal
    ConvertBase.bin2hex = function (num) {
        return ConvertBase(num).from(2).to(16);
    };
    
    // decimal to binary
    ConvertBase.dec2bin = function (num) {
        return ConvertBase(num).from(10).to(2);
    };
    
    // decimal to hexadecimal
    ConvertBase.dec2hex = function (num) {
        return ConvertBase(num).from(10).to(16);
    };
    
    // hexadecimal to binary
    ConvertBase.hex2bin = function (num) {
        return ConvertBase(num).from(16).to(2);
    };
    
    // hexadecimal to decimal
    ConvertBase.hex2dec = function (num) {
        return ConvertBase(num).from(16).to(10);
    };
    ConvertBase.binaryToHex = function (s) {
        var i, k, part, accum, ret = '';
        for (i = s.length-1; i >= 3; i -= 4) {
            // extract out in substrings of 4 and convert to hex
            part = s.substr(i+1-4, 4);
            accum = 0;
            for (k = 0; k < 4; k += 1) {
                if (part[k] !== '0' && part[k] !== '1') {
                    // invalid character
                    return { valid: false };
                }
                // compute the length 4 substring
                accum = accum * 2 + parseInt(part[k], 10);
            }
            if (accum >= 10) {
                // 'A' to 'F'
                ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
            } else {
                // '0' to '9'
                ret = String(accum) + ret;
            }
        }
        // remaining characters, i = 0, 1, or 2
        if (i >= 0) {
            accum = 0;
            // convert from front
            for (k = 0; k <= i; k += 1) {
                if (s[k] !== '0' && s[k] !== '1') {
                    return { valid: false };
                }
                accum = accum * 2 + parseInt(s[k], 10);
            }
            // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
            ret = String(accum) + ret;
        }
        return { valid: true, result: ret };
    }
    
    this.ConvertBase = ConvertBase;
    
})(this);

/*
* Usage example:
* ConvertBase.bin2dec('111'); // '7'
* ConvertBase.dec2hex('42'); // '2a'
* ConvertBase.hex2bin('f8'); // '11111000'
* ConvertBase.dec2bin('22'); // '10110'
*/
