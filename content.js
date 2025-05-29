// Get current page URL
const currentUrl = new URL(window.location.href);

// Extract id and cid
const idPattern = /id=(\d+)/;
const cidPattern = /cid=(\d+)/;
const currentIdMatch = idPattern.exec(currentUrl.search);
const currentCidMatch = cidPattern.exec(currentUrl.search);
let currentId = currentIdMatch ? parseInt(currentIdMatch[1], 10) : null;
let currentCid = currentCidMatch ? parseInt(currentCidMatch[1], 10) : null;
const yahboomUrlPattern = "www.yahboom.com";

if (currentUrl.hostname.includes(yahboomUrlPattern)) {
  // Create button function
  const createButton = (direction) => {
    const button = document.createElement("button");
    button.innerText = direction === "prev" ? "上一个教程" : "下一个教程";
    button.className = "tutorial-button";
    button.onclick = () => {
      if (direction === "prev") {
        currentId--;
      } else {
        currentId++;
      }
      // Use the current cid value from the URL if available, otherwise don't include cid parameter
      const newUrl = currentCid
        ? `https://www.yahboom.com/build.html?id=${currentId}&cid=${currentCid}`
        : `https://www.yahboom.com/build.html?id=${currentId}`;
      window.location.href = newUrl;
    };
    return button;
  };

  // Add floating buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.style.position = "fixed";
  buttonContainer.style.right = "20px";
  buttonContainer.style.bottom = "20px";
  buttonContainer.style.zIndex = 1000;

  const prevButton = createButton("prev");
  const nextButton = createButton("next");

  buttonContainer.appendChild(prevButton);
  buttonContainer.appendChild(nextButton);
  document.body.appendChild(buttonContainer);
}

// Hide specified elements
const hideElements = () => {
  const elementsToHide = ['weixin', 'downPdf', 'readthedocs-ea'];
  elementsToHide.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
      // console.log('Yahboom: 隐藏元素 ' + id + ' 成功');
    }
  });
};

const addCopyButton = () => {
  // 处理主文档中的代码块
  const codeBlocks = document.querySelectorAll('pre.md-fences');

  // 为每个代码块添加复制按钮
  codeBlocks.forEach(block => {
    if (block.nextSibling && block.nextSibling.classList?.contains('code-copy-button')) {
      return; // 如果按钮已经存在，跳过
    }
    if (block.querySelector('.code-copy-button')) {
      return; // 如果找到按钮,则返回
    }

    const button = document.createElement('button');
    button.innerText = 'Copy';
    button.className = 'code-copy-button';
    button.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #f8f9fa;
            cursor: pointer;
            z-index: 100;
        `;

    button.onclick = () => {
      const codeText = block.innerText.replace(/\u200B/g, '');
      navigator.clipboard.writeText(codeText).then(() => {
        button.innerText = '已复制！';
        setTimeout(() => {
          button.innerText = '复制代码';
        }, 2000);
      }).catch(err => {
        console.error('复制失败:', err);
      });
    };

    block.style.position = 'relative';
    block.appendChild(button);
  });

  // 处理 iframe 中的代码块
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const iframeCodeBlocks = iframeDocument.querySelectorAll('pre.md-fences');

      iframeCodeBlocks.forEach(block => {
        if (block.nextSibling && block.nextSibling.classList?.contains('code-copy-button')) {
          return; // 如果按钮已经存在，跳过
        }
        if (block.querySelector('.code-copy-button')) {
          return; // 如果找到按钮,则返回
        }

        const button = document.createElement('button');
        button.innerText = '复制代码';
        button.className = 'code-copy-button';
        button.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    padding: 5px 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: #f8f9fa;
                    cursor: pointer;
                    z-index: 100;
                    line-height: revert;
                `;


        button.onclick = () => {
          // const codeText = block.innerText.replace(/\u200B/g, '');
          navigator.clipboard.writeText(cleanCodeText()).then(() => {
            button.innerText = '已复制!';
            setTimeout(() => {
              button.innerText = '复制代码';
            }, 2000);
          }).catch(err => {
            console.error('复制失败:', err);
          });

          function cleanCodeText() {
            // 从网页上获取代码文本
            let codeText = block.innerText;
            codeText = codeText.replace(/复制代码/g, "").replace(/已复制!/g, "").trim();
            // 清洗代码文本,去除可能存在的非法字符
            return codeText
              .replace(/\u00a0/g, ' ').replace(/\u200b/g, ' ')
              .replace(/[\u0000-\u0008\u000b-\u000c\u000e-\u001f\u007f-\u0084\u0086-\u009f]/g, ''); // 替换控制字符     
          }
        };

        block.style.position = 'relative';
        block.appendChild(button);
      });
    } catch (e) {
      console.log('无法访问iframe内容:', e);
    }
  });
};

// Call function to hide elements
hideElements();
setInterval(hideElements, 2000);
setInterval(addCopyButton, 1000);
