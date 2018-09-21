import {DB} from './Api'
async function findRoom(room){
    let teste = {}
    const findInEvents = (room) =>{
        return DB.get('event/room/' + room)
        .then( (res) =>{
            return res.data
        });
    };
    const findInLessons = (room) =>{
        return DB.get('lesson/room/' + room)
        .then( (res) =>{
            return res.data
        });
    };
    async function do_search(){
        const events_list = await findInEvents(room)
        const lessons_list = await findInLessons(room)
        events_list.forEach(item => {
            lessons_list.push(item)
        });
        return lessons_list;
    }
    return await do_search()
}

export {findRoom}