# jQuery Modulider
Copyright &copy; [José Almeida](http://joseafga.com.br) <br />
License [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/ "License CC by 3.0")

Easy, Fast, Extensible and Flexible Slider for jQuery

## Demonstration:
[jQuery Modulider Demo](http://janightmare.github.io/jquery.modulider/demo/)

## Tested and Working:
* Internet Explorer 6, 7, 8, 9, 10
* Firefox 3.6.8, 8.0, 9.0
* Opera 11.52
* Chrome 15.0
* Safari 5.0

## Features:
* Autoplay
* Show Arbitrary/Next/Previous Slide
* Captions
* Navigation
* Automatically Generate Thumbnails for Navigation
* Preload
* Custom Transitions
* Random Transition
* Random Transition List - *you choose the transitions to random*
* Easy Customization
* Modular
* Events

## Options:
* `slides` jQuery Object
* `captions` jQuery Object
* `nav` jQuery Object
* `delay` Integer
* `speed` Integer
* `transition` String
* `randomList` Array
* `autoNav` Boolean
* `preload` Boolean
* `autoplay` Boolean
* `mouseOver` Boolean

## Main Methods:
* `.play()`
* `.pause()`
* `.next()`
* `.prev()`
* `.goTo(Integer to)`

## Default Transitions:
* none
* random
* fade
* crossfade
* fadebackground
* slide
* crossslide
* slidebackground
* show
* crossshow
* showbackground

## Events:
* onPlay
* onPause
* onNext
* onPrev
* onStartChanging `vars: current slide(int), next slide(int)`
* onFinishChanging