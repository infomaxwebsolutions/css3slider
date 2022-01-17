var imxQuery = require('imxquery');

/**
 * the configuration of the CSS3Slider
 *
 * @param {CSS3Slider} CSS3Slider
 * @param {object} baseConfig
 * @returns {CSS3Slider_Config}
 */
function CSS3Slider_Config(CSS3Slider, baseConfig) {

  /**
   * fallback for baseConfig
   */
  this.__defaultBaseConfig = {
    maxSteps: 1,               // how many elements in the slider should one direction slide step skip
    singleStep: 100,           // slide width in percent of the width of a single slide step
    forceSingleElement: false, // better ignore this - can be used to force the slider only to show one element
    cloneMode: false,          // set to true to add clones for endless slider visuals
    continiousSlide: false,    // set to true to create an endless slider
    overflowAllowed: false,     // set to true to allow to slide the last element to the first visible position.
    calcMethod: 'floor'
  };

  this.__CSS3Slider = null;

  /**
   * contains all user given config input
   */
  this.__baseConfig = null;
  /**
   * contains calculated values
   */
  this.__runtimeConfig = null;

  /**
   * init tasks
   *
   * @param {CSS3Slider} CSS3Slider
   * @param {object} baseConfig
   * @returns {void}
   */
  this.__construct = function(CSS3Slider, baseConfig) {
    this.__CSS3Slider = CSS3Slider;

    if(baseConfig === undefined) {
      baseConfig = [];
    }
    this._setBaseConfig(imxQuery.extendObject(baseConfig, this.__defaultBaseConfig));

    this._createRuntimeConfig();
  };

  /**
   * @param {object} baseConfig
   * @returns {void}
   */
  this._setBaseConfig = function(baseConfig) {
    this.__baseConfig = baseConfig;
  };

  /**
   * @returns {object}
   */
  this._getBaseConfig = function() {
    return this.__baseConfig;
  };

  /**
   * @param {object} runtimeConfig
   * @returns {object}
   */
  this._setRuntimeConfig = function(runtimeConfig) {
    this.__runtimeConfig = runtimeConfig;
    return this.getRuntimeConfig();
  };

  /**
   * @returns {object}
   */
  this.getRuntimeConfig = function() {
    return this.__runtimeConfig;
  };


  /**
   * update the config, for example after a screen resize
   *
   * @param {object} baseConfig
   * @returns {void}
   */
  this.updateBaseConfig = function(baseConfig) {
    // set the single step to the default value of 100
    this.__baseConfig.singleStep = 100;

    if(baseConfig !== undefined) {
      this._setBaseConfig(imxQuery.extendObject(baseConfig, this.__defaultBaseConfig));
    }

    this.__CSS3Slider._Dom.resetSlideTargetNode();

    // create a new clean runtime config
    this._createRuntimeConfig();

    this.__CSS3Slider._Dom.prepareSlideTarget();
    this.__CSS3Slider.slideTo(this.getRuntimeConfig().slidePosition);
  };


  /**
   * creates the runtime config
   *
   * @returns {object}
   */
  this._createRuntimeConfig = function() {
    var slideTargetNode = this.__CSS3Slider.getSlideTargetNode();

    // look up how many childnodes without clones are present
    var cloneChildrenCount = slideTargetNode.querySelectorAll('.-css3Slider-prepander').length * 2;
    var slideChildrenCount = slideTargetNode.childElementCount - cloneChildrenCount;

    // calculate how many slider nodes are visible at once
    var slideChildrenVisible = this._getChildrenVisible();
    var slideOverflowCount = this._getBaseConfig().overflowAllowed ? slideChildrenVisible - 1 : 0;

    // calculate how many clones are needed
    var slideClonesCount = 0;
    if(this._getBaseConfig().cloneMode) {

      slideClonesCount = this.__baseConfig.maxSteps + Math.floor((slideChildrenVisible - 1) / 2);
      if(slideClonesCount > slideChildrenVisible) {
        slideClonesCount = slideChildrenVisible;
      }
      if(slideClonesCount > slideChildrenCount) {
        slideClonesCount = slideChildrenCount;
      }
    }

    // calculate the movement for one single sliding attempt
    this.__baseConfig.singleStep = this.__baseConfig.singleStep / slideChildrenVisible;

    // general global check if animation is allowed
    if(slideChildrenCount <= slideChildrenVisible) {
      this.__CSS3Slider._forbidAnimation();
    }else {
      this.__CSS3Slider._allowAnimation();
    }

    var slidePosition = (this.getRuntimeConfig() !== null) ? this.getRuntimeConfig().slidePosition : 0;

    return this._setRuntimeConfig({
      slidePosition: slidePosition,                // the current first visible element in the row
      slideValue: 0,                               // the offset of the row in percent
      slideChildrenCount: slideChildrenCount,      // how many non clone elements are in the slider
      slideChildrenVisible: slideChildrenVisible,  // how many elements are visible at once in the slider
      slideOverflowCount: slideOverflowCount,      // how many overflow steps are possible
      slideClonesCount: slideClonesCount           // how many clones are needed
    });
  };

  this._getChildrenVisible = function() {
    var slideTargetNode = this.__CSS3Slider.getSlideTargetNode();

    // the width of the container that holds the row
    var canvasWidth = slideTargetNode.parentNode.getBoundingClientRect().width;

    var slideChildrenVisible = 1;

    // calculate how many slider nodes are visible at once
    if(!this._getBaseConfig().forceSingleElement) {

      var calcMethod = this.__baseConfig.calcMethod;
      var singleElementWidthInPx = this._getSingleElementWidthInPx();

      if(calcMethod == 'ceil') {
        slideChildrenVisible = Math.ceil(canvasWidth / singleElementWidthInPx);

      }else if(calcMethod == 'round') {
        slideChildrenVisible = Math.round(canvasWidth / singleElementWidthInPx);

      }else {
        slideChildrenVisible = Math.floor(canvasWidth / singleElementWidthInPx);
      }
    }

    if(slideChildrenVisible < 1) slideChildrenVisible = 1;

    return slideChildrenVisible;
  };


  /**
   * calculate the original widht of a single slider element in pixel
   *
   * @returns {Number|CSS3Slider_Config._getSingleElementWidthInPx.width}
   */
  this._getSingleElementWidthInPx = function() {
    var baseObject = this.__CSS3Slider.getSlideTargetNode().children[0];
    var computedStyle = window.getComputedStyle(baseObject);

    var width = parseFloat(computedStyle.getPropertyValue('width'));

    var totalWidth = width + this._getSingleElementMarginInPx();

    return totalWidth;
  };

  /**
   * calculate the percentage width of a single slider element
   *
   * @returns {Number|CSS3Slider_Config.getRuntimeConfig.slideChildrenCount}
   */
  this._getSingleElementWidthInPercent = function() {
    return 100 / this.getRuntimeConfig().slideChildrenCount;
  };

  this._getSingleElementMarginInPx = function() {
    var baseObject = this.__CSS3Slider.getSlideTargetNode().children[0];
    var computedStyle = window.getComputedStyle(baseObject);

    var marginLeft = parseInt(computedStyle.getPropertyValue('margin-left')) || 0;
    var marginRight = parseInt(computedStyle.getPropertyValue('margin-right')) || 0;

    return marginLeft + marginRight;
  };


  this.__construct(CSS3Slider, baseConfig);
}

module.exports = CSS3Slider_Config;
