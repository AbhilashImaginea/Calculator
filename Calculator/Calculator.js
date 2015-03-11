(function () {
    'use strict';
    var MyCalculator = function () {
        this.aItems = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "C", "0", "=", "+"];
        this.iFirstValue = 0;
        this.isFirstValueFinal = false;
        this.iSecondValue = 0;
        this.isPreviousTotal = false;
        this.oCurrentOperator = '';
        this.isValueCalculated = false;
    };

    MyCalculator.prototype.init = function () {
        $("#Calculator").append("<div id='displayBox'><div id='display'></div><div id='input'></div></div>");
        $.each(this.aItems, function (index, value) {
            if (!isNaN(value)) {
                $("#Calculator").append("<div data-value=" + value + " class='number'>" + value + "</div>");
            } else {
                $("#Calculator").append("<div data-value=" + value + " class='operator'>" + value + "</div>");
            }
        });
    };

    MyCalculator.prototype.click = function (event) {
        var oClickedValue, iFinalValue;
        if (typeof event === "object") {
            oClickedValue = event.target.innerText || event.target.textContent;
        } else {
            oClickedValue = event;
        }
        if (!isNaN(oClickedValue)) {
            if (this.isValueCalculated === true) {
                if (this.oCurrentOperator !== '') {
                    this.iFirstValue = $("#Calculator #input").text();
                    this.isFirstValueFinal = true;
                    this.isValueCalculated = false;
                    $("#Calculator #input").text(oClickedValue);
                    this.iSecondValue = oClickedValue;
                } else {
                    this.clear('');
                    $("#Calculator #input").text(oClickedValue);
                    this.isValueCalculated = false;
                }
            } else if (this.oCurrentOperator !== '' && !this.isFirstValueFinal) {
                this.iFirstValue = $("#Calculator #input").text();
                this.isFirstValueFinal = true;
                this.iSecondValue = oClickedValue;
                $("#Calculator #input").text(oClickedValue);
            } else if (this.oCurrentOperator !== '' && this.isFirstValueFinal) {
                this.iSecondValue = $("#Calculator #input").text() + oClickedValue;
                $("#Calculator #input").text(this.iSecondValue);
            } else {
                $("#Calculator #input").text($("#Calculator #input").text() + oClickedValue);
            }

        } else {
            switch (oClickedValue) {
            case "/":
            case "+":
            case "*":
            case "-":
                if ($("#Calculator #input").text() === '') {
                    this.oCurrentOperator = '';
                } else if (this.oCurrentOperator !== '' && this.iSecondValue !== 0) {
                    this.click("=");
                    this.oCurrentOperator = oClickedValue;
                } else {
                    this.oCurrentOperator = oClickedValue;
                }
                break;
            case "=":
                if (!isNaN(parseInt(this.iFirstValue, 0)) && parseInt(this.iSecondValue, 0) !== 0) {
                    switch (this.oCurrentOperator) {
                    case "/":
                        this.iFinalValue = parseInt(this.iFirstValue, 0) / parseInt(this.iSecondValue, 0);
                        break;
                    case "+":
                        this.iFinalValue = parseInt(this.iFirstValue, 0) + parseInt(this.iSecondValue, 0);
                        break;
                    case "*":
                        this.iFinalValue = parseInt(this.iFirstValue, 0) * parseInt(this.iSecondValue, 0);
                        break;
                    case "-":
                        this.iFinalValue = parseInt(this.iFirstValue, 0) - parseInt(this.iSecondValue, 0);
                        break;
                    }

                    $("#Calculator #input").text(parseInt(this.iFinalValue, 0));
                    $("#Calculator #displayBox").addClass('inputanimation');
                    this.isValueCalculated = true;
                    this.oCurrentOperator = '';
                    this.iSecondValue = 0;
                }
                break;
            case "C":
                this.clear('');
                break;
            }
        }
        this.display();
    };

    MyCalculator.prototype.clear = function (value) {
        $("#Calculator #input").text(value);
        this.iFirstValue = 0;
        this.isFirstValueFinal = false;
        this.iSecondValue = 0;
        this.isPreviousTotal = false;
        this.oCurrentOperator = '';
        this.isValueCalculated = false;
    };

    MyCalculator.prototype.display = function () {
        if (this.iFirstValue !== 0) {
            if (this.isValueCalculated === true) {
                $("#Calculator #display").text($("#Calculator #input").text());
            } else {
                $("#Calculator #display").text(this.iFirstValue);
            }
        } else {
            $("#Calculator #display").text($("#Calculator #input").text());
        }
        if (this.oCurrentOperator !== '' && this.isValueCalculated === false) {
            $("#Calculator #display").text($("#Calculator #display").text() + this.oCurrentOperator);
            if (this.iSecondValue !== 0) {
                $("#Calculator #display").text($("#Calculator #display").text() + this.iSecondValue);
            }
        } else if (this.oCurrentOperator !== '') {
            $("#Calculator #display").text($("#Calculator #display").text() + this.oCurrentOperator);
        }
    };

    $(document).ready(function () {
        var oCalculator = new MyCalculator();
        oCalculator.init();
        $("#Calculator").click(function (event) {
            $("#Calculator #displayBox").removeClass('inputanimation');
            var oTarget = $(event.target);
            oTarget.removeClass('buttonClick');
            oTarget.offsetWidth = oTarget.offsetWidth;
            if (oTarget.hasClass("number") || oTarget.hasClass("operator")) {
                oTarget.addClass('buttonClick');
                oCalculator.click(event);
            }
        });

        window.addEventListener("keypress", function (e) {
            var key = e.keyCode || e.charCode, oClickedValue, sAttrSelector;
            $("#Calculator #displayBox").removeClass('inputanimation');
            $("#Calculator div").removeClass('buttonClick');
            if (key >= 48 && key <= 57) {
                oClickedValue = key - 48;
            } else {
                switch (key) {
                case 43:
                    oClickedValue = "+";
                    break;
                case 45:
                    oClickedValue = "-";
                    break;
                case 42:
                    oClickedValue = "*";
                    break;
                case 47:
                    oClickedValue = "/";
                    break;
                case 61:
                case 13:
                    oClickedValue = "=";
                    break;
                }
            }
            oCalculator.click(oClickedValue);
            sAttrSelector = "[data-value='" + oClickedValue + "']";
            $(sAttrSelector).height($(sAttrSelector).height());
            $(sAttrSelector).addClass('buttonClick');
        }, false);
    });
}());