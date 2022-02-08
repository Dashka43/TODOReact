
(function () {

    const PHOTOS_ON_PAGE = 40
    const FAVOURITES='favourites'
    let fav_photos =[]

    function widget(){
        window.addEventListener('load', function () {
            get_random_photos();
        });
        function get_random_photos() {
            fetch('https://jsonplaceholder.typicode.com/photos')
                .then((response) => response.json())
                .then((json) => {
                    let photo_list=[]
                    for (let i = 0; i<PHOTOS_ON_PAGE;i++){
                        let random = json[Math.floor(Math.random() * json.length)];
                        photo_list.push({
                            id: random.id,
                            src: random.thumbnailUrl,
                            title: random.title,
                        })
                    }
                   render(photo_list,'add')
                });

        }
        function render(photo_list,button_id){
            let photos = document.getElementById('photos')
            photos.innerHTML = ''
            photo_list.forEach(photo=>
            {   let div = document.createElement('div')
                div.className = 'container'
                let img = document.createElement('img')
                img.src = photo.src
                img.title = photo.title
                img.alt = photo.title
                img.id = photo.id
                div.appendChild(img)
                let btn = document.createElement('button')
                btn.className = "btn"
                btn.id = button_id
                button_id == 'add'? btn.innerHTML = 'Favourite':btn.innerHTML = 'Delete'
                div.appendChild(btn)
                photos.appendChild(div);

            })

        }
        document.getElementById('update').addEventListener("click", function (e) {
            get_random_photos()
        })
        document.getElementById('photos').addEventListener("click", function (e) {
            let target = e.target;
            if (target.id == 'add') {
                let img = target.closest("div").firstChild
                if (!fav_photos.find(x=>x.id ==img.id)){
                    deserialize()
                    fav_photos.push({
                        id: img.id,
                        src: img.src,
                        title: img.alt,
                    })
                    serialize()
                }
            }
            if (target.id == 'delete') {
                let img = target.closest("div").firstChild
                deserialize()
                fav_photos=fav_photos.filter(x=>x.id!=img.id)
                serialize()
                render(fav_photos, 'delete')
            }
        })
        document.getElementById('favourites').addEventListener("click", function (e) {
            deserialize()
            render(fav_photos, 'delete')
        })
        document.getElementById('clean').addEventListener("click", function (e) {
            localStorage.removeItem(FAVOURITES);
            fav_photos = []
            render(fav_photos, 'delete')

        })
        function serialize() {
            localStorage.setItem(FAVOURITES, JSON.stringify(fav_photos))
        }
        function deserialize() {
            let value = localStorage.getItem(FAVOURITES);
            if(value) {
                fav_photos = JSON.parse(value)
            }
        }
    }
    document.addEventListener('DOMContentLoaded', function () {
        widget()
    })

})()