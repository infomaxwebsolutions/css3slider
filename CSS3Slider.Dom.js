var CSS3Slider_Dom_Clone = CSS3Slider_Dom_Clone || {};

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
    
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but only CommonJS-like enviroments that support module.exports, like Node.
    CSS3Slider_Dom_Clone = require('./CSS3Slider.Dom.Clones.js');
    
    module.exports = factory;
    
  } else {
    // Browser globals (root is window)
    root.CSS3Slider_Dom = factory;
  }
})(this, CSS3Slider_Dom);


/**
 * handle the dom manipulations
 * 
 * @param {CSS3Slider} CSS3Slider
 * @returns {CSS3Slider_Dom}
 */
function CSS3Slider_Dom (CSS3Slider) {
  
  this.__CSS3Slider = null;
  this.__Clone = null;
  
  /**
   * init tasks
   * 
   * @param {CSS3Slider} CSS3Slider
   * @returns {void}
   */
  this.__construct = function (CSS3Slider) {
    this.__CSS3Slider = CSS3Slider;
    this.__Clone = new CSS3Slider_Dom_Clone(CSS3Slider);
    
    this.resetSlideTargetNode();
    this.prepareSlideTarget();
  };
  
  
  /**
   * reset the dom to the initial state (remove all inline stylings)
   * 
   * @returns {void}
   */
  this.resetSlideTargetNode = function () {
    var slideTargetNode = this.__CSS3Slider.getSlideTargetNode();
    var slideNodeChildren = slideTargetNode.children;
    
    // remove calculated widths for all slider children
    for (var i = 0; i < slideNodeChildren.length; i++) {
      slideNodeChildren[i].style.width = null;
    }

    // remove calculated width for the sliding target
    slideTargetNode.style.width = null;
    this.deactivateAnimation();

    // remove all clones
    if (this.__CSS3Slider._Config._getBaseConfig().cloneMode) {
      this.__Clone._removeClones();
    }
  };
  
  
  /**
   * set all inline stylings for the slider
   * 
   * @returns {void}
   */
  this.prepareSlideTarget = function () {
    var runtimeConfig = this.__CSS3Slider._Config.getRuntimeConfig();
    
    // calculate the width of the slider row
    var totalWidth = (runtimeConfig.slideChildrenCount / runtimeConfig.slideChildrenVisible) * 100;
    // calculate the width of one single slider child node in percent
    var singleElementWidth = this.__CSS3Slider._Config._getSingleElementWidthInPercent();

    var slideTargetNode = this.__CSS3Slider.getSlideTargetNode();
    var slideNodeChildren = slideTargetNode.children;
    
    // set the width of every slider child node
    for (var i = 0; i < slideNodeChildren.length; i++) {
      slideNodeChildren[i].style.width = singleElementWidth + '%';
    }

    // set the width of the slider row node
    slideTargetNode.style.width = totalWidth + '%';
    this.activateAnimation();

    // add clones
    if (this.__CSS3Slider._Config._getBaseConfig().cloneMode) {
      this.__Clone._addClones();
    }
  };
  
  /**
   * set the transition styling
   * 
   * @returns {void}
   */
  this.activateAnimation = function () {
    this.__CSS3Slider.getSlideTargetNode().style.transition = 'margin-left 0.5s ease';;
  };
  
  /**
   * used to remove the transition styling
   * 
   * @returns {void}
   */
  this.deactivateAnimation = function () {
    this.__CSS3Slider.getSlideTargetNode().style.transition = null;
  };
  
  
  this.__construct (CSS3Slider);
}