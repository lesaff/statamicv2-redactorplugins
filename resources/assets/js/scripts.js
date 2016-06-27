// Word counter
// Adapted from offical Redactor site
// https://imperavi.com/redactor/plugins/counter/

if (!RedactorPlugins) var RedactorPlugins = {};
 
RedactorPlugins.counter = function()
{
    return {
        init: function()
        {        
            // As have no access to init of Redactor in Craft add callback from plugin            
            if (typeof this.opts.callbacks.counter === 'undefined')
            {
               this.opts.callbacks.counter = function(data)
               {
                   console.log(data);
               }
            }

            var button = this.button.add('counter-button', 'Word count');
            this.button.addCallback(button, this.counter.showCount)

            this.core.editor().on('keyup.redactor-plugin-counter', $.proxy(this.counter.count, this));
        },
        count: function()
        {
            var words = 0, characters = 0, spaces = 0;
            var html = this.code.get();

            var text = html.replace(/<\/(.*?)>/gi, ' ');
            text = text.replace(/<(.*?)>/gi, '');
            text = text.replace(/\t/gi, '');
            text = text.replace(/\n/gi, ' ');
            text = text.replace(/\r/gi, ' ');
            text = text.replace(/\u200B/g, '');
            text = $.trim(text);

            if (text !== '')
            {
                var arrWords = text.split(/\s+/);
                var arrSpaces = text.match(/\s/g);

                words = (arrWords) ? arrWords.length : 0;
                spaces = (arrSpaces) ? arrSpaces.length : 0;

                characters = text.length;

            }

            this.core.callback('counter', { words: words, characters: characters, spaces: spaces });

            return { words: words, characters: characters, spaces: spaces };
        },
        showCount: function()
        {
            var data = this.counter.count();
            console.log('Words: ' + data.words);
            console.log('Characters: ' + data.characters);
            console.log('Characters w/o spaces: ' + (data.characters - data.spaces));
            
            // open modal
            this.modal.addTemplate('counterTemplate', this.counter.getTemplate());
            this.modal.load('counterTemplate', 'Word counter', 500);
 
            var button = this.modal.getActionButton();
            button.on('click', this.counter.insert);
 
            this.modal.show();
        },
        getTemplate: function()
        {
            var data = this.counter.count();
            
            return String()
            + '<div class="modal-section" id="redactor-modal-counter">'
                + '<section><table class="data fullwidth">'
                    + '<tr>'
                    + '<th>Words</th><td>' + data.words + '</td>'
                    + '</tr><tr>'
                    + '<th>Characters</th><td>' + data.characters + '</td>'
                    + '</tr><tr>'
                    + '<th>Characters without spaces</th><td>' + (data.characters - data.spaces) + '</td>'
                    + '</tr>'
                + '</table></section>'
                + '<section>'
                    + '<button id="redactor-modal-button-cancel">Close</button>'
                + '</section>'
            + '</div>';
        }
    };
};
if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.definedlinks = function()
{
	return {
		init: function()
		{
			if (!this.opts.definedLinks)
			{
				return;
			}

			this.modal.addCallback('link', $.proxy(this.definedlinks.load, this));

		},
		load: function()
		{
			var $section = $('<section />');
			var $select = $('<select id="redactor-defined-links" />');

			$section.append($select);
			this.modal.getModal().prepend($section);

			this.definedlinks.storage = {};

			var url = (this.opts.definedlinks) ? this.opts.definedlinks : this.opts.definedLinks;
			$.getJSON(url, $.proxy(function(data)
			{
				$.each(data, $.proxy(function(key, val)
				{
					this.definedlinks.storage[key] = val;
					$select.append($('<option>').val(key).html(val.name));

				}, this));

				$select.on('change', $.proxy(this.definedlinks.select, this));

			}, this));

		},
		select: function(e)
		{
			var oldText = $.trim($('#redactor-link-url-text').val());

			var key = $(e.target).val();
			var name = '', url = '';
			if (key !== 0)
			{
				name = this.definedlinks.storage[key].name;
				url = this.definedlinks.storage[key].url;
			}

			$('#redactor-link-url').val(url);

			if (oldText === '')
			{
				$('#redactor-link-url-text').val(name);
			}

		}
	};
};

if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.fontcolor = function()
{
	return {
		init: function()
		{
			var colors = [
				'#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#ffff00',
				'#f2f2f2', '#7f7f7f', '#ddd9c3', '#c6d9f0', '#dbe5f1', '#f2dcdb', '#ebf1dd', '#e5e0ec', '#dbeef3', '#fdeada', '#fff2ca',
				'#d8d8d8', '#595959', '#c4bd97', '#8db3e2', '#b8cce4', '#e5b9b7', '#d7e3bc', '#ccc1d9', '#b7dde8', '#fbd5b5', '#ffe694',
				'#bfbfbf', '#3f3f3f', '#938953', '#548dd4', '#95b3d7', '#d99694', '#c3d69b', '#b2a2c7', '#b7dde8', '#fac08f', '#f2c314',
				'#a5a5a5', '#262626', '#494429', '#17365d', '#366092', '#953734', '#76923c', '#5f497a', '#92cddc', '#e36c09', '#c09100',
				'#7f7f7f', '#0c0c0c', '#1d1b10', '#0f243e', '#244061', '#632423', '#4f6128', '#3f3151', '#31859b',  '#974806', '#7f6000'
			];

			var buttons = ['fontcolor', 'backcolor'];

			for (var i = 0; i < 2; i++)
			{
				var name = buttons[i];

				var button = this.button.add(name, this.lang.get(name));
				var $dropdown = this.button.addDropdown(button);

				$dropdown.width(242);
				this.fontcolor.buildPicker($dropdown, name, colors);

			}
		},
		buildPicker: function($dropdown, name, colors)
		{
			var rule = (name == 'backcolor') ? 'background-color' : 'color';

			var len = colors.length;
			var self = this;
			var func = function(e)
			{
				e.preventDefault();
				self.fontcolor.set($(this).data('rule'), $(this).attr('rel'));
			};

			for (var z = 0; z < len; z++)
			{
				var color = colors[z];

				var $swatch = $('<a rel="' + color + '" data-rule="' + rule +'" href="#" style="float: left; font-size: 0; border: 2px solid #fff; padding: 0; margin: 0; width: 22px; height: 22px;"></a>');
				$swatch.css('background-color', color);
				$swatch.on('click', func);

				$dropdown.append($swatch);
			}

			var $elNone = $('<a href="#" style="display: block; clear: both; padding: 5px; font-size: 12px; line-height: 1;"></a>').html(this.lang.get('none'));
			$elNone.on('click', $.proxy(function(e)
			{
				e.preventDefault();
				this.fontcolor.remove(rule);

			}, this));

			$dropdown.append($elNone);
		},
		set: function(rule, type)
		{
			this.inline.format('span', 'style', rule + ': ' + type + ';');
		},
		remove: function(rule)
		{
			this.inline.removeStyleRule(rule);
		}
	};
};
if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.fontfamily = function()
{
	return {
		init: function ()
		{
			var fonts = [ 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Monospace' ];
			var that = this;
			var dropdown = {};

			$.each(fonts, function(i, s)
			{
				dropdown['s' + i] = { title: s, func: function() { that.fontfamily.set(s); }};
			});

			dropdown.remove = { title: 'Remove Font Family', func: that.fontfamily.reset };

			var button = this.button.add('fontfamily', 'Change Font Family');
			this.button.addDropdown(button, dropdown);

		},
		set: function (value)
		{
			this.inline.format('span', 'style', 'font-family:' + value + ';');
		},
		reset: function()
		{
			this.inline.removeStyleRule('font-family');
		}
	};
};
if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.fontsize = function()
{
	return {
		init: function()
		{
			var fonts = [10, 11, 12, 14, 16, 18, 20, 24, 28, 30];
			var that = this;
			var dropdown = {};

			$.each(fonts, function(i, s)
			{
				dropdown['s' + i] = { title: s + 'px', func: function() { that.fontsize.set(s); } };
			});

			dropdown.remove = { title: 'Remove Font Size', func: that.fontsize.reset };

			var button = this.button.add('fontsize', 'Change Font Size');
			this.button.addDropdown(button, dropdown);
		},
		set: function(size)
		{
			this.inline.format('span', 'style', 'font-size: ' + size + 'px;');
		},
		reset: function()
		{
			this.inline.removeStyleRule('font-size');
		}
	};
};
if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.fullscreen = function()
{
	return {
		init: function()
		{
			this.fullscreen.isOpen = false;

			var button = this.button.add('fullscreen', 'Fullscreen');
			this.button.addCallback(button, this.fullscreen.toggle);

			if (this.opts.fullscreen) this.fullscreen.toggle();
		},
		enable: function()
		{
			this.button.changeIcon('fullscreen', 'normalscreen');
			this.button.setActive('fullscreen');
			this.fullscreen.isOpen = true;

			if (this.opts.toolbarExternal)
			{
				this.fullscreen.toolcss = {};
				this.fullscreen.boxcss = {};
				this.fullscreen.toolcss.width = this.$toolbar.css('width');
				this.fullscreen.toolcss.top = this.$toolbar.css('top');
				this.fullscreen.toolcss.position = this.$toolbar.css('position');
				this.fullscreen.boxcss.top = this.$box.css('top');
			}

			this.fullscreen.height = this.$editor.height();

			if (this.opts.maxHeight) this.$editor.css('max-height', '');
			if (this.opts.minHeight) this.$editor.css('min-height', '');

			if (!this.$fullscreenPlaceholder) this.$fullscreenPlaceholder = $('<div/>');
			this.$fullscreenPlaceholder.insertAfter(this.$box);

			this.$box.appendTo(document.body);

			this.$box.addClass('redactor-box-fullscreen');
			$('body, html').css('overflow', 'hidden');

			this.fullscreen.resize();
			$(window).on('resize.redactor.fullscreen', $.proxy(this.fullscreen.resize, this));
			$(document).scrollTop(0, 0);

			this.$editor.focus();
			this.observe.load();
		},
		disable: function()
		{
			this.button.removeIcon('fullscreen', 'normalscreen');
			this.button.setInactive('fullscreen');
			this.fullscreen.isOpen = false;

			$(window).off('resize.redactor.fullscreen');
			$('body, html').css('overflow', '');

			this.$box.insertBefore(this.$fullscreenPlaceholder);
			this.$fullscreenPlaceholder.remove();

			this.$box.removeClass('redactor-box-fullscreen').css({ width: 'auto', height: 'auto' });

			this.code.sync();

			if (this.opts.toolbarExternal)
			{
				this.$box.css('top', this.fullscreen.boxcss.top);
				this.$toolbar.css({
					'width': this.fullscreen.toolcss.width,
					'top': this.fullscreen.toolcss.top,
					'position': this.fullscreen.toolcss.position
				});
			}

			if (this.opts.minHeight) this.$editor.css('minHeight', this.opts.minHeight);
			if (this.opts.maxHeight) this.$editor.css('maxHeight', this.opts.maxHeight);

			this.$editor.css('height', 'auto');
			this.$editor.focus();
			this.observe.load();
		},
		toggle: function()
		{
			if (this.fullscreen.isOpen)
			{
				this.fullscreen.disable();
			}
			else
			{
				this.fullscreen.enable();
			}
		},
		resize: function()
		{
			if (!this.fullscreen.isOpen) return;

			var toolbarHeight = this.$toolbar.height();

			var height = $(window).height() - toolbarHeight;
			this.$box.width($(window).width() - 2).height(height + toolbarHeight);

			if (this.opts.toolbarExternal)
			{
				this.$toolbar.css({
					'top': '0px',
					'position': 'absolute',
					'width': '100%'
				});

				this.$box.css('top', toolbarHeight + 'px');
			}

			this.$editor.height(height - 14);
		}
	};
};
if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.properties = function()
{
	return {
		langs: {
			en: {
				"properties": "Properties"
			}
		},
		block: false,
		labelStyle: {
			'position': 'absolute',
			'padding': '2px 5px',
			'line-height': 1,
			'border-radius': '5px',
			'font-size': '10px',
			'color': 'rgba(255, 255, 255, .9)',
			'z-index': 99
		},
		getTemplate: function()
		{
			 return String()
			 + '<div class="modal-section" id="redactor-modal-properties">'
			 	+ '<section>'
			 		+ '<label id="modal-properties-id-label">Id</label>'
			 		+ '<input type="text" id="modal-properties-id" />'
			 	+ '</section>'
			 	+ '<section>'
				 	+ '<label id="modal-properties-class-label">Class</label>'
				 	+ '<input type="text" id="modal-properties-class" />'
				 + '</section>'
				+ '<section>'
					+ '<button id="redactor-modal-button-action">Save</button>'
					+ '<button id="redactor-modal-button-cancel">Cancel</button>'
				+ '</section>'
			 + '</div>';
		},
		setup: function()
		{
			this.opts.properties = (typeof this.opts.properties === 'undefined') ? {} : this.opts.properties;
			this.opts.properties.id = (typeof this.opts.properties.id === 'undefined') ? true : this.opts.properties.id;
			this.opts.properties.classname = (typeof this.opts.properties.classname === 'undefined') ? true : this.opts.properties.classname;
			this.opts.properties.show = (typeof this.opts.properties.show === 'undefined') ? false : this.opts.properties.show;

		},
		init: function()
		{
			if (this.opts.type === 'pre' || this.opts.type === 'inline')
			{
				return;
			}

			this.properties.setup();

			this.properties.createLabelId(this.properties.labelStyle);
			this.properties.createLabelClass(this.properties.labelStyle);

			this.properties.setEvents();

			var button = this.button.add('properties', this.lang.get('properties'));
			this.button.addCallback(button, this.properties.show);

		},
		show: function()
		{
			this.modal.addTemplate('properties', this.properties.getTemplate());
			this.modal.load('properties', 'Properties', 600);

			var button = this.modal.getActionButton().text('Save');
			button.on('click', this.properties.save);

			this.properties.showId();
			this.properties.showClass();

			this.modal.show();

		},
		createLabelId: function(css)
		{
			if (!this.opts.properties.show && !this.opts.properties.id)
			{
				return;
			}

			this.properties.labelId = $('<span />').attr('id', 'redactor-properties-label-id-' + this.uuid).attr('title', 'ID').hide();
			this.properties.labelId.css(css).css('background', 'rgba(229, 57, 143, .7)');
			$('body').append(this.properties.labelId);

		},
		createLabelClass: function(css)
		{
			if (!this.opts.properties.show && !this.opts.properties.classname)
			{
				return;
			}

			this.properties.labelClass = $('<span />').attr('id', 'redactor-properties-label-class-' + this.uuid).attr('title', 'class').hide();
			this.properties.labelClass.css(css).css('background', 'rgba(61, 121, 242, .7)');
			$('body').append(this.properties.labelClass);

		},
		setEvents: function()
		{
			this.core.element().on('click.callback.redactor', this.properties.showOnClick);
			$(document).on('mousedown.redactor-properties', $.proxy(this.properties.hideOnBlur, this));

			this.core.element().on('destroy.callback.redactor', $.proxy(function()
			{
				$(document).off('.redactor-properties');

			}, this));
		},
		showId: function()
		{
			if (this.opts.properties.id)
			{
				$('#modal-properties-id-label').show();
				$('#modal-properties-id').show().val($(this.properties.block).attr('id'));
			}
			else
			{
				$('#modal-properties-id, #modal-properties-id-label').hide();
			}
		},
		showClass: function()
		{
			if (this.opts.properties.classname)
			{
				$('#modal-properties-class-label').show();
				$('#modal-properties-class').show().val($(this.properties.block).attr('class'));
			}
			else
			{
				$('#modal-properties-class, #modal-properties-class-label').hide();
			}
		},
		save: function()
		{
			// id
			if (this.opts.properties.id)
			{
				var id = $('#modal-properties-id').val();
				if (typeof id === 'undefined' || id === '')
				{
					this.block.removeAttr('id', this.properties.block);
				}
				else
				{
					this.block.replaceAttr('id', id, this.properties.block);
				}
			}

			// class
			if (this.opts.properties.classname)
			{
				var classname = $('#modal-properties-class').val();
				if (typeof classname === 'undefined' || classname === '')
				{
					this.block.removeAttr('class', this.properties.block);
				}
				else
				{
					this.block.replaceClass(classname, this.properties.block);
				}
			}

			this.modal.close();
			this.properties.showOnClick(false);

		},
		showOnClick: function(e)
		{
			if (e !== false)
			{
				e.preventDefault();
			}

			var zindex = (typeof this.fullscreen !== 'undefined' && this.fullscreen.isOpen) ? 1052 : 99;

			this.properties.block = this.selection.block();
			if (!this.properties.block || !this.utils.isRedactorParent(this.properties.block) || this.utils.isCurrentOrParent(['figure', 'li']))
			{
				return;
			}

			var pos = $(this.properties.block).offset();

			var classname = this.properties.showOnClickClass(pos, zindex);
			this.properties.showOnClickId(pos, zindex, classname);

		},
		showOnClickId: function(pos, zindex, classname)
		{
			var id = $(this.properties.block).attr('id');
			if (this.opts.properties.show && this.opts.properties.id && typeof id !== 'undefined' && id !== '')
			{
				setTimeout($.proxy(function()
				{
					var width = (this.opts.properties.classname && typeof classname !== 'undefined' && classname !== '') ? this.properties.labelClass.innerWidth() : -3;
					this.properties.labelId.css({

						zIndex: zindex,
						top: pos.top - 13,
						left: pos.left + width

					}).show().text('#' + id);

				}, this), 10);
			}
		},
		showOnClickClass: function(pos, zindex)
		{
			var classname = $(this.properties.block).attr('class');
			if (this.opts.properties.show && this.opts.properties.classname && typeof classname !== 'undefined' && classname !== '')
			{
				this.properties.labelClass.css({

					zIndex: zindex,
					top: pos.top - 13,
					left: pos.left - 3

				}).show().text(classname);
			}

			return classname;
		},
		hideOnBlur: function(e)
		{
			if (e.target === this.properties.block)
			{
				return;
			}

			this.properties.hideOnBlurId();
			this.properties.hideOnBlurClass();

		},
		hideOnBlurId: function()
		{
			if (this.opts.properties.show && this.opts.properties.id)
			{
				this.properties.labelId.css('z-index', 99).hide();
			}
		},
		hideOnBlurClass: function()
		{
			if (this.opts.properties.show && this.opts.properties.classname)
			{
				this.properties.labelClass.css('z-index', 99).hide();
			}
		}
	}
};

if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.scriptbuttons = function()
{
    return {
        init: function()
        {
            var sup = this.button.add('superscript', 'superscript');
            var sub = this.button.add('subscript', 'subscript');
            //this.button.setIcon('superscript', '<i class="fa-superscript"></i>');
            //this.button.setIcon('subscript', '<i class="fa-subscript"></i>');
            this.button.setAwesome('superscript', 'fa-superscript');
            this.button.setAwesome('subscript', 'fa-subscript');

            this.button.addCallback(sup, this.scriptbuttons.formatSup);
            this.button.addCallback(sub, this.scriptbuttons.formatSub);
        },
        formatSup: function()
        {
            this.inline.format('sup');
        },
        formatSub: function()
        {
            this.inline.format('sub');
        }
    }
};

/*
 * Uploadcare Redactor plugin (1.1.3)
 */

if (!RedactorPlugins) var RedactorPlugins = {};

(function($) {
    RedactorPlugins.uploadcare = function() {
        var $opts;
        return {
            init: function() {
                $opts = this.opts.uploadcare;
                // defaults
                if (! $opts.crop) {
                    $opts.crop = '';
                }
                if (! $opts.version) {
                    $opts.version = '2.5.0';
                }

                if (typeof uploadcare === 'undefined') {
                    var widget_url = 'https://ucarecdn.com/widget/' + $opts.version + '/uploadcare/uploadcare.min.js';
                    $.getScript(widget_url);
                }
                var button = this.button.add('image', $opts.buttonLabel || 'Uploadcare');
                this.button.addCallback(button, this.uploadcare.show);

                // using Font Awesome, sets the default icon
                // for usage with Semantic UI, change second argument to desired icon class (e.g. 'attach icon')
                this.button.setAwesome('uploadcare', 'fa-picture-o');
            },

            show: function() {
                var dialog = uploadcare.openDialog({}, $opts);
                this.selection.save();
                dialog.done(this.uploadcare.done)
            },

            done: function(data) {
                var $this = this;
                var files = $opts.multiple ? data.files() : [data];
                this.selection.restore();
                $.when.apply(null, files).done(function() {
                    $.each(arguments, function() {
                        if ($.isFunction($opts.uploadCompleteCallback)) {
                            $opts.uploadCompleteCallback.call($this, this);
                        } else {
                            var imageUrl = this.cdnUrl;
                            if (this.isImage && ! this.cdnUrlModifiers) {
                                imageUrl += '-/preview/';
                            }
                            if (this.isImage) {
                                $this.insert.html('<img src="' + imageUrl + '" alt="' + this.name + '" />', false);
                            } else {
                                $this.insert.html('<a href="' + this.cdnUrl + '">' + this.name + '</a>', false);
                            }
                        }
                  });
                });
            },
        };
    };
})(jQuery);

if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.video = function()
{
	return {
		reUrlYoutube: /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig,
		reUrlVimeo: /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/,
		getTemplate: function()
		{
			return String()
			+ '<section id="redactor-modal-video-insert">'
				+ '<label>' + this.lang.get('video_html_code') + '</label>'
				+ '<textarea id="redactor-insert-video-area" style="height: 160px;"></textarea>'
			+ '</section>';
		},
		init: function()
		{
			var button = this.button.addAfter('image', 'video', this.lang.get('video'));
			this.button.addCallback(button, this.video.show);
		},
		show: function()
		{
			this.modal.addTemplate('video', this.video.getTemplate());

			this.modal.load('video', this.lang.get('video'), 700);
			this.modal.createCancelButton();

			var button = this.modal.createActionButton(this.lang.get('insert'));
			button.on('click', this.video.insert);

			this.selection.save();
			this.modal.show();

			$('#redactor-insert-video-area').focus();

		},
		insert: function()
		{
			var data = $('#redactor-insert-video-area').val();
			data = this.clean.stripTags(data);

			// parse if it is link on youtube & vimeo
			var iframeStart = '<iframe style="width: 500px; height: 281px;" src="',
				iframeEnd = '" frameborder="0" allowfullscreen></iframe>';

			if (data.match(this.video.reUrlYoutube))
			{
				data = data.replace(this.video.reUrlYoutube, iframeStart + '//www.youtube.com/embed/$1' + iframeEnd);
			}
			else if (data.match(this.video.reUrlVimeo))
			{
				data = data.replace(this.video.reUrlVimeo, iframeStart + '//player.vimeo.com/video/$2' + iframeEnd);
			}

			this.selection.restore();
			this.modal.close();

			var current = this.selection.getBlock() || this.selection.getCurrent();

			if (current) $(current).after(data);
			else
			{
				this.insert.html(data);
			}

			this.code.sync();
		}

	};
};

//# sourceMappingURL=scripts.js.map
