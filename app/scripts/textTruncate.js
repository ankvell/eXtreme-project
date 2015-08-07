var $ = require('jquery');
(function() {
    var Truncator = {
        init: function(options, elem) {
            var _this = this;
            _this.elem = elem;
            _this.$elem = $(elem);
            _this.originalText = _this.$elem.html();
            //If options are provided by user, we are overwriting defaults
            _this.options = $.extend({}, $.fn.textTruncate.options, options);
            //Two scenarios, depending on whether user specified max characters quantity
            if (_this.options.charAmount) {
                //Make container actually fit the text limited by the max characters quantity
                if (_this.originalText.length > _this.options.charAmount) {
                    var indexOfBoundingElement = _this.getBoundingElementIndex();
                    _this.hideTruncatedText(indexOfBoundingElement);
                    //If user specified url we omit adding click event for ellipsis to show overflowing content
                    //User is only redirected to the specified url
                    if (!options.url) {
                        _this.handleEvent();
                    }
                }
            } else {
                _this.wordsArray = _this.originalText.split(' ');
                //Wrapping each word into span for the purpose of later finding their coordinates
                _this.wrapInSpan(_this.originalText);
                var index = _this.getBoundingElementIndex();
                //As the user can specify ellipsis we have to take into account it's length and leave enough space for it
                var trimLength = _this.wordsArray[index].length + 1;
                while (trimLength < _this.options.ellipsis.length) {
                    index--;
                    //Adding 1 to the current word length as we need to take spaces into consideration. They are not present in wordsArray
                    trimLength += _this.wordsArray[index].length + 1;
                }
                //Now index identifies the last word, that will be diplayed and we are hiding the rest
                _this.hideTruncatedText(index);
                if (!options.url) {
                    _this.handleEvent();
                }
            }
        },
        wrapInSpan: function(originalText) {
            var _this = this;
            var spannedWords = _this.wordsArray.map(function(curElem, index) {
                return '<span id=' + index + '>' + curElem + '</span>';
            });
            var spannedText = spannedWords.join(' ');
            _this.$elem.html(spannedText);
            //Now elements html contains words wrapped in span elements
        },
        getBoundingElementIndex: function() {
            var _this = this;
            if (_this.options.charAmount) {
                //Returning the index of last space that is not overflowing the maximum characters quantity. We don't want to tear words apart
                return _this.originalText.lastIndexOf(' ', _this.options.charAmount);
            } else {
                var indexOfBoundingElement = 0,
                    containerShape,
                    curElemShape,
                    direction;
                //Getting border box information usent getClientRects() method
                containerShape = _this.elem.getClientRects();
                //Here we are actually checking if out text is single line or multiline. And therefore choosing diffenent directions of overflowing
                direction = (_this.$elem.css('white-space') == 'nowrap') ? 'right' : 'bottom';
                for (var i = 0; i < _this.elem.childNodes.length; i++) {
                    if (_this.elem.childNodes[i].nodeType == 3) {
                        continue;
                    } else {
                        //Getting border box information about each span element
                        curElemShape = _this.elem.childNodes[i].getClientRects();
                        //Finding first span element that is overflowing the container
                        if (curElemShape[0][direction] > containerShape[0][direction]) {
                            //Decrementing to actually find last span element inside the container
                            indexOfBoundingElement--;
                            break;
                        }
                        indexOfBoundingElement++;
                    }
                }
                return indexOfBoundingElement;
            }
        },
        hideTruncatedText: function(index) {
            var _this = this,
                visibleText, overflowingText;
            if (_this.options.charAmount) {
                visibleText = _this.originalText.substring(0, index);
                overflowingText = _this.originalText.substring(index);
            } else {
                visibleText = _this.wordsArray.slice(0, index).join(' ');
                overflowingText = _this.wordsArray.slice(index).join(' ');
            }
            //Displaying visible text with ellipsis and hiding overflowing text
            _this.$elem.html(visibleText + '<span class="ellipsis"><a href=' + _this.options.url + ' class="truncated_link"> ' + _this.options.ellipsis + '</a></span>' + '<span class="truncated"> ' + overflowingText + '</span>');
            _this.$elem.find('span[class=truncated]').css('display', 'none');
        },
        handleEvent: function() {
            var _this = this;
            $('.truncated_link', _this.$elem).click(function() {
                _this.$elem.find('span[class=ellipsis]').css('display', 'none');
                _this.$elem.find('span[class=truncated]').css('display', 'inline');
                var expansion = (_this.$elem.css('white-space') == 'nowrap') ? 'width' : 'height';
                _this.$elem.css(expansion, 'auto');
            });
        }
    };
    $.fn.textTruncate = function(options) {
        if (typeof options == 'undefined') {
            options = {};
        }
        return this.each(function() {
            var truncator = Object.create(Truncator);
            truncator.init(options, this);
        });
    };
    //Default options are configurable
    $.fn.textTruncate.options = {
        charAmount: null,
        ellipsis: '...',
        url: '#'
    };
})();