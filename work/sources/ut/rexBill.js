

    function loadBillJSON(sessionID,billNumber,testMode){


        var pageID =sessionID.substring(0,4)+"_"+billNumber;
        //$.ajax({url:"/Test/Hc?page="+pageID.substring(0,11)})
        $.ajax({url:"/HC.jsp?page="+pageID.substring(0,11)})
            .done(function(){
                //console.log("done");
            }).fail(function() {
                    //console.log("fail");
            });



        var jsonurl = "/data/"+sessionID+"/"+billNumber+".json";
        if(testMode==true){
            jsonurl = "/data2/"+sessionID+"/"+billNumber+".json";
        }
        $.ajax({
            type: "GET",
            cache: false,
            url: jsonurl,
            success: function(json) {
                console.log(json);
                var linkcnt=0;

                var sessionTxt="";
                if(json.sessionID.endsWith("GS")){
                    sessionTxt = json.sessionID.replace("GS","")+" General Session";
                }else{
                    sessionTxt = json.sessionID.substring(0,4)+" ";
                    var sessType=json.sessionID.substring(4,5);
                    var sessNum=json.sessionID.substring(5,6);

                    if(sessNum=="A"){
                        sessionTxt+="10";
                    }else if(sessNum=="B"){
                        sessionTxt+="11";
                    }else if(sessNum=="C"){
                        sessionTxt+="12";
                    }else if(sessNum=="D"){
                        sessionTxt+="13";
                    }else if(sessNum=="E"){
                        sessionTxt+="14";
                    }else{
                        sessionTxt+=sessNum;
                    }

                    if(sessNum=="1"){
                        sessionTxt+="st";
                    }else if(sessNum=="2"){
                        sessionTxt+="nd";
                    }else if(sessNum=="3"){
                        sessionTxt+="rd";
                    }else{
                        sessionTxt+="th";
                    }

                    if(sessType=="S"){
                        sessionTxt+=" Special Session";
                    }else if(sessType=="X"){
                        sessionTxt+=" House Special Session";
                    }else if(sessType=="Y"){
                        sessionTxt+=" Senate Special Session";
                    }
                    
                    
                }
                $("a#sessionName").html(sessionTxt);


                if(json.primeSponsor){
                    $("#sponsors_box").append(
                        "<div id='sponsor_prime'>"+
                        "   <b>Bill Sponsor:</b>"+
                        "   <div class=\"portraitFrame\" style=\"background-image:URL('/images/legislator/"+json.primeSponsor+".jpg'\"></div>"+
                        "   <a href=\"/asp/roster/leglookup.asp?house="+json.primeSponsorHouse+"&Legid="+json.primeSponsor+"\" target='_blank'>"+json.primeSponsorName+"</a>"+
                        "</div>"
                    );
                }

                if(json.floorSponsor){
                    $("#sponsors_box").append(
                        "<div id='sponsor_floor'>"+
                        "   <b>Floor Sponsor:</b>"+
                        "   <div class=\"portraitFrame\" style=\"background-image:URL('/images/legislator/"+json.floorSponsor+".jpg'\"></div>"+
                        "   <a href=\"/asp/roster/leglookup.asp?house="+json.floorSponsorHouse+"&Legid="+json.floorSponsor+"\" target='_blank'>"+json.floorSponsorName+"</a>"+
                        "</div>"
                    );
                }

                // if(json.coSponsorList){
                //     $("#cosponsor_box").append("<b>CoSponsor(s):</b><ul id='cosponsor_ul'></ul>");
                //     for (let i = 0; i < json.coSponsorList.length; i++) {
                //         let spon = json.coSponsorList[i];
                //         $("#cosponsor_ul").append("<li><a href='/asp/roster/leglookup.asp?house="+spon.house+"&Legid="+spon.lid+"' target='_blank'>"+spon.name+"</a></li>");
                //     }
                // }

                if(json.billVersionList){
                    var $currentVersion_documents;
                    var $moveTo_currentVersion_documents = $("<div></div>");

                    for (let i = 0; i < json.billVersionList.length; i++) {
                        let billv = json.billVersionList[i];

                        if(billv.activeVersion==true){//Set current version documents
                            if(billv.coSponsorList.length>0){
                                $("#staff_box").prepend("<div><b>CoSponsor(s)</b></a><ul id='cosponBody_"+billv.billNumber+"' style='column-count:2;'></ul></div>");

                                for (let j = 0; j < billv.coSponsorList.length; j++) {
                                    var cospon = billv.coSponsorList[j];
                                    var prefix=" ";
                                    $("#cosponBody_"+billv.billNumber).append("<li style='padding:0;'><a href='/asp/roster/leglookup.asp?house="+cospon.house+"&Legid="+cospon.lid+"' target='_blank'>"+prefix+cospon.name+"</a></li>");
                                }
                            }
                        }
                    }
                }

                if (json.draftingAttorney) {
                    if(json.draftingAttorney=="Megan L. Bolin"){
                        $("#staff_box").append("<li><b>Drafting Analyst: </b>" + json.draftingAttorney + "</li>");
                    }else{
                        $("#staff_box").append("<li><b>Drafting Attorney: </b>" + json.draftingAttorney + "</li>");
                    }
                }
                if (json.fiscalAnalyst) {
                    $("#staff_box").append("<li><b>Fiscal Analyst: </b>" + json.fiscalAnalyst + "</li>");
                }

                if(json.sessionIndex=="1") {
                    $("#tackingDiv").append("<li><b>Bill Tracking</b></li>");
                    $("#tackingDiv").append("<li><a id=\"trackbtn\" class=\"button\" onclick=\"trackBtnClick('"+json.billNumber+"','trackbtn');\">Track this</a>"+
                        "<a href=\"/tracking/tracking.jsp\" target=\"_blank\">My Legislation</a></li>");
                    $("#trackingDiv").after("<hr>");
                }


                //Loop through Agenda list 
                if (json.agendaList) {
                    for (let i = 0; i < json.agendaList.length; i++) {
                        var agenda = json.agendaList[i];
                        console.log(agenda);
                        var $dest;
                        if(agenda.committeeID.startsWith("H")){
                            $dest = $("#commhearings .houseCom");

                        }else if(agenda.committeeID.startsWith("S")){
                            $dest = $("#commhearings .senateCom");
                        }

                        var aghtml="<div id='comm"+agenda.committeeID+"'>"+
                            "   <a href='https://le.utah.gov/committee/committee.jsp?year="+json.year+"&com="+agenda.committeeID+"&mtgid="+agenda.mtgID+"' target='_blank'>"+agenda.committeeName+"</a>"+
                            "   <ul class='commUL' id='commUL"+agenda.committeeID+"'>";
                        if(agenda.agendaURL){
                            aghtml+="<li><a href='"+agenda.agendaURL+"' target='_blank'>Agenda</a><a href='"+agenda.agendaURL.replace(".htm",".pdf")+"' target='_blank'><img src=\"/images/pdf.gif\" alt=\"PDF document\" height=\"17\" width=\"15\"></a></li>";
                        }
                        if(agenda.minutesURL){
                            aghtml+="<li><a href='"+agenda.minutesURL.replace("/html/","/pdf/").replace(".htm",".pdf")+"' target='_blank'>Minutes<img src=\"/images/pdf.gif\" alt=\"PDF document\" height=\"17\" width=\"15\"></a></li>";
                        }
                        if(agenda.markerID){
                            // aghtml+="<li><a href='/av/committeeArchive.jsp?timelineID="+agenda.markerID+"' target='_blank'>Audio </a></li>";
                            aghtml+="<li><a href='https://www.utleg.gov/event-streaming/committee/timeline/"+agenda.markerID+"' target='_blank'>Audio </a></li>"; //Vimeo compatible links
                        }
                        aghtml+="   </ul>"+
                            "</div>";

                        $dest.prepend(aghtml);
                    }
                }

                //Loop through Floor Debates 
                if (json.floorDebateList) {
                    if(json.floorDebateList.length>0){
                        $("#billVideo").append("<b>Floor Debate</b><ul id='floorDebateUL'></ul>")
                    }
                    for (let i = 0; i < json.floorDebateList.length; i++) {
                        var floorDebate = json.floorDebateList[i];
                        var floorStr="";
                        if(floorDebate.house=="S"){
                            floorStr="Senate Floor";
                        }else if(floorDebate.house=="H"){
                            floorStr="House Floor";
                        }
                        // $("#floorDebateUL").append("<li><a href='https://le.utah.gov/av/floorArchive.jsp?markerID="+floorDebate.markerID+"'>"+floorStr+", Day "+floorDebate.dayOfSession+" ("+floorDebate.sessionDate+") ["+floorDebate.description+"]"+"</a></li>");
                        $("#floorDebateUL").append("<li><a href='https://www.utleg.gov/event-streaming/floor/marker/"+floorDebate.markerID+"' target='_blank'>"+floorStr+", Day "+floorDebate.dayOfSession+" ("+floorDebate.sessionDate+") ["+floorDebate.description+"]"+"</a></li>");

                    }
                }


                /////////////////////////////
                //Loop through bill versions
                if(json.billVersionList){
                    var $currentVersion_documents;
                    var $moveTo_currentVersion_documents = $("<div></div>");


                    for (let i = 0; i < json.billVersionList.length; i++) {
                        let billv = json.billVersionList[i];
                        // var fiscalDocCnt=0;
                        var docCnt=0;
                        var destinationContainer ="";

                        if(billv.activeVersion==false){
                            //other version
                            destinationContainer = "#otherVersions_ul";
                        }else{
                            //current version
                            destinationContainer = "#currentVersion_ul";
                            $("#currentVersion_title").html("Current Version: "+billv.billNumberShort);
                        }
                        $(destinationContainer).append("<li><div class='versionHead groupHead' id='verHead_"+billv.billNumber+"' onclick='toggleHiddenView(\"#verHead_"+billv.billNumber+"\",\"#verBody_"+billv.billNumber+"\")'>"+billv.billNumberShort+"</div>"+
                            "<div id='verBody_"+billv.billNumber+"' class='versionBody groupBody'>"+
                            "<div class='verCatagory'><div class='verCatagoryTitle'>Text</div><ul class=\"ul_billText\"></ul></div>"+
                            "<div class='verCatagory fiscalNoteBlock'><div class='col1'></div><div class='col2'></div></div>"+
                            "<div class='verCatagory'><div class='verCatagoryTitle'>Documents</div><ul class=\"ul_billDocs\"></ul></div>"+
                            //"<div class='verCatagory'><div class='verCatagoryTitle'>Fiscal Impact</div><ul class=\"ul_billFiscal\"></ul></div>"+
                            "</div>"+
                            "</li>"
                        );

                        if(billv.activeVersion==true){//Set current version documents so we can move Conference committee reports there after the loop is done.
                            $currentVersion_documents = $(destinationContainer+" .ul_billDocs");
                        }

                        /////////////////////////////
                        //Substitute sponsor 
                        if(json.primeSponsor!=billv.versionSponsor){
                            $("#verBody_"+billv.billNumber).prepend("<div class='verCatagory'><span class='cospon_head verCatagoryTitle' >Substitute Sponsor: </span>"+billv.versionSponsorName+"</div>");

                        }

                        /////////////////////////////
                        //Loop through CoSponsors
                        // if(billv.coSponsorList.length>0){
                        //     $("#verBody_"+billv.billNumber).append("<div class='verCatagory'><a id='cosponHead_"+billv.billNumber+"' class='cospon_head verCatagoryTitle groupHead' onclick='toggleHiddenView(\"#cosponHead_"+billv.billNumber+"\",\"#cosponBody_"+billv.billNumber+"\")'>CoSponsors ("+billv.coSponsorList.length+")</a><div id='cosponBody_"+billv.billNumber+"' class='cospon_body groupBody'></div></div>");
                        //     for (let j = 0; j < billv.coSponsorList.length; j++) {
                        //         var cospon = billv.coSponsorList[j];
                        //         var prefix="";
                        //         if(cospon.house=="H"){
                        //             prefix="Representative ";
                        //         }else if(cospon.house=="S"){
                        //             prefix="Senator ";
                        //         }
                        //         $("#cosponBody_"+billv.billNumber).append("<a href='/asp/roster/leglookup.asp?house="+cospon.house+"&Legid="+cospon.lid+"' target='_blank'>"+prefix+cospon.name+"</a>");
                        //     }
                        // }

                        /////////////////////////////
                        //Loop through Subjects
                        if(billv.subjectList.length>0){
                            //$("#verBody_"+billv.billNumber).append("<div class='verCatagory'><a id='subjectHead_"+billv.billNumber+"' class='subject_head verCatagoryTitle' onclick='toggleHiddenView(\"#subjectHead_"+billv.billNumber+"\",\"#subjectBody_"+billv.billNumber+"\")'>Subject(s)</a><div id='subjectBody_"+billv.billNumber+"' class='subject_body'></div></div>");
                            $("#verBody_"+billv.billNumber).append("<div class='verCatagory'><a id='subjectHead_"+billv.billNumber+"' class='subject_head verCatagoryTitle groupHead' onclick='toggleHiddenView(\"#subjectHead_"+billv.billNumber+"\",\"#subjectBody_"+billv.billNumber+"\")'>Subjects ("+billv.subjectList.length+")</a><div id='subjectBody_"+billv.billNumber+"' class='subject_body groupBody'></div></div>");
                            for (let j = 0; j < billv.subjectList.length; j++) {
                                var sj = billv.subjectList[j];
                                
                                $("#subjectBody_"+billv.billNumber).append("<a href='/ASP/RelatedBill/similar.asp?scode="+sj.code+"&Year="+json.year+"' target='_blank'>"+sj.description+"</a><br>");
                            }
                        }

                        /////////////////////////////
                        //Loop through Sections Affected
                        if(billv.sectionAffectedList.length>0){
                            $("#verBody_"+billv.billNumber).append("<div class='verCatagory'><a id='sectionHead_"+billv.billNumber+"' class='section_head verCatagoryTitle groupHead' onclick='toggleHiddenView(\"#sectionHead_"+billv.billNumber+"\",\"#sectionBody_"+billv.billNumber+"\")'>Sections Affected</a><div id='sectionBody_"+billv.billNumber+"' class='section_body groupBody'></div></div>");
                            var secAffCnt=0;
                            for (let j = 0; j < billv.sectionAffectedList.length; j++) {
                                let affSec = billv.sectionAffectedList[j];
                                if(!["","effdate","retro","contingent","revisor","votesub","approp","rule","coord"].includes(affSec.secNo)){
                                    $("#sectionBody_"+billv.billNumber).append("<li><A HREF=\"/asp/codelookup/codelookup.asp?section="+affSec.secNo+"\" class=\"nlink\">"+affSec.secNo+"</A></li>");
                                    secAffCnt++;
                                }
                            }
                            if(secAffCnt==0){
                                //$("#sectionBody_"+billv.billNumber).html("None");
                                $("#sectionHead_"+billv.billNumber).hide();
                                $("#sectionBody_"+billv.billNumber).hide();
                            }else{
                                $("#sectionHead_"+billv.billNumber).html("Sections Affected ("+secAffCnt+")");
                            }
                        }


                        /////////////////////////////
                        //Loop through bill documents
                        for (let j = 0; j < billv.billDocs.length; j++) {
                            let billdoc = billv.billDocs[j];
                            let $dest = $("#verBody_"+billv.billNumber+" ul.ul_billDocs");
                            let hasPDF=false;
                            if(["pubfn"].includes(billdoc.fileType.toLowerCase())){
                                $dest = $("#verBody_"+billv.billNumber+" ul.ul_billText").parent();
                                // fiscalDocCnt++;
                            }else if(["amended","introduced","enrolled","public","pubsub"].includes(billdoc.fileType.toLowerCase())){
                                $dest = $("#verBody_"+billv.billNumber+" ul.ul_billText");
                            }else{
                                docCnt++;
                            }
                            
                            if(billdoc.fileType.toLowerCase()=="comreport"){
                                console.log(billdoc);
                                if(billdoc.chamber.toLowerCase()=="h"){
                                    $dest = $(".houseCom");
                                    console.log("found H");
                                    if(billdoc.strVal1!=""){
                                        $dest = $(".houseCom #comm"+billdoc.strVal1);
                                        if($dest.length==0){
                                            var comhtml="<div id='comm"+billdoc.strVal1+"'>"+
                                                "   <ul class='commUL' id='commUL"+billdoc.strVal1+"'></ul></div>";
                                            $(".houseCom").append(comhtml);    
                                            $dest = $(".houseCom #comm"+billdoc.strVal1);
                                        }
                                    }
                                    // else{//if the committee is not given
                                    //     $dest = $("#currentVersion_ul .ul_billDocs");
                                    // }
                                }else if(billdoc.chamber.toLowerCase()=="s"){
                                    $dest = $(".senateCom");
                                    console.log("found S2");
                                    if(billdoc.strVal1!=""){
                                        $dest = $(".senateCom #comm"+billdoc.strVal1);
                                        if($dest.length==0){
                                            var comhtml="<div id='comm"+billdoc.strVal1+"'>"+
                                                "   <ul class='commUL' id='commUL"+billdoc.strVal1+"'></ul></div>";
                                            $(".senateCom").append(comhtml);    
                                            $dest = $(".senateCom #comm"+billdoc.strVal1);
                                        }
                                    }
                                    // else{//if the committee is not given
                                    //     $dest = $("#currentVersion_ul .ul_billDocs");
                                    // }
                                }else if(billdoc.chamber.toLowerCase()=="c"){
                                    $dest = $moveTo_currentVersion_documents;
                                }


                            }else if(billdoc.fileType.toLowerCase()=="pubamend"){
                                if(billdoc.strVal1.toLowerCase()=="pass"){
                                    if(billdoc.strVal2=="committee"){
                                        billdoc.shortDesc+=" (passed in committee)";
                                    }else{
                                        billdoc.shortDesc+=" (passed on floor)";
                                    }
                                }else if(billdoc.strVal1.toLowerCase()=="m"){
                                    billdoc.shortDesc+=" (pass/mod)";
                                }else if(billdoc.strVal1.toLowerCase()=="s"){
                                    billdoc.shortDesc+=" (failed)";
                                }
                                // hasPDF=true;
                            }else if(["pubsub","amended","introduced","enrolled","public"].includes(billdoc.fileType.toLowerCase())){
                                hasPDF=true;
                            }
                            //Create link
                            var subStr = "";
                            var pdfStr="";
                            var currlinkcnt=linkcnt;
                            if(billv.subVersion>0){
                                subStr=" S"+billv.subVersion;
                            }
                            if(hasPDF){
                                pdfStr="<a href='"+billdoc.url.replace("\/lfa\/","https:\/\/pf.utleg.gov\/public-web\/").replace(".xml",".pdf").replace(".html",".pdf").replace(".htm",".pdf")+"' class='pdflink' target='_blank'><img src=\"/images/pdf.gif\" alt=\"PDF document\" height=\"17\" width=\"15\"></a>";
                            }
                            if(hasPDF&&billdoc.url.endsWith(".pdf")){
                                //Don't show it twice
                            }else{
                                // if(["Introduced","Enrolled","PubSub"].includes(billdoc.fileType)){
                                //     $dest.prepend("<li class='"+billdoc.fileType+"'><a id='l"+linkcnt+"' class='doclink "+billdoc.fileType+"' onclick='showDoc(\""+billdoc.fileType+"\",\""+json.billNumberShort+subStr+"\",\""+billdoc.url+"\",this)' target='_blank'>"+billdoc.shortDesc+"</a>"+pdfStr+"</li>");
                                // }else{
                                //     $dest.append("<li class='"+billdoc.fileType+"'><a id='l"+linkcnt+"' class='doclink "+billdoc.fileType+"' onclick='showDoc(\""+billdoc.fileType+"\",\""+json.billNumberShort+subStr+"\",\""+billdoc.url+"\",this)' target='_blank'>"+billdoc.shortDesc+"</a>"+pdfStr+"</li>");
                                // }
                                if(["pubfn"].includes(billdoc.fileType.toLowerCase())){
                                    //pdfStr="<a href='"+billdoc.url.replace("\/Session\/","https:\/\/pf.utleg.gov\/public-web\/Session\/").replace(".xml",".pdf").replace(".html",".pdf").replace(".htm",".pdf")+"' class='pdflink' target='_blank'><img src=\"/images/pdf.gif\" height=\"17\" width=\"15\"></a>";
                                    //$dest.after("<div class='verCatagory'><a id='l"+linkcnt+"' class='doclink "+billdoc.fileType+"' onclick='showDoc(\""+billdoc.fileType+"\",\""+json.billNumberShort+subStr+"\",\""+billdoc.url+"\",\"l"+linkcnt+"\",\"\")' target='_blank'><div class='verCatagoryTitle'>Fiscal Note</div></a><div id='"+billv.billNumber+"_"+billdoc.fileType+"' class='pdfplace'>"+pdfStr+"</div></div>");
                                    if(billdoc.fileName.endsWith(".pdf")){
                                        $("#verBody_"+billv.billNumber+" .fiscalNoteBlock .col2").html("<a href='"+billdoc.url+"' class='pdflink' target='_blank'><img src=\"/images/pdf.gif\" alt=\"PDF document\" height=\"17\" width=\"15\"></a>");
                                    }else{
                                        $("#verBody_"+billv.billNumber+" .fiscalNoteBlock .col1").html("<a id='l"+linkcnt+"' class='doclink "+billdoc.fileType+"' onclick='showDoc(\""+billdoc.fileType+"\",\""+json.billNumberShort+subStr+"\",\""+billdoc.url+"\",\"l"+linkcnt+"\",\"\")' target='_blank'><div class='verCatagoryTitle'>Fiscal Note</div></a>");
                                    }
                                }else{
                                    var amendNoAttr = "";
                                    if(["PubAmend"].includes(billdoc.fileType.toLowerCase())){
                                        if(billdoc.strVal1){
                                            amendNoAttr="data-amendNo='"+billdoc.strVal1+"'";
                                        }
                                    }else if(["enrolled"].includes(billdoc.fileType.toLowerCase())){
                                        subStr="";
                                    }
                                    $dest.append("<li class='"+billdoc.fileType+" "+billdoc.strVal2+"' "+amendNoAttr+"><a id='l"+linkcnt+"' class='doclink "+billdoc.fileType+"' onclick='showDoc(\""+billdoc.fileType+"\",\""+json.billNumberShort+subStr+"\",\""+billdoc.url+"\",\"l"+linkcnt+"\",\""+billv.versionSponsorName+"\")' target='_blank'>"+billdoc.shortDesc+"</a>"+pdfStr+"</li>");
                                }
                                linkcnt++;
                            }
                            



                            //Decide what the default document to display is
                            // console.log("billdoc.fileType = "+billdoc.fileType);

                            // if(billv.activeVersion==true && ["Enrolled","Introduced","PubSub"].includes(billdoc.fileType)){//Active
                            //     var subStr = "";
                            //     if(billv.subVersion>0){
                            //         subStr = " S"+billv.subVersion;
                            //     }
                            //     //Don't auto display PDFs
                            //     if(billdoc.url.endsWith(".htm")||billdoc.url.endsWith(".html")||billdoc.url.endsWith(".xml")){
                            //         //if(billv.hasEnrolled==true && billdoc.fileType=="Enrolled"){//Introduced
                            //         //console.log(billv.subVersion,billdoc.fileType,billv.hasEnrolled);
                            //         if(billv.subVersion == -2 && billdoc.fileType=="Enrolled"){//Enrolled
                            //             showDoc('Enrolled',json.billNumberShort+subStr,billdoc.url,$("#l"+currlinkcnt).get(0));
                            //         // }else if(billv.hasEnrolled==false && ["Introduced","PubSub"].includes(billdoc.fileType)){
                            //         }else if(billv.subVersion != -2 && ["Introduced","PubSub"].includes(billdoc.fileType)){
                            //             showDoc('Introduced',json.billNumberShort+subStr,billdoc.url,$("#l"+currlinkcnt).get(0));
                            //         }
                            //     }
                            // }


                        }
                        //End Loop through bill documents
                        /////////////////////////////

                        // if(fiscalDocCnt==0){
                        //     $("#verBody_"+billv.billNumber+" .ul_billFiscal").parent().hide();
                        // }
                        if(docCnt==0){
                            $("#verBody_"+billv.billNumber+" .ul_billDocs").parent().hide();
                        }

                    }
                    //End Loop through bill versions
                    /////////////////////////////

                    //Add Conference committee reports to current version documents
                    $currentVersion_documents.append($moveTo_currentVersion_documents.html());

                    //Hide Other versions if there is only 1 version
                    if(json.billVersionList.length<=1){
                        $("#otherVersions_box").hide();
                    }

                    //Sort Bill Text 
                    $(".versionBody .ul_billText").each(function(i,ul){
                        $(ul).find("li").each(function(j,li){
                            if($(li).hasClass("Introduced")){
                                $(ul).prepend(li);
                            }else if($(li).hasClass("Enrolled")){
                                $(ul).append(li);
                            }
                        });
                    });

                    //Default Display Bill Text
                    var funcStr="";
                    if($("#currentVersion_ul ul.ul_billText").find("li.Enrolled").length>0){
                        funcStr = $("#currentVersion_ul ul.ul_billText").find("li.Enrolled a").attr("onclick");
                    // }else if($("#currentVersion_ul ul.ul_billText").find("li.PubAmend").length>0){
                    //     var $ta;
                    //     var amdNo="0";
                    //     $("#currentVersion_ul ul.ul_billText").find("li.PubAmend").each(function(index,item){
                    //         if($ta==null){
                    //             $ta = $(item);
                    //             amdNo=$(item).attr("data-amendNo");
                    //         }else if($(item).attr("data-amendNo")>amdNo){
                    //             $ta = $(item);
                    //             amdNo=$(item).attr("data-amendNo");
                    //         }
                    //     });
                    //     console.log("amdNo="+amdNo);

                        

                    // //     }
                    // //     //funcStr = $("#currentVersion_ul ul.ul_billText").find("li.PubAmend a").attr("onclick");
                    //     funcStr = $ta.find("a").attr("onclick");
                    

                    }else if($("#currentVersion_ul ul.ul_billText").find("li.Amended.current").length>0){
                        funcStr = $("#currentVersion_ul ul.ul_billText").find("li.Amended.current a").attr("onclick");
                    }else if($("#currentVersion_ul ul.ul_billText").find("li.PubSub").length>0){
                        funcStr = $("#currentVersion_ul ul.ul_billText").find("li.PubSub a").attr("onclick");
                    }else if($("#currentVersion_ul ul.ul_billText").find("li.Introduced").length>0){
                        funcStr = $("#currentVersion_ul ul.ul_billText").find("li.Introduced a").attr("onclick");
                    }
                    //console.log("eval "+funcStr);
                    eval(funcStr);

                    

                }


                /////////////////////////////////
                // Action History 
                if (json.actionHistoryList) {
                    for (let i = 0; i < json.actionHistoryList.length; i++) {
                        let action = json.actionHistoryList[i];
                        var voteStr = "";
                        if (action.voiceVote=="1") {
                            voteStr = "<a href='/DynaBill/svotes.jsp?sessionid=" + json.sessionID + "&voteid=" + action.voteID + "&house=" + action.voteHouse + "'>Voice Vote</a>";
                        } else if (action.actionClass!="A" && action.voteID!="") {
                            //console.log("Action = "+action.action);
                            voteStr = "<a href='/DynaBill/svotes.jsp?sessionid=" + json.sessionID + "&voteid=" + action.voteID + "&house=" + action.voteHouse + "'>" + action.voteStr + "</a>";
                        } else if (action.actionClass=="A" && action.voteID!="") {
                            voteStr = "<a href='/mtgvotes.jsp?voteid=" + action.voteID + "'>" + action.voteStr + "</a>";
                        }

                        var extra = "";
                        if(action.actionCode){
                            if(['HAMEND','SAMEND','HAMENDFAIL','SAMENDFAIL','HCAAMD','SCAAMD','LRULAMDH','LRULAMDS'].includes(action.actionCode)){
                                if(action.parm1){
                                    extra = " #"+action.parm1;
                                }
                            }
                            if(['HSUB','SSUB','SCASUB','HCASUB','LRULSUBH','LRULSUBS'].includes(action.actionCode)){
                                if(action.parm1 && action.parm2){
                                    extra = " From #"+action.parm2 + " to #"+ action.parm1;
                                }
                            }
                        }



                        $("#billStatusTbl").append("<tr class='action" + action.actionClass + "'>" +
                            "<td>" + action.actionDate + "</td>" +
                            "<td>" + action.description + extra + "</td>" +
                            "<td>" + action.owner + "</td>" +
                            "<td>" + voteStr + "</td>" +
                            "</tr>");
                    }
                }

                    //Add toggle functionality for Fiscal actions
                    const toggle = document.getElementById('actionFToggle');
                    
                        // Function to apply striping to visible rows
                        function applyStriping() {
                            const allRows = document.querySelectorAll('tbody tr');
                            let visibleIndex = 0;
                            
                            allRows.forEach(row => {
                            // Skip the header row if it's in tbody
                            if (row.querySelector('th')) {
                                return;
                            }
                            
                            // Only count visible rows
                            if (row.style.display !== 'none') {
                                if (visibleIndex % 2 === 0) {
                                row.style.backgroundColor = '#f9f9f9'; // Light gray
                                } else {
                                row.style.backgroundColor = '#ffffff'; // White
                                }
                                visibleIndex++;
                            }
                            });
                        }
                        
                        // Hide actionF rows on page load if toggle is unchecked
                        if (!toggle.checked) {
                            const actionFRows = document.querySelectorAll('tr.actionF');
                            actionFRows.forEach(row => {
                            row.style.display = 'none';
                            });
                        }
                        
                        // Apply initial striping
                        applyStriping();
                        
                        toggle.addEventListener('change', function() {
                            const actionFRows = document.querySelectorAll('tr.actionF');
                            
                            actionFRows.forEach(row => {
                            row.style.display = this.checked ? 'table-row' : 'none';
                            });
                            
                            // Reapply striping after toggling
                            applyStriping();
                        });

                        document.querySelectorAll('tbody tr').forEach(row => {
                            const dateCell = row.querySelector('td:first-child');
                            if (dateCell && dateCell.textContent.includes('-')) {
                                dateCell.textContent = formatDate(dateCell.textContent);
                            }
                            });


                            //format date function
                        function formatDate(dateString) {
                            const date = new Date(dateString);
                            
                            // Get date parts
                            const month = date.getMonth() + 1; // Months are 0-indexed
                            const day = date.getDate();
                            const year = date.getFullYear();
                            
                            // Get time parts
                            let hours = date.getHours();
                            const minutes = date.getMinutes();
                            const ampm = hours >= 12 ? 'PM' : 'AM';
                            
                            // Convert to 12-hour format
                            hours = hours % 12;
                            hours = hours ? hours : 12; // 0 should be 12
                            
                            // Pad minutes with leading zero if needed
                            const minutesStr = minutes < 10 ? '0' + minutes : minutes;
                            
                            return `${month}/${day}/${year} ${hours}:${minutesStr} ${ampm}`;
                            }


                if(json.lastAction){
                    $("#actions_ul").append("<li><b>Last Action:</b> "+json.lastActionDate+", "+json.lastAction+"</li>");
                }
                if(json.lastActionOwner){
                    $("#actions_ul").append("<li><b>Last Location:</b> "+json.lastActionOwner+"</li>");
                }

                // if (json.sectionAffectedList) {
                //     for (let i = 0; i < json.sectionAffectedList.length; i++) {
                //         let affSec = json.sectionAffectedList[i];
                //         if(!["effdate","retro","contingent","revisor","votesub","approp","rule"].includes(affSec.secNo)){
                //             $("#sectionAffected_ul").append("<li><A HREF=\"/asp/codelookup/codelookup.asp?section="+affSec.secNo+"\" class=\"nlink\">"+affSec.secNo+"</A></li>");
                //         }
                //     }
                // }

                // if (json.subjectList) {
                //     for (let i = 0; i < json.subjectList.length; i++) {
                //         let sub = json.subjectList[i];
                //         $("#subject_ul").append("<li><a href=\"/ASP/RelatedBill/similar.asp?scode="+sub.code+"&Year="+json.year+"\">"+sub.description+"</a></a></li>");
                //     }
                // }


            }
        });
    }






    function showDoc(docType,billNumber,url,linkID,versionSponsor){
        var r = Math.floor(Math.random() * 1000);
        var docTypeStr=docType;
        var header2="";
        if(docType.toLowerCase()=="pubfn"){
            docTypeStr="Fiscal Note";
        }else if(docType.toLowerCase()=="pubsub"){
            docTypeStr="Substitute";
            header2="<b>"+versionSponsor+"</b> proposes the following substitute bill:";
        }
        if(url.endsWith(".xml")||url.endsWith(".htm")||url.endsWith(".html")){

            $("a.doclink").removeClass("current");

            var printerFriendly = "";
            if($("#"+linkID).next("a.pdflink").length>0){
                printerFriendly = "<a href=\""+$("#"+linkID).next("a.pdflink").attr("href")+"\" target=\"_blank\">Printer Friendly <img src=\"/images/pdf.gif\" alt=\"PDF document\" height=\"17\" width=\"15\"></a>";
            }

            //Set header
            $("#docheader").html(
                "<div id='docType'>"+docTypeStr+" </div>"+
                "<div id='printerFriendly'>"+printerFriendly+"</div>"+
                "<div id='billNumber'>"+billNumber+"</div>"
            );

            $("#docheader2").remove();
            if(header2!=""){
                $("#docheader").after("<div id=\"docheader2\">"+header2+"</div>");
            }



            //Load content or open page
            if(url.endsWith(".xml")){
                $("#billbox").html("Loading...");
                $("#billbox").load(url+"?r="+r,function(response, status, xhr){
                    console.log(status,xhr);
                    if ( status == "error" ) {
                        $("#billbox").html("<div style='color:#F33;font-size:16px;'>There was an error loading the file '"+url+"'</div>");
                    }else{
                        formatXML();
                    }
                });
                $("a#"+linkID).addClass("current");
            }else if(url.endsWith(".htm")||url.endsWith(".html")){
                $("#billbox").html("");
                console.log(url);
                $("#billbox").load(url+"?r="+r,function(response, status, xhr){
                    if ( status == "error" ) {
                        $("#billbox").html("<div style='color:#F33;font-size:16px;'>There was an error loading the file '"+url+"'</div>");
                    }
                });
                $("a#"+linkID).addClass("current");
            }
        }else{
            window.open(url,"_blank");
        }
        return false;
    }

    function toggleHiddenView(head,body){
        if($(head).hasClass("active")){
            $(head).removeClass("active");
            $(body).removeClass("active");
        }else{
            $(head).addClass("active");
            $(body).addClass("active");
        }
    }

    ////////////////////////////////////////////////////////////////
    //Tracking
    ////////////////////////////////////////////////////////////////
    function trackBtnClick(billnum,billchk){
        var txt = $('#'+billchk).text();
        if (txt=="Track this") {
            trackBillBtn(billnum,billchk);

        } else {
            stopTrackingBillBtn(billnum,billchk);
        }
    }

    function trackBillBtn(blist,billchk){
        if(blist==""){
            alert("No items selected")
            return
        }else{
            $.ajax({
                method: "POST",
                url: "/tracking/trackingAddBills.jsp",
                data: { bills: blist }
            })
                .done(function( msg ) {

                if(msg.trim()=="success"){
                    $('#'+billchk).text("Stop tracking");
                    var billList = localStorage.getItem("trackBillsList");
                    if(billList!=""){billList+=",";}
                    billList+=blist;
                    localStorage.setItem("trackBillsList",billList);
                }else{

                }
            });
        }
    }
    function stopTrackingBillBtn(blist,billchk){
        if(blist==""){
            alert("No items selected")
            return
        }else{
            $.ajax({
                method: "POST",
                url: "/tracking/trackingRemoveBill.jsp",
                data: { bill: blist }
            })
                .done(function( msg ) {
                if(msg.trim()=="success"){
                    $('#'+billchk).text("Track this");
                    var billList = localStorage.getItem("trackBillsList");
                    billList=billList.replace(","+blist,"");
                    billList=billList.replace(blist,"");
                    localStorage.setItem("trackBillsList",billList);

                }else{

                }
            });
        }
    }





    ////////////////////////////////////////////////////////////////
    // XML Styling
    ////////////////////////////////////////////////////////////////

    function formatXML(){
        console.log("formatXML");
        var sess = $("leg").attr("sess");

        //TEMPORARY REMOVE THESE ELEMENTS
        $("da daamd snhead").remove();
        

        $("#billbox tbl row").each(function(index,row){
            $(row).children("cell").first().css("width","0px");
            $(row).children("cell").first().css("flex-grow","unset");
        });



        $("#billbox enacthead").html("<hr2></hr2>");
        $("#billbox lt").prepend("<hr2></hr2>");


        //Add bullets to highlighted provisions
        $("hl[level=1],ltdest").each(function(index,linenoitem){
            $(linenoitem).prepend("<span class=\"bullet\">▸</span>");
        });
        $("hl[level=2],ltsrc").each(function(index,linenoitem){
            $(linenoitem).prepend("<span class=\"bullet\">•</span>");
        });

        $("bsec[type=repealer] sectiontext repsec").each(function(index,linenoitem){
            $(linenoitem).prepend("Section "+$(linenoitem).attr("num")+", ");
        });


        //TRENT AND RYAN MESSING WITH STUFF
        //*********************************
        // $("bsec section catline bold").each(function(index,linenoitem){
        //     console.log(1,text);
        //     var text = $(linenoitem).html();
        //     var i = text.indexOf("<parens");
        //     text = "<catlinenum>"+ insertString(text,"</catlinenum>",i);
        //     console.log(2,text);
        //     $(linenoitem).html(text);
        // });



        //Table conversion from <tbl> to <table> <row> to <tr> and <cell> to <td>
$(function () {
  // Helper to replace one tag with another, preserving attributes and children.
  // Accepts either a selector string or a jQuery collection as `from`.
    function replaceTag(from, newTag, onCreate) {
        const $nodes = typeof from === 'string' ? $(from) : from;

        $nodes.each(function () {
        const $old = $(this);
        const $new = $(`<${newTag}>`);

        // Copy all attributes
        $.each(this.attributes, function () {
            $new.attr(this.name, this.value);
        });

        // Allow custom adjustments on the new element
        if (typeof onCreate === 'function') onCreate($new, $old);

        // Move children/HTML
        $new.html($old.html());

        // Swap in the DOM
        $old.replaceWith($new);
        });
    }

    // Map for general tag conversions
    const tagMap = {
        row:  'tr',
        cell: 'td'
    };

    // Apply generic mappings
    Object.entries(tagMap).forEach(([from, to]) => replaceTag(from, to));

    // Special handling for <tbl> → <table>:
    // Skip any <tbl> whose parent is <tbox>
    const $tblsToConvert = $('tbl').filter(function () {
        return !$(this).parent().is('tbox');
    });

    // Convert only the allowed <tbl> nodes and set border="line"
    replaceTag($tblsToConvert, 'table', ($new /*, $old */) => {
        $new.attr('border', 'line'); // standardize border attribute
    });
});

//Remove <td> with border="false"
$(function () {
    $('td[border="false"]').remove();
});

        //Add <br> to elements with lineno. Add <tab> style <para>
        $("[lineno]").each(function(index,linenoitem){
            var lnum = $(linenoitem).attr("lineno");
            var tab = "";
            if($(linenoitem).attr("display")=="tab"){
                tab = "<tab/>";
            }
            //var slnum = $(linenoitem).attr("slineno");
            //console.log($(linenoitem).prop("tagName"));
            if($(linenoitem).is("para,tab")){

            }else if($(linenoitem).is("cn")){
                $(linenoitem).prepend("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("comrec")){
                $(linenoitem).prepend("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("ltcat")){
                $(linenoitem).prepend("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");
                
            }else if($(linenoitem).is("ua")){
                $(linenoitem).prepend("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("sectiontext>summary")){
                // $(linenoitem).after("<br>");

            }else if($(linenoitem).is("category>feedisplay")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("feecommittee")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("feecommittee feeagency:first-of-type")){
                $(linenoitem).before("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("feeagency feeitem:first-of-type")){
                $(linenoitem).before("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("feeprogram[numlevel]")){
                $(linenoitem).before("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("feeitem")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("feeagency")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("feeitem feedisplay")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("feeagency feedisplay")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("committee")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("fee>explanation")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("feeamt")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("headtitl")){
                $(linenoitem).prepend("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div><tab/>TITLE ");

            }else if($(linenoitem).is("row")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("eol[display=eol]")){
                $(linenoitem).append("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div><br>");

            }else if($(linenoitem).is("eol[display=tab]")){
                $(linenoitem).after("<tab/><tab/><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("bsec[type=repealer]")){
                $(linenoitem).find("secline").append("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("bsec[src=reso]")){
                $(linenoitem).find("section").before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("sectiontext")){
                $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");
                // $(linenoitem).before("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");
                //$(linenoitem).before("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>"+tab);
            // }else if($(linenoitem).is("bsec[src=const]")){
            //     $(linenoitem).before("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>It is proposed to enact Utah Constitution, "+$(linenoitem).attr("num")+" to read:");
            }else if($(linenoitem).is("bsec,section")){
                // $(linenoitem).before("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");
            }else if($(linenoitem).is("programs")){
                $(linenoitem).prepend("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>"+tab+"Schedule of Programs:&nbsp;");

            }else if($(linenoitem).css("display")=="block"||$(linenoitem).css("display")=="inline-block" || $(linenoitem).is("moni,oc,sa,hp,rhead")) {
                $(linenoitem).prepend("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>"+tab);
                // $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>"+tab);
            // }else if($(linenoitem).is("bsec,secline")){
            //     $(linenoitem).before("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("tr")){
                $(linenoitem).prepend("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else if($(linenoitem).is("lt")){
                $(linenoitem).prepend("<div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>");

            }else{
                $(linenoitem).prepend("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>"+tab);
                // $(linenoitem).before("<br><div class=\"lineno\">"+$(linenoitem).attr("lineno")+"</div>"+tab);
            }

        });


        $("parens").each(function(index,parens){
            if($(parens).text()==""){
                $(parens).hide();
            }
        });

        $("sinfo flags").each(function(index,flags){
            var $bsec = $(flags).closest("bsec");
            $bsec.prepend(flags);
        });

        $("headpart").prepend("Part ");
        $("headchap").prepend("Chapter ");

        $("conferencestart").prepend("Ĉ→ ");
        $("conferenceend").prepend("←Ĉ ");
        
        $("feeamt[per]").each(function(i,item){
            console.log("per",$(item).attr("per"));
            if($(item).attr("per")!=""){
                $(item).prev("feedisplay").append(" (per "+$(item).attr("per")+") ")
            }
        });
        $("feeprogram category fee>explanation").each(function(i,item){
            if($(item).prev().is("div.lineno")){
                var $divln = $(item).prev("div");
                var $parent = $(item).parent();
                $parent.after($(item));
                $parent.after($divln);
            }else{
                $(item).parent().after($(item));
            }
            
        });


        $("bsec[type=repealer] rhead").append("This bill repeals: ");

        $("uaent snhead").html("ENACTS UNCODIFIED MATERIAL:");

        //Add clickable sections affected 
        $("saamd sn,saent sn,sarep sn,sarnr sn,sarna sn,safre sn"+
            ",raamd sn,raent sn,rarep sn,rarnr sn,rarna sn,rafre sn"+
            ",caamd sn,caent sn,carep sn,carnr sn,carna sn,cafre sn"+
            ",uaamd sn,uaent sn,uarep sn,uarnr sn,uarna sn,uafre sn"+
            ",daamd sn,daent sn,darep sn,darnr sn,darna sn,dafre sn"+
            ",vaamd sn,vaent sn,varep sn,varnr sn,varna sn,vafre sn"
            ).click(function(){
                // console.log($(this).attr("num"),$(this).attr("newnum"));
                // console.log("bsec uid: "+$("bsec[uid='"+$(this).attr("uid")+"]'").length);
                // console.log("repsec uid: "+$("repsec[uid='"+$(this).attr("uid")+"']").length);
                // console.log("uid: "+$(this).attr("uid"));
                if($("bsec[uid='"+$(this).attr("uid")+"']").length>0){
                    var $bsec = $("bsec[uid='"+$(this).attr("uid")+"']");
                    $('html,body').animate({
                        scrollTop: $bsec.offset().top-150
                    }, 'fast');
                }else if($("repsec[uid='"+$(this).attr("uid")+"']").length>0){
                    var $bsec = $("repsec[uid='"+$(this).attr("uid")+"']");
                    $('html,body').animate({
                        scrollTop: $bsec.offset().top-150
                    }, 'fast');
                }
        });

        //Make Xref clickable
        $("xref").click(function(){

            var refnum = $(this).attr("refnumber");
            if(refnum.indexOf("(")>=0){
                refnum=refnum.substring(0,refnum.indexOf("("));
            }
            if(refnum==""){return;}

            if($("bsec[num='"+refnum+"']").length>0){
                var $bsec = $("bsec[num='"+refnum+"']");
                $('html,body').animate({
                    scrollTop: $bsec.offset().top-150
                }, 'fast');

                var top=$bsec.position().top+"px";
                var left=$bsec.position().left+"px";
                var width=$bsec.width()+"px";
                var height=$bsec.height()+"px";
                // left="10px";
                // width="20px";

                $('html,body').append("<div id='highlightBox'></div>");
                $("#highlightBox").css({
                    'position':'absolute',
                    'top':top,
                    'left':left,
                    'width':width,
                    'height':height,
                    'opacity':'0.3',
                    'z-index':99,
                    'display':'block',
                    'background-Color':'#00c9ff'
                });
                $("#highlightBox").fadeOut( 1000 );
                
                
            }else if($("repsec[num='"+refnum+"']").length>0){
                var $bsec = $("repsec[num='"+refnum+"']");
                $('html,body').animate({
                    scrollTop: $bsec.offset().top-150
                }, 'fast');

                var top=$bsec.position().top+"px";
                var left=$bsec.position().left+"px";
                var width=$bsec.width()+"px";
                var height=$bsec.height()+"px";
                // left="10px";
                // width="20px";

                $('html,body').append("<div id='highlightBox'></div>");
                $("#highlightBox").css({
                    'position':'absolute',
                    'top':top,
                    'left':left,
                    'width':width,
                    'height':height,
                    'opacity':'0.3',
                    'z-index':99,
                    'display':'block',
                    'background-Color':'#00c9ff'
                });
                $("#highlightBox").fadeOut( 1000 );

            }else{
                window.open("/asp/codelookup/codelookup.asp?section="+refnum, '_blank').focus();
            }
        });

        $("ocl").click(function(){
            var type = $(this).attr("type");
            if(type=="effdate"){
                var $bsec = $("bsec[uid='EF0000']");
                $('html,body').animate({
                    scrollTop: $bsec.offset().top-150
                }, 'fast');

                var top=$bsec.position().top+"px";
                var left=$bsec.position().left+"px";
                var width=$bsec.width()+"px";
                var height=$bsec.height()+"px";
                // left="10px";
                // width="20px";

                $('html,body').append("<div id='highlightBox'></div>");
                $("#highlightBox").css({
                    'position':'absolute',
                    'top':top,
                    'left':left,
                    'width':width,
                    'height':height,
                    'opacity':'0.3',
                    'z-index':99,
                    'display':'block',
                    'background-Color':'#00c9ff'
                });
                $("#highlightBox").fadeOut( 1000 );

            }

        });    




        replaceChar(4,6,"&#167;"); //section symbol 
        replaceChar(6,6,"&amp;"); 
        replaceChar(6,34,"&bull;"); 
        replaceChar(1,41,"&#233;"); 
        replaceChar(51,5156, "&#201;"); //capitol E acute

        replaceChar(51,5151,"&#937;"); //capitol omega
        replaceChar(51,5152,"&#969;"); //lower case omega
        replaceChar(6,2,"&#8804;"); // less than
        replaceChar(6,3,"&#8805;"); // greater than
        replaceChar(51,5154,"&#955;"); //small lambda
        replaceChar(51,5155,"&#8730;"); //square root
        replaceChar(51,5153,"&#923;"); // capitol lambda
        replaceChar(6,1,"&#177;"); // plus minus




    }

    function replaceChar(set,char,html){
        var $char = $("char[set="+set+"][char="+char+"]");
        $char.after(html);
        $char.remove();
    }

    function insertString(originalString, stringToInsert, position) {
        if (position < 0 || position > originalString.length) {
            return originalString;
        }
        return originalString.slice(0, position) + stringToInsert + originalString.slice(position);
    }



    ////////////////////////////////////////////////////////////////
    // End XML Styling
    ////////////////////////////////////////////////////////////////
