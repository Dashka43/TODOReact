let  items = []
let  deleted_items = []

let maxId = 0;
let deleted_maxId = 0;

const LOCAL_STORAGE_NAME_LIST = "todo-list"
const LOCAL_STORAGE_MAX_ID = "todo-list-max-id"
const LOCAL_STORAGE_DELETED_LIST = "deleted-list"
const LOCAL_STORAGE_DELETED_MAX_ID = "deleted-list-max-id"

const STATUS_DONE = 1
const STATUS_TODO = 0

const FAVORITE = 1
const NOT_FAVORITE = 0

const FILTER_NONE = 0;
const FILTER_DONE = 1;
const FILTER_TODO = 2;

const FILTER_FAVORITE = 1;
const FILTER_NOT_FAVORITE = 2;

const FILTER_RED = 1;
const FILTER_YELLOW= 2;
const FILTER_GREEN = 3;

const RED = 'red';
const YELLOW = 'yellow';
const GREEN = 'green'


let FILTER = FILTER_NONE;
let FAV_FILTER = FILTER_NONE;
let PRI_FILTER= FILTER_NONE;


/*
function serialize() {
    localStorage.setItem(LOCAL_STORAGE_NAME_LIST, JSON.stringify(items))
    localStorage.setItem(LOCAL_STORAGE_MAX_ID, maxId)
}

 */
function serialize(namelist = LOCAL_STORAGE_NAME_LIST,storage_max_id = LOCAL_STORAGE_MAX_ID, maxid = maxId ) {

    namelist == LOCAL_STORAGE_NAME_LIST ? localStorage.setItem(namelist, JSON.stringify(items)) : localStorage.setItem(namelist, JSON.stringify(deleted_items))
    localStorage.setItem(storage_max_id, maxid)
}
/*
function deserialize() {

    let value = localStorage.getItem(LOCAL_STORAGE_NAME_LIST);
    if(value) {
        items = JSON.parse(value)
    }

    maxId = localStorage.getItem(LOCAL_STORAGE_MAX_ID) || maxId
    render()
}

 */

function deserialize(namelist = LOCAL_STORAGE_NAME_LIST,storage_max_id = LOCAL_STORAGE_MAX_ID, maxid = maxId) {

    let value = localStorage.getItem(namelist);
    if(value) {
        namelist == LOCAL_STORAGE_NAME_LIST ? items = JSON.parse(value):deleted_items = JSON.parse(value)
    }

   // maxId = localStorage.getItem(LOCAL_STORAGE_MAX_ID) || maxId
    if (namelist == LOCAL_STORAGE_NAME_LIST) { maxId = localStorage.getItem(LOCAL_STORAGE_MAX_ID) || maxId }
    else{deleted_maxId = localStorage.getItem(LOCAL_STORAGE_DELETED_MAX_ID) || deleted_maxId}
    render()
}

document.addEventListener('DOMContentLoaded', function () {
    deserialize();
    deserialize(LOCAL_STORAGE_DELETED_LIST,LOCAL_STORAGE_DELETED_MAX_ID,deleted_maxId);
})

window.addEventListener('storage', function () {
    deserialize();
    deserialize(LOCAL_STORAGE_DELETED_LIST,LOCAL_STORAGE_DELETED_MAX_ID,deleted_maxId);
});

document.getElementById('select_filter').addEventListener('change', function (e) {
    FILTER = parseInt(e.target.value);
    render();
})

document.getElementById('search').addEventListener('change', function (e)
{
   render()
})

document.getElementById('favorite_filter').addEventListener('change', function (e) {
    FAV_FILTER = parseInt(e.target.value);
    render();
})

document.getElementById('priority_filter').addEventListener('change', function (e) {
    PRI_FILTER = parseInt(e.target.value);
    render();
})

document.getElementById('add_task').addEventListener('submit',  function (e) {
    e.preventDefault();
    let input = document.getElementById('text');
    document.getElementById('priority');
    items.push({
        id: ++maxId,
        date: (new Date()).getTime(),
        text: input.value,
        status: STATUS_TODO,
        favourite:NOT_FAVORITE,
        priority:document.getElementById('priority').value
    })
    serialize();
    render();
    input.value = '';
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
        <button type="button" class="js-complate">
            ${item.status == STATUS_DONE ? "ADD to TODO" : "DONE"}
        </button>
        
        <button type="button" class="js-remove">
            Remove
        </button>
        <button type="button" class="js-favorite">
            ${item.favourite == FAVORITE ? "Favorite" : "Not favorite"}
        </button>
        </div>
    `
    return li;
}

document.getElementById('taskList').addEventListener("click", function (e) {
    let target = e.target;
    if(target.classList.contains('js-remove')) {
        let itemBlock = target.closest('.js-item')
        let id = itemBlock.dataset['id'];
        if  (document.getElementById('archiv').innerHTML = 'Покажи архив') {
            deleted_items = deleted_items.concat(items.filter((item) => {
                return item.id == id
            }))
            serialize(LOCAL_STORAGE_DELETED_LIST, LOCAL_STORAGE_DELETED_MAX_ID, deleted_maxId);
            items = items.filter((item) => {
                return item.id != id
            })
            serialize();
            render();
        }
        else {
            deleted_items = items.filter((item) => {
                return item.id != id
            })
            serialize(LOCAL_STORAGE_DELETED_LIST, LOCAL_STORAGE_DELETED_MAX_ID, deleted_maxId);
            render(LOCAL_STORAGE_DELETED_LIST);
        }
    } 
    if(target.classList.contains('js-complate')) {
        let itemBlock = target.closest('.js-item')
        let id = itemBlock.dataset['id'];
        let item = items.find((item) => {
            return item.id == id
        })
        if(item.status == STATUS_DONE) {
            item.status = STATUS_TODO;
        } else {
            item.status = STATUS_DONE
        }
        item.date = (new Date()).getTime()
        serialize();
        render();
    }
    if(target.classList.contains('js-favorite')) {
        let itemBlock = target.closest('.js-item')
        let id = itemBlock.dataset['id'];
        let item = items.find((item) => {
            return item.id == id
        })
        if(item.favourite == FAVORITE) {
            item.favourite = NOT_FAVORITE;
        } else {
            item.favourite = FAVORITE
        }
        serialize();
        render();
    }
})

document.getElementById('archiv').addEventListener("click", function (e) {
    if (this.innerHTML == 'Покажи архив')
        {
            this.innerHTML = 'Покажи список'
            render(LOCAL_STORAGE_DELETED_LIST)

        } else{
            this.innerHTML = 'Покажи архив'
             render()

        }


})

function listRender(items) {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = "";
    items.forEach((item) => {
        taskList.appendChild(createElement(item))
    })
}

function render(namelist = LOCAL_STORAGE_NAME_LIST) {
    let renderList = []
    namelist == LOCAL_STORAGE_NAME_LIST ? renderList = [...items] : renderList = [...deleted_items]


    renderList.sort((item1, item2) => {
        if(item1.priority == item2.priority) {
            if (item1.favourite == item2.favourite) {
                if (item1.status == item2.status) {
                    return item2.date - item1.date
                }
                return item1.status == STATUS_TODO ? -1 : 1
            }
            return item1.favourite == NOT_FAVORITE ? -1 : 1
        }
        return (item1.priority == RED||(item1.priority == YELLOW && item2.priority == GREEN)) ? -1:1


    });
    switch (FILTER) {
        case FILTER_DONE: {
            renderList = renderList.filter((item) => {
                return item.status === STATUS_DONE
            })
            break;
        }
        case FILTER_TODO: {
            renderList = renderList.filter((item) => {
                return item.status === STATUS_TODO
            })
            break
        }
        case FILTER_NONE:
        default:
            break;
    }
    switch (FAV_FILTER) {
        case FILTER_NOT_FAVORITE: {
            renderList = renderList.filter((item) => {
                return item.favourite === NOT_FAVORITE
            })
            break;
        }
        case FILTER_FAVORITE: {
            renderList = renderList.filter((item) => {
                return item.favourite === FAVORITE
            })
            break
        }
        case FILTER_NONE:
        default:
            break;
    }
    switch (PRI_FILTER) {
        case FILTER_RED: {
            renderList = renderList.filter((item) => {
                return item.priority === RED
            })
            break;
        }
        case FILTER_YELLOW: {
            renderList = renderList.filter((item) => {
                return item.priority === YELLOW
            })
            break
        }
        case FILTER_GREEN:{
            renderList = renderList.filter((item) => {
                return item.priority === GREEN
            })
            break
        }
        case FILTER_NONE:
        default:
            break;
    }
    renderList = renderList.filter(x=>x.text.search(document.getElementById('search').value)!==-1)
    listRender(renderList);

}