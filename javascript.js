// Mobile menu section - Start

// Open mobile menu
const navLinksPosition = document.getElementById("nav-links");  //Grab the navigation bar links
navLinksPosition.style.top = "-1000px"                          //Preset the position of the navigation bar links for the mobile menu

document.getElementById("mobile-menu").onclick = function () {
    if (navLinksPosition.style.top == "-1000px") {              //If top position == -1000px change it to 0px, else -1000px
        navLinksPosition.style.top = "0";
        navLinksPosition.style.animation = ".5s mobile-slide-open forwards ease-in-out";
        console.log("The current postion of the mobile menu is: " + navLinksPosition.style.top.valueOf(top));
        console.log("menu shown");
        return true
    } else {
        navLinksPosition.style.top = "-1000px";
        navLinksPosition.style.transition = ".5s mobile-slide-open forwards ease-in-out";
        console.log("menu hidden");
    }
};

// Close mobile menu
document.getElementById("mobile-close").onclick = function () {  //If top position == 0px change it to -1000px.
    console.log("The current postion of the mobile menu is: " + navLinksPosition.style.top.valueOf(top));
    if (navLinksPosition.style.top == "0px") {
        navLinksPosition.style.top = "-1000px";
        navLinksPosition.style.animation = ".5s mobile-slide-close forwards ease-in-out";
        console.log("menu hidden");
    }
};
// Mobile menu section - End



// Calculations section - Start
//      GAS calculator - Start
// Inner gas pipe diameter
innerPipeDiameter = [
    17.3,
    22.3,
    28.5,
    37.2,
    43.1,
    54.5,
    70.3,
    82.5,
    107.1,
    131.7,
    159.3,
    206.5,
    260.4,
    309.7,
    339.6,
    388.8,
    437.2,
    486
];

// Nominal gas pipe diameter
nominalPipeDiameter = [
    "DN 15",
    "DN 20",
    "DN 25",
    "DN 32",
    "DN 40",
    "DN 50",
    "DN 65",
    "DN 80",
    "DN 100",
    "DN 125",
    "DN 150",
    "DN 200",
    "DN 250",
    "DN 300",
    "DN 350",
    "DN 400",
    "DN 450",
    "DN 500"
];

// Calculate the gas flow based on gas appliances power
function calcGasFlow(gasPower) {
    var gasFlowResult = Math.round(gasPower * 0.115 * 100) / 100
    document.getElementById('gas-hourly-flow').value = gasFlowResult;
    return gasFlowResult;
};

// Calculate gas appliances power based on gas flow
function calcGasPower(gasFlow) {
    var gasPowerResult = Math.round(gasFlow / 0.115 * 100) / 100;
    document.getElementById('gas-power').value = gasPowerResult;
    return gasPowerResult;
};

// Return the pressure drop in [Pa] - variable input in [m3/h, mm]
var gasPressureDrop = function (gasFlow, gasPipeDiameter) {
    return (pressureDrop = 0.776457e-8 * 0.78 * (Math.pow(gasFlow, 1.82) / Math.pow(gasPipeDiameter / 1000, 4.82)));
};

// Return the speed value of gas flow in [m/s] - variable input in [m3/h, mm]
var gasSpeedCalculation = function (gasFlow, gasPipeDiameter) {
    var surfaceArea = 0.785 * (gasPipeDiameter / 1000) * (gasPipeDiameter / 1000);
    return (gasSpeed = gasFlow / 3600 / surfaceArea);
};

// Return an array of gas flow speeds
var gasSpeedCalculationTable = function (diameterTable, gasFlow) {
    speedTable = [];
    for (let i = 0; i < diameterTable.length; i++) {
        gasSpeed = gasSpeedCalculation(gasFlow, diameterTable[i]);
        speedTable.push(Math.round(gasSpeed * 100) / 100);
    }
    return speedTable;
};

// Return an array of gas pressure drops
var selectGasPipeDiameter = function (diameterTable, gasFlow) {
    pressureDropTable = [];
    for (let i = 0; i < diameterTable.length; i++) {
        pressureDrop = gasPressureDrop(gasFlow, diameterTable[i]);

        pressureDropTable.push(Math.round(pressureDrop * 1000) / 1000);
    }
    return pressureDropTable;
};

// Type out gas pipe diameters when gas flow is inputed by user
var gasFlowPipeCalculation = function () {
    document.getElementById("gas-results").innerHTML = "";
    console.clear();
    gasFlow = document.getElementById("gas-hourly-flow").value;
    gasPower = calcGasPower(gasFlow);
    document.getElementById("gas-power").value = Math.round(gasPower * 100) / 100;
    calculatedGasSpeed = gasSpeedCalculationTable(innerPipeDiameter, gasFlow);
    calculatedPressureDrop = selectGasPipeDiameter(innerPipeDiameter, gasFlow);

    typeOutResults(calculatedGasSpeed);
};

// Typeout gas pipe diameters when gas appliances power is inputed by user
var gasPowerPipeCalculation = function () {
    document.getElementById("gas-results").innerHTML = "";
    console.clear();
    gasPower = document.getElementById("gas-power").value;
    gasFlow = calcGasFlow(gasPower);
    document.getElementById("gas-hourly-flow").value = Math.round(gasFlow * 100) / 100;
    calculatedGasSpeed = gasSpeedCalculationTable(innerPipeDiameter, gasFlow);
    calculatedPressureDrop = selectGasPipeDiameter(innerPipeDiameter, gasFlow);
    typeOutResults(calculatedGasSpeed);
};

