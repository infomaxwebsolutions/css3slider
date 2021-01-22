# CSS3Slider

Create simple horizontal slider using only css3 transitions

## Why should you use it?

The simple horizontal slider is a well known pattern, that can be observed in various kinds on thousands of websites. There are a lot of frameworks out there, that provide all kinds of slider experiences, but most of them are pretty bloated and offer more functions than most of us need. This is where the CSS3Slider comes im place. With the CSS3Slider you can create simple slider that are responsive and offer a simple but nice sliding animation.

## Installing

Currently there is only one way to install the CSS3Slider, using NPM:
```
$ npm install css3slider
```

## How to use

First you need to require the CSS3Slider:
```javascript
var CSS3Slider = require('css3slider');
```

In order to use the CSS3Slider you will need to create a new CSS3Slider Object in your script:
```javascript
var mySliderObject = new CSS3Slider(htmlNode, configObject);
```
You need to pass two params to the CSS3Slider:
* The htmlNode that you want to work as a slider - **mandatory**
* An options object you can use, to customize your slider - **optional**

### The Options

In order to customize your CSS3Slider, you pass an options object to it. Valid options are listed below:
* **maxSteps** - you can config how many steps the slider will slide in a single slide attempt - default is *1*
* **forceSingleElement** - if you use the slider to slide image galleries, where every image is 100% viewport of the slider, you can manualy force the CSS3Slider to only display one slider element per time - default is *false*
* **cloneMode** - with cloneMode true, CSS3Slider will add clones before the first child element and after the last child element, to create the illusion of an endless slider - default is *false*
* **continiousSlide** - with continiousSlide true, CSS3Slider will bring you back to the start if you reach the last child element. If cloneMode is also true, CSS3Slider will create an endless slider - default is *false*
* **overflowAllowed** - with overflowAllowed true, the CSS3Slider allow to slide to the last element even there are more than one element visible - default is *false*

### API

The CSS3Slider will not create any kind of controll elements or arrows to slide your content. It is totaly up to you, to create those elements and then call the CSS3Slider methods when needed. The benefit to this is, that you can totaly customize your UI to your needs. You can even slide your contents from other moduls or use touch frameworks like Hammer to access your slider.

#### How to slide

```javascript
mySliderObject.slideLeft();
```
A simple slide to the left side.

```javascript
mySliderObject.slideRight();
```
A simple slide to the right side.

```javascript
mySliderObject.slideTo(index);
```
Slide to a specific position inside the slider elements. Lets say you have a row of 6 teasers, than you can slide directly to teaser 5 using
```javascript
mySliderObject.slideTo(4);
```

#### Might come in handy

CSS3Slider offers some additional methods you can use to create your own slider.

```javascript
mySliderObject.isAnimationAllowed();
```
Check if the CSS3Slider will accept a new slide attempt. If this returns false, the CSS3Slider is currently busy.

```javascript
mySliderObject.updateBaseConfig();
```
You can use this method to update the CSS3Slider. This can be usefull if you add new child elements to the slider, or after a resize event.

```javascript
mySliderObject.deactivate();
```
If you want to deactivate the CSS3Slider, you can do this with the deactivate method.

```javascript
mySliderObject.reactivate();
```
To reactivate a former deactivated CSS3Slider, use the reactivate method.

```javascript
mySliderObject.slidesAvailable(direction);
```
Will return the count of child elements in the given direction, beginning from the current slider position.
Valid directions are *left* and *right*.

```javascript
mySliderObject.getRuntimeConfig();
```
This returns the runtime config object. The runtime config object stores several informations that describe the current state of your CSS3Slider:
* **slidePosition** - the current first visible element in the row
* **slideValue** - the offset of the row in percent
* **slideChildrenCount** - how many non clone elements are in the slider
* **slideChildrenVisible** - how many elements are visible at once in the slider
* **slideOverflowCount** - how many overflow steps are possible
* **slideClonesCount** - how many clones are needed


## Authors

* **Axel Güldner@infomax** - *all the work*
