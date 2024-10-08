$(document).ready(function () {
    var storedData = JSON.parse(localStorage.getItem('storedData')) || [];

    // Function to append heading in the DOM
    function appendHeading(heading) {
        $('.heading-select').append(`<option value="${heading}">${heading}</option>`);
        $('.heading-form-select').append(`<option value="${heading}">${heading}</option>`);
        $('.main-content').append(`
        <section class="heading-container draggable">
            <h2>${heading}
                <button type="button" class="close1" aria-label="Close"><span aria-hidden="true">x</span></button>
            </h2>
        </section>
    `);
        makeDraggable();  // Reapply draggable
    }

    // Function to append subheading
    function appendSubheading(heading, subheading) {
        $('.main-content').find(`h2:contains("${heading}")`).append(`
        <section class="subheading-container draggable">
            <h4>${subheading}
                <button type="button" class="close2" aria-label="Close"><span aria-hidden="true">x</span></button>
            </h4>
        </section>
    `);
        makeDraggable();  // Reapply draggable
    }
   
    function makeDraggable() {
    $(".draggable").draggable({
        containment: false,  // Allow dragging beyond the container boundaries
        cursor: "move",      // Change the cursor to indicate drag
        scroll: true,        // Scroll the container when dragging beyond viewport
        stack: ".draggable"  // Ensure draggable elements stack correctly if overlapping
    });
 }
    // On document ready
    $(document).ready(function () {
        // Initialize the page with draggable functionality
        makeDraggable();

        // Form submission handler for adding heading
        $('.heading-form').on('submit', function (e) {
            e.preventDefault();
            var newHeading = $('.heading-input').val().trim();
            if (newHeading) {
                $('.heading').modal('hide');
                appendHeading(newHeading);
                storedData.push({ heading: newHeading, subheadings: [] });
                localStorage.setItem('storedData', JSON.stringify(storedData));
                $('.heading-input').val('');
            }
        });

        // Form submission handler for adding subheading
        $('.subheading-form').on('submit', function (e) {
            e.preventDefault();
            var selectedHeading = $('.heading-select').val();
            var newSubheading = $('.subheading-input').val().trim();

            if (selectedHeading && newSubheading) {
                $('.subheading').modal('hide');
                appendSubheading(selectedHeading, newSubheading);

                // Add subheading to the corresponding heading in storedData
                var headingObj = storedData.find(function (data) {
                    return data.heading === selectedHeading;
                });
                if (headingObj) {
                    headingObj.subheadings.push({ subheading: newSubheading, forms: [] });
                }

                localStorage.setItem('storedData', JSON.stringify(storedData));
                $('.subheading-input').val('');
                $('.heading-select').val('');
            }
        });
        $('.heading-form-select').on('change', function () {
            var selectedHeading = $(this).val();
            var headingObj = storedData.find(function (data) {
                return data.heading === selectedHeading;
            });
            var subheadingSelect = $('.subheading-form-select');
            subheadingSelect.empty(); // Clear the previous subheadings
            subheadingSelect.append('<option selected disabled>Select a subheading</option>');

            if (headingObj && headingObj.subheadings.length > 0) {

                headingObj.subheadings.forEach(function (sub) {
                    subheadingSelect.append(`<option value="${sub.subheading}">${sub.subheading}</option>`);
                });
                subheadingSelect.val(headingObj.subheadings[0].subheading);
                $('.subheading-input').val(headingObj.subheadings[0].subheading);
            } else {
                $('.subheading-input').val('');
            }
        });
        var selectHeading = $('.heading-form-select').val();
        var selectSubHeading = $('.subheading-form-select').val();
        $('.form-inputs').on('submit', function (e) {
            e.preventDefault();
            var selectHeading = $('.heading-form-select').val();
            var selectSubHeading = $('.subheading-form-select').val();
            var inputType = $('.input-type-select').val();
            var labelInput = $('.form-label').val();
            var classInput = $('.form-class').val();
            var valueInput = $('.form-value').val();
            var placeholderInput = $('.form-placeholder').val();
            var optionInput = $('.form-option').val();
            var isReadonly = $('.form-readonly').is(':checked');
            var isDisabled = $('.form-disabled').is(':checked');
            var isRequired = $('.form-required').is(':checked');
            var formData = {
                inputType: inputType,
                labelInput: labelInput,
                classInput: classInput,
                valueInput: valueInput,
                placeholderInput: placeholderInput,
                optionInput: optionInput,
                isReadonly: isReadonly,
                isDisabled: isDisabled,
                isRequired: isRequired
            };
            var headingObj = storedData.find(function (data) {
                return data.heading === selectHeading;
            });
            if (headingObj) {
                var subheadingObj = headingObj.subheadings.find(function (sub) {
                    return sub.subheading === selectSubHeading;
                });
                if (subheadingObj) {
                    subheadingObj.forms.push(formData);
                    appendFormInput(selectHeading, selectSubHeading, formData);
                    localStorage.setItem('storedData', JSON.stringify(storedData));
                    $('.form-inputs')[0].reset();
                    $('.form').modal('hide');
                }
            }
        });

        // Function to append form input to the correct subheading in the DOM
        function appendFormInput(heading, subheading, formData) {
            var subHeadingContainer = $(`.heading-container:has(h2:contains('${heading}')) .subheading-container:has(h4:contains('${subheading}'))`);
            var inputTag = '';

            switch (formData.inputType) {
                case 'text':
                case 'password':
                case 'number':
                case 'color':
                case 'date':
                case 'datetime-local':
                case 'email':
                case 'file':
                case 'image':
                case 'month':
                case 'range':
                case 'search':
                case 'time':
                case 'url':
                case 'week':
                    inputTag = `<label>${formData.labelInput}</label><input type="${formData.inputType}" class="${formData.classInput}" placeholder="${formData.placeholderInput}" value="${formData.valueInput}" ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''} ${formData.isRequired ? 'required' : ''}>`;
                    break;
                case 'select':
                    var options = formData.optionInput.split(',').map(option => option.trim());
                    var optionsHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
                    inputTag = `<label>${formData.labelInput}</label><select class="${formData.classInput}" ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''} ${formData.isRequired ? 'required' : ''}>${optionsHTML}</select>`;
                    break;
                case 'textarea':
                    inputTag = `<label>${formData.labelInput}</label><textarea class="${formData.classInput}" placeholder="${formData.placeholderInput}" ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''} ${formData.isRequired ? 'required' : ''}>${formData.valueInput}</textarea>`;
                    break;
                case 'checkbox':
                    var checkboxes = formData.optionInput.split(',').map(option => `<label><input type="checkbox" class="${formData.classInput}" value="${option}" ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''} ${formData.isRequired ? 'required' : ''}> ${option}</label>`).join('');
                    inputTag = `<label>${formData.labelInput}</label>${checkboxes}`;
                    break;
                case 'radio':
                    var radios = formData.optionInput.split(',').map(option => `<label><input type="radio" name="radio-group-${subheading}" value="${option}" ${option === formData.valueInput ? 'checked' : ''} ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''} ${formData.isRequired ? 'required' : ''}> ${option}</label>`).join('');
                    inputTag = `<label>${formData.labelInput}</label>${radios}`;
                    break;
                case 'submit':
                    inputTag = `<input type="submit" value="${formData.valueInput}" class="${formData.classInput}" ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''}>`;
                    break;
            }

            subHeadingContainer.append(`<section class="form-group">${inputTag}
                <button type="button" class="close3" aria-label="Close"><span aria-hidden="true">x</span></button>
                </section>`);
        }
        // Load stored headings, subheadings, and forms from localStorage on page load
        function renderData() {
            storedData.forEach(function (data) {
                appendHeading(data.heading);
                data.subheadings.forEach(function (sub) {
                    appendSubheading(data.heading, sub.subheading);
                    sub.forms.forEach(function (form) {
                        appendFormInput(data.heading, sub.subheading, form);
                    });
                });
            });

        }
        renderData();

        $('main').on('click', '.close1', function () {
            var headingContainer = $(this).closest('.heading-container');
            var headingText = headingContainer.find('h2').text().trim();

            // Remove heading and its subheadings from storedData
            storedData = storedData.filter(function (data) {
                return data.heading !== headingText;
            });
            localStorage.setItem('storedData', JSON.stringify(storedData));

            // Remove heading and its subheadings from DOM
            headingContainer.remove();
             localStorage.clear(); 1
        });

        // Event listener for removing subheading
        $('main').on('click', '.close2', function () {
            var subheadingContainer = $(this).closest('.subheading-container');
            var headingText = subheadingContainer.closest('.heading-container').find('h2').contents().filter(function () {
                return this.nodeType == Node.TEXT_NODE;
            }).text().trim();

            var subheadingText = subheadingContainer.find('h4').contents().filter(function () {
                return this.nodeType == Node.TEXT_NODE;
            }).text().trim();

            var headingObj = storedData.find(function (data) {
                return data.heading === headingText;
            });

            if (headingObj) {
                headingObj.subheadings = headingObj.subheadings.filter(function (sub) {
                    return sub.subheading !== subheadingText;
                });

                localStorage.setItem('storedData', JSON.stringify(storedData));

                subheadingContainer.remove();
            }
        });
        $(document).on('click', '.close3', function () {
            var $section = $(this).closest('.form-group');
            $section.find('input, textarea, select').val('').prop('checked', false).prop('selected', false);
            $section.remove();
        });
        function renderData() {
            storedData.forEach(function (data) {
                appendHeading(data.heading);
                data.subheadings.forEach(function (sub) {
                    appendSubheading(data.heading, sub.subheading);
                    sub.forms.forEach(function (form) {
                        appendFormInput(data.heading, sub.subheading, form);
                    });
                });
            });
        }
    });

});