if (!(chrome && chrome.contextMenus) && (browser && browser.contextMenus)) {
    // Replacing chrome.contextMenus with browser.contextMenus for Firefox / other browsers that may need it
    chrome.contextMenus = browser.contextMenus;
}

if (!(chrome && chrome.tabs) && (browser && browser.tabs)) {
    // Replacing chrome.tabs with browser.tabs for Firefox / other browsers that may need it
    chrome.contextMenus = browser.contextMenus;
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function createBox(htmlData) {
    chrome.tabs.getCurrent(tab => {
        chrome.tabs.executeScript(tab, {
            code: ` 
            function appendStyle(cssString) {
                let head = document.head || document.getElementsByTagName('head')[0];
                let style = document.createElement('style');
            
                style.type = 'text/css';
                style.appendChild(document.createTextNode(cssString));
                head.appendChild(style);
            }

            
            if(document.getElementById('AskCortanaBox')) {
                document.getElementById('AskCortanaBox').remove();
            }
            
            var box = document.createElement('iframe');
            box.id = 'AskCortanaBox';
            document.body.appendChild(box);

            var iframe = document.getElementById('AskCortanaBox');
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(\`${htmlData}\`);

            setTimeout(()=>{
                iframe.contentWindow.document.querySelectorAll('a').forEach(element=>{
                    element.target = "_blank";
                });
                iframe.contentWindow.document.close();
            }, 2000);

            
            appendStyle(\`
                #AskCortanaBox {
                    overflow: scroll;
                    position: fixed;
                    top: 0;
                    right: 0;
                    height: 100%;
                    width: 350px;
                    border: 1px solid black;
                    z-index: 9999;
                    background-color: white;
                }
            \`);

            document.querySelectorAll('*:not(#AskCortanaBox)').forEach(element=>{
                element.addEventListener('click', ()=>{
                    document.getElementById('AskCortanaBox').remove();
                });
            });

    `
        });
    });
}

function askCortana(e) {
    let lat, long;
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        console.log(lat, long);
    });

    var data = `query=${e.selectionText}&title=Bing&context=oded%2B%253D%253D%2Bnull%2529%253B%2B%7D%2B%7D%2B%7D&offset=2522&url=https%253A%252F%252Fwww.bing.com%252Fsearch`;

    fetch('https://www.bing.com/widget/insights/lookup', {
        'method': 'post',
        'credentials': 'omit',
        'headers': new Headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Host',
            'Host': 'www.bing.com',
            "Cache-Control": "max-age=0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1",
            "X-Search-Location": `lat:${lat};long:${long};`, "Content-Length": "126",
            "X-Search-RPSToken": "t=EwDYAgALBAAUWkziSC7RbDJKS1VkhugDegv7L0eAANXiv7ZLPcYh8axlZO0Dd8jUfWp7glYp0HKCnQeRv2shDfgIZcyHzBWzxcyCBvyoyI26EpC2d9uiKw7DxV5pHuEszq+r4jb0nE04NO3EjAAVVtKiypey/O2UNEAssYKgldVG71GQ8t5fRB5v94Ax29JyAd76oTrfMLPUv1KPsZoDA2YAAAgLlYa8pGIP6SgCwurGIGQAH0fbUzb4HzYCYyIw9xLuSKw9qruRp8Szw4LCaU5eVoAY9Zoqtsz8TeDvfNUVcn4pZTGL7G9BlTnelOk/ISyJv40LSZrbpWmA6E4xT3lmOb68u6wCoc2tVgsxvTAHJ7HdS3cDF7NTAq2J2B++GcnWJ2sEtt5WlOjInSKUfHIcHvJcN/u+EoiKQwRmAwN1U+tjtN56s1gm194cSumzRSASUd+704q2MNSagFUtbJREISuFkSvO2BesUSefNtQS9H4Daz37Xr0OxVOHdTr+QevgKnqDbNDYgDNedf9zbMpOFXqH5yM4X2K0W7zXb1OERK58r8UxvyAV+QD7hmSac1QXbJnjmVY15wXi+wcF0TeeS/5x39wbckfnsxEb7uDHkYkpXKzf3rTb+JqJ0sCKgH46y9NJKebu2UEz07zeoMjFjsrYppVl+GVr7SowJXGj0UC+AnOEqMZ3A/qqtmFlH+1jwa7kyL0sfEDfLuY76BCRure2KVpEn2naOPtqTlXgv+EYHX/HeKkUY7DAtP55hlu/XbvBFEHPiBWoHAK/ryFa2fWG2Om4as2PcqIOh/3vz3AIIVX2kNXC7Irry6W0qOQvVPec0oX/HwBLsKCdjnyKLlmHB9adFErCsJLuJ2FjODMmGgCIqLYQr8t2O+InyDXzWTQH5FZw9nkcnZOxtbpG6CP3pkg+emiYeVVyx5AeY559RnaTGqPxU6PbJzRCQ3vCmvH7UgI=&p=",
            "Accept-Language": "en-US,en;q=0.9",
        }),
        body: data
    }).then(x => x.text())
        .then(function(data) {
            console.log(data.replaceAll('href="/', 'href="https://bing.com/'));
            createBox(data.replaceAll('href="/', 'href="https://bing.com/').replaceAll('src="/', 'src="https://bing.com/').replaceAll('\n', ''));
        });

}

chrome.contextMenus.create({
    title: "Ask Cortana",
    contexts: ["selection"],  // ContextType
    onclick: askCortana // A callback function
});