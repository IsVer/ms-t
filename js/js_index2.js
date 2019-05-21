const w = 400;
const h = 400;


const margin = {
    right: 10,
    left: 10,
    top: 10,
    bottom: 10
};

const width = w - margin.right - margin.left;
const height = h - margin.top - margin.bottom;


let numCols = Math.floor(Math.sqrt(500));

// set areas for graphs
const graph1 = d3.select("#graph1")
    .append("svg")
    .attr("id", "chart1")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(0" + margin.left + "," + margin.top + ")");

const graph2 = d3.select("#graph2_1")
    .append("svg")
    .attr("id", "chart2")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(0" + margin.left + "," + margin.top + ")");

const graph3 = d3.select("#graph3")
    .append("svg")
    .attr("id", "chart3")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(0" + margin.left + "," + margin.top + ")");

// prepare tooltips
let tooltip = d3.select('#subtitle')
    .attr('class', 'tooltip');
let switchEnviron = "master";


// build the first graph, appears before the slider was touched


// add a slider to communicate with each graph:
let sliderYears = d3.sliderBottom()
    .min([2014])
    .max([2018])
    .width(300)
    .ticks(5)
    .step(1)
    .tickFormat(d3.format('.0f'))
    .default(2018);

var gStep = d3
    .select('div#slider-step')
    .append('svg')
    .attr('width', 380)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gStep.call(sliderYears);



////////////////////////////
// ###  Graph functions ###
////////////////////////////

//Preparing dataformatter and 2 functions for graphs

let thisYear = 2018;

let getYearData = function( data, yearInputFromSlider) {
    return (data.filter( function(d) {return d.year === yearInputFromSlider }));
};

// to move the SVG element to the front
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

let getCompanyClass = function(d) {return d.split('*').join('').split("!").join('').split('.').join('').split(',').join('').split('&').join('').split("'").join('').split(' ').join('_').toLowerCase()};


let mastergraph = function(yearData, graphNr) {
    d3.select(".proptextundergraph").html('') ;
    // select companies only
    let companies = d3.map( yearData, function(d){return d.issuer_company } ).keys();

    //console.log(yearData[0]);
    let getShStroke = (company) => {

        let shaStroke = "#C2C2C2";
        let againstManFill = "#ffffff";
        let environPropText = [];

        yearData.forEach( ( datarow ) => {
            if (datarow.issuer_company === company) {
                let shaPropCount = +datarow.count_sharehold_propo;
                let againstMgmt = +datarow.count_against_mgmt;
                let environProp = +datarow.environ_prop;
                let prop = datarow.proposal;

                if ( shaPropCount > 0 )
                { shaStroke = "#E1652A"}
                if ( againstMgmt > 0)
                { againstManFill = "#FFD275" }
                if (environProp > 0) {
                    environPropText.push(prop);
                }
            }
        });

        return [shaStroke, againstManFill, environPropText];
    }; // end of getShStroke

    let sqs = graphNr.selectAll("rect")
        .data(companies)
        .enter()
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("x", function(d, i){
            let colIndex = i % numCols;
            return colIndex * 15
        })
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols);
            return  rowIndex * 15
        })
        .attr("stroke", (d) => { return getShStroke(d)[0] })
        .attr("fill", (d) => { return getShStroke(d)[1] })
        .attr("class",function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
        });


        sqs.on('mouseover', function(d)  {
            let companyName = d;

            tooltip
                .transition()
                .duration(100)
                .style('opacity', 0.9);
            tooltip
                .html(() =>  {return "on proxy issues at " + "<span style='color:#FF6116'>" + companyName + "</span>" })
                .style("left", d + "px")
                .style("top", d + "px");

            if ( this !== d3.select('rect:last-child').node()) {
                    this.parentElement.appendChild(this) }

            let companyClass = getCompanyClass(d);

            d3.selectAll('.c'+ companyClass + "__rect")
                .moveToFront()
                .classed('selectedSq',true);



        }) // end of mouseover
        .on( 'mouseout', function (d) {
            let companyClass = getCompanyClass(d);

            d3.selectAll('.c'+ companyClass + "__rect")
                .classed('selectedSq',false);

            //
            // let rects = d3.selectAll('rect')
            //     .classed("selectedSq", false)
            //     .attr('mouse','pointer')
            //     .attr("transform", "translate(0, 0)")
            //     .attr("height", 12)
            //     .attr("width", 12)
            //     .attr("stroke-width", 1);

            tooltip
                .html(() => {return "on proxy issues at S&P 500 companies" })
                .transition()
                .duration(100)
                .style('opacity', 0.9);
        });




}; // end of Mastergraph1 function

