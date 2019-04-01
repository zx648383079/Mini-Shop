enum BLOCK_TYPE {
    NONE,
    TAG,
    ATTR,
    ATTR_VALUE,
    END_TAG
}

interface IElement {
    tag: string,
    content?: string,
    children?: IElement[],
    attrs: {[key: string]: string}
}



function htmlToWxml(content: string): string {
    if (content.indexOf('<view') >= 0) {
        return content;
    }
    let pos = -1;
    function parserElement() {
        while (pos < content.length) {
            
        }
    }
    function parserElements() {
        let items: IElement[] = [];
        while (pos < content.length) {
            
        }
        return items;
    }
}