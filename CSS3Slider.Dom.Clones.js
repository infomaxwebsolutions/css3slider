/**
 * handles clone nodes for endless slide effect
 *
 * @param {CSS3Slider} CSS3Slider
 * @returns {CSS3Slider_Dom_Clone}
 */
function CSS3Slider_Dom_Clone(CSS3Slider) {

  this.__CSS3Slider = null;

  /**
   * init tasks
   *
   * @param {CSS3Slider} CSS3Slider
   * @returns {void}
   */
  this.__construct = function(CSS3Slider) {
    this.__CSS3Slider = CSS3Slider;

    var cloneMode = this.__CSS3Slider._Config._getBaseConfig().cloneMode;

    // set slider positioning to relative - to be able to absolute position clones
    if(cloneMode) {
      this.__CSS3Slider.getSlideTargetNode().style.position = 'relative';
    }
  };


  /**
   * will add clone nodes before the first slider node and after the last slider node
   *
   * @returns {void}
   */
  this._addClones = function() {
    var runtimeConfig = this.__CSS3Slider._Config.getRuntimeConfig();
    var singleElementWidth = this.__CSS3Slider._Config._getSingleElementWidthInPercent();
    var singleElementMargin = this.__CSS3Slider._Config._getSingleElementMarginInPx();
    var slideTargetNode = this.__CSS3Slider.getSlideTargetNode();

    // store all child nodes in an array cause nodeCollections are updated
    var originalChildNodeArray = [];
    for(var childNodeIndex = 0; childNodeIndex < runtimeConfig.slideChildrenCount; childNodeIndex++) {
      originalChildNodeArray.push(slideTargetNode.children[childNodeIndex]);
    }

    // add so much clones as the config states are needed
    for(var i = 0; i < runtimeConfig.slideClonesCount; i++) {
      this.__addSingleClone(slideTargetNode, originalChildNodeArray, i, 'prepander', singleElementWidth, singleElementMargin);
      this.__addSingleClone(slideTargetNode, originalChildNodeArray, i, 'apander', singleElementWidth, singleElementMargin);
    }
  };

  /**
   * adds a single clone to the slider
   *
   * @param {object} slideTargetNode
   * @param {Array} originalChildNodeArray
   * @param {Number} index
   * @param {String} type
   * @param {Number} singleElementWidth
   * @returns {void}
   */
  this.__addSingleClone = function(slideTargetNode, originalChildNodeArray, index, type, singleElementWidth, singleElementMargin) {

    var nodeForCloningIndex = null;

    // get the index of the child node that we want to clone
    if(type === 'prepander') {
      nodeForCloningIndex = originalChildNodeArray.length - 1 - index;
    }else if(type === 'apander') {
      nodeForCloningIndex = index;
    }
    // get the actual child node we want to clone
    var nodeForCloning = originalChildNodeArray[nodeForCloningIndex];

    // create the clone
    var cloneNode = nodeForCloning.cloneNode(true);
    cloneNode.classList.add('-css3Slider-' + type);
    cloneNode.style.position = 'absolute';
    cloneNode.style.top = '0%';
    cloneNode.style.right = '100%';

    if(singleElementMargin) {
      cloneNode.style.width = 'calc(' + singleElementWidth + '% - ' + singleElementMargin + 'px)';
    }else {
      cloneNode.style.width = singleElementWidth + '%';
    }

    if(type === 'prepander') {
      // prepander will be positioned in front
      cloneNode.style.right = 100 + singleElementWidth * index + '%';
      slideTargetNode.insertBefore(cloneNode, slideTargetNode.children[0]);

    }else if(type === 'apander') {
      // apander will be positioned at the end
      cloneNode.style.left = 100 + singleElementWidth * index + '%';
      slideTargetNode.appendChild(cloneNode);

    }
  };


  /**
   * will return all clone nodes from slider
   *
   * @returns {void}
   */
  this._removeClones = function() {
    var slideTargetNode = this.__CSS3Slider.getSlideTargetNode();

    // get all prepander
    var prepanderCollection = slideTargetNode.getElementsByClassName('-css3Slider-prepander');
    var prepanderLength = prepanderCollection.length;

    // get all apander
    var apenderCollection = slideTargetNode.getElementsByClassName('-css3Slider-apander');
    var apenderLength = apenderCollection.length;

    // remove all prepander
    for(var prepanderIndex = 0; prepanderIndex < prepanderLength; prepanderIndex++) {
      slideTargetNode.removeChild(prepanderCollection[0]); // allways use index 0 due to updating nodeCollections
    }

    // remove all apander
    for(var apenderIndex = 0; apenderIndex < apenderLength; apenderIndex++) {
      slideTargetNode.removeChild(apenderCollection[0]); // allways use index 0 due to updating nodeCollections
    }
  };


  this.__construct(CSS3Slider);
}

module.exports = CSS3Slider_Dom_Clone;
