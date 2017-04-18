'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//检测props
var propTypes = {
    thousandSeparator: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
    prefix: _propTypes2.default.string,
    suffix: _propTypes2.default.string,
    displayType: _propTypes2.default.oneOf(['input', 'text'])
};

//设置默认props
var defaultProps = {
    displayType: 'input'
};

var NumberFormat = function (_React$Component) {
    _inherits(NumberFormat, _React$Component);

    function NumberFormat(props) {
        _classCallCheck(this, NumberFormat);

        var _this = _possibleConstructorReturn(this, (NumberFormat.__proto__ || Object.getPrototypeOf(NumberFormat)).call(this, props));

        _this.state = {
            value: _this.formatInput(props.value).formattedValue
        };
        _this.onChange = _this.onChange.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        return _this;
    }

    _createClass(NumberFormat, [{
        key: 'getSeparators',


        //获取分割符
        value: function getSeparators() {
            var thousandSeparator = this.props.thousandSeparator;

            if (thousandSeparator === true) {
                thousandSeparator = ',';
            }
            return { thousandSeparator: thousandSeparator };
        }
    }, {
        key: 'getNumberRegex',


        /*格式化为数字*/
        value: function getNumberRegex(g) {
            return new RegExp('\\d' + '', g ? 'g' : undefined);
        }
    }, {
        key: 'setCaretPosition',
        value: function setCaretPosition(el, caretPos) {
            el.value = el.value;
            if (el !== null) {
                if (el.createTextRange) {
                    var range = el.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                    return true;
                }
                if (el.selectionStart || el.selectionStart === 0) {
                    el.focus();
                    el.setSelectionRange(caretPos, caretPos);
                    return true;
                }
                el.focus();
                return false;
            }
        }
    }, {
        key: 'formatInput',


        //格式化
        value: function formatInput(val) {
            var _props = this.props,
                prefix = _props.prefix,
                suffix = _props.suffix;

            var _getSeparators = this.getSeparators(),
                thousandSeparator = _getSeparators.thousandSeparator;

            //匹配数字，返回/\d/g


            var numRegex = this.getNumberRegex(true);

            //如果值为number,转换为字符串
            if (typeof val === 'number') val = val + '';

            //如果值不存在或不存在数字,返回空
            if (!val || !val.match(numRegex)) return { value: '' };

            //匹配后获取的数组合并为一个字符串
            var num = val.match(numRegex).join('');
            var formattedValue = num;

            //格式化为千分位
            if (thousandSeparator) {
                formattedValue = formattedValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
            }

            //添加前缀和后缀
            if (prefix) formattedValue = prefix + formattedValue;
            if (suffix) formattedValue = formattedValue + suffix;

            return {
                //格式化前的
                value: formattedValue.match(numRegex).join(''),
                //返回格式化后的
                formattedValue: formattedValue
            };
        }
    }, {
        key: 'getCursorPosition',


        //获取当前光标位置
        value: function getCursorPosition(inputValue, formattedValue, cursorPos) {

            //获取数字格式化正则
            var numRegex = this.getNumberRegex();
            var j = 0,
                i = void 0;

            for (i = 0; i < cursorPos; i++) {
                if (!inputValue[i].match(numRegex) && inputValue[i] !== formattedValue[j]) continue;
                while (inputValue[i] !== formattedValue[j] && j < formattedValue.length) {
                    j++;
                }j++;
            };

            return j;
        }
    }, {
        key: 'onChangeHandler',
        value: function onChangeHandler(e, callback) {
            var _this2 = this;

            var el = e.target,
                inputValue = el.value,
                _formatInput = this.formatInput(inputValue),
                formattedValue = _formatInput.formattedValue,
                value = _formatInput.value;
            //获取光标位置
            var cursorPos = el.selectionStart;

            //更新state中value的值
            this.setState({ value: formattedValue }, function () {
                cursorPos = _this2.getCursorPosition(inputValue, formattedValue, cursorPos);

                _this2.setCaretPosition(el, cursorPos);
                setTimeout(function () {
                    return _this2.setCaretPosition(el, cursorPos);
                }, 0);
                if (callback) callback(e, value);
            });

            return value;
        }
    }, {
        key: 'onChange',
        value: function onChange(e) {
            this.onChangeHandler(e, this.props.onChange);
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            var el = e.target;
            var selectionStart = el.selectionStart,
                selectionEnd = el.selectionEnd,
                value = el.value;
            var key = e.key;

            var numRegex = this.getNumberRegex(false);
            if (selectionEnd - selectionStart === 0) {
                //key是否等于删除键 && 用字符串来匹配正则表达式
                if (key === 'Delete' && !numRegex.test(value[selectionStart])) {
                    e.preventDefault();
                    var nextCursorPosition = selectionStart;
                    while (!numRegex.test(value[nextCursorPosition]) && nextCursorPosition < value.length) {
                        nextCursorPosition++;
                    }this.setCaretPosition(el, nextCursorPosition);
                } else if (key === 'Backspace' && !numRegex.test(value[selectionStart - 1])) {
                    e.preventDefault();
                    var prevCursorPosition = selectionStart;
                    while (!numRegex.test(value[prevCursorPosition - 1]) && prevCursorPosition > 0) {
                        prevCursorPosition--;
                    }this.setCaretPosition(el, prevCursorPosition);
                }
            }

            if (this.props.onKeyDown) this.props.onKeyDown(e);
        }
    }, {
        key: 'render',
        value: function render() {
            //拷贝
            var props = Object.assign({}, this.props);

            //删除
            Object.keys(propTypes).forEach(function (key) {
                delete props[key];
            });

            //设置inputProps的属性
            var inputProps = Object.assign({}, props, {
                type: 'text',
                value: this.state.value,
                onChange: this.onChange,
                onKeyDown: this.onKeyDown
            });

            if (this.props.displayType === 'text') {
                return _react2.default.createElement(
                    'span',
                    props,
                    this.state.value
                );
            } else {
                return _react2.default.createElement('input', inputProps);
            }
        }
    }]);

    return NumberFormat;
}(_react2.default.Component);

;

NumberFormat.propTypes = propTypes;
NumberFormat.defaultProps = defaultProps;

module.exports = NumberFormat;