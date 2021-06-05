function filterEmployeesByProject() {
    //get the id of the selected homeworld from the filter dropdown
    var project_id = document.getElementById('project_filter').value
    //construct the URL and redirect to it
    window.location = '/employee/filter/' + parseInt(project_id)
}
