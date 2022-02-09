(function () {

    const LOCAL_STORAGE_NAME_LIST = "todo-list"
    const LIST_TYPE = 'list_type'


    function widget(items,type) {
        const STATUSES = Object.freeze({
            "DONE": 1,
            "TODO": 0
        })

        const PRIORITIES = Object.freeze({
            "RED": 1,
            "YELLOW": 2,
            "GREEN": 3
        })

        let filters = {
            "filter": null,
            "favFilter" : null,
            "priFilter" : null,
            "textFilter": ""
        }

        function setFilter(filterName, value) {
            filters[filterName] = value;
            render();
        }

        function serialize() {
            localStorage.setItem(LOCAL_STORAGE_NAME_LIST, JSON.stringify(items))
            localStorage.setItem(LIST_TYPE, JSON.stringify(type))
        }

        function deserialize() {
            let value = localStorage.getItem(LOCAL_STORAGE_NAME_LIST);
            if(value) {
                items = JSON.parse(value)
            }
            value = localStorage.getItem(LIST_TYPE);
            if(value) {
                type = JSON.parse(value)
            }
            render()
        }

        window.addEventListener('storage', function () {
            deserialize();
        });

        [...document.getElementsByClassName('js-filter')].forEach((element) => {
            element.addEventListener("change", function (e) {
                setFilter(e.target.getAttribute('name'), e.target.value !== '' ? parseInt(e.target.value) : null)
            })
        })

        document.getElementById('search').addEventListener('keyup', function (e) {
            setFilter('textFilter', e.target.value)
        })

        document.getElementById('favorite_filter').addEventListener('change', function (e) {
            setFilter("favFilter", e.target.value !== '' ? e.target.value === "1" : null)
        })

        document.getElementById('add_task').addEventListener('submit', function (e) {
            e.preventDefault();
            let formData = new FormData(e.target);

            let text = formData.get('text');

            if(text) {
                let time = (new Date()).getTime();
                let id = Math.random().toString(36).substring(2) + time
                items.push({
                    id: id,
                    date: time,
                    text: text,
                    status: STATUSES.TODO,
                    is_favourite: false,
                    priority: formData.get('priority'),
                    is_deleted:false
                })
                serialize();
                render();
                e.target.reset();
            }
        })

        function createElement(item) {
            const li = document.createElement('li');
            let date = new Date(item.date)
            li.dataset['id'] = item.id
            li.classList.add("js-item")
            li.classList.add(item.priority)
            li.innerHTML = `
        <div>${date}</div>
        <div>${item.text}</div>
        <div>
        `
        if(type) {
                li.innerHTML+=`
            <button type="button" class="js-complate">
                ${item.status == STATUSES.DONE ? "ADD to TODO" : "DONE"}
            </button>
            `
        } else{
                li.innerHTML+=`
            <button type="button" class="js-restore">
                Restore
            </button>
            `
        }
        li.innerHTML+=     `
        <button type="button" class="js-remove">
            Remove
        </button>
        `
        if(type) {
                li.innerHTML += `
            <button type="button" class="js-favorite">
                ${item.is_favourite ? "Favorite" : "Not favorite"}
            </button>
            <button type="button" class="js-change">
                Change
            </button>`
            }
        li.innerHTML+= `
        </div>
    `
            return li;
        }

        document.getElementById('taskList').addEventListener("click", function (e) {
            let target = e.target;
            if (target.classList.contains('js-remove')) {
                let itemBlock = target.closest('.js-item')
                let id = itemBlock.dataset['id'];
                items.filter((item) => {
                    return item.id == id
                }).forEach(x=>x.is_deleted = true)
                if (!type){
                items = items.filter((item) => {
                        return item.id != id
                })}
                serialize();
                render();

            }
            if (target.classList.contains('js-complate')) {
                let itemBlock = target.closest('.js-item')
                let id = itemBlock.dataset['id'];
                let item = items.find((item) => {
                    return item.id == id
                })
                if (item.status == STATUSES.DONE) {
                    item.status = STATUSES.TODO;
                } else {
                    item.status = STATUSES.DONE
                }
                item.date = (new Date()).getTime()
                serialize();
                render();
            }
            if (target.classList.contains('js-favorite')) {
                let itemBlock = target.closest('.js-item')
                let id = itemBlock.dataset['id'];
                let item = items.find((item) => {
                    return item.id == id
                })
                item.is_favourite = !item.is_favourite;

                serialize();
                render();
            }
            if (target.classList.contains('js-restore')) {
                let time = (new Date()).getTime();
                let itemBlock = target.closest('.js-item')
                let id = itemBlock.dataset['id'];
                let item = items.find((item) => {
                    return item.id == id
                })
                item.is_deleted= false;
                item.date = time
                serialize();
                render();
            }
            if (target.classList.contains('js-change')) {
                let time = (new Date()).getTime();
                let itemBlock = target.closest('.js-item')
                let id = itemBlock.dataset['id'];
                let item = items.find((item) => {
                    return item.id == id
                })
                let text = document.getElementById('text').value
                if(text)
                {
                    item.date = time
                    item.text = text
                    document.getElementById('text').innerHTML = ''
                }


                serialize();
                render();
            }
        })

        document.getElementById('archive').addEventListener("click", function (e) {
            type = !type;
            render()
        })

        function listRender(items) {
            let taskList = document.getElementById('taskList');
            taskList.innerHTML = "";
            items.forEach((item) => {
                taskList.appendChild(createElement(item))
            })
        }

        function render() {
            type?
            document.getElementById('archive').innerHTML = 'Покажи архив':
                document.getElementById('archive').innerHTML = 'Покажи список'
            type?
                document.getElementById('h2').innerHTML = ' Список заданий':
                document.getElementById('h2').innerHTML = 'Архив'
            let renderList = [1]
            renderList = [...items]
            renderList = renderList.filter(x=>x.is_deleted!==type)
            renderList.sort((item1, item2) => {
                if (item1.status == item2.status) {
                     if (item1.priority == item2.priority) {
                         if (item1.is_favourite == item2.is_favourite) {
                            return item2.date - item1.date
                         }
                         return item1.is_favourite ? 1 : -1
                    }
                     return (item1.priority == PRIORITIES.RED || (item1.priority == PRIORITIES.YELLOW && item2.priority == PRIORITIES.GREEN)) ? -1 : 1}
                return item1.status == STATUSES.TODO ? -1 : 1
            });

            if(filters.filter !== null) {
                renderList = renderList.filter((item) => {
                    return item.status === filters.filter
                })
            }
            
            if(filters.favFilter !== null) {
                console.log(filters.favFilter);
                renderList = renderList.filter((item) => {
                    return item.is_favourite === filters.favFilter
                })
            }
            
            if(filters.priFilter !== null) {
                renderList = renderList.filter((item) => {
                    return item.priority === filters.priFilter
                })
            }
            
            if(filters.textFilter !== '') {
                renderList = renderList.filter(x => x.text.includes(filters.textFilter))
            }
            
            listRender(renderList);
        }

        render()
    }

    document.addEventListener('DOMContentLoaded', function () {

        let value = localStorage.getItem(LOCAL_STORAGE_NAME_LIST);
        let  items = []
        if (value) {
            items = JSON.parse(value)
        }

        value = localStorage.getItem(LIST_TYPE);
        let type = true
        if (value) {
            type = JSON.parse(value)
        }
        widget(items,type);
    })

})()