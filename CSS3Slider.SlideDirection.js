/**
 * handles direction slides
 *
 * @param {CSS3Slider} CSS3Slider
 * @returns {CSS3Slider_SlideDirection}
 */
function CSS3Slider_SlideDirection(CSS3Slider) {

  this.__CSS3Slider = null;


  /**
   * init tasks
   *
   * @param {CSS3Slider} CSS3Slider
   * @returns {void}
   */
  this.__construct = function(CSS3Slider) {
    this.__CSS3Slider = CSS3Slider;
  };


  /**
   * slide in a given direction
   *
   * @param {String} direction
   * @param {Boolean} testCalculation
   * @returns {object}
   */
  this.directionSlide = function(direction, testCalculation) {
    if(this.__CSS3Slider.isAnimationAllowed()) {
      var baseConfig = this.__CSS3Slider._Config._getBaseConfig();
      var runtimeConfig = this.__CSS3Slider._Config.getRuntimeConfig();

      if(baseConfig.continiousSlide) {
        if(baseConfig.cloneMode) {
          // handle slide if cloneMode and continious slide are active
          return this.__directionSlideContiniousClone(direction, baseConfig, runtimeConfig, testCalculation);
        }else {
          // handle slide if continious slide is active
          return this.__directionSlideContinious(direction, baseConfig, runtimeConfig, testCalculation);
        }
      }else {
        // handle simple slide
        return this.__directionSlide(direction, baseConfig, runtimeConfig, testCalculation);

      }
    }else {
      // simply return the runtime config without animation
      return this.__CSS3Slider._Config.getRuntimeConfig();
    }
  };


  /**
   * handle the slide if cloneMode and continious slide are active
   *
   * @param {String} direction
   * @param {object} baseConfig
   * @param {object} runtimeConfig
   * @param {Boolean} testCalculation
   * @returns {object}
   */
  this.__directionSlideContiniousClone = function(direction, baseConfig, runtimeConfig, testCalculation) {
    var currentPosition = runtimeConfig.slidePosition;
    var slidesAvailable = this.__CSS3Slider.slidesAvailable(direction);

    if(slidesAvailable < baseConfig.maxSteps) {
      // if the slider has not enough slider childs to perform a full slide
      // deactivate the transition
      this.__CSS3Slider._Dom.deactivateAnimation();

      if(direction === 'right') {
        // move the slider to the left side
        this.__CSS3Slider._SlidePosition.positionSlide(0 - (runtimeConfig.slideChildrenCount - currentPosition));

      }else if(direction === 'left') {
        // move the slider to the right side
        this.__CSS3Slider._SlidePosition.positionSlide(runtimeConfig.slideChildrenCount + currentPosition);

      }

      // after a short timeout - slide to the new position
      setTimeout(function() {
        this.__CSS3Slider._Dom.activateAnimation();
        this.directionSlide(direction);
      }.bind(this), 50);

      this.__CSS3Slider._allowAnimation();

      // return the future runtimeconfig using the testcalculation flag
      return this.directionSlide(direction, true);

    }

    // simply slide in the desired direction
    return this.__directionSlide(direction, baseConfig, runtimeConfig, testCalculation);
  };


  /**
   * handle the slide if continious slide is active
   *
   * @param {String} direction
   * @param {object} baseConfig
   * @param {object} runtimeConfig
   * @param {Boolean} testCalculation
   * @returns {object}
   */
  this.__directionSlideContinious = function(direction, baseConfig, runtimeConfig, testCalculation) {
    var slidesAvailable = this.__CSS3Slider.slidesAvailable(direction);

    // if there are no more slides available - then slide to the other side
    if(slidesAvailable <= 0) {
      if(direction === 'left') {
        return this.__CSS3Slider._SlidePosition.positionSlide(runtimeConfig.slideChildrenCount);

      }else if(direction === 'right') {
        return this.__CSS3Slider._SlidePosition.positionSlide(0);

      }
    }

    // simply slide in the desired direction
    return this.__directionSlide(direction, baseConfig, runtimeConfig, testCalculation);
  };


  /**
   * simple slide if no special behavior is active
   *
   * @param {String} direction
   * @param {object} baseConfig
   * @param {object} runtimeConfig
   * @param {Boolean} testCalculation
   * @returns {object}
   */
  this.__directionSlide = function(direction, baseConfig, runtimeConfig, testCalculation) {
    var currentPosition = runtimeConfig.slidePosition;
    var slidesAvailable = this.__CSS3Slider.slidesAvailable(direction);
    var stepsToSlide = null;

    // check if there are enough slider child nodes available for a slide, to perform the configured single slide
    if(slidesAvailable >= baseConfig.maxSteps) {
      stepsToSlide = baseConfig.maxSteps;
    }else {
      stepsToSlide = slidesAvailable;
    }

    // set the new active slider child node
    var newPosition = (direction === 'left') ? currentPosition - stepsToSlide : currentPosition + stepsToSlide;

    // check if the current active slider child node is the target slide child node
    if(newPosition !== currentPosition) {
      return this.__CSS3Slider._SlidePosition.positionSlide(newPosition, testCalculation);

    }else {
      return this.__CSS3Slider._Config.getRuntimeConfig();
    }
  };

  this.__construct(CSS3Slider);
}

module.exports = CSS3Slider_SlideDirection;
