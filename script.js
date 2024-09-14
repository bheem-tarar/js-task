$(document).ready(function () {
    // Handle heading form submission
    $('.heading-form').on('submit', function (e) {
        e.preventDefault(); // Prevent form from refreshing the page

        var newHeading = $('.heading-input').val().trim();
        if (newHeading) {
            $('.heading').modal('hide');
            // Add heading to select options and content area
            $('.heading-select').append(`<option value="${newHeading}">${newHeading}</option>`);
            $('.heading-form-select').append(`<option value="${newHeading}">${newHeading}</option>`);
            $('.main-content').append(`
                <div class="heading-container">
                    <h2>${newHeading}
                        <button type="button" class="close1" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </h2>
                </div>
            `);
            // Reset input fields
            $('.heading-input').val('');
            $('.heading-select').val('');
            console.log(newHeading, "Heading added");
            localStorage.setItem('heading', JSON.stringify(newHeading));

            // Close button functionality for heading
            $('main').on('click', '.close1', function () {
                $(this).closest('.heading-container').remove();
                // Optionally save updated data to localStorage
                $('.heading').trigger('reset');
            });
        }
    });

    // Handle subheading form submission
    $('.subheading-form').on('submit', function (e) {
        e.preventDefault();
        var selectedHeading = $('.heading-select').val();
        var newSubheading = $('.subheading-input').val().trim();

        if (selectedHeading && newSubheading) {
            $('.subheading').modal('hide');
            // Add the subheading under the selected heading
            $('.main-content').find(`h2:contains("${selectedHeading}")`).after(`
                <div class="subheading-container">
                    <h3>${newSubheading}</h3>
                </div>
            `);
            $('.subheading-input').val(''); // Clear input
            $('.heading-select').val(''); // Clear heading selection
            console.log(newSubheading, "Subheading added");
            localStorage.setItem('subheading', JSON.stringify(newSubheading));
        }
    });

    // Populate subheading select when heading changes
    $('.heading-form-select').on('change', function () {
        var selectedHeading = $(this).val();
        var subheadings = [];
        // Find subheadings under the selected heading
        $('.main-content').find(`h2:contains("${selectedHeading}")`).nextAll('div.subheading-container').each(function () {
            subheadings.push($(this).find('h3').text());
        });

        var subheadingSelect = $('.subheading-form-select');
        subheadingSelect.empty();
        subheadingSelect.append('<option selected disabled>Select a subheading</option>');
        // Populate the subheading dropdown
        $.each(subheadings, function (index, subheading) {
            subheadingSelect.append(`<option value="${subheading}">${subheading}</option>`);
        });
    });

    // Handle form inputs submission
    $('.form-inputs').on('submit', function (e) {
        e.preventDefault();

        var selectHeading = $('.heading-form-select').val();
        var selectSubHeading = $('.subheading-form-select').val();
        var inputType = $('.input-type-select').val(); // Change selector
        var labelInput = $('.form-label').val();
        var classInput = $('.form-class').val();
        var valueInput = $('.form-value').val();
        var placeholderInput = $('.form-placeholder').val();
        var optionInput = $('.form-option').val();
        var isReadonly = $('.form-readonly').is(':checked');
        var isDisabled = $('.form-disabled').is(':checked');
        var inputTag = '';

        // Switch case to handle different input types
        switch (inputType) {
            case 'input':
                inputTag = `<input type="text" class="${classInput}" placeholder="${placeholderInput}" value="${valueInput}" ${isReadonly ? 'readonly' : ''} ${isDisabled ? 'disabled' : ''}>`;
                break;
            case 'select':
                inputTag = `<select class="${classInput}"></select>`;
                break;
            case 'textarea':
                inputTag = `<textarea class="${classInput}" placeholder="${placeholderInput}" ${isReadonly ? 'readonly' : ''} ${isDisabled ? 'disabled' : ''}>${valueInput}</textarea>`;
                break;
            case 'checkbox':
                if (optionInput) {
                    var options = optionInput.split(',').map(option => option.trim());
                    var checkboxes = options.map((option, index) => {
                        return `<input type="checkbox" class="${classInput}" name="checkbox-group-${index}" value="${option}" ${isReadonly ? 'readonly' : ''} ${isDisabled ? 'disabled' : ''}> ${option}`;
                    }).join('<br>');
                    inputTag = checkboxes;
                }
                break;
            case 'radio':
                if (optionInput) {
                    var options = optionInput.split(',').map(option => option.trim());
                    var radioButtons = options.map((option) => {
                        var isChecked = option === valueInput ? 'checked' : '';
                        return `<input type="radio" class="${classInput}" name="radio-group" value="${option}" ${isChecked} ${isReadonly ? 'readonly' : ''} ${isDisabled ? 'disabled' : ''}> ${option}`;
                    }).join('<br>');
                    inputTag = radioButtons;
                }
                break;
            case 'button':
                inputTag = `<button type="button" class="${classInput}">${valueInput}</button>`;
                break;
            case 'submit':
                inputTag = `<input type="submit" class="${classInput}" value="${valueInput}">`;
                break;
        }

        // Store form data in localStorage (optional)
        var formData = {
            heading: selectHeading,
            subHeading: selectSubHeading,
            inputType: inputType,
            labelInput: labelInput,
            classInput: classInput,
            valueInput: valueInput,
            placeholderInput: placeholderInput,
            optionInput: optionInput,
            isReadonly: isReadonly,
            isDisabled: isDisabled
        };
        localStorage.setItem('formData', JSON.stringify(formData));

        // Append input under the selected subheading
        if (selectHeading && selectSubHeading && inputType) {
            var subHeadingContainer = $(`.heading-container:has(h2:contains('${selectHeading}')) .subheading-container:has(h3:contains('${selectSubHeading}'))`);

            if (subHeadingContainer.length) {
                subHeadingContainer.append(`<div class="form-group">${inputTag}</div>`);
                console.log("Form element added to the selected subheading.");
            } else {
                console.log("Subheading container not found!");
            }
            // Hide modal and reset form
            $('.form').modal('hide');
            $('.form-inputs')[0].reset();
        } else {
            console.log("Please select both heading and subheading.");
        }
    });
});
w