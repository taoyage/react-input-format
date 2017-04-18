/*
 * @Author: accord
 * @FileName: inputFormat.js 						   
 * @Date:   2017-04-17 18:27:24 						   
 * @Last Modified by:   accord 	   
 * @Last Modified time: 2017-04-18 09:12:35        
 */

import React, { PropTypes } from 'react';

//检测props
const propTypes = {
    thousandSeparator: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    prefix: PropTypes.string,
    suffix: PropTypes.string,
};

//设置默认props
const defaultProps = {
    displayType: 'input',
};


class NumberFormat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.formatInput(props.value).formattedValue
        }
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    };

    //获取分割符
    getSeparators() {
        let { thousandSeparator } = this.props;
        if (thousandSeparator === true) {
            thousandSeparator = ','
        }
        return { thousandSeparator }
    };

    /*格式化为数字*/
    getNumberRegex(g) {
        return new RegExp('\\d' + (''), g ? 'g' : undefined);
    };

    setCaretPosition(el, caretPos) {
        el.value = el.value;
        if (el !== null) {
            if (el.createTextRange) {
                const range = el.createTextRange();
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
    };

    //格式化
    formatInput(val) {
        const { prefix, suffix } = this.props;
        const { thousandSeparator } = this.getSeparators();

        //匹配数字，返回/\d/g
        const numRegex = this.getNumberRegex(true);

        //如果值为number,转换为字符串
        if (typeof val === 'number') val = val + '';

        //如果值不存在或不存在数字,返回空
        if (!val || !(val.match(numRegex))) return { value: '' };

        //匹配后获取的数组合并为一个字符串
        const num = val.match(numRegex).join('');
        let formattedValue = num;

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
        }
    };

    //获取当前光标位置
    getCursorPosition(inputValue, formattedValue, cursorPos) {

        //获取数字格式化正则
        const numRegex = this.getNumberRegex();
        let j = 0,
            i;

        for (i = 0; i < cursorPos; i++) {
            if (!inputValue[i].match(numRegex) && inputValue[i] !== formattedValue[j]) continue;
            while (inputValue[i] !== formattedValue[j] && j < formattedValue.length) j++;
            j++;
        };

        return j;
    };
    
    //事件处理
    onChangeHandler(e, callback) {
        const el = e.target,
            inputValue = el.value,
            //获取格式化后的value值和格式化前的value值,分别保存
            { formattedValue, value } = this.formatInput(inputValue);
        //获取光标位置
        let cursorPos = el.selectionStart;

        //更新state中value的值
        this.setState({ value: formattedValue }, () => {
            cursorPos = this.getCursorPosition(inputValue, formattedValue, cursorPos);

            this.setCaretPosition(el, cursorPos);
            setTimeout(() => this.setCaretPosition(el, cursorPos), 0);
            if (callback) callback(e, value);
        });

        return value;
    };

    onChange(e) {
        this.onChangeHandler(e, this.props.onChange);
    };
    
    //事件处理
    onKeyDown(e) {
        const el = e.target;
        const { selectionStart, selectionEnd, value } = el;
        const { key } = e;
        const numRegex = this.getNumberRegex(false);
        if (selectionEnd - selectionStart === 0) {
            //key是否等于删除键 && 用字符串来匹配正则表达式
            if (key === 'Delete' && !numRegex.test(value[selectionStart])) {
                e.preventDefault();
                let nextCursorPosition = selectionStart;
                while (!numRegex.test(value[nextCursorPosition]) && nextCursorPosition < value.length) nextCursorPosition++;
                this.setCaretPosition(el, nextCursorPosition);
            } else if (key === 'Backspace' && !numRegex.test(value[selectionStart - 1])) {
                e.preventDefault();
                let prevCursorPosition = selectionStart;
                while (!numRegex.test(value[prevCursorPosition - 1]) && prevCursorPosition > 0) prevCursorPosition--;
                this.setCaretPosition(el, prevCursorPosition);
            }
        }

        if (this.props.onKeyDown) this.props.onKeyDown(e);
    };

    render() {
        //拷贝
        const props = Object.assign({}, this.props);

        //删除
        Object.keys(propTypes).forEach((key) => {
            delete props[key];
        });

        //设置inputProps的属性
        const inputProps = Object.assign({}, props, {
            type: 'text',
            value: this.state.value,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
        });

        if (this.props.displayType === 'text') {
            return (<span {...props}>{this.state.value}</span>);
        }
        return (
            <input
        {...inputProps}
      />
        )
    };
};

NumberFormat.propTypes = propTypes;
NumberFormat.defaultProps = defaultProps;

module.exports = NumberFormat;