// Type out results based on which input field has been used by the user
var typeOutResults = function (speedTable) {
    for (var i = 0; i < speedTable.length; i++) {
        if (speedTable[i] < 6) {    // Show only 6 options
            for (let j = 2; j > -3; j--) {
                if (i - j >= 0 && i - j < pressureDropTable.length) {
                    var resultDOM = document.createElement("p");
                    if (j > 0) {
                        resultDOM.className = "red-text";
                    }
                    var resultSet = document.createTextNode(
                        "[" + nominalPipeDiameter[i - j].toString() + "] - " +
                        " Pd = " +
                        calculatedPressureDrop[i - j] +
                        " [Pa/m]" +
                        " w = " +
                        Math.round(speedTable[i - j] * 100) / 100 +
                        " [m/s]"
                    );
                    resultDOM.appendChild(resultSet);
                    document.getElementById("gas-results").appendChild(resultDOM);
                }
            }
            break;
        }
    }
    if ((document.getElementById('gas-power').value > 0) || (document.getElementById('gas-hourly-flow').value > 0)) {
        document.getElementById('gas-results').style.display = "block";
    } else {
        document.getElementById('gas-results').style.display = "none";
    }
};
//      GAS calculator - End


//      Ventilation calculator - Start
// Constant variables
const ABSOLUTE_ROUGHNESS = 0.15;
const AIR_KINEMATIC_VISCOSITY = 17.0e-6;
const AIR_DENSITY = 1.2;

// Duct sizes
ductDiameter = [
    100,
    125,
    160,
    200,
    250,
    315,
    355,
    400,
    450,
    500,
    560,
    630,
    710,
    800,
    1000,
    1250
];

// Calculate air flow in [m^3/h]
function calcAirHourlyFlow(airSecondsFlow) {
    var airHourFlow = Math.round((airSecondsFlow / 3600) * 100) / 100;
    document.getElementById('round-hourly-flow').value = airHourFlow;
    return airHourFlow;
};

// Calculate air flow in [m^3/s]
function calcAirSecondsFlow(airHourlyFlow) {
    var airSecondFlow = Math.round((airHourlyFlow / 3600) * 100) / 100;
    document.getElementById('round-seconds-flow').value = airSecondFlow;
    return airSecondFlow;
};

// Calculate air flow speed in [m/s] - input in ([m3/h], [mm])
var calcAirSpeed = function (airFlow, ductDiameter) {
    var ductSurfaceArea = 0.785 * (ductDiameter / 1000) * (ductDiameter / 1000);
    return speed = (airFlow / 3600) / (ductSurfaceArea);
}

// Create an array of air flow speeds
var createAirSpeedTable = function (ductDiameterTable, airFlow) {
    airSpeedTable = [];
    for (let i = 0; i < ductDiameterTable.length; i++) {
        speed = calcAirSpeed(airFlow, ductDiameterTable[i]);
        airSpeedTable.push(Math.round(speed * 100) / 100);
    }
    return airSpeedTable;
};

// calculate Reynolds number
var calcReynolds = function (airFlowSpeed, ductDiameter) {
    return reynolds = (airFlowSpeed * (ductDiameter / 1000)) / AIR_KINEMATIC_VISCOSITY;
};

// Calculate Lambda
var calcLambda = function (reynolds, ductDiameter) {
    lambda = 0.00001;

    var calcLeftLambda = function (lambda) {
        lambdaLeft = 1 / Math.sqrt(lambda);
        return lambdaLeft;
    };

    var calcRightLambda = function (reynolds, lambda, ductDiameter) {
        lambdaRight = -2 * Math.log10(ABSOLUTE_ROUGHNESS / 1000 / (3.71 * (ductDiameter / 1000)) + 2.51 / (reynolds * Math.sqrt(lambda)));
        return lambdaRight;
    };

    calcLeftLambda(lambda);
    calcRightLambda(reynolds, lambda, ductDiameter);
    count = 1;
    while (Math.abs(lambdaLeft - lambdaRight) > 0.005) {
        calcLeftLambda(lambda);
        calcRightLambda(reynolds, lambda, ductDiameter);
        lambda = lambda + 0.00001;
        if (count == 55555555) {
            break;
        }
        count++;
    }
    return lambda;
};

// args (lambda without units - input in (duct diameter [mm], air flow speed [m/s], air density [kg/m3])
var calcLinearDrop = function (lambda, ductDiameter, airFlowSpeed) {
    return (AIR_DENSITY * (lambda / (ductDiameter / 1000)) * ((airFlowSpeed * airFlowSpeed) / 2))
};

// Return an array of air pressure drops
var createAirPressureDropTable = function (ductDiameterTable) {
    airPressureTable = []
    airFlow = document.getElementById('round-hourly-flow').value;
    for (let i = 0; i < ductDiameterTable.length; i++) {
        speed = calcAirSpeed(airFlow, ductDiameterTable[i]);
        reynolds = calcReynolds(speed, ductDiameterTable[i]);
        lambda = calcLambda(reynolds, ductDiameterTable[i]);
        linearDrop = calcLinearDrop(lambda, ductDiameterTable[i], speed);
        airPressureTable.push(linearDrop);
    }
    return airPressureTable;
}

// Calculate ventilation duct diameter, air pressure drop and air flow speed based on users hourly air flow input
var roundDuctHourlyFlowCalculations = function () {
    document.getElementById("round-vent-results").innerHTML = "";
    console.clear();
    airFlow = document.getElementById('round-hourly-flow').value;
    if (airFlow > 0) {
        document.getElementById('round-seconds-flow').value = Math.round((airFlow / 3600) * 1000) / 1000;
        calculatedAirSpeed = createAirSpeedTable(ductDiameter, airFlow);
        calculatedPressureDrop = createAirPressureDropTable(ductDiameter);
        typeOutAirSpeedData(calculatedAirSpeed);
        if (airFlow == 0) {
            document.getElementById("round-vent-results").innerHTML = "";
        };
    }
    if (document.getElementById('round-hourly-flow').value > 0) {
        document.getElementById('round-vent-results').style.display = "block";
    } else {
        document.getElementById('round-vent-results').style.display = "none";
        document.getElementById('round-seconds-flow').value = "0";
    }
};

// Calculate ventilation duct diameter, air pressure drop and air flow speed based on users seconds air flow input
var roundDuctSecondsFlowCalculations = function () {
    document.getElementById("round-vent-results").innerHTML = "";
    console.clear();
    airFlow = document.getElementById('round-seconds-flow').value;
    if (airFlow > 0) {
        hourlyAirFlow = (airFlow * 3600);
        document.getElementById('round-hourly-flow').value = hourlyAirFlow;
        calculatedAirSpeed = createAirSpeedTable(ductDiameter, hourlyAirFlow);
        calculatedPressureDrop = createAirPressureDropTable(ductDiameter);
        typeOutAirSpeedData(calculatedAirSpeed);
        if (airFlow == 0) {
            document.getElementById("round-vent-results").innerHTML = "";
        };
    }
    if (document.getElementById('round-seconds-flow').value > 0) {
        document.getElementById('round-vent-results').style.display = "block";
    } else {
        document.getElementById('round-vent-results').style.display = "none";
        document.getElementById('round-hourly-flow').value = "0";
    }
};

// Type out calculation results for round ventilation ducts
var typeOutAirSpeedData = function (airSpeedTable) {
    for (var i = 0; i < airSpeedTable.length; i++) {
        if (airSpeedTable[i] < 5.2) {
            for (let j = 2; j > -3; j--) {
                if (i - j >= 0 && i - j < airSpeedTable.length) {
                    var resultDOM = document.createElement("p");
                    if (j > 0) { resultDOM.className = "red-text" };
                    var roundResults = document.createTextNode(
                        "Ø" + ductDiameter[i - j].toString() + " | " + Math.round((calculatedPressureDrop[i - j] * 100)) / 100
                        + " [Pa/m] | " + " w = " + airSpeedTable[i - j] + " [m/s]"
                    );

                    resultDOM.appendChild(roundResults);
                    document.getElementById("round-vent-results").appendChild(resultDOM);
                }
            }
            break;
        }
    }
};

// Calculate air flow speed in square ventilation ducts [m/s] - input in ([m^3/h], [mm], [mm])
var calcSquareDuctAirSpeed = function (airFlow, dimensionA, dimensionB) {
    surfaceArea = (dimensionA / 1000) * (dimensionB / 1000);
    return ((airFlow / 3600) / (surfaceArea));
};

// Calculate hourly air flow, duct size and air flow speed inside square ducts [m^3/h], [m^2], [m/s]
var calcSquareDucts = function () {
    document.getElementById("square-vent-results").innerHTML = "";

    var dimensionA = document.getElementById('dimension-a').value;
    var dimensionB = document.getElementById('dimension-b').value;
    var hourlyAirFlow = document.getElementById('square-hourly-flow').value;
    var speed = Math.round((calcSquareDuctAirSpeed(hourlyAirFlow, dimensionA, dimensionB)) * 100) / 100;
    let surfaceArea = Math.round((dimensionA / 1000) * (dimensionB / 1000) * 1000) / 1000;

    if (dimensionA != 0 && dimensionB != 0 && hourlyAirFlow != 0) {
        var resultsDOM = document.createElement("p")

        resultsDOM.innerHTML = (`For ${hourlyAirFlow} [m<sup>3</sup>/h] and duct dimensions: 
        ${dimensionA} [mm] x ${dimensionB} [mm] (${surfaceArea} [m<sup>2</sup>]) air flow speed = 
        ${speed} [m/s]`);

        document.getElementById("square-vent-results").appendChild(resultsDOM);
        document.getElementById('square-vent-results').style.display = "block";

    } else {
        var resultsDOM = document.createElement("p");
        var squareResults = document.createTextNode(`Please fill out the remaining fields`);
        resultsDOM.appendChild(squareResults);
        document.getElementById("square-vent-results").appendChild(resultsDOM);
        document.getElementById('square-vent-results').style.display = "block";
    }

    if (dimensionA == 0 && dimensionB == 0 && hourlyAirFlow == 0) {
        document.getElementById('square-vent-results').style.display = "none";
    }
};
//      Ventilation calculator - End


//      Water supply calculator - Start
// The inner diameter of a water supply pipe
innerWaterPipeDiameter = [
    17.3,
    22.3,
    28.5,
    37.2,
    43.1,
    54.5,
    70.3,
    82.5,
    107.1,
    131.7,
    159.3,
    206.5,
    260.4,
    309.7,
    339.6,
    388.8,
    437.2,
    486
];

// Pipe diameter thickness
waterPipeThickness = [
    2,
    2.3,
    2.6,
    2.6,
    2.6,
    2.9,
    3.2,
    3.6,
    4,
    4.5,
    6.3,
    6.3,
    7.1,
    8,
    8.8,
    10,
    11
];

// The nominal diameter of water pipes
nominalWaterPipeDiameter = [
    "DN 15",
    "DN 20",
    "DN 25",
    "DN 32",
    "DN 40",
    "DN 50",
    "DN 65",
    "DN 80",
    "DN 100",
    "DN 125",
    "DN 150",
    "DN 200",
    "DN 250",
    "DN 300",
    "DN 350",
    "DN 400",
    "DN 450",
    "DN 500"
];

// Inner diameter of PP water pipes
ppWaterPipeInnerDiameter = [
    10.6,
    13.2,
    16.6,
    21.2,
    26.6,
    33.4,
    42,
    50,
    60,
    73.4
];

// Nominal diameter of PP water pipes
ppNominalWaterPipeDiameter = [
    "16x2,7",
    "20x3,4",
    "25x4,2",
    "32x5,4",
    "40x6,7",
    "50x8,3",
    "63x10,5",
    "75x12,5",
    "90x15",
    "110x18,3"
];

// Inner diameter of PEX water pipes
pexInnerWaterPipeDiameter = [
    12.0,
    16.0,
    20,
    26,
    33,
    42,
    54
];

// Nominal diameter of PEX water pipes
pexNominalWaterPipeDiameter = [
    "16x2,0",
    "20x2,0",
    "25x2,5",
    "32x3,0",
    "40x3,5",
    "50x4,0",
    "63x4,5"
];

// Get user input values - number of appliances, building type and pipe type
var getSink = () => document.getElementById("sink").value;
var getKitchenSink = () => document.getElementById("kitchen-sink").value;
var getToilet = () => document.getElementById("toilet").value;
var getBathtub = () => document.getElementById("bathtub").value;
var getShower = () => document.getElementById("shower").value;
var getWashMachine = () => document.getElementById("wash-machine").value;
var getDishwasher = () => document.getElementById("dishwasher").value;
var getUrinal = () => document.getElementById("urinal").value;

var getBuildingType = () => document.getElementById("buildings").value;
var getWaterPipeType = () => document.getElementById("water-pipes").value;
var getSpeedCryterion = () => document.getElementById("speed-cryterion").value;

// Calculate "qn sum", "q calc" and "q calc in [m^3/h]"
function calcQ() {
    console.clear()
    var sink = getSink();
    var kitchenSink = getKitchenSink();
    var toilet = getToilet();
    var bathTub = getBathtub();
    var shower = getShower();
    var washMachine = getWashMachine();
    var dishwasher = getDishwasher();
    var urinal = getUrinal();

    var speedCryterion = getSpeedCryterion();
    var waterPipeType = getWaterPipeType();
    var buildingType = getBuildingType();
    var pipeSeries = [];
    var nominalPipeDiameter = [];

    var sumQn = Math.round((calcSumQn(sink, kitchenSink, toilet, bathTub, shower, washMachine, dishwasher, urinal)) * 100) / 100;
    var qCalc = Math.round((calcWaterFlowQ(sumQn, buildingType)) * 100) / 100;

    // [m^3/h] qCalc:
    var qCalcCubicMeterPerHour = Math.round(((qCalc * 3600) / 1000) * 100) / 100;

    // Switch pipe diameters based on user selected pipe type
    switch (waterPipeType) {
        case "steel":
            pipeSeries = innerWaterPipeDiameter;
            nominalPipeDiameter = nominalWaterPipeDiameter;
            break;
        case "pp":
            pipeSeries = ppWaterPipeInnerDiameter;
            nominalPipeDiameter = ppNominalWaterPipeDiameter;
            break;
        case "pex":
            pipeSeries = pexInnerWaterPipeDiameter;
            nominalPipeDiameter = pexNominalWaterPipeDiameter;
            break;
    }

    waterPipeDiameterSelection(qCalc, speedCryterion, pipeSeries, nominalPipeDiameter);

    // Show calculation results based on (qn sum)
    if (sumQn == 0) {
        document.getElementById("qn-result").innerHTML = "0.0";
        document.getElementById("qcalc-result").innerHTML = "0.0";
        document.getElementById("qcalc-m3/h-result").innerHTML = "0.0";
        document.getElementById("water-speed-result").innerHTML = "0.0";
        document.getElementById("water-pipe-diameter-result").innerHTML = "Pipe diameter";
    } else {
        document.getElementById("qn-result").innerHTML = sumQn;
        document.getElementById("qcalc-result").innerHTML = qCalc;
        document.getElementById("qcalc-m3/h-result").innerHTML = qCalcCubicMeterPerHour;
    }
};

