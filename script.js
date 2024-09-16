$(document).ready(function () {
	function appendHeading(heading) {
		$('.heading-select').append(`<option value="${heading}">${heading}</option>`);
		$('.heading-form-select').append(`<option value="${heading}">${heading}</option>`);
		$('.main-content').append(`
            <div class="heading-container">
                <h2>${heading}
                 <button type="button" class="close1" aria-label="Close"><span aria-hidden="true">x</span></button>
               </h2>
            </div>
        `);
	}
	// subheading append
	function appendSubheading(heading, subheading) {
		$('.main-content').find(`h2:contains("${heading}")`).after(`
            <div class="subheading-container">
                <h3>${subheading}		
                </h3>
            </div>
        `);
	}
	// Form submission handler for heading
	$('.heading-form').on('submit', function (e) {
		e.preventDefault();

		var newHeading = $('.heading-input').val().trim();
		if (newHeading) {
			$('.heading').modal('hide');
			appendHeading(newHeading);

			// Update localStorage with new heading
			storedHeadings.push({ heading: newHeading, subheadings: [] });
			localStorage.setItem('headingsData', JSON.stringify(storedHeadings));

			// Reset input fields
			$('.heading-input').val('');
			$('.heading-select').val('');
			console.log(newHeading, "Heading added");

			// Close button functionality for heading
			$('main').on('click', '.close1', function () {
				console.log("clckkkkkkkkkkkkkkkkkkkkk");

				var headingContainer = $(this).closest('.heading-container');
				var headingText = headingContainer.find('h2').text().trim();


				// 	// Remove heading and its subheadings from localStorage
				storedHeadings = storedHeadings.filter(function (data) {
					return data.heading !== headingText;
				});
				// localStorage.setItem('headingsData', JSON.stringify(storedHeadings));

				// 	// Remove heading and its subheadings from DOM
				headingContainer.nextUntil('h2').remove(); // Remove subheadings
				console.log(headingContainer.nextUntil('h2').remove(), "hhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

				headingContainer.remove();
			});
		}
	});

	$('.subheading-form').on('submit', function (e) {
		e.preventDefault();
		var selectedHeading = $('.heading-select').val();
		var newSubheading = $('.subheading-input').val().trim();

		if (selectedHeading && newSubheading) {
			$('.subheading').modal('hide'); appendSubheading(selectedHeading, newSubheading);

			var headingObj = storedHeadings.find(function (data) {
				return data.heading === selectedHeading;
			});
			if (headingObj) {
				headingObj.subheadings.push(newSubheading);
			}
			localStorage.setItem('headingsData', JSON.stringify(storedHeadings));
			$('.subheading-input').val('');
			$('.heading-select').val('');

			// console.log(newSubheading, "Subheading added");
		}
	});

	//  heading subheading change in form
	$('.heading-form-select').on('change', function () {
		var selectedHeading = $(this).val();
		var headingObj = storedHeadings.find(function (data) {
			return data.heading === selectedHeading;
		});
		var subheadings = headingObj ? headingObj.subheadings : [];

		var subheadingSelect = $('.subheading-form-select');
		subheadingSelect.empty();
		subheadingSelect.append('<option selected disabled>Select a subheading</option>');
		$.each(subheadings, function (index, subheading) {
			subheadingSelect.append(`<option value="${subheading}">${subheading}</option>`);
		});
	});

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
		var inputTag = '';

		switch (inputType) {
			case 'input':
				inputTag = `<label>${labelInput}</label><input type="text" class="${classInput}" placeholder="${placeholderInput}" value="${valueInput}" ${isReadonly ? 'readonly' : ''} ${isDisabled ? 'disabled' : ''}>`;
				break;
			case 'select':
				if (optionInput) {
					var options = optionInput.split(',').map(option => option.trim());
					var optionsHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
					inputTag = `<label>${labelInput}</label><select class="${classInput}">${optionsHTML}</select>`;
				} else {
					inputTag = `<label>${labelInput}</label><select class="${classInput}"><option disabled selected>No options available</option></select>`;
				}
				break;
			case 'textarea':
				inputTag = `<label>${labelInput}</label><textarea class="${classInput}" placeholder="${placeholderInput}" ${isReadonly ? 'readonly' : ''} ${isDisabled ? 'disabled' : ''}>${valueInput}</textarea>`;
				break;
			case 'checkbox':
				if (optionInput) {
					var options = optionInput.split(',').map(option => option.trim());
					var checkboxes = options.map((option, index) => {
						return `<label><input type="checkbox" class="${classInput}" name="checkbox-group-${index}" value="${option}" ${isReadonly ? 'readonly' : ''} ${isDisabled ? 'disabled' : ''}> ${option}</label>`;
					}).join(' ');
					inputTag = `<label>${labelInput}</label>${checkboxes}`;
				}
				break;
			case 'radio':
				if (optionInput) {
					var options = optionInput.split(',').map(option => option.trim());
					var radioButtons = options.map((option) => {
						var isChecked = option === valueInput ? 'checked' : '';
						return `<label><input type="radio" class="${classInput}" name="radio-group" value="${option}" ${isChecked} ${isReadonly ? 'readonly' : ''} ${isDisabled ? 'disabled' : ''}> ${option}</label>`;
					}).join(' ');
					inputTag = `<label>${labelInput}</label>${radioButtons}`;
				}
				break;
			case 'button':
				inputTag = `<label>${labelInput}</label><button type="button" class="${classInput}">${valueInput}</button>`;
				break;
			case 'submit':
				inputTag = `<label>${labelInput}</label><input type="submit" class="${classInput}" value="${valueInput}">`;
				break;
		}
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

		storedForms.push(formData);
		localStorage.setItem('formsData', JSON.stringify(storedForms));

		if (selectHeading && selectSubHeading && inputType) {
			var subHeadingContainer = $(`.heading-container:has(h2:contains('${selectHeading}')) .subheading-container:has(h3:contains('${selectSubHeading}'))`);

			if (subHeadingContainer.length) {
				subHeadingContainer.append(`<div class="form-group">${inputTag}</div>`);
				console.log("Form element added to the selected subheading.");
			} else {
				console.log("Subheading container not found!");
			}
			$('.form').modal('hide');
			$('.form-inputs')[0].reset();
		} else {
			console.log("Please select both heading and subheading.");
		}
	});
	var storedHeadings = JSON.parse(localStorage.getItem('headingsData')) || [];
	var storedForms = JSON.parse(localStorage.getItem('formsData')) || [];
	//  save and load all input field in local storage
	function renderForms() {
		storedForms.forEach(function (formData) {
			var subHeadingContainer = $(`.heading-container:has(h2:contains('${formData.heading}')) .subheading-container:has(h3:contains('${formData.subHeading}'))`);

			if (subHeadingContainer.length) {
				var inputTag = '';

				switch (formData.inputType) {
					case 'input':
						inputTag = `<label>${formData.labelInput}</label><input type="text" class="${formData.classInput}" placeholder="${formData.placeholderInput}" value="${formData.valueInput}" ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''}>`;
						break;

					case 'select':
						if (formData.optionInput) {
							var options = formData.optionInput.split(',').map(option => option.trim());
							var optionsHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
							inputTag = `<label>${formData.labelInput}</label><select class="${formData.classInput}">${optionsHTML}</select>`;
						} else {
							inputTag = `<label>${formData.labelInput}</label><select class="${formData.classInput}"><option disabled selected>No options available</option></select>`;
						}
						break;

					case 'textarea':
						inputTag = `<label>${formData.labelInput}</label><textarea class="${formData.classInput}" placeholder="${formData.placeholderInput}" ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''}>${formData.valueInput}</textarea>`;
						break;

					case 'checkbox':
						if (formData.optionInput) {
							var options = formData.optionInput.split(',').map(option => option.trim());
							var checkboxes = options.map((option, index) => {
								return `<label><input type="checkbox" class="${formData.classInput}" name="checkbox-group-${index}" value="${option}" ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''}> ${option}</label>`;
							}).join(' ');
							inputTag = `<label>${formData.labelInput}</label>${checkboxes}`;
						}
						break;

					case 'radio':
						if (formData.optionInput) {
							var options = formData.optionInput.split(',').map(option => option.trim());
							var radioButtons = options.map((option) => {
								var isChecked = option === formData.valueInput ? 'checked' : '';
								return `<label><input type="radio" class="${formData.classInput}" name="radio-group-${formData.subHeading}" value="${option}" ${isChecked} ${formData.isReadonly ? 'readonly' : ''} ${formData.isDisabled ? 'disabled' : ''}> ${option}</label>`;
							}).join(' ');
							inputTag = `<label>${formData.labelInput}</label>${radioButtons}`;
						}
						break;

					case 'button':
						inputTag = `<label>${formData.labelInput}</label><button type="button" class="${formData.classInput}">${formData.valueInput}</button>`;
						break;

					case 'submit':
						inputTag = `<label>${formData.labelInput}</label><input type="submit" class="${formData.classInput}" value="${formData.valueInput}">`;
						break;
				}

				subHeadingContainer.append(`<div class="form-group">${inputTag}</div>`);
			}
		});
	}
	// Add existing headings and subheadings from localStorage to the DOM on page load
	storedHeadings.forEach(function (data) {
		appendHeading(data.heading);
		data.subheadings.forEach(function (subheading) {
			appendSubheading(data.heading, subheading);
		});
	});

	// Render saved form elements
	renderForms();

	$('.close1').on('click', function () {
		var headingContainer = $(this).closest('.heading-container');
		var headingText = headingContainer.find('h2').text().trim();
		storedHeadings = storedHeadings.filter(function (data) {
			return data.heading !== headingText;
		});
		localStorage.setItem('headingsData', JSON.stringify(storedHeadings));
		headingContainer.nextUntil('h2').remove();
		headingContainer.remove();
	});
});
