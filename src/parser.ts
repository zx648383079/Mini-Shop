enum BLOCK_TYPE {
    NONE,
    TAG,
    ATTR,
    ATTR_VALUE,
    END_TAG
}

interface IElement {
    node: string,
    tag?: string,
    text?: string,
    children?: IElement[],
    attrs?: {[key: string]: string| boolean}
}

export function htmlToJson(content: string): IElement[] {
    let pos = -1, 
    isNodeBegin = function() {
        let po = pos, code: string, status = BLOCK_TYPE.TAG, attrTag: string = '';
        while (po < content.length) {
            code = content.charAt(++ po);
            if (['\'', '"'].indexOf(code) >= 0) {
                if (status !== BLOCK_TYPE.ATTR_VALUE) {
                    attrTag = code;
                    status = BLOCK_TYPE.ATTR_VALUE;
                    continue;
                }
                if (attrTag === code) {
                    status = BLOCK_TYPE.TAG;
                    continue;
                }
            }
            if (code === '>') {
                return true;
            }
            if (status !== BLOCK_TYPE.ATTR_VALUE && code === '<') {
                return false;
            }
        }
        return false;
    },
    isNodeEnd = function() {
        let po = pos, code: string;
        code = content.charAt(++po);
        if (code !== '/') {
            return false;
        }
        while (po < content.length) {
            code = content.charAt(++ po);
            if (code === '>') {
                pos = po;
                return true;
            }
            if (['<', '"', '\'', '(', ')', '{', '}', '='].indexOf(code) >= 0) {
                return false;
            }
        }
        return false;
    },
    isComment = function() {
        if (content.substr(pos, 3) !== '!--') {
            return false;
        }
        return content.indexOf('-->', pos + 3) > 0;
    },
    getCommentElement = function(): IElement {
        let start = pos + 3;
        let end = content.indexOf('-->', start);
        let text = content.substr(start, end - start);
        pos += end + 3;
        return {node: 'comment', text};
    },
    getTextElement = function(): IElement | boolean {
        let text = '', code: string;
        while (pos < content.length) {
            code = content.charAt(++ pos);
            if (code  === '<' && isNodeBegin()) {
                pos --;
                break;
            }
            text += code;
        }
        if (text.length < 1) {
            return false;
        }
        return {node: 'text', text};
    },
    backslashedCount = function() {
        let po = pos, code: string, count = 0;
        while (po < content.length) {
            code = content.charAt(-- po);
            if (code === '\\') {
                count ++;
                continue;
            }
            return count;
        }
        return count;
    },
    getElement = function(): IElement {
        let tag = '', 
            attrs: {[key: string]: string| boolean} = {}, 
            code: string, 
            status: BLOCK_TYPE = BLOCK_TYPE.TAG, 
            name: string = '', 
            value: string = '', 
            endAttr: string| undefined; // 属性的结束标记
        while (pos < content.length) {
            code = content.charAt(++ pos);
            if (code === '>' && (status === BLOCK_TYPE.TAG || status === BLOCK_TYPE.ATTR)) {
                const children = parserElements();
                if (children.length < 1) {
                    return {
                        node: 'element',
                        tag,
                        attrs,
                    }
                }
                return {
                    node: 'element',
                    tag,
                    attrs,
                    children
                }
            }
            if (code === '/') {
                if (status == BLOCK_TYPE.ATTR || status == BLOCK_TYPE.TAG) {
                    if (content.charAt(pos + 1) == '>') {
                        pos ++;
                        break;
                    }
                    continue;
                }
                if (!endAttr && status == BLOCK_TYPE.ATTR_VALUE) {
                    if (content.charAt(pos ++) == '>') {
                        status = BLOCK_TYPE.NONE;
                        attrs[name] = value;
                        name = '';
                        value = '';
                        pos ++;
                        break;
                    }
                }
            }
            if (code == ' ') {
                if (status === BLOCK_TYPE.TAG) {
                    status = BLOCK_TYPE.ATTR;
                    name = '';
                    value = '';
                    continue;
                }
                if (status == BLOCK_TYPE.ATTR) {
                    status = BLOCK_TYPE.ATTR;
                    attrs[name] = true;
                    name = '';
                    continue;
                }
                if (!endAttr && status === BLOCK_TYPE.ATTR_VALUE) {
                    status = BLOCK_TYPE.ATTR;
                    attrs[name] = value;
                    name = '';
                    value = '';
                    continue;
                }
            }
            if (status === BLOCK_TYPE.TAG) {
                tag += code;
            }
            if (code === '=' && status == BLOCK_TYPE.ATTR) {
                code = content.charAt(pos + 1);
                status = BLOCK_TYPE.ATTR_VALUE;
                if (code == '\'' || code == '"') {
                    endAttr = code;
                    pos ++;
                    continue;
                }
                endAttr = undefined;
                continue;
            }
            if (endAttr && code === endAttr && status == BLOCK_TYPE.ATTR_VALUE) {
                //向前获取反斜杠的数量
                if (backslashedCount() % 2 === 0) {
                    status = BLOCK_TYPE.TAG;
                    attrs[name] = value;
                    name = '';
                    value = '';
                    continue;
                }
                value += code;
                continue;
            }
            if (status == BLOCK_TYPE.ATTR) {
                name += code;
                continue;
            }
            if (status == BLOCK_TYPE.ATTR_VALUE) {
                value += code;
            }
        }
        return {
            node: 'element',
            tag,
            attrs,
        };
    },
    parserElement = function(): IElement | boolean {
        let code: string;
        while (pos < content.length) {
            code = content.charAt(++pos);
            if (code === ' ' || code === "\r" || code === "\n" || code === "\t") {
                continue;
            }
            if (code !== '<') {
                pos --;
                return getTextElement();
            }
            if (isNodeEnd()) {
                return true;
            }
            if (isComment()) {
                return getCommentElement();
            }
            if (!isNodeBegin()) {
                pos --;
                return getTextElement();
            }
            return getElement();
        }
        return false;
    },
    parserElements = function () {
        let items: IElement[] = [];
        while (pos < content.length) {
            let item = parserElement();
            if (item === true) {
                break;
            }
            if (item) {
                items.push(item);
            }
        }
        return items;
    };
    return parserElements();
}

export function jsonToWxml(json: IElement | IElement[]): string {
    if (json instanceof Array) {
        return json.map(item => {
            return jsonToWxml(item);
        }).join('');
    }
    if (json.node == 'text') {
        if (/^\s+$/.test(json.text + '')) {
            return '';
        }
        return `<text>${json.text}</text>`;
    }
    let child = json.children ? jsonToWxml(json.children) : '';
    const default_allow_attrs = ['id', 'class', 'style', 'src'],
            input_allow_attrs = ['value', 'type', 'password', 'placeholder', 'disabled', 'maxlength', 'focus', 'cursor', 'class', 'id'];

    if (json.node === 'root') {
        return child;
    }

    if (json.node === 'comment') {
        return '<!--' + json.text + '-->';
    }

    if (json.node != 'element') {
        return child;
    }

    if(json.tag == 'img') {
        const attr = parseNodeAttr(json.attrs);
        return `<image${attr}></image>`
    }
    if (json.tag == 'input') {
        return parseInput(json);
    }
    if (json.tag == 'button') {
        return parseButton(json);
    }
    if (json.tag == 'form') {
        const attr = parseNodeAttr(json.attrs);
        return `<form${attr}>${child}</form>`;
    }
    if (json.children && json.children.length == 1 && json.children[0].node == 'text') {
        child = json.children[0].text + '';
    }
    if (json.tag == 'label') {
        const attr = parseNodeAttr(json.attrs, ['for']);
        return `<label${attr}>${child}</label>`;
    }
    if (json.tag == 'style') {
        const attr = parseNodeAttr(json.attrs, ['type', 'lang', 'scoped']);
        return `<style${attr}>${child}</style>`;
    }
    if (json.tag == 'script') {
        const attr = parseNodeAttr(json.attrs, ['type', 'lang', 'src']);
        return `<script${attr}>${child}</script>`;
    }
    if (json.tag == 'textarea') {
        json.attrs = Object.assign({}, json.attrs, {
            vlaue: child
        });
        const attr = parseNodeAttr(json.attrs, input_allow_attrs);
        return `<textarea${attr}/>`;
    }
    if (json.tag == 'a') {
        let attr = parseNodeAttr(json.attrs, ['id', 'class']);
        if (json.attrs && json.attrs.href) {
            attr += ' url='+ q(json.attrs.href);
        }
        return `<navigator${attr}>${child}</navigator>`;
    }
    const attr = parseNodeAttr(json.attrs);
    if (['i', 'span', 'strong', 'block', 'font'].indexOf(json.tag + '') >= 0 
    && (!json.children || (json.children.length == 1 && json.children[0].node == 'text'))) {
        return `<text${attr}>${child}</text>`;
    }
    return `<view${attr}>${child}</view>`;

    function q(v: any) {
        return '"' + v + '"';
    }

    function parseNodeAttr(attrs?: any, allows: string[] = default_allow_attrs): string {
        let str = '';
        if (!attrs) {
            return str;
        }
        for (let key in attrs) {
            if (!attrs.hasOwnProperty(key)) {
                continue;
            }
            if (allows.indexOf(key) >= 0) {
                let value = attrs[key];
                if (value === true) {
                    str += ' ' + key;
                    continue; 
                }
                if (Array.isArray(value)) {
                    value = value.join(' ');
                };
                str += ' ' + key + '=' + q(value);
            }
        }
        return str;
    }

    function parseButton(node: IElement): string {
        let attr = parseNodeAttr(node.attrs);
        if (node.attrs && ['reset', 'submit'].indexOf(node.attrs.type + '') >= 0) {
            attr += ' form-type='+ q(node.attrs.type);
        }
        return `<button type="default"${attr}>${node.text}</button>`;
    }

    function parseInput(node: IElement) {
        if (!node.attrs) {
            node.attrs = {
                type:'text'
            };
        }
        if (node.attrs.type == 'password') {
            node.attrs.type = 'text';
            node.attrs.password = 'true';
        }
        if (['button', 'reset', 'submit'].indexOf(node.attrs.type + '') >= 0) {
            node.text = node.attrs.value + '';
            node.tag = 'button';
            return parseButton(node);
        }
        if (node.attrs.type == 'checkbox') {
            const attr = parseNodeAttr(node.attrs, ['value', 'checked', 'class', 'id']);
            return `<checkbox${attr}/>`
        }
        if (node.attrs.type == 'radio') {
            const attr = parseNodeAttr(node.attrs, ['value', 'checked', 'class', 'id']);
            return `<radio${attr}/>`
        }
        if (['text', 'number', 'idcard', 'digit'].indexOf(node.attrs.type + '') < 0) {
            node.attrs.type = 'text';
        }
        const attr = parseNodeAttr(node.attrs, input_allow_attrs);
        return `<input${attr}/>`;
    }
}

export function htmlToWxml(content: string): string {
    if (content.indexOf('<view') >= 0) {
        return content;
    }
    let elements = htmlToJson(content);
    return jsonToWxml(elements);
}