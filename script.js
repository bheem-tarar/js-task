$(document).ready(function () {
    $('#save-heading-btn').on('click', function () {
        var newHeading = $('#heading-input').val().trim();
        if (newHeading) {
            $('#heading').modal('hide');
            $('#heading-select').append(`<option value="${newHeading}">${newHeading}</option>`);
            $('#heading-form-select').append(`<option value="${newHeading}">${newHeading}</option>`);
            $('#main-content').append(`
                <div class="heading-container">
                    <h2>${newHeading}</h2>
                </div>
            `);
            $('#heading-input').val('');
            console.log(newHeading, ">>>>>>>>>>>>")
        }
    });
    $('#save-subheading-btn').on('click', function () {
        var selectedHeading = $('#heading-select').val();
        var newSubheading = $('#subheading-input').val().trim();

        if (selectedHeading && newSubheading) {
            $('#subheading').modal('hide');

            $('#main-content').find(`h2:contains("${selectedHeading}")`).after(`
                <div class="subheading-container">
                    <h3>${newSubheading}</h3>
                </div>
            `);
            $('#subheading-input').val('');
            console.log(newSubheading, "sssssssssss")
        }
    });
    $('#heading-form-select').on('change', function () {
        var selectedHeading = $(this).val();
        var subheadings = [];

        $('#main-content').find(`h2:contains("${selectedHeading}")`).nextAll('div.subheading-container').each(function () {
            subheadings.push($(this).find('h3').text());
        });
        var subheadingSelect = $('#subheading-form-select');
        subheadingSelect.empty();
        subheadingSelect.append('<option selected disabled>Select a subheading</option>');
        $.each(subheadings, function (index, subheading) {
            subheadingSelect.append(`<option value="${subheading}">${subheading}</option>`);
        });
    });
});