// Calculate the sum (qnSum) of water usage for appliances
function calcSumQn(sink, kitchenSink, toilet, bathTub, shower, washMachine, dishwasher, urinal) {
    return (sink * 0.07 + kitchenSink * 0.07 + toilet * 0.13 + bathTub * 0.15 + shower * 0.15 +
        washMachine * 0.25 + dishwasher * 0.15 + urinal * 0.3);
};

// Calculate the water flow (Qcalc)
function calcWaterFlowQ(sumQn, buildingType) {
    switch (buildingType) {
        case "housing":
            if (sumQn <= 20) {
                qCalc = 0.682 * (Math.pow(sumQn, 0.45)) - 0.14;
            } else {
                qCalc = 1.7 * (Math.pow(sumQn, 0.21)) - 0.7;
            }
            break;
        case "admin-office":
            if (sumQn <= 20) {
                qCalc = 0.682 * (Math.pow(sumQn, 0.45)) - 0.14;
            } else {
                qCalc = 0.4 * (Math.pow(sumQn, 0.54)) + 0.48;
            }
            break;
        case "hotel":
            if (sumQn <= 20) {
                qCalc = 0.698 * (Math.pow(sumQn, 0.5)) - 0.12;
            } else {
                qCalc = 1.08 * (Math.pow(sumQn, 0.5)) - 1.83;
            }
            break;
        case "department":
            if (sumQn <= 20) {
                qCalc = 0.698 * (Math.pow(sumQn, 0.5)) - 0.12;
            } else {
                qCalc = 4.3 * (Math.pow(sumQn, 0.27)) - 6.65;
            }
            break;
        case "hospital":
            if (sumQn <= 20) {
                qCalc = 0.698 * (Math.pow(sumQn, 0.5)) - 0.12;
            } else {
                qCalc = 0.25 * (Math.pow(sumQn, 0.65)) + 1.25;
            }
            break;
        case "school":
            if (sumQn <= 1.5) {
                qCalc = sumQn;
            } else if (sumQn > 1.5 && sumQn <= 20) {
                qCalc = 4.4 * (Math.pow(sumQn, 0.27)) - 3.41;
            } else {
                qCalc = -22.5 * (Math.pow(sumQn, -0.5)) + 11.5;
            }
            break;
    }
    if (qCalc > 0) {
        return qCalc;
    } else {
        return 0;
    }
};

// Return the water flow speed in [m/s] - input in ([m^3/h], [mm])
var calcWaterFlowSpeed = function (qCalc, waterPipeDiameter) {
    pipeSurfaceArea = (Math.PI * (waterPipeDiameter / 1000) * (waterPipeDiameter / 1000)) / 4;
    return (waterSpeed = qCalc / 3600 / pipeSurfaceArea);
};

//Dobór rury (przeplyw l/s, kryterium m/s, typoszereg tablica rur mm)
function waterPipeDiameterSelection(qCalc, speedCryterion, pipeSeries, nominalPipeDiameter) {
    selectedWaterPipeDiameter = 0;
    for (let i = 0; i < pipeSeries.length; i++) {
        waterFlowSpeed = calcWaterFlowSpeed(((qCalc * 3600) / 1000), pipeSeries[i]);
        if (waterFlowSpeed < speedCryterion) {
            selectedWaterPipeDiameter = nominalPipeDiameter[i];
            waterFlowSpeed = Math.round(waterFlowSpeed * 100) / 100;
            document.getElementById("water-pipe-diameter-result").innerHTML = selectedWaterPipeDiameter;
            document.getElementById("water-speed-result").innerHTML = waterFlowSpeed;
            break;
        } else {
            document.getElementById("water-pipe-diameter-result").innerHTML = "QCalc is too big for the pipe diameter series";
            document.getElementById("water-speed-result").innerHTML = "";
        }
    }
};
//      Water supply calculator - End




//      Heating calculator - Start

// Calculate heating power flow
var calcHeatPowerFlow = function () {
    var heatPower = document.getElementById("heat-power").value;
    if (heatPower < 0) {
        heatPower = 1;
        document.getElementById("heat-power").value = heatPower;
    }
    var tempDiff = document.getElementById("temperature-difference").value;
    if (tempDiff < 0) {
        tempDiff = 1;
        document.getElementById("temperature-difference").value = tempDiff;
    }
    var specificHeat = document.getElementById("heat-fluid").value;
    var temperature = document.getElementById("heat-temperature").value;
    var fluidDensity;
    if (specificHeat == 4.2) {
        fluidDensity = calcWaterDensity(temperature);
    } else if (specificHeat == 3.63) {
        fluidDensity = 1052;
    } else if (specificHeat == 3.54) {
        fluidDensity = 1059;
    } else if (specificHeat == 3.77) {
        fluidDensity = 1034;
    } else if (specificHeat == 3.7) {
        fluidDensity = 1036;
    }
    // Returning unit is [kg/s]
    return (heatPowerFlow = (heatPower / (tempDiff * specificHeat) / (fluidDensity / 1000)) * 3.6);
};

// 
var heatFluidCalculation = function () {
    if (document.getElementById("heat-power").value.length == 0) {
        calcHeatPressureDrop();
    } else {
        document.getElementById("pre-heat-results").innerHTML = "";
        document.getElementById("heat-hourly-flow").value = Math.round(calcHeatPowerFlow() * 1000) / 1000;
        document.getElementById("heat-seconds-flow").value = Math.round(document.getElementById("heat-hourly-flow").value * (10 / 36) * 1000) / 1000;

        var resultDOM = document.createElement("p");
        var text =
            "For " +
            document.getElementById("heat-power").value +
            " [kW] " +
            "  and the temp. difference: " +
            document.getElementById("temperature-difference").value +
            " [°C]," +
            " V = " +
            document.getElementById("heat-hourly-flow").value +
            " [m^3/h]";

        var heatResult = document.createTextNode(text);
        resultDOM.appendChild(heatResult);
        document.getElementById("pre-heat-results").appendChild(resultDOM);

        calcHeatPressureDrop();
    }
};

var heatPowerCalculation = function () {
    document.getElementById("pre-heat-results").innerHTML = "";
    document.getElementById("heat-hourly-flow").value = Math.round(calcHeatPowerFlow() * 1000) / 1000;

    if (document.getElementById("temperature-difference").value == 0) {
        var resultDOM = document.createElement("p");
        var text = "No temperature difference was given"
        var heatResult = document.createTextNode(text);
        resultDOM.appendChild(heatResult);
        document.getElementById("pre-heat-results").appendChild(resultDOM);

    } else {
        var resultDOM = document.createElement("p");

        var text =
            "For " +
            document.getElementById("heat-power").value +
            " [kW] " +
            "  and the temp. difference: " +
            document.getElementById("temperature-difference").value +
            " [°C], " +
            "V = " +
            document.getElementById("heat-hourly-flow").value +
            " [m^3/h]";

        var heatResult = document.createTextNode(text);
        resultDOM.appendChild(heatResult);
        document.getElementById("pre-heat-results").appendChild(resultDOM);
        document.getElementById("heat-seconds-flow").value = Math.round(document.getElementById("heat-hourly-flow").value * (10 / 36) * 1000) / 1000;

        calcHeatPressureDrop();
    }
};

// Calculate pressure drop based on user temperature input (0-100 [°C])
var temperatureCalcDrop = function () {
    calcHeatPressureDrop();
};

// Calculate pressure drop based on user pipe selection (absolute roughness)
var heatRoughnessCalcDrop = function () {
    calcHeatPressureDrop();
};

// Heat pipe results based on user hourly flow input [m^3/h]
var resultsBasedOnSecondsHeatFlow = function () {
    document.getElementById("pre-heat-results").innerHTML = "For the given flow V = " + document.getElementById("heat-seconds-flow").value + " [dm<sup>3</sup>/s]: ";
    document.getElementById("heat-power").value = null;
    document.getElementById("temperature-difference").value = null;
    document.getElementById("heat-hourly-flow").value = document.getElementById("heat-seconds-flow").value * 3.6;
    calcHeatPressureDrop();
};

// Heat pipe results based on user seconds flow input [dm^3/s]
var resultsBasedOnHourlyHeatFlow = function () {
    document.getElementById("pre-heat-results").innerHTML =
        "For the given flow V = " +
        document.getElementById("heat-hourly-flow").value +
        " [m<sup>3</sup>/h]: ";
    document.getElementById("heat-power").value = null;
    document.getElementById("temperature-difference").value = null;
    document.getElementById("heat-seconds-flow").value = Math.round(document.getElementById("heat-hourly-flow").value * (10 / 36) * 1000) / 1000;
    calcHeatPressureDrop();
};

// Heat pipes inner diameter [mm]
heatPipeInnerDiameter = [
    17.3,
    22.3,
    28.5,
    37.2,
    43.1,
    54.5,
    70.3,
    82.5,
    107.1,
    131.7,
    159.3,
    206.5,
    260.4,
    309.7,
    339.6,
    388.8,
    437.2,
    486
];

// Heat pipes pipe width [mm]
heatPipeWidth = [
    2,
    2.3,
    2.6,
    2.6,
    2.6,
    2.9,
    3.2,
    3.6,
    4,
    4.5,
    6.3,
    6.3,
    7.1,
    8,
    8.8,
    10,
    11
];

// Heat pipes nominal diameter
heatPipeNominalDiameter = [
    "DN 15",
    "DN 20",
    "DN 25",
    "DN 32",
    "DN 40",
    "DN 50",
    "DN 65",
    "DN 80",
    "DN 100",
    "DN 125",
    "DN 150",
    "DN 200",
    "DN 250",
    "DN 300",
    "DN 350",
    "DN 400",
    "DN 450",
    "DN 500"
];

// Heat pipes made out of PP inner diameter
ppHeatPipeInnerDiameter = [
    10.6,
    13.2,
    16.6,
    21.2,
    26.6,
    33.4,
    42,
    50,
    60,
    73.4
];

// Heat pipes made out of PP nominal diameter
ppHeatPipeNominalDiameter = [
    "16x2,7",
    "20x3,4",
    "25x4,2",
    "32x5,4",
    "40x6,7",
    "50x8,3",
    "63x10,5",
    "75x12,5",
    "90x15",
    "110x18,3"
];

// Heat pipes made out o PEX inner diameter
pexHeatPipeInnerDiameter = [
    12.0,
    16.0,
    20,
    26,
    33,
    42,
    54
];

// Heat pipes made out of PEX nominal diameter
pexHeatPipeNominalDiameter = [
    "16x2,0",
    "20x2,0",
    "25x2,5",
    "32x3,0",
    "40x3,5",
    "50x4,0",
    "63x4,5"
];

// Empty arrays for heat calculation results
heatSpeedTable = [];
heatPressureDropTable = [];
heatDiameterTable = [];

var calcHeatPressureDrop = function () {

    document.getElementById("heat-results").innerHTML = "";

    heatSpeedTable = [];
    heatPressureDropTable = [];
    pipeType = document.getElementById("heat-pipes").value;
    heatDiameterTable = [];
    nominalDiameterTable = [];
    if (pipeType == 0.1 || pipeType == 0.15 || pipeType == 0.25) {
        heatDiameterTable = heatPipeInnerDiameter;
        nominalDiameterTable = heatPipeNominalDiameter;
    } else if (pipeType == 0.007001) {
        heatDiameterTable = ppHeatPipeInnerDiameter;
        nominalDiameterTable = ppHeatPipeNominalDiameter;
    } else if (pipeType == 0.007002) {
        heatDiameterTable = pexHeatPipeInnerDiameter;
        nominalDiameterTable = pexHeatPipeNominalDiameter;
    }

    for (let i = 0; i < heatDiameterTable.length; i++) {
        var heatFlow = document.getElementById("heat-hourly-flow").value;
        if (heatFlow == 0) {
            break;
        }
        var heatAbsoluteRoughness = document.getElementById("heat-pipes").value;
        var heatDiameter = heatDiameterTable[i];
        var temperature = document.getElementById("heat-temperature").value;
        if (temperature > 100) {
            temperature = 100;
            document.getElementById("heat-temperature").value = 100;
        } else if (temperature < 0) {
            temperature = 0;
            document.getElementById("heat-temperature").value = 0;
        }
        var fluidDensity = document.getElementById("heat-fluid").value;
        var heatSpeed = calcHeatFlowSpeed(heatFlow, heatDiameter);
        var waterDensity = calcWaterDensity(temperature);

        if (fluidDensity == 4.2) {
            var stickiness = calcWaterKinematicStickiness(temperature);
        } else {
            var stickiness = calcGlycolEthylKinematicStickiness(temperature, fluidDensity);
        }

        var heatReynolds = calcHeatReynolds(heatSpeed, heatDiameter, stickiness);
        var heatLambda = calcHeatLambda(heatAbsoluteRoughness, heatReynolds, heatDiameter);
        var heatLinearDrop = calcHeatLinearDrop(heatLambda, heatDiameter, heatSpeed, temperature);

        heatSpeedTable.push(Math.round(heatSpeed * 100) / 100);
        heatPressureDropTable.push(Math.round(heatLinearDrop * 100) / 100);
    }

    for (var i = 0; i < heatPressureDropTable.length; i++) {
        if (heatPressureDropTable[i] < 180) {
            for (let j = 2; j > -3; j--) {
                if (i - j >= 0 && i - j < heatPressureDropTable.length) {
                    var resultDOM = document.createElement("p");
                    if (j > 0) {
                        resultDOM.className = "red-text";
                    }
                    var heatPressureDropString = (Math.round(heatPressureDropTable[i - j] * 100) / 100).toString();
                    var heatResult = document.createTextNode(
                        nominalDiameterTable[i - j].toString() +
                        " - " +
                        heatPressureDropString +
                        " [Pa/m]" +
                        " | " +
                        " w = " +
                        (Math.round(heatSpeedTable[i - j] * 100) / 100) +
                        " [m/s]"
                    );

                    resultDOM.appendChild(heatResult);
                    document.getElementById("heat-results").appendChild(resultDOM);
                }
            }
            break;
        }
    }
    if (document.getElementById("heat-results").innerHTML == 0) {
        document.getElementById("heat-results").innerHTML = "<br>There are no pipes in the programs catalogue which would fit your data."
    };
};

 // Calculate the speed of heat fluid [m/s] - Input in ([m^3/h, [mm]])
  var calcHeatFlowSpeed = function (heatFlow, heatDiameter) {
    heatPipeSurfaceArea = (Math.PI * (heatDiameter / 1000) * (heatDiameter / 1000)) / 4;
    return (heatSpeed = heatFlow / 3600 / heatPipeSurfaceArea);
  };

 // Calculate water density 
  var calcWaterDensity = function (temperature) {
    heatWaterDensity = (999.83952 + 16.945176 * temperature - 7.9870401e-3 * temperature * temperature - 46.170461e-6 * temperature * 
        temperature * temperature + 105.56302e-9 * temperature * temperature * temperature * temperature - 280.54253e-12 * 
        temperature * temperature * temperature * temperature * temperature) / (1 + 16.89785e-3 * temperature);
    return heatWaterDensity;
  };

 // Calculate water stickiness [m^2/s] - Input in ([°C])
  var calcWaterKinematicStickiness = function (temperature) {
    dynamicFactorWaterStickiness = 0.00179 / (1 + 0.0337 * temperature + 0.000221 * temperature * temperature);
    return (waterKinematicSticiness = dynamicFactorWaterStickiness / calcWaterDensity(temperature));
  };

