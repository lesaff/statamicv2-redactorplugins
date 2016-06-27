<?php

namespace Statamic\Addons\RedactorPlugins;

use Statamic\Extend\Listener;

class RedactorPluginsListener extends Listener
{
    /**
     * The events to be listened for, and the methods to call.
     *
     * @var array
     */
    public $events = [
        'cp.add_to_head'  => 'showCss',
    ];

    /**
     * Initialize Hubspot assets
     * @return string
     */
    public function showCss()
    {
        $addon_css = $this->css->url('hubspot.css');
        $output = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">';

        return $output;

    }

}
