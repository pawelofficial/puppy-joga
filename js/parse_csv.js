$(document).ready(function() {
    Papa.parse('schedule.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            var data = results.data;

            // Extract unique cities
            var cities = [...new Set(data.map(item => item.City))];
            cities.sort(); // Sort cities alphabetically

            // Populate the city dropdown
            var citySelect = $('#city-select');
            // 'All Cities' is already in the HTML, so no need to add it again
            cities.forEach(function(city) {
                citySelect.append(new Option(city, city));
            });

            // Ensure 'All' is selected by default
            citySelect.val('All');

            // Custom search function to filter by city
            $.fn.dataTable.ext.search.push(
                function(settings, searchData, index, rowData, counter) {
                    var selectedCity = $('#city-select').val();
                    var city = rowData.City || '';

                    if (selectedCity === 'All' || city === selectedCity) {
                        return true;
                    }
                    return false;
                }
            );

            // Initialize DataTable without default search box
            var dataTable = $('#schedule-table').DataTable({
                data: data,
                columns: [
                    { data: 'Day' },
                    { data: 'Time' },
                    { data: 'Class' },
                    { data: 'City' }
                ],
                paging: false,
                searching: true, // Enable searching
                info: false,
                dom: 'lrtip' // Remove the default search input box
            });

            // Trigger initial draw to apply the custom filter
            dataTable.draw();

            // Event listener for city dropdown change
            $('#city-select').on('change', function() {
                dataTable.draw();
            });
        }
    });
});
