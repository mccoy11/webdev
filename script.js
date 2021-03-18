const API = 'https://api.shrtco.de/v2/shorten?url=';
const input = document.getElementById('url');
const shortBtn = document.getElementById('shorttenButton');
const error = document.getElementById('error');
const container = document.querySelector('.links-container')

let links = []//[...JSON.parse(localStorage.getItem('links'))];


shortBtn.addEventListener('click', checkURL);


async function getShortURL(url){
    let query = await fetch(`${API}${url}`)
    let data = await query.json()

    updateSavedLinks(data);

    input.value = '';
}

function checkURL(){
    let url = input.value;
    
    if (url == '') {
        input.classList.add('wrong');
        error.style.opacity = `1`;
        setTimeout(() => {
            input.classList.remove('wrong');
            error.style.opacity = `0`;
        }, 2000);
    } else {
        getShortURL(url);
    }
}

function populateLinks(links){

    container.innerHTML = '';

    links.forEach(link => {

        let div = document.createElement('div');
        div.classList.add('link');

        div.innerHTML = `
            <div class="link-info">
                <span>${link.originalLink}</span>
                <span>${link.shortLink}</span>
            </div>
            <button>Copy</button>
            <div class="delete">
                <i class="fa fa-trash"></i>
            </div>
        `;

        container.appendChild(div);

        div.addEventListener('click', (e) => {
            if(e.target.classList.contains('delete')){
                console.log('works');
                deleteLink(e);
            } else if(e.target.tagName == 'BUTTON'){
                let parent = e.target.parentElement;
                let child = parent.children[0];
                let url = child.children[1].innerText;
                
                e.target.innerText = 'Copied!'

                setTimeout(() => {
                    e.target.innerText = 'Copy'
                }, 1500);

                copyURL(url);
            }
        });
    });

}

function updateSavedLinks(data){
    let link = {originalLink: data.result.original_link, shortLink: data.result.full_short_link2};
    links.push(link);
    populateLinks(links);

    localStorage.setItem('links',JSON.stringify(links));
}

function deleteLink(e){
    let parent = e.target.parentElement;
    let child = parent.children[0];
    let url = child.children[0].innerText;

    links = links.filter( link => link.originalLink !== url)

    localStorage.setItem('links',JSON.stringify(links));

    populateLinks(links);
}

async function copyURL(url) {
    try {
        await navigator.clipboard.writeText(url);
        console.log('Page URL copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

populateLinks(links);
