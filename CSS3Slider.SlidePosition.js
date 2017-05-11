(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
    
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but only CommonJS-like enviroments that support module.exports, like Node.
    module.exports = factory;
    
  } else {
    // Browser globals (root is window)
    root.CSS3Slider_SlidePosition = factory;
  }
})(this, CSS3Slider_SlidePosition);


/**
 * handles slides to a specific position
 * 
 * @param {CSS3Slider} CSS3Slider
 * @returns {CSS3Slider_SlidePosition}
 */
function CSS3Slider_SlidePosition (CSS3Slider) {
  
  this.__CSS3Slider = null;
  
  
  /**
   * init tasks
   * 
   * @param {CSS3Slider} CSS3Slider
   * @returns {void}
   */
  this.__construct = function (CSS3Slider) {
    this.__CSS3Slider = CSS3Slider;
  };
  
  
  /**
   * slide to a specific position
   * 
   * @param {Number} position - the index of the slider child to slide to
   * @param {Boolean} testCalculation - set to true if you only want to calculate the runtimeconfig without actualy sliding
   * @returns {CSS3Slider_SlidePosition@pro;__CSS3Slider@pro;_Config@call;_setRuntimeConfig|CSS3Slider_SlidePosition.positionSlide.newRuntimeConfig|CSS3Slider_SlidePosition@pro;__CSS3Slider@pro;_Config@call;getRuntimeConfig}
   */
  this.positionSlide = function (position, testCalculation) {
    if (this.__CSS3Slider.isAnimationAllowed()) {
      
      this.__CSS3Slider._forbidAnimation();
      
      // check if the position is inside the slider bounds
      position = this.__getActualPositionInsideBounds(position);

      // set the new slider position in percent
      var newSlideValue = (position * this.__CSS3Slider._Config._getBaseConfig().singleStep) * -1;
      
      // set the new runtime config
      var newRuntimeConfig = {
        slidePosition: position,
        slideValue: newSlideValue,
        slideChildrenCount: this.__CSS3Slider._Config.getRuntimeConfig().slideChildrenCount,
        slideChildrenVisible: this.__CSS3Slider._Config.getRuntimeConfig().slideChildrenVisible,
        slideClonesCount : this.__CSS3Slider._Config.getRuntimeConfig().slideClonesCount
      };
      
      // check if call is not only a testCalculation
      if (!testCalculation) {
        // if so - actualy slide the slide target
        this.__CSS3Slider.getSlideTargetNode().style.marginLeft = newSlideValue + '%';
        
        // allow animation again, after the css transition took place
        setTimeout(function () {
          var runtimeConfig = this.__CSS3Slider._Config.getRuntimeConfig();
          if (runtimeConfig.slideChildrenCount > runtimeConfig.slideChildrenVisible){
            this.__CSS3Slider._allowAnimation();
          }
        }.bind(this), 500);
        
        return this.__CSS3Slider._Config._setRuntimeConfig(newRuntimeConfig);
        
      } else {
        // if not, only return the calculated but not stored runtimeconfig
        this.__CSS3Slider._allowAnimation();
        return newRuntimeConfig;
      }
      
    } else {
      // simply return the runtime config without animation
      return this.__CSS3Slider._Config.getRuntimeConfig();
    }
  };
  
  
  /**
   * return the next posible position inside the bounds of the slider
   * 
   * @param {Number} position
   * @returns {@var;minPosition|@var;maxPosition}
   */
  this.__getActualPositionInsideBounds = function (position) {
    var baseConfig = this.__CSS3Slider._Config._getBaseConfig();
    var runtimeConfig = this.__CSS3Slider._Config.getRuntimeConfig();

    var minPosition = 0;
    var maxPosition = runtimeConfig.slideChildrenCount - runtimeConfig.slideChildrenVisible;
    if(maxPosition <= 0){
      maxPosition = 0;
    }

    // if continious slide is active, add the clones count to min and max positions
    if (baseConfig.cloneMode) {
      minPosition -= runtimeConfig.slideClonesCount;
      maxPosition += runtimeConfig.slideClonesCount;
    }

    // slide to the first slider child node, if the target is below zero
    if (position < minPosition) {
      position = minPosition;
    }
    // slide to the last slider child node, if the target is beyond the last slider child node
    if (position >= maxPosition) {
      position = maxPosition;
    }
    
    return position;
  };
  
  this.__construct (CSS3Slider);
}