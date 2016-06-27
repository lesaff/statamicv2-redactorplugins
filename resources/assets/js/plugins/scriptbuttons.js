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
