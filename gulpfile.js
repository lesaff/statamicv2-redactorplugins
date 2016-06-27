var elixir = require('laravel-elixir');

require('laravel-elixir-vueify');

elixir(function(mix) {
    
    mix.scripts([
        'plugins/*.js',
        'custom.js'
    ], 'resources/assets/js/scripts.js');
});