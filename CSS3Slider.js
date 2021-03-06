var CSS3Slider_Config = require('./CSS3Slider.Config.js');
var CSS3Slider_Dom = require('./CSS3Slider.Dom.js');
var CSS3Slider_SlidePosition = require('./CSS3Slider.SlidePosition.js');
var CSS3Slider_SlideDirection = require('./CSS3Slider.SlideDirection.js');

/**
 * provides easy to use horizontal sliders
 *
 * @param {HTMLElement} slideTargetNode
 * @param {object} baseConfig
 * @returns {CSS3Slider}
 */
function CSS3Slider(slideTargetNode, baseConfig) {

  this._Config = null;
  this._Dom = null;
  this._SlidePosition = null;
  this._SlideDirection = null;

  this._slideTargetNode = null;

  this.__allowAnimation = false;

  /**
   * init tasks
   *
   * @param {HTMLElement} slideTargetNode
   * @param {object} baseConfig
   * @returns {void}
   */
  this.__construct = function(slideTargetNode, baseConfig) {
    this.__setSlideTargetNode(slideTargetNode);

    this._Config = new CSS3Slider_Config(this, baseConfig);
    this._Dom = new CSS3Slider_Dom(this);
    this._SlidePosition = new CSS3Slider_SlidePosition(this);
    this._SlideDirection = new CSS3Slider_SlideDirection(this);
  };

  /**
   * @param {HTMLElement} slideTargetNode
   * @returns {void}
   */
  this.__setSlideTargetNode = function(slideTargetNode) {
    this._slideTargetNode = slideTargetNode;
  };

  /**
   * @returns {HTMLElement}
   */
  this.getSlideTargetNode = function() {
    return this._slideTargetNode;
  };

  /**
   * set allowAnimation flag to true
   *
   * @returns {void}
   */
  this._allowAnimation = function() {
    this.__allowAnimation = true;
  };

  /**
   * set allowAnimation flag to false
   *
   * @returns {Boolean}
   */
  this._forbidAnimation = function() {
    this.__allowAnimation = false;
  };

  /**
   * @returns {Boolean}
   */
  this.isAnimationAllowed = function() {
    return this.__allowAnimation;
  };


  /**
   * external access point to update the config of the CSS3Slider
   *
   * @param {object} baseConfig
   * @returns {void}
   */
  this.updateBaseConfig = function(baseConfig) {
    this._Config.updateBaseConfig(baseConfig);
  };


  /**
   * reactivate sleepint slider
   *
   * @returns {void}
   */
  this.reactivate = function() {
    this._Config.updateBaseConfig();
  };

  /**
   * set slider to sleep mode
   *
   * @returns {void}
   */
  this.deactivate = function() {
    this._Dom.resetSlideTargetNode();
  };


  /**
   * external access point for simple slide to left
   *
   * @returns {object}
   */
  this.slideLeft = function() {
    if(this.isAnimationAllowed()) {
      return this._SlideDirection.directionSlide('left');
    }
  };

  /**
   * external access point for simple slide to right
   *
   * @returns {object}
   */
  this.slideRight = function() {
    if(this.isAnimationAllowed()) {
      return this._SlideDirection.directionSlide('right');
    }
  };

  /**
   * external access point for a slide to a specific position
   *
   * @param {Number} position
   * @returns {object}
   */
  this.slideTo = function(position) {
    if(this.isAnimationAllowed()) {
      return this._SlidePosition.positionSlide(position);
    }
  };


  /**
   * returns the runtime config of the config object
   *
   * @returns {object}
   */
  this.getRuntimeConfig = function() {
    return this._Config.getRuntimeConfig();
  };


  /**
   * checks count of elements in a specific direction from the current position
   *
   * @param {String} direction
   * @returns {Number}
   */
  this.slidesAvailable = function(direction) {
    // get the config objects
    var runtimeConfig = this._Config.getRuntimeConfig();
    var baseConfig = this._Config._getBaseConfig();

    // get the current active slider child node
    var currentPosition = runtimeConfig.slidePosition;
    // Hack for damn IE -> default value can be 'auto'
    if(!currentPosition) {
      currentPosition = 0;
    }

    var slidesAvailable = 0;

    // calculate how many slider steps are available
    if(direction === 'right') {
      slidesAvailable = runtimeConfig.slideChildrenCount - currentPosition - runtimeConfig.slideChildrenVisible + runtimeConfig.slideOverflowCount;

    }else if(direction === 'left') {
      slidesAvailable = currentPosition;
    }

    // add the clone count if continious slide is active
    if(baseConfig.cloneMode && baseConfig.continiousSlide) {
      slidesAvailable += runtimeConfig.slideClonesCount;
    }

    return slidesAvailable;
  };


  this.__construct(slideTargetNode, baseConfig);
}

module.exports = CSS3Slider;