// _updateGraph
let updateGraph = function(yearData, graphNr) {

    d3.select(".proptextundergraph").html('') ;

    legend_IMG.selectAll("*")
        .remove();
    d3.select("#legend_mainGraph")
        .style("text-decoration", "None");
    legend_IMG.style("visibility", "hidden");

    // select companies only
    let companies = d3.map( yearData, function(d){ return d.issuer_company } ).keys();

    //reset heading
    tooltip.html("on proxy issues at S&P 500 companies");


    let getShStroke = (company) => {

        let shaStroke = "#C2C2C2";
        let againstManFill = "#ffffff";

        yearData.forEach( ( datarow ) => {
            if (datarow.issuer_company === company) {
                let shaPropCount = +datarow.count_sharehold_propo;
                let againstMgmt = +datarow.count_against_mgmt;
                if ( shaPropCount > 0 )
                { shaStroke = "#E1652A"}
                if ( againstMgmt > 0)
                { againstManFill = "#FFD275" }
            }
        });
        return [shaStroke, againstManFill];
    }; // end of getShStroke


    let t = d3.transition()
        .duration(1000);

    //d3.selectAll('rect').classed('selectedSq',false)
    let rects = graphNr.selectAll("rect")
        .classed('selectedSq',false)
        .data(companies);
    // exit
    rects
        .exit()
        .remove();


    let blocks = rects
        .data(companies )
        .enter()
        .append("rect")
        .attr('class','blocks')
        .attr("height", 6)
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols);
            return  rowIndex * 15
        })
        .attr("x", function(d, i){
            let colIndex = i % numCols;
            return colIndex * 15
        })
        .attr('width', 10)
        .style("fill", "#ffffff")
        .classed('selectedSq',false)
        .classed(function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
        }, false);


    let sqs = blocks.merge(rects)
        .transition(t)
        .attr("x", function(d, i){
            let colIndex = i % numCols;
            return colIndex * 15
        })
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols);
            return  rowIndex * 15
        })
        .attr("width", 12)
        .attr("height", 12)
        .style("stroke", (d)=>{return getShStroke(d)[0]})
        .style('fill', (d)=>{return getShStroke(d)[1]})
        .attr("class",function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
            });

        d3.selectAll("rect").on('mouseover', function(d)  {
                let companyName = d;
                let companyClass = getCompanyClass(d);

            d3.selectAll('.c'+ companyClass + "__rect")
                .moveToFront()
                .classed('selectedSq',true);

            tooltip
                .transition()
                .duration(100)
                .style('opacity', 0.9);
            tooltip
                .html(() =>  {
                    return "on proxy issues at " + "<span style='color:#FF6116'>" + companyName + "</span>" })
                .style("left", d + "px")
                .style("top", d + "px");
        })
        .on( 'mouseout', function (d) {
            let companyClass = getCompanyClass(d);

            d3.selectAll('.c'+ companyClass + "__rect")
                .classed('selectedSq',false);

            tooltip
                .html(() => {return "on proxy issues at S&P 500 companies" })
                .transition()
                .duration(100)
                .style('opacity', 0.9);
        });

    d3.selectAll("#environ_btn")
        .html("environmental"); // TODO fix this
};


// _updateGraph_Environ _environ function
let updateGrap_Environ = function( yearData, graphNr) {


    d3.select(".proptextundergraph").html('') ;

    legend_IMG.selectAll("*")
        .remove();
    d3.select("#legend_mainGraph")
        .style("text-decoration", "None");
    legend_IMG.style("visibility", "hidden");


    d3.select(".tooltip").html("on <span style='border-bottom:  3px solid darkorange;'> environmental</span> proxy issues");

    // select unique companies only
    let companies = d3.map( yearData, function(d){ return d.comp} ).keys();

    let getfillEnv = function( company ) {
        let fill, fund;
        yearData.forEach( (datarow) => {
            if (datarow.comp === company) {
                fill = datarow.fill;
                fund = datarow.fund;
            }
        });
        return [fill, fund];
    };

    let t = d3.transition()
        .duration(1000);

    let rects = graphNr.selectAll("rect")
        .data(companies)

    rects.exit()
        .remove();

    let numCols2 = 7;
    let blocks =  rects
        .data(companies)
        .enter()
        .append("rect")
        .attr("height", 6)
        .style("stroke", "#ec5900")
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols2);
            return  rowIndex * 25
        })
        .attr("x", function(d, i){
            let colIndex = i % numCols2;
            return colIndex * 25
        })
        .attr('width', 10)
        .style("fill", "#ffffff")
        .classed('selectedSq',false)
        .classed(function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
        }, false)
        .attr("class", function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect" })
        .attr("data-fund", (d)=>{ return getfillEnv(d)[1] } );



    blocks.merge(rects)
        .transition(t)
        .attr("x", function(d, i){
            let colIndex = i % numCols2;
            return colIndex * 25
        })
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols2);
            return  rowIndex * 25
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("stroke", "#ec5900")
        .style('fill', (d)=>{ return getfillEnv(d)[0] } )
        .attr("class", function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect";
        })
        .attr("data-fund", (d)=>{ return getfillEnv(d)[1] } );


    d3.selectAll('rect').on('mouseover', function(d)  {


        let fund = this.getAttribute('data-fund');

        //let yearStr = yearData[1].year.toString();
        let yearStr = thisYear.toString();

        let companyStr = d.charAt(0).toUpperCase() + d.substring(1).toLowerCase();

        // get the right data for this particular graph
        let getDataforProp = function(fundname) {
            if (fundname === "BlackRock") { dataMouse = BrCompaniesEnvFilterBIG[yearStr]}
            else if (fundname === "Vanguard") { dataMouse = VangCompaniesEnvFilterBIG[yearStr]}
            else { dataMouse = StStCompaniesEnvFilterBIG[yearStr] };
            return dataMouse;
        };


        // get the right
        let getprop = function( company, year ) {
            let dataforProp = getDataforProp(fund);

            dataforProp.forEach( (datarow) => {

                if ((datarow.comp.toLowerCase() === company.toLowerCase()) && ( datarow.year == year) ) {
                    propsEnv = datarow.allProps;
                }
            });
            //console.log(propsEnv);
            return propsEnv;
        };

        let thisprop = getprop(d, thisYear);

        let propSentences = thisprop.join("")
        d3.select(".proptextundergraph").html(
            "At <span style='font-weight: bolder; color: #ec5900'> "+ companyStr + "</span>, shareholder activists proposals: <br><br>" + propSentences
        ) ;


        let companyName = d;
        let companyClass = getCompanyClass(d);

        d3.selectAll('.c'+ companyClass + "__rect")
            .moveToFront()
            .classed('selectedSqEnviron',true);


        tooltip
            .transition()
            .duration(100)
            .style('opacity', 0.9);
        tooltip
            .html(() =>  {return "on <span style='border-bottom:  3px solid darkorange;'> environmental</span> proxy issues at " + "<span style='color:#FF6116'>" + companyName + "</span>" })
            .style("left", d + "px")
            .style("top", d + "px");


    })
        .on( 'mouseout', function (d) {


            let companyClass = getCompanyClass(d);


            d3.selectAll('.c'+ companyClass + "__rect")
                .classed('selectedSqEnviron',false);

            tooltip
                .html("on <span style='border-bottom:  3px solid darkorange;'> environmental</span> proxy issues")
                .transition()
                .duration(100)
                .style('opacity', 0.9);
        });

};
///////////////////////////
// ###  Graph 1 - BR   ###
///////////////////////////

// load the data
let dataBr;
d3.csv('Data/BrDataSP500_allyears.csv')
    .then(function(data) {
        let dataMC = data.sort((a, b) => ( +a.marketcap < +b.marketcap ) ? 1 : -1);
        // convert years from strings to numbers
        dataMC.forEach( function(d) { return d.year = +d.year })

        // get data from slider
        let startYearData = getYearData(dataMC, 2018);

        // start with a graph
        mastergraph(startYearData, graph1);
        return dataBr = dataMC;
    })
    .catch(function(error){
        console.log('data load error')
    });



//////////////////////////
// ### Graph 2 - VANG ###
///////////////////////////

// load the data
let dataVang;
d3.csv('Data/Vanguard_proposals_all_years.csv')
    .then(function(data) {
        let dataMC = data.sort((a, b) => ( +a.marketcap < +b.marketcap ) ? 1 : -1);
        // convert years from strings to numbers
        dataMC.forEach( function(d) { return d.year = +d.year });

        // start with a graph
        let startYearData = getYearData(dataMC, 2018);
        mastergraph(startYearData, graph2);

      dataVang = dataMC;

    })
    .catch(function(error){
        console.log('data load error')
    });

//////////////////////////
// ### Graph 3 - StSt ###
///////////////////////////


