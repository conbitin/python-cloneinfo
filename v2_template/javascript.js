<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js">

</script><script src="https://code.jquery.com/jquery-1.10.16.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.10.16/js/dataTables.bootstrap.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/dataTables.bootstrap.min.css">

<script type="text/javascript" language="javascript">
    //TODO fix issue with changing chart and insert variables for models here
    <!--position_data_chart-->

    google.charts.load('current', {'packages':['bar', 'corechart']});
    google.charts.setOnLoadCallback(showDailyReport);

    function showDailyReport(){
        document.getElementById("loading-progress").style.display = "none";
        document.getElementById("main-page").style.display = "block";
        document.getElementById("likes-and-labels-container").style.display = "block";
        document.getElementById("comments-section").style.display = "block";

        drawChart('div_chart_urgent', '', all_models);
        drawChart('div_chart_summary', '', summary_data_chart);
        drawSelectChart('div_chart_pending');
    }

    $(document).ready(function() {
        window.location.hash = "#title-text";
        showActiveTab('tab_urgent_issue');
        hideUrgentTable();

        $('#table_long_pending').DataTable({
            columns: [
               {title: 'Case code'},
               {title: 'Model'},
               {title: 'Pending days'},
               {title: 'Title'},
               {title: 'Owner'},
               {title: 'subTG'},
               {title: 'TG'},
               {title: 'Priority'}
            ]
        });

        $('#table_jira_task').DataTable({
            data: dataJiraTask,
            columns: [
               {title: 'Key'},
               {title: 'Summary'},
               {title: 'T'},
               {title: 'Created'},
               {title: 'Due'},
               {title: 'Assignee'},
               {title: 'Team'},
               {title: 'P'},
               {title: 'Status'}
            ],
            "order": [[ 3, "desc" ]]
        });

        $('#table_urgent_detail').DataTable({
            columns: [
               {title: 'Case code'},
               {title: 'Model'},
               {title: 'Pending days'},
               {title: 'Title'},
               {title: 'Owner'},
               {title: 'subTG'},
               {title: 'TG'},
               {title: 'Priority'},
               {title: 'Daily comment'}
            ]
        });

       $('#table_issue_detail').DataTable({
            columns: [
               {title: 'Case code'},
               {title: 'Model'},
               {title: 'Pending days'},
               {title: 'Title'},
               {title: 'Owner'},
               {title: 'subTG'},
               {title: 'TG'},
               {title: 'Priority'},
               {title: 'No Comment'}
            ]
        });

       $("#table-urgent tr").click(function() {
            $(this).closest('tr').each(function() {
                var numIssue = $(this).find('.num-issue').text(); // get number issue of project
                var prjName = $(this).find('.prj-name').text();
                $(this).addClass("selected").siblings().removeClass("selected");
                //console.log("project: " +prjName + " ; num issue: "+numIssue);
                if (numIssue > 0){
                    prj = prjName.toLowerCase();
                    drawChart('div_chart_urgent', '', prj_urgent_detail[prj]);
                    document.getElementById('title-urgent-chart').innerText = "Urgent Issues (" +prj.toUpperCase()+ ")";
                    hideShowChartUrgent('show');
                    createUrgentTable(prj);
                }else{
                    hideUrgentTable();
                    hideShowChartUrgent('hide');
                }
            });
       });

       $("#btn-show-all").click(function(){
            createUrgentTable('detail_all_urgent');
            hideShowChartUrgent('show');
            drawChart('div_chart_urgent', '', all_models);
            document.getElementById('title-urgent-chart').innerText = "Urgent Issues (All Projects)";
            // remove class selected in row table
            $('#table-urgent').find('.table-primary').each(function(){
                $(this).removeClass("selected");
            });
            $('#table-urgent').find('.table-danger').each(function(){
                $(this).addClass("selected");
            });
       });

       $("#btn-show-summary").click(function(){
            hideUrgentTable();
            hideShowChartUrgent('show');
            drawChart('div_chart_urgent', '', all_models);
            document.getElementById('title-urgent-chart').innerText = "Urgent Issues (All Projects)";
            // remove class selected in row table
            $('#table-urgent').find('.selected').each(function(){
                $(this).removeClass("selected");
            });
       });
    });

    function hideShowChartUrgent(options){
        if (options == 'show'){
            $("#div-chart-urgent").show();
            $("#div-no-issue").hide();
        }else{
            $("#div-chart-urgent").hide();
            $("#div-no-issue").show();
        }
    }

    function createUrgentTable(project){
        $('#table_urgent').show();
        $('#summary_chart').hide();
        $('#table_urgent_detail').dataTable().fnClearTable();
        $('#table_urgent_detail').dataTable().fnAddData(dataTableUrgent[project]);

        if (project == 'detail_all_urgent'){
            document.getElementById('title-urgent-table').innerText = "List of Urgent Issues (All)";
        }else {
            document.getElementById('title-urgent-table').innerText = "List of Urgent Issues (" +project.toUpperCase()+ ")";
        }
    }

    function createIssueByTeamTable(team){
        $('#table_issue_detail').dataTable().fnClearTable();
        if (dataInfoIssueTeam[team].length > 0) {
            $('#table_issue_detail').dataTable().fnAddData(dataInfoIssueTeam[team]);
        }
    }

    function createTableLongPending(type_data){
        $('#table_long_pending').dataTable().fnClearTable();
        if (dataTablePending[type_data].length > 0) {
            $('#table_long_pending').dataTable().fnAddData(dataTablePending[type_data]);
        }
    }

    function hideUrgentTable(){
        $('#table_urgent').hide();
        $('#summary_chart').show();
    }

    function showTeamDetail() {
        team = document.getElementById("select_detail_team_chart").value;
        var data = dataTotalTeam[team];
        drawChartPieIssueByTeam(data);
        createIssueByTeamTable(team);
    }

    function showActiveTab(id_tab){
        var arr_tab = ['tab_urgent_issue', 'tab_long_pending', 'tab_jira_task', 'tab_work_load', 'tab_team_detail'];
        setActiveTab(id_tab);
        for (i = 0; i < arr_tab.length; i++){
            if (arr_tab[i] == id_tab){
                $("#" +id_tab).show();
            }else{
                $("#" +arr_tab[i]).hide();
            }
        }
        switch(id_tab){
            case 'tab_long_pending':
                showSubMainPLM();
                break;
            case 'tab_jira_task':
                drawChart('div_chart_jira', '', jira_chart_input);
                drawChartJiraPie()
                break;
            case 'tab_work_load':
                drawChartPie();
                drawChartBar();
                break;
            case 'tab_team_detail':
                team = document.getElementById("select_detail_team_chart").value;
                if (team == 'HomeScreen & Settings') { // default HomeScreen & Settings
                    var data = dataTotalTeam[team];
                    drawChartPieIssueByTeam(data);
                    createIssueByTeamTable(team);
                }
                break
            default:
                break;
        }
    }

    function setActiveTab(tabActive){
        $(".nav_bar a").removeClass('active');
        $("#menu_" + tabActive).addClass('active');
        if(tabActive != "tab_team_detail"){
            $("#menu_tab_team_detail").removeClass('active');
        }
    }

    function drawSelectChart(id_type_chart) {
        var result, myOption;

        <!--position_data_two_chart-->

        switch(id_type_chart) {
            case 'div_chart_pending':
                data_input = tab_pending_57days;
                if(id_type_chart == 'div_chart_pending'){
                    myOption = document.getElementById("select_option").value;
                }
                else{
                    myOption = document.getElementById("select_option1").value;
                }

                result = [["", "Num issue pending"]];

                for(i=0; i< data_input.length; i++) {
                    if(myOption == data_input[i].type_data) {
                        data_input_item = data_input[i];
                        keyArr = Object.keys(data_input_item);
                        valueArr = Object.keys(data_input_item).map(function(item) { return data_input_item[item]; });

                        for(j = 0; j < keyArr.length; j++){
                            if (keyArr[j] != 'type_data'){
                                result.push([keyArr[j], valueArr[j]]);
                            }
                        }
                    }// end if
                } // end for
                result.sort(function(a, b){return b[1] - a[1]});
                break;

            case 'div_chart_main_sub':
                data_input = tab_pending_main_sub;
                myOption = document.getElementById("select_chart").value;
                console.log(myOption);
                result = [['', 'open', 'active']];
                var key_open, value_open, key_active, value_active;
                for(i=0; i<data_input.length; i++) {
                    data_input_item = data_input[i];
                    if(myOption == data_input[i].type_chart && data_input[i].type_data=="open") {
                         key_open = Object.keys(data_input_item);
                         value_open = Object.keys(data_input_item).map(function(item) { return data_input_item[item]; });
                    }// end if

                    if(myOption == data_input[i].type_chart && data_input[i].type_data=="active") {
                         key_active = Object.keys(data_input_item);
                         value_active = Object.keys(data_input_item).map(function(item) { return data_input_item[item]; });
                    }// end if
                } // end for

                for (j = 0; j < key_active.length; j++){
                    if (key_active[j] != 'type_chart' && key_active[j] != 'type_data'){
                         result.push([key_active[j], value_open[j], value_active[j]]);
                    }
                }
            default:
                break
        }

        var data = new google.visualization.arrayToDataTable(result);

        var options = {
            width: 500,
            legend: { position: 'none' },
            bars: 'horizontal', // Required for Material Bar Charts.
            bar: { groupWidth: "90%" }
        };

        var chart = new google.charts.Bar(document.getElementById(id_type_chart));
        chart.draw(data, options);
     };

    function showSubMainPLM(){
        drawSelectChart('div_chart_main_sub');
        myOption = document.getElementById("select_chart").value;
        if (myOption == 'main'){
            // show long pending chart/table Main Folder
            drawChart('div_chart_long_pending', '', chartMainSubLongPending['main_5days']);
            createTableLongPending('main_5days');
            document.getElementById('title-long-pending-chart').innerText = "Long pending issue >= 5 days";
            document.getElementById('sub-title-long-pending').innerText = "This table shows list of issues in Main Folder, which are pending >= 5 days";
        }else{
            // show long pending chart/table Sub Folder
            drawChart('div_chart_long_pending', '', chartMainSubLongPending['sub_7days']);
            createTableLongPending('sub_7days');
            document.getElementById('title-long-pending-chart').innerText = "Long pending issue >= 7 days";
            document.getElementById('sub-title-long-pending').innerText = "This table shows list of issues in Sub & MR Folder, which are pending >= 7 days";
        }
    }

    function drawChart(id_type_chart, title, data_chart) {
        var data = new google.visualization.arrayToDataTable(data_chart);
        var options = {
            chart: {
                title: title,
            },
            width: 500,
            legend: { position: 'none' },
            bars: 'horizontal', // Required for Material Bar Charts.
            bar: { groupWidth: "90%" }
        };
        var chart = new google.charts.Bar(document.getElementById(id_type_chart));
        chart.draw(data, options);

        // Add selection handler.
        google.visualization.events.addListener(chart, 'select', function(){
            handleEvent(chart, id_type_chart, data)
        });
    }

    function drawChartPie(){

        <!--data_chart_pie_member_no_issue-->

        myOption = document.getElementById("select_work").value;
        result = [["", "Num issue pending"]];

        for(i=0; i< data_pie_chart.length; i++) {
            if(myOption == data_pie_chart[i].type_data) {
                data_pie_item = data_pie_chart[i];
                keyArr = Object.keys(data_pie_item);
                valueArr = Object.keys(data_pie_item).map(function(item) { return data_pie_item[item]; });

                for(j = 0; j < keyArr.length; j++){
                    if (keyArr[j] != 'type_data'){
                        result.push([keyArr[j], valueArr[j]]);
                    }
                }
            }// end if
        } // end for
        var data = google.visualization.arrayToDataTable(result);
        var options = {};
        var chart = new google.visualization.PieChart(document.getElementById('div_chart_work_load'));
        chart.draw(data, options);
    }

    function drawChartJiraPie(){
        <!--data_chart_pie_jira_task-->
        var data = google.visualization.arrayToDataTable(dataChartPieJira);
        var options = {isStacked:true};
        var chart = new google.visualization.PieChart(document.getElementById('div_chart_jira_pie'));
        chart.draw(data, options);
    }

    function drawChartPieIssueByTeam(data){
        var data = google.visualization.arrayToDataTable(data);
        var options = {isStacked:true};
        var chart = new google.visualization.PieChart(document.getElementById('div_team_detail_chart'));
        chart.draw(data, options);
    }

    function drawChartBar(){
        <!--data_top_10_member_chart-->
        var data = google.visualization.arrayToDataTable(data_top_10_member_chart);
        var options = {isStacked:true};
        // Instantiate and draw the chart.
        var chart = new google.visualization.BarChart(document.getElementById('div_chart_top_member'));
        chart.draw(data, options);
    }

    function handleEvent(chart, id_type_chart, data) {
        switch(id_type_chart) {
            case 'div_chart_jira':
                // TODO
                break;
            default:
                break;
        }
    }

</script>