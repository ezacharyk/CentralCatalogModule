(function($, Drupal) {

	'use strict';

	function addLoader(message) {
		const loaderContainer = document.createElement('div');
		const loader = document.createElement('div');
		loaderContainer.className = 'central-catalog-loading-container';
		loader.innerHTML = `<div class="applingfilter-spinners app custom-spinner-container"><svg width="70" height="70" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="1" stroke="#d5d5d5" cx="18" cy="18" r="18"></circle><path d="M36 18c0-9.94-8.06-18-18-18" stroke="#0079b8" transform="rotate(322.791 18 18)"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform> </path></g></g></svg><span class="custom-loader-text">${message}</span></div>`
		loaderContainer.appendChild(loader);
		document.body.appendChild(loaderContainer);
	};

	function removeLoader() {
		let loaderContainer = document.querySelector('.central-catalog-loading-container');
		loaderContainer.remove();
	};

	function addMessage(message, error) {
		let currentMessage = document.querySelector('.central-catalog-custom-message');
		if (currentMessage) {
			currentMessage.remove();
		};
		const container = document.querySelector('#block-adminimal-system-main');
		const messageDiv = document.createElement('div');
		messageDiv.className = 'central-catalog-custom-message';
		messageDiv.style.color = error ? 'red' : 'green';
		messageDiv.innerHTML = message;
		container.insertBefore(messageDiv, container.childNodes[0]);
		setTimeout(() => {
			let checkCurrentMessage = document.querySelector('.central-catalog-custom-message');
			if (checkCurrentMessage) {
				checkCurrentMessage.remove();
			};
		}, 5000);
	};

	// addLoader('Editing term') Add loader with message
	// removeLoader() Remove loader after done
	// addMessage('Success message') //add a response message
	// addMessage('Error message', true) // add a response message pass true if it is an error


	$(document).ready(function () {
$( "#sortable" ).sortable({
  items: "> .panel:not(.panel-default)",
  handle: ".drag",
  classes: {
    "ui-sortable": "highlight"
  },


	update: function(event, ui) {
		escEditSection();
		var panelSort = $(this).find('.panel-sort');
		var sortOrder = [];
		panelSort.each(function() {
			sortOrder.push($(this).data('vid'));
		});
		$.ajax({
			url: '/api/cc_order_taxonomy',
			data: {sortOrder: sortOrder},
			dataType: 'json',
			method: 'POST',
			success: function(result){
			}
		});
	}
});

function terms_sortable(){
	$( ".terms-wrap" ).sortable({
		items: "> .term-wrap",
		update: function(event, ui) {
			escEditSection();
			$(this).children('.term-wrap').each( function(e) {
				$(this).children('.term').attr('data-order', ( $(this).index() + 1 ));
				var action_wrap = $(this).closest('.terms-wrap').siblings('.action-wrap');
				if (!(action_wrap.children('.save-order-btn').length > 0) ) {
					action_wrap.append('<a class="btn action-btn save-order-btn">Save Order</a>');
					$(this).closest('.terms-wrap').addClass('shake');

					var termWrap = $('.term');
					termWrap.popover('dispose');
				}
			});
		}
	});
}
terms_sortable();

	$('body').on('click', '.panel .view', function() {
		escShake();
		escEditSection();
		var panel = $(this).closest('.panel');
		var panelCollapse = panel.find('.panel-collapse');
		var panelID = panel.data('panel');
		panel.toggleClass('expanded');
		panel.siblings().removeClass('expanded');
		panel.siblings().find('.panel-collapse').slideUp();
		panelCollapse.slideToggle();
	});

	function escShake() {
			if ($('.expanded .terms-wrap').hasClass('shake')){
				$('.save-order-btn').closest('.action-wrap').siblings('.terms-wrap').removeClass('shake');
				$('.save-order-btn').remove();
				var termWrap = $('.term');
				termWrap.each(function() {
					$(this).popover('dispose');
					termPopover($(this));
				});
			}
	}

	function escEditSection() {
			if ($('.expanded:not(.newSection) .edit').hasClass('save-section')){
				$('.expanded:not(.newSection) .save-section').text('Edit Section');
				$('.expanded:not(.newSection) .save-section').addClass('edit-section').removeClass('save-section');
				var v_name = $('.expanded .panel-title').attr('data-title');
				$('.expanded:not(.newSection) .panel-title').html(v_name);
			}
	}

	var termWrap = $('.term');
	termWrap.each(function() {
		termPopover($(this));
	});
	function termPopover(item) {
		var $this = item;
		var tr = $this.attr('data-tr');
		var tx = $this.attr('data-tx');
		var text = $this.text();
		$this.popover({
			html: true,
			placement: 'bottom',
			container: $this.parent(),
			template: '<div class="popover term-popover" role="tooltip"><div class="arrow"></div><div class="popover-body"></div></div>',
			content: (function(scope) {
				var popupHtml = '<div class="edit_term_popover">';
				popupHtml += '<div class="title">';
				popupHtml += text;
				popupHtml += '</div>';
				popupHtml += '<div class="action-wrap">';
				popupHtml += '<a class="btn action-btn edit-btn">Edit Term</a>';
				popupHtml += '<a class="btn action-btn delete-btn"><span class="icon-delete"><img src="/dist/img/svg-sprite/basic/delete.svg" class="icon-delete"></span>Delete Term</a>';
				popupHtml += '</div></div>';
				return popupHtml;
			})($this)
		});
	}


	var addTerm = $('.add-term-btn');
	addTerm.each(function() {
		addTermPopover($(this));
	});

	$(document).on('click', function (e) {
		termWrap.each(function () {
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				(($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
			}
		});
		addTerm.each(function () {
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				(($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
			}
		});
		$('.expanded .panel-body').each(function () {
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.expanded .terms-wrap').hasClass('shake')) {
				escShake();
			}
		});
		$('.expanded:not(.newSection) [name=section_title]').each(function () {
			if ((!$(this).closest('.panel-heading').is(e.target) && $(this).closest('.panel-heading').has(e.target).length === 0)) {
				escEditSection();
			}
		});
		$('.term-popup-wrap').each(function () {
			if ((!$(this).is(e.target) && $(this).has(e.target).length === 0 && !$(e.target).is(".delete-btn"))) {
				$('.term-popup').remove();
			}
		});
	});

	$(document).keyup(function(e) {
		if (e.keyCode === 13){}
		if (e.keyCode === 27){
			escShake();
			escEditSection();
			escNewSection();
			escTermPopup();

		}
	});


	function escNewSection() {
		if($('.expanded').hasClass('newSection')){
			$('.add-section').removeClass('adding');
			$('.newSection').remove();
		}
	}
	function escTermPopup() {
		if($('.term-popup').length){
			$('.term-popup').remove();
		}
	}


	function addTermPopover(item) {
		var $this = item;
		$this.popover({
			html: true,
			placement: 'bottom',
			container: $this.parent(),
			sanitize: false,
			template: '<div class="popover addterm-popover" role="tooltip"><div class="arrow"></div><div class="popover-body"></div></div>',
			content: (function(scope) {
				var popupHtml = '<div class="edit_term_popover">';
				popupHtml += '<div class="title">';
				popupHtml += '<input type="text" name="addTerm" value="" placeholder="Add Term Name" required>';
				popupHtml += '</div>';
				popupHtml += '<div class="action-wrap">';
				popupHtml += '<a class="btn action-btn save-btn">Save Term</a>';
				popupHtml += '<a class="btn action-btn cancel-btn"><i class="fa fa-times"></i>Cancel Term</a>';
				popupHtml += '</div></div>';
				return popupHtml;
			})($this)
		});
	}

	$('body').on('click', '.term-popover .edit-btn', function() {
		var popover = $(this).closest('.term-popover');
		var termWrap = popover.siblings('.term');
		var title = popover.find('.title').text()
		$(this).text('Save Term');
		$(this).addClass('save-btn').removeClass('edit-btn');
		popover.find('.title').html('<input type="text" name="term" value="'+title+'" required>');
		popover.find('[name=term]').focus();

	});

	$('body').on('click', '.term-popover .save-btn', function() {
		addLoader('Editing term')
		var popover = $(this).closest('.term-popover');
		var termWrap = popover.siblings('.term');
		var vid = termWrap.data('tx');
		var tid = termWrap.data('tr');
		var name = popover.find('[name=term]').val()

		window.setTimeout(function() {
			termWrap.popover('dispose');
		}, 100);
		window.setTimeout(function() {
			termPopover(termWrap);
		}, 2000);

		if(name && vid && tid){
			$.ajax({
				url: '/api/cc_edit_term',
				data: {vid: vid, tid: tid, name: name},
				dataType: 'json',
				method: 'POST',
				statusCode: {
					404: function() {
						alert( "page not found" );
					}
				},
				success: function(result){
					var vid = result.vid;
					var name = result.name;
					var tid = result.tid;
					var message = result.message;
					var panel = $('.panel[data-vid='+vid+']');
					var termWrap = $('.term[data-tr='+tid+']');
					var termPopover = panel.find('.term-popover');
					var saveTermBtn = termPopover.find('.save-btn');
					saveTermBtn.text('Edit Term');
					saveTermBtn.addClass('edit-btn').removeClass('save-btn');

					termWrap.text(name);
					termPopover.find('.title').html(name);
					removeLoader()
					// addMessage('Successfully edited term') //Adds a success message in green
					addMessage('Successfully edited term')
				},
				error: function (xhr, ajaxOptions, thrownError) {
					removeLoader();
					addMessage('Something went wrong editing term', true)
					//Add error message here
					// popover.find('[name=addTerm]').addClass('error');
				}
			});
		} else {
			popover.find('[name=addTerm]').addClass('error');
		}
	});


	$('body').on('click', '.term-popover .delete-btn', function() {

		var termWrap = $(this).closest('.term-wrap');
		var termName = termWrap.children('.term').text();
		var vid = termWrap.children('.term').data('tx');
		var tid = termWrap.children('.term').data('tr');

		var panelBody = $(this).closest('.panel-body');
		panelBody.append('<div class="term-popup term-del-confirmation" data-vid="'+vid+'" data-tid="'+tid+'"><div class="term-popup-wrap"><svg class="icon-caution"><use xlink:href="#icon-caution"></use></svg><h4>You are about to delete the term tag “'+termName+'”</h4><p>If any Resources are using this tag, they will be affected by this action. Are you sure you want to delete this tag?</p><div class="action-wrap"><a class="btn action-btn delete-btn"><i class="fa fa-times"></i>Delete Term</a><a class="btn action-btn cancel-btn">Cancel</a></div></div></div>');

		var popover = $(this).closest('.term-popover');
		var termW = popover.siblings('.term');
		window.setTimeout(function() {
			termW.popover('dispose');
		}, 100);
		window.setTimeout(function() {
			termPopover(termW);
		}, 500);
	});


	$('body').on('click', '.term-del-confirmation .cancel-btn', function() {
		$('.term-del-confirmation').remove();
	});
	$('body').on('click', '.term-del-successfully .dismiss-btn', function() {
		$('.term-del-successfully').remove();
	});

	$('body').on('click', '.term-del-confirmation .delete-btn', function() {
		var termPopup = $(this).closest('.term-popup');
		var vid = termPopup.data('vid');
		var tid = termPopup.data('tid');
		var termWrap = termPopup.siblings('.term');
		if(tid && vid){
			addLoader('Deleting term')
			$.ajax({
				url: '/api/cc_delete_term',
				data: {vid: vid, tid: tid},
				dataType: 'json',
				method: 'POST',
				statusCode: {
					404: function() {
						alert( "page not found" );
					}
				},
				success: function(result){
					var vid = result.vid;
					var tid = result.tid;
					var name = result.name;
					var message = result.message;
					var panel = $('.panel[data-vid='+vid+']');
					var termWrap = $('.term[data-tr='+tid+']');
					termWrap.popover('dispose');
					$('.term-del-confirmation').remove();
					removeLoader()
					addMessage('Successfully deleted term')
					var panelBody = $('.panel-body');
					panelBody.append('<div class="term-popup term-del-successfully"><div class="term-popup-wrap"><svg class="icon-success"><use xlink:href="#icon-success"></use></svg><h4>You have successfully deleted the term tag “'+name+'”</h4><p>If this isn’t what you wanted to do, contact Andy immediately!</p><div class="action-wrap"><a class="btn action-btn dismiss-btn">Dismiss</a></div></div></div>');
					termWrap.remove();


					if(message == 'No term found'){
						panel.find('.terms-wrap').append('<div class="no_term_found">No term found</div>');
						panel.find('.terms-wrap').siblings('.action-wrap').append('<a class="btn action-btn remove-section"><span class="icon-delete"><img src="/dist/img/svg-sprite/basic/delete.svg" class="icon-delete"></span>Delete Section</a>');
					} else {
						panel.find('.no_term_found').remove();
						panel.find('.remove-section').remove();
					}
				},
				error: function (xhr, ajaxOptions, thrownError) {
					removeLoader();
					addMessage('Something went wrong deleting term', true)
					//Add error message here
					// popover.find('[name=addTerm]').addClass('error');
				}
			});
		}
	});


	$('body').on('click', '.addterm-popover .cancel-btn', function() {
		var popover = $(this).closest('.addterm-popover');
		var addTermBtn = popover.siblings('.add-term-btn');
		window.setTimeout(function() {
			addTermBtn.popover('dispose');
		}, 200);
		window.setTimeout(function() {
			addTermPopover(addTermBtn);
		}, 700);
	});

	$('body').on('click', '.addterm-popover .save-btn:not(.loading)', function() {
		// $(this).addClass('loading');
		addLoader('Adding term')
		var popover = $(this).closest('.addterm-popover');
		var addTermBtn = popover.siblings('.add-term-btn');
		popover.find('[name=addTerm]').removeClass('error');
		var newTitle = popover.find('[name=addTerm]').val();
		var vid = popover.closest('.panel').data('vid');
		if(newTitle && vid){
			$.ajax({
				url: '/api/cc_add_term',
				data: {vid: vid, name: newTitle},
				dataType: 'json',
				method: 'POST',
				statusCode: {
					404: function() {
						alert( "page not found" );
					}
				},
				success: function(result){
					var vid = result.vid;
					var name = result.name;
					var tid = result.tid;
					var message = result.message;
					$('.expanded .no_term_found').remove();
					var panel = $('.panel[data-vid='+vid+']');
					var addTermBtn = panel.find('.add-term-btn');
					panel.find('.terms-wrap').append('<div class="term-wrap newTerm"><span class="term" data-order="50" data-tx="'+vid+'" data-tr="'+tid+'">'+name+'</span></div>');
					// $('.save-btn').removeClass('loading');
					removeLoader();
					addMessage('Successfully added term')
					window.setTimeout(function() {
						addTermBtn.popover('dispose');
					}, 100);
					window.setTimeout(function() {
						addTermPopover(addTermBtn);
					}, 700);

					var newTerm = $('.newTerm .term');
					termPopover(newTerm);

					if(message == 'No term found'){
						panel.find('.terms-wrap').append('<div class="no_term_found">No term found</div>');
						panel.find('.terms-wrap').siblings('.action-wrap').append('<a class="btn action-btn remove-section"><span class="icon-delete"><img src="/dist/img/svg-sprite/basic/delete.svg" class="icon-delete"></span>Delete Section</a>');
					} else {
						panel.find('.no_term_found').remove();
						panel.find('.remove-section').remove();
					}
				},
				error: function (xhr, ajaxOptions, thrownError) {
					removeLoader();
					addMessage('Something went wrong adding term', true)
					//Add error message here
					// popover.find('[name=addTerm]').addClass('error');
				}
			});
		} else {
			removeLoader();
			popover.find('[name=addTerm]').addClass('error');
		}
	});

	$('body').on('click', '.save-order-btn', function() {
			var addTerm = $(this).closest('.action-wrap').siblings('.terms-wrap').find('.term');
			var vid = addTerm.data('tx');
			var sortOrder = [];
			addTerm.each(function() {
				sortOrder.push($(this).data('tr'));
			});
			$.ajax({
				url: '/api/cc_order_term',
				data: {vid: vid, sortOrder: sortOrder},
				dataType: 'json',
				method: 'POST',
				success: function(result){
					$('.save-order-btn').closest('.action-wrap').siblings('.terms-wrap').removeClass('shake');
					$('.save-order-btn').remove();
				}
			});
			var termWrap = $('.term');
			termWrap.each(function() {
				$(this).popover('dispose');
				termPopover($(this));
			});
	});


	$('body').on('click', '.edit-section', function() {
			$(this).text('Save Section');
			$(this).addClass('save-section').removeClass('edit-section');
			var panel_section = $(this).siblings('.panel-title');
			var section_title = panel_section.text();
			panel_section.attr('data-title', section_title);
			panel_section.html('<input type="text" name="section_title" value="'+section_title+'" required>');
			$('.expanded [name=section_title]').focus();
	});


	$('body').on('click', '.save-section:not(.loading)', function() {
		// $(this).addClass('loading');
		addLoader('Saving section');
		var $this = $(this);
		var panel = $(this).closest('.panel');
		var panel_section = $(this).siblings('.panel-title');
		var section_title = panel_section.find('[name=section_title]').val();
		if(section_title){
			if(panel.hasClass('newSection')){
				$.ajax({
					url: '/api/cc_add_taxonomy',
					data: {name: section_title},
					dataType: 'json',
					method: 'POST',
					success: function(result){
						var vid = result.vid;
						var v_name = result.v_name;
						var v_machine_name = result.v_machine_name;
						$('.panel.newSection .save-section').text('Edit Section');
						$('.panel.newSection .save-section').addClass('edit-section').removeClass('save-section');
						$('.panel.newSection').attr('data-vid', vid);
						$('.panel.newSection .panel-title').attr('data-title', v_name);
						$('.panel.newSection .panel-title').html(v_name);
						$('.panel.newSection').attr('data-panel', v_machine_name);
						$('.add-section').removeClass('adding');
						$('.panel.newSection').removeClass('newSection');
						// $('.panel.newSection .save-section').removeClass('loading');
						// $this.removeClass('loading');
						removeLoader();
						addMessage('Successfully saved section')
					},
					error: function (xhr, ajaxOptions, thrownError) {
						removeLoader();
						//Add error message here
						// popover.find('[name=addTerm]').addClass('error');
					}
				});
			} else {
				var section_vid = panel.data('vid');
				$.ajax({
					url: '/api/cc_edit_taxonomy',
					data: {vid: section_vid, name: section_title},
					dataType: 'json',
					method: 'POST',
					success: function(result){
						var vid = result.vid;
						var v_name = result.v_name;
						$('[data-vid='+vid+'] .save-section').text('Edit Section');
						$('[data-vid='+vid+'] .save-section').addClass('edit-section').removeClass('save-section');
						$('[data-vid='+vid+'] .panel-title').attr('data-title', v_name);
						$('[data-vid='+vid+'] .panel-title').html(v_name);
						// $('[data-vid='+vid+'] .save-section').removeClass('loading');
						// $this.removeClass('loading');
						removeLoader();
						addMessage('Successfully saved section')
					}
				});
			}
		} else {
			// $(this).removeClass('loading');
			removeLoader();
			$('[name=section_title]').addClass('error');
		}
	});

	$('body').on('click', '.add-section:not(.adding)', function() {
		var newSection = '<div class="panel panel-sort newSection" data-panel="" data-vid="">';
			newSection += '<div class="panel-heading">';
			newSection += '<h4 class="panel-title"><input type="text" name="section_title" value="" placeholder="Add Section Name" required></h4>';
			newSection += '<span class="edit save-section">Save Section</span>';
			newSection += '<span class="drag"><img src="/dist/img/svg-sprite/basic/drag.svg" class="icon-drag"></span>';
			newSection += '<span class="view">View Terms</span>';
			newSection += '</div>';
			newSection += '<div class="panel-collapse">';
			newSection += '<div class="panel-body">';
			newSection += '<div class="terms-wrap">';
			newSection += '<div class="no_term_found">No term found</div>';
			newSection += '</div>';
			newSection += '<div class="action-wrap">';
			newSection += '<a class="btn action-btn add-term-btn"><i class="fa fa-times"></i> + Add Term</a>';
			newSection += '<a class="btn action-btn remove-section"><span class="icon-delete"><img src="/dist/img/svg-sprite/basic/delete.svg" class="icon-delete"></span>Delete Section</a>';
			newSection += '</div>';
			newSection += '</div>';
			newSection += '</div>';
			newSection += '</div>';
		$(this).addClass('adding');
		$('.panel-default').before(newSection);
		$('.expanded [name=section_title]').focus();
		$('.newSection .view').trigger( "click" );
		addTermPopover($('.newSection').find('.add-term-btn'));
		//terms_sortable();
	});
	$('body').on('click', '.remove-section', function() {
		// $(this).addClass('loading');
		var panel = $(this).closest('.panel');

		if(panel.hasClass('newSection')){
			$(this).closest('.panel').remove();

			$('.add-section').removeClass('adding');
			// $('.panel.newSection .remove-section').removeClass('loading');
		} else {
			addLoader('Deleting section');
			var section_vid = panel.data('vid');
			$.ajax({
				url: '/api/cc_delete_taxonomy',
				data: {vid: section_vid},
				dataType: 'json',
				method: 'POST',
				success: function(result){
					var vid = result.vid;
					var message = result.message;
					// console.log(message);
					// $('[data-vid='+vid+'] .remove-section').removeClass('loading');
					removeLoader();
					addMessage('Successfully deleted section')
					$('.add-section').removeClass('adding');
					if(message == 'Done'){ $('.panel[data-vid='+section_vid+']').remove(); }
				},
				error: function (xhr, ajaxOptions, thrownError) {
					removeLoader();
					addMessage('Something went wrong deleting section', true)
					//Add error message here
					// popover.find('[name=addTerm]').addClass('error');
				}
			});
		}
	});

	$('body').on('click', '.loading', function(e) {
		e.preventDefault();
	});

	});
})(jQuery, Drupal);