// Calculate glycol stickiness [m^2/s] - Input in ([°C])
  var calcGlycolEthylKinematicStickiness = function (temperature, cp) {
    if (cp == 3.63) {
      if (temperature >= 0 && temperature < 20) {
        glycolKinematicStickiness = 4.6 - ((4.6 - 2.2) / 20) * temperature;
      }
      if (temperature >= 20 && temperature < 40) {
        glycolKinematicStickiness =
          2.2 - ((2.2 - 1.5) / 20) * (temperature - 20);
      }
      if (temperature >= 40 && temperature < 60) {
        glycolKinematicStickiness =
          1.5 - ((1.5 - 0.98) / 20) * (temperature - 40);
      }
      if (temperature >= 60 && temperature < 80) {
        glycolKinematicStickiness =
          0.98 - ((0.98 - 0.68) / 20) * (temperature - 60);
      }
      if (temperature >= 80 && temperature < 101) {
        glycolKinematicStickiness =
          0.68 - ((0.68 - 0.51) / 20) * (temperature - 80);
      }
    }
    if (cp == 3.54) {
      if (temperature >= 0 && temperature < 20) {
        glycolKinematicStickiness = 6.5 - ((6.5 - 2.94) / 20) * temperature;
      }
      if (temperature >= 20 && temperature < 50) {
        glycolKinematicStickiness =
          2.94 - ((2.94 - 1.43) / 30) * (temperature - 20);
      }
      if (temperature >= 50 && temperature < 101) {
        glycolKinematicStickiness =
          1.43 - ((1.43 - 0.65) / 50) * (temperature - 50);
      }
    }
    if (cp == 3.77) {
      if (temperature >= 0 && temperature < 20) {
        glycolKinematicStickiness = 12 - ((12 - 4.4) / 20) * temperature;
      }
      if (temperature >= 20 && temperature < 40) {
        glycolKinematicStickiness =
          4.4 - ((4.4 - 2.2) / 20) * (temperature - 20);
      }
      if (temperature >= 40 && temperature < 60) {
        glycolKinematicStickiness =
          2.2 - ((2.2 - 1.3) / 20) * (temperature - 40);
      }
      if (temperature >= 60 && temperature < 80) {
        glycolKinematicStickiness =
          1.3 - ((1.3 - 0.9) / 20) * (temperature - 60);
      }
      if (temperature >= 80 && temperature < 101) {
        glycolKinematicStickiness =
          0.9 - ((0.9 - 0.7) / 20) * (temperature - 80);
      }
    }
    if (cp == 3.7) {
      if (temperature >= 0 && temperature < 20) {
        glycolKinematicStickiness = 14.3 - ((14.3 - 5.0) / 20) * temperature;
      }
      if (temperature >= 20 && temperature < 40) {
        glycolKinematicStickiness =
          5.0 - ((5.0 - 2.46) / 20) * (temperature - 20);
      }
      if (temperature >= 40 && temperature < 60) {
        glycolKinematicStickiness =
          2.46 - ((2.46 - 1.4) / 20) * (temperature - 40);
      }
      if (temperature >= 60 && temperature < 80) {
        glycolKinematicStickiness =
          1.4 - ((1.4 - 0.96) / 20) * (temperature - 60);
      }
      if (temperature >= 80 && temperature < 101) {
        glycolKinematicStickiness =
          0.96 - ((0.96 - 0.73) / 20) * (temperature - 80);
      }
    }
    glycolKinematicStickiness = glycolKinematicStickiness / 1000000;
    return glycolKinematicStickiness;
  };

// Calculate Reynolds number for heating [-] - Input in ([m/s], [mm], [m^2/s])
  var calcHeatReynolds = function (heatFlow, heatDiameter, kinematicStickiness) {
    return (reynolds = (heatFlow * (heatDiameter / 1000)) / kinematicStickiness);
  };

// Calculate lambda [-] - Input in ([mm], [-], [mm])
  var calcHeatLambda = function (heatAbsoluteRoughness, heatReynolds, heatDiameter) {
    absRoughness = heatAbsoluteRoughness;
    reynolds = heatReynolds;
    diameter = heatDiameter;
    lambda = 0.00001;

    var calcLeftLambda = function (lambda) {
      lambdaLeft = 1 / Math.sqrt(lambda);
      return lambdaLeft;
    };

    var calcRightLambda = function (absRoughness, reynolds, lambda, diameter) {
      lambdaRight = -2 * Math.log10(absRoughness / 1000 / (3.71 * (diameter / 1000)) + 2.51 / (reynolds * Math.sqrt(lambda)));
      return lambdaRight;
    };

    calcLeftLambda(lambda);
    calcRightLambda(absRoughness, reynolds, lambda, diameter);
    counter = 1;

    while (Math.abs(lambdaLeft - lambdaRight) > 0.005) {
      calcLeftLambda(lambda);
      calcRightLambda(absRoughness, reynolds, lambda, diameter);
      lambda = lambda + 0.00001;
      if (counter == 55555555) {
        break;
      }
      counter++;
    }
    return lambda;
  };

 // Calculate lambda with no units - Input in  ([mm], [m/s], [°C])
   var calcHeatLinearDrop = function (lambda, heatDiameter, heatFlow, temperature) {
    linearDrop = calcWaterDensity(temperature) * (lambda / (heatDiameter / 1000)) * ((heatFlow * heatFlow) / 2);
    return linearDrop;
  };

//      Heating calculator - End
//Calculations section - End

