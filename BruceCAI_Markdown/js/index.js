(() => {
    function $(selector) {
        return document.querySelector(selector);
    }

    function Mymarkdown(textarea, div, em, strong, blockquote, h1, a, ul, img, pre) {
        this.textarea = textarea;
        this.div = div;
        this.em = em;
        this.strong = strong;
        this.blockquote = blockquote;
        this.h1 = h1;
        this.a = a;
        this.ul = ul;
        this.img = img;
        this.pre = pre;
    }

    Mymarkdown.prototype = {
        init: function () {
            this.textarea.oninput = () => {
                this.div.innerHTML = this.parse(this.textarea.value);
            }
            this.em.onclick = () => {
                this.insertText(this.textarea, '*斜体*', 'em')
                this.textarea.oninput();
            }
            this.strong.onclick = () => {
                this.insertText(this.textarea, '**粗体**', 'strong')
                this.textarea.oninput();
            }
            this.blockquote.onclick = () => {
                this.insertText(this.textarea, '> 段落', 'blockquote')
                this.textarea.oninput();
            }
            this.h1.onclick = () => {
                this.insertText(this.textarea, '# 标题1', 'h1')
                this.textarea.oninput();
            }
            this.a.onclick = () => {
                this.insertText(this.textarea, '[链接描述](链接地址)', 'a')
                this.textarea.oninput();
            }
            this.ul.onclick = () => {
                this.insertText(this.textarea, '- 无序列表', 'ul')
                this.textarea.oninput();
            }
            this.img.onclick = () => {
                this.insertText(this.textarea, '![图片描述](图片地址)', 'img')
                this.textarea.oninput();
            }
            this.pre.onclick = () => {
                this.insertText(this.textarea, '\n```\n此处输入代码\n```\n', 'pre')
                this.textarea.oninput();
            }
        },


        parse: function (content) {
            let rows = content.split('\n');
            let result = '';
            let matchContent;
            for (let i = 0; i < rows.length; i++) {
                // console.log(rows[i].match(/^\*{3,}$/))
                //处理格式包括标题、分割线、引用、无序列表、有序列表、多行代码块
                matchContent = rows[i].match(/^#\s/) ||
                    rows[i].match(/^##\s/) ||
                    rows[i].match(/^###\s/) ||
                    rows[i].match(/^####\s/) ||
                    rows[i].match(/^#####\s/) ||
                    rows[i].match(/^######\s/) ||
                    rows[i].match(/^\*{3,}$/) ||
                    rows[i].match(/^>\s/) ||
                    rows[i].match(/^-\s/) ||
                    rows[i].match(/^\d\.\s/) ||
                    rows[i].match(/^```$/)

                if (matchContent) {
                    switch (matchContent[0]) {
                        case '# ':
                            result += `<h1>${this.parseHelper(rows[i].substring(2))}</h1>`;
                            break;
                        case '## ':
                            result += `<h2>${this.parseHelper(rows[i].substring(3))}</h2>`;
                            break;
                        case '### ':
                            result += `<h3>${this.parseHelper(rows[i].substring(4))}</h3>`;
                            break;
                        case '#### ':
                            result += `<h4>${this.parseHelper(rows[i].substring(5))}</h4>`;
                            break;
                        case '##### ':
                            result += `<h5>${this.parseHelper(rows[i].substring(6))}</h5>`;
                            break;
                        case '###### ':
                            result += `<h6>${this.parseHelper(rows[i].substring(7))}</h6>`;
                            break;
                            //先不为空，再[0]
                        case rows[i].match(/^\*{3,}$/) && rows[i].match(/^\*{3,}$/)[0]:
                            // console.log(rows[i]);
                            result += `<hr/>`;
                            break;
                        case '> ':
                            result += `<blockquote>${rows[i].substring(2)}</blockquote>`;
                            break;
                        case '- ':
                            let temp = '';
                            while (i < rows.length && rows[i].match(/^-\s/)) {
                                temp += `<li>${this.parseHelper(rows[i].substring(2))}</li>`;
                                i++;
                            }
                            result += `<ul>${temp}</ul>`;
                            //避免列表结束之后一行无法解析
                            i--;
                            break;
                        case rows[i].match(/^\d\.\s/) && rows[i].match(/^\d\.\s/)[0]:
                            let t = '';
                            while (i < rows.length && rows[i].match(/^\d\.\s/)) {
                                t += `<li>${this.parseHelper(rows[i].substring(2))}</li>`;
                                i++;
                            }
                            result += `<ol>${t}</ol>`;
                            i--;
                            break;
                        case '```':
                            let preContent = '';
                            let e = /^```$/;
                            i++;
                            while (i < rows.length && !e.test(rows[i])) {
                                preContent += rows[i] + '\n';
                                i++;
                            }
                            result += `<pre>${preContent}</pre>`;
                            break;
                    }
                } else {
                    //若不是特殊格式，直接解析为p标签
                    result += `<p>${this.parseHelper(rows[i])}</p>`;
                }

            }
            return result;
        },

        //处理可以粗体、倾斜、图片、链接、代码等可以嵌套在其他格式的格式
        parseHelper: function (inputText) {
            const htmlText = inputText
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*)\*/gim, '<em>$1</em>')
                .replace(/!\[(.*)\]\((.*)\)/gim, '<img alt="$1" src="$2"/>')
                .replace(/\[(.*)\]\((.*)\)/gim, '<a href="$2">$1</a>')
                .replace(/```(.*)```/gim, '<code>$1</code>')
            return htmlText.trim();
        },

        //在光标位置插入文本
        insertText: function (obj, str, type) {
            let temp = obj.value;
            let start = obj.selectionStart, end = obj.selectionEnd;
            obj.value = temp.substring(0, start) + str + temp.substring(end);
            // console.log(obj.selectionStart, obj.selectionEnd);

            if(type === 'strong'){
                obj.selectionStart = start + 2;
                obj.selectionEnd = end + str.length - 2;
            }
            else if(type === 'em'){
                obj.selectionStart = start + 1;
                obj.selectionEnd = end + str.length - 1;
            } 
            else if(type === 'blockquote'){
                obj.selectionStart = start + 2;
                obj.selectionEnd = end + str.length;
            } 
            else if(type === 'h1'){
                obj.selectionStart = start + 2;
                obj.selectionEnd = end + str.length;
            } 
            else if(type === 'a'){
                obj.selectionStart = start + 1;
                obj.selectionEnd = end + 5;
            } 
            else if(type === 'img'){
                obj.selectionStart = start + 2;
                obj.selectionEnd = end + 6;
            } 
            else if(type === 'ul'){
                obj.selectionStart = start + 2;
                obj.selectionEnd = end + str.length;
            } 
            else if(type === 'pre'){
                obj.selectionStart = start + 5;
                obj.selectionEnd = end + 11;
            } 
            else if(type === 'ul'){
                obj.selectionStart = start + 2;
                obj.selectionEnd = end + str.length;
            } 

            obj.focus();
        }

    }

    let obj = new Mymarkdown($('#md'), $('#html'), $('#em'), $('#strong'), 
    $('#blockquote'), $('#h1'), $('#a'), $('#ul'), $('#img'), $('#pre'));
    obj.init();

})()