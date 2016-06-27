# Redactor Plugins for Statamic v2.x
by Rudy Affandi (2016)

## What is this?
This addon allows you to add various Redactor plugins to Statamic v2.x

By default, it comes precompiled with the following addons:

- fontcolor
- fontfamily
- fontsize
- fullscreen
- scriptbuttons
- video

## Installation
- Copy or clone this repo to your `site/addons/RedactorPlugins`  
`git clone https://github.com/lesaff/statamicv2-redactorplugins.git RedactorPlugins`

## Usage
Edit `site/settings/system.yaml` and add the following to your `redactor` settings

```
plugins:  
  - fontcolor  
  - fontfamily  
  - fontsize  
  - fullscreen  
  - scriptbuttons  
  - table  
  - video   
```

### Example:

```
redactor:
  - 
    name: Standard
    settings:
      plugins:
        - fontcolor
        - fontfamily
        - fontsize
        - fullscreen
        - scriptbuttons
        - table
        - video     
```

## How to add or remove plugins?
I've included a `gulpfile` in the addon to somewhat automate the concatenation process. 

### To add a new plugin
- Drop the plugin js file in the `site/addons/RedactorPlugins/resources/assets/js/plugins` folder
- Initialize gulp, run `npm install` (if you have not done so)
- Run `gulp` or `gulp --production`
- Add the newly added plugin to the `site/settings/system.yaml`

### To remove plugin(s)
- Remove the plugin js file(s) from the `site/addons/RedactorPlugins/resources/assets/js/plugins` folder
- Initialize gulp, run `npm install` (if you have not done so)
- Run `gulp` or `gulp --production`
- Remove plugin(s) from the `site/settings/system.yaml`