// load the data
let dataStSt;
let dataStStSorted;
d3.csv('Data/StStDataSP500_allyears.csv')
    .then(function(data) {

        let dataMC = data.sort((a, b) => ( +a.marketcap < +b.marketcap ) ? 1 : -1);
        // convert years from strings to numbers
        dataMC.forEach( function(d) { return d.year = +d.year })

        // start with a graph
        let startYearData = getYearData(dataMC, 2018);
        mastergraph(startYearData, graph3);

        dataStSt = dataMC;


    })
    .catch(function(error){
        console.log('data load error')
    });


//  selection for Environmental props
// _getdataEnviron
let BrCompaniesEnvFilterBIG = {};
let VangCompaniesEnvFilterBIG = {};
let StStCompaniesEnvFilterBIG = {};

let getdataEnviron = function(year) {

    let BrCompaniesEnvFilter = [];
    let VangCompaniesEnvFilter = [];
    let StStCompaniesEnvFilter = [];

    let BRDataForProp = getYearData(dataBr, year);
    let VangDataForProp = getYearData(dataVang, year);
    let StStDataForProp = getYearData(dataStSt, year);

    let fund;
    // get fill for environ issues and proposal text based on company
    let getStrokeText = function (company, dataEn, fund) {

        let againstManFill;
        let proposals = [];
        let countvotedAgainstM = 0;

        let dataEnSelect = dataEn.filter( lines => (lines.environ_prop  > 0 && lines.year === year  )  );

        dataEnSelect.forEach((datarow) => {

            if (datarow.issuer_company.toLowerCase() === company.toLowerCase()) {
                let voted = datarow.against_mgmt;
                let voteToDisplay;
                if (voted === "AGAINST MGMT") {
                    countvotedAgainstM += 1;
                    voteToDisplay = fund + " voted  <span style='font-weight: bolder; border-bottom: 2px solid darkorange;'>FOR</span> in "  + datarow.year + "<br>";

                } else {
                    voteToDisplay =  fund  + " voted <span style='font-weight: bolder; border-bottom: 2px solid darkorange;'>against</span> in " + thisYear  ;}
                let sentence = datarow.proposal.toLowerCase();
                let upper = sentence.charAt(0).toUpperCase() + sentence.substring(1);
                proposals.push( "<li>" + upper + "  --  " + voteToDisplay + "</li>");
            }
        });

        let countVotes = (countvotedAgainstM/proposals.length)*100;
        if (countVotes=== 0) {againstManFill = "#c0caca" }
        else if ((countVotes > 0 ) && (countVotes < 30)) { againstManFill ="#949126" }
        else if ((countVotes > 5)) { againstManFill =  "#2e5603" }

        return [againstManFill, proposals];

    }; // end of get stroke and text


    BRDataForProp.forEach( ( datarow ) => {
        let environProp = +datarow.environ_prop;
        if (( environProp  > 0) && ( +datarow.year === year)) {
            fund = "BlackRock";
            let comp = datarow.issuer_company;
            let voted = datarow.against_mgmt;
            let propnr = datarow.prop_nr;
            let prop = datarow.proposal;
            let stroketext = getStrokeText(comp, BRDataForProp, fund); // will be fill [0] and prop [1]
            let allProps = stroketext[1];
            let fill = stroketext[0];
            BrCompaniesEnvFilter.push( { fund: fund, comp:comp, propnr:propnr, prop:prop,  voted:voted, allProps: allProps, fill: fill, year:year} )
        }
    });


    VangDataForProp.forEach( ( datarow ) => {
        let environProp = +datarow.environ_prop;
        if (( environProp  > 0) && ( +datarow.year === year)) {
            fund = "Vanguard";
            let comp = datarow.issuer_company;
            let voted = datarow.against_mgmt;
            let propnr = datarow.prop_nr;
            let prop = datarow.proposal;
            let stroketext = getStrokeText(comp, VangDataForProp, fund); // will be fill [0] and prop [1]
            let allProps = stroketext[1];
            let fill = stroketext[0];
            VangCompaniesEnvFilter.push( { fund: fund, comp:comp, propnr:propnr, prop:prop,  voted:voted, allProps: allProps, fill: fill, year:year} )
        }
    });

    StStDataForProp.forEach( ( datarow ) => {
        let environProp = +datarow.environ_prop;
        if (( environProp  > 0) && ( +datarow.year === year)) {
            fund = "StateStreet";
            let comp = datarow.issuer_company;
            let voted = datarow.against_mgmt;
            let propnr = datarow.prop_nr;
            let prop = datarow.proposal;
            let stroketext = getStrokeText(comp, StStDataForProp, fund); // will be fill [0] and prop [1]
            let allProps = stroketext[1];
            let fill = stroketext[0];
            StStCompaniesEnvFilter.push( { fund: fund, comp:comp, propnr:propnr, prop:prop,  voted:voted, allProps: allProps, fill: fill, year:year} )
        }
    });

    BrCompaniesEnvFilterBIG[year] = BrCompaniesEnvFilter;
    VangCompaniesEnvFilterBIG[year] = VangCompaniesEnvFilter;
    StStCompaniesEnvFilterBIG[year] = StStCompaniesEnvFilter;

    return [ BrCompaniesEnvFilter, VangCompaniesEnvFilter, StStCompaniesEnvFilter ];

};


const createEnviron = function(year) {
    let environYearData = getdataEnviron( year ); // get data for each fund
    let BrEnviron = environYearData[0];
    let VangEnviron = environYearData[1];
    let StStEnviron = environYearData[2];

    updateGrap_Environ (BrEnviron, graph1);
    updateGrap_Environ (VangEnviron, graph2);
    updateGrap_Environ (StStEnviron, graph3);

};

d3.select("#environ_btn").on('click', function(d) {

    if (switchEnviron === "environ") {

        d3.select("#environ_btn").style("text-decoration", "None")
        switchEnviron = "master"; // switch to master

        let BrDataUpdate = getYearData(dataBr, thisYear);
        updateGraph( BrDataUpdate, graph1);

        let VangDataUpdate = getYearData(dataVang, thisYear);
        updateGraph(VangDataUpdate , graph2);

        let StStDataUpdate = getYearData(dataStSt, thisYear);
        updateGraph(StStDataUpdate, graph3);



    }
     else {
        d3.select("#environ_btn").html("all combined");
        switchEnviron = "environ"; // switch to environ
        return createEnviron(thisYear)
    }

});


sliderYears.on("onchange", val => {


    d3.select('#main-title').text("How did the largest asset managers vote in " + val + "?");

    if (switchEnviron === "master") {
            let BrDataUpdate = getYearData(dataBr, val);
            updateGraph( BrDataUpdate, graph1);

            let VangDataUpdate = getYearData(dataVang, val);
            updateGraph( VangDataUpdate , graph2);

            let StStDataUpdate = getYearData(dataStSt, val);
            updateGraph( StStDataUpdate, graph3);

            d3.select("#environ_btn").on('click', function() {
                let environYearData = getdataEnviron(val); // get data for each fund
                let BrEnviron = environYearData[0];
                let VangEnviron = environYearData[1];
                let StStEnviron = environYearData[2];

                let dataMouse ;
                let propsEnv = []; //todo a mystery why this doesn not update! 

                updateGrap_Environ(BrEnviron, graph1);
                updateGrap_Environ(VangEnviron, graph2);
                updateGrap_Environ(StStEnviron, graph3);



            }); // end of onclick
    } else {
        createEnviron(val)
    }
    thisYear = val;
    }); // end of sliders


// set up how to read:
let legendSwitch= "showIMG";
let legend_IMG = d3.select("#legend_mainGraph_IMG");
let legend_butto = d3.select("#legend_mainGraph");
legend_IMG.style("visibility", "hidden");
legend_butto.on("click", function() {

    if (legendSwitch === "showIMG" && switchEnviron === "master") {
        legend_IMG.style("visibility", "visible");
        legend_IMG
            .append("svg:image")
            .attr("x", 10)
            .attr("y", 35)
            .attr('width', "100%")
            .attr('height', "90%")
            .attr("xlink:href", "Data/img/Legend_all_topics.svg");
        d3.select("#legend_mainGraph")
            .style("text-decoration", "line-through");
        legendSwitch = "removeIMG";

    } else if (legendSwitch === "showIMG" && switchEnviron === "environ") {
        legend_IMG.style("visibility", "visible");
        legend_IMG
            .append("svg:image")
            .attr("x", 10)
            .attr("y", 35)
            .attr('width', "70%")
            .attr('height', "70%")
            .attr("xlink:href", "Data/img/legend_environMainGraph.svg");
        d3.select("#legend_mainGraph")
            .style("text-decoration", "line-through");
        legendSwitch = "removeIMG";

    } else {
        legend_IMG.style("visibility", "hidden");
        legend_IMG.selectAll("*")
            .remove()
        d3.select("#legend_mainGraph")
            .style("text-decoration", "None");
        legendSwitch = "showIMG";
    }
});

