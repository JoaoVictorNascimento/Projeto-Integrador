<template>
    <b-container fluid>
        <b-row>
            <b-col md="12">
                <card style="padding: 10px;">
                    <h4 slot="header" class="card-title">Relatórios</h4>
                    <b-row>
                        <b-col md="4" class="my-1">
                            <b-card border-variant="info" header-bg-variant="info" header="Escolha uma data inicial" class="text-center" header-text-variant="white">
                                <b-row>
                                    <b-col md="12">
                                        <date-picker id="stardDate" v-model="searchData.datetimeInterval.start" :config="datetimeOptions_start"></date-picker>
                                    </b-col>
                                </b-row>
                            </b-card>
                        </b-col>
                        <b-col md="4" class="my-1">
                            <b-card border-variant="info" header-bg-variant="info" header="Escolha uma data final" class="text-center" header-text-variant="white">
                                <b-row>
                                    <b-col md="12">
                                        <date-picker id="endDate" v-model="searchData.datetimeInterval.end" :config="datetimeOptions_end"></date-picker>
                                    </b-col>
                                </b-row>
                            </b-card>
                        </b-col>
                        <b-col md="4" class="my-1">
                            <b-row>
                                <b-col md="12" class="my-1">
                                    <b-form-group vertical label="Buscar por:" class="mb-0">
                                        <b-form-select v-model="searchData.objectOfSearch">
                                            <option :value="null">Aulas e Eventos</option>
                                            <option value="lessons">Apenas Aulas</option>
                                            <option value="events">Apenas Eventos</option>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="12" class="my-1">
                                    <b-form-group v-if="searchData.objectOfSearch !== 'free'" vertical label="Aplicar filtro:">
                                        <b-form-select v-model="searchData.filter.type" :options="searchData.filter.options">
                                            <option :value="null">Sem Filtro</option>
                                            <option value="room">Sala</option>
                                            <option value="responsable">Responsável</option>
                                            <option v-if="searchData.objectOfSearch === 'lessons'" value="discipline_cod">Código da disciplina</option>
                                            <option v-if="searchData.objectOfSearch === 'events'" value="status">Status</option>
                                        </b-form-select>
                                        <b-form-input v-if="searchData.filter.type !== 'status' && searchData.filter.type" v-model="searchData.filter.value" :placeholder="filterPlaceholder"/>
                                        <b-form-select v-if="searchData.filter.type === 'status'" v-model="searchData.filter.value" :options="searchData.filter.options">
                                            <option :value="null">Todos</option>
                                            <option value="pendent">Pendentes</option>
                                            <option value="Aprovada">Aprovados</option>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col mb="12">
                                    <b-btn v-on:click="search()" variant="info" block>Realizar busca</b-btn>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                    <hr />
                    <b-row>
                        <b-col md="6" class="my-1">
                            <b-form-group horizontal label="Buscar" label-text-align="right" class="mb-0">
                                <b-input-group>
                                    <b-form-input v-model="filter" placeholder="Digite para realizar uma busca" />
                                    <b-input-group-append>
                                        <b-btn variant="info" :disabled="!filter" v-on:click="filter = ''">Clear</b-btn>
                                    </b-input-group-append>
                                </b-input-group>
                            </b-form-group>
                        </b-col>
                        <b-col md="6" class="my-1">
                            <b-form-group horizontal label="Itens por página:" label-text-align="right" class="mb-0">
                                <b-form-select :options="pageOptions" v-model="perPage" />
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <!-- Main table element -->
                    <b-table show-empty stacked="md" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered">
                        <template v-if="searchData.objectOfSearch !== 'free'" slot="title" slot-scope="row">
                            <span v-for="item in row.value">{{item}}<span v-if="row.value.length > 1 "> - </span></span>
                        </template>
                        <template v-if="searchData.objectOfSearch !== 'free'" slot="responsable" slot-scope="row">
                            <span v-for="item in row.value">{{item}}<span v-if="row.value.length > 1 "> - </span></span>
                        </template>
                        <!-- <template v-if="searchData.objectOfSearch === 'events'" slot="status" slot-scope="row">
                        <span>{{row.value}}</span>
                    </template> -->
                    <template slot="room" slot-scope="row">
                        <span v-for="item in row.value">{{item}}<span v-if="row.value.length > 1 "> - </span></span>
                    </template>
                    <template v-if="searchData.objectOfSearch !== 'free'" slot="interval" slot-scope="row">{{row.value.start}} - {{row.value.end}}</template>
                    <template slot="actions" slot-scope="row">
                        <!-- <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">Info modal</b-button> -->
                        <!-- <b-button size="sm" @click.stop="row.toggleDetails">{{ row.detailsShowing ? 'Hide' : 'Show' }} Details</b-button> -->
                        <button v-if="row.item.isActive == true" type="button" class="btn-simple btn btn-sm btn-success" v-b-tooltip.hover title="Aprovar reserva">
                            <i class="fa fa-check"></i>
                        </button>
                        <button v-else type="button" class="btn-simple btn btn-sm" disabled>
                            <i class="fa fa-check"></i>
                        </button>
                        <button v-if="row.item.isActive == true" type="button" class="btn-simple btn btn-sm btn-danger" v-b-tooltip.hover title="Rejeitar reserva">
                            <i class="fa fa-times"></i>
                        </button>
                        <button v-else type="button" class="btn-simple btn btn-sm" disabled>
                            <i class="fa fa-times"></i>
                        </button>
                        <button type="button" class="btn-simple btn btn-sm btn-info" v-b-tooltip.hover title="Visualizar mais informações" v-on:click.stop="row.toggleDetails">
                            <i class="fa fa-eye"></i>
                        </button>
                    </template>
                    <template slot="row-details" slot-scope="row">
                        <b-card>
                            <ul>
                                <li v-for="(value, key) in row.item" :key="key" v-if="checkDetails(key)">
                                    {{ value.label }}: <span v-for="item in value.item">{{item.toUpperCase()}}<span v-if="value.item.length > 1 "> - </span></span>
                                </li>
                            </ul>
                        </b-card>
                    </template>
                </b-table>

                <b-row>
                    <b-col md="6" class="my-1">
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </b-col>
                </b-row>

                <!-- <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
                <pre>{{ modalInfo.content }}</pre>
            </b-modal> -->
        </card>
    </b-col>
</b-row>
</b-container>
</template>

<script>
import moment from 'moment'
import Card from 'src/components/UIComponents/Cards/Card.vue'

import {getTime, parseHourToSchedule, sortSchedule} from '../../../services/utils'
import {freeRooms} from '../../../services/GetsServices'
import * as events from '../../../services/eventQuerys'
import * as lessons from '../../../services/lessonQuerys'
import * as rooms from '../../../services/roomQuerys'

export default {
    components:{
        Card
    },
    data() {
        return {
            items: [],
            currentPage: 1,
            perPage: 10,
            totalRows: null,
            pageOptions: [10, 25, 50, 100],
            sortBy: null,
            sortDesc: false,
            sortDirection: "asc",
            filter: null,
            modalInfo: { title: "", content: "" },
            filterPlaceholder: null,
            searchData: {
                objectOfSearch: null,
                filter: {
                    value: null,
                    type: null,
                    options: [],
                    schedules: {
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    }
                },
                datetimeInterval: {
                    start: null,
                    end: null
                }
            },
            datetimeOptions_start: {
                format: "MM/DD/YYYY HH:mm",
                disabledHours: [0, 1, 2, 3, 4, 5, 6, 23],
                stepping: 10,
                useCurrent: true,
                sideBySide: false,
                defaultDate: null,
                locale: "pt-br",
                inline: true
            },
            datetimeOptions_end: {
                format: "MM/DD/YYYY HH:mm",
                disabledHours: [0, 1, 2, 3, 4, 5, 6, 23],
                stepping: 10,
                useCurrent: true,
                sideBySide: false,
                defaultDate: null,
                locale: "pt-br",
                inline: true
            }
        };
    },
    computed: {
        fields () {
            var new_fields = []
            if (!this.searchData.objectOfSearch) {
                new_fields.push(
                    {
                        key: "title",
                        label: "Título",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "responsable",
                        label: "Resposável",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "room",
                        label: "Sala",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "interval",
                        label: "Período"
                    },
                    {
                        key: "actions",
                        label: "Ações"
                    }
                )

            } else if (this.searchData.objectOfSearch == 'lessons') {
                new_fields.push(
                    {
                        key: "title",
                        label: "Código da disciplina",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "discipline_name",
                        label: "Nome da disciplina",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "responsable",
                        label: "Resposável",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "room",
                        label: "Sala",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "interval",
                        label: "Intervalo",
                        sortDirection: "asc"
                    },
                    {
                        key: "actions",
                        label: "Ações"
                    }
                )
            } else if (this.searchData.objectOfSearch == 'events') {
                new_fields.push(
                    {
                        key: "title",
                        label: "Título",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "responsable",
                        label: "Resposável",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "status",
                        label: "Status",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "room",
                        label: "Sala",
                        sortable: true,
                        sortDirection: "asc"
                    },
                    {
                        key: "interval",
                        label: "Período"
                    },
                    {
                        key: "actions",
                        label: "Ações"
                    }
                )
            }

            return new_fields
        }
    },
    watch: {
        "searchData.filter.type": function() {
            if (this.searchData.filter.type == "room") {
                this.filterPlaceholder = "Ex: F101";
                return;
            }
            if (this.searchData.filter.type == "responsable") {
                this.filterPlaceholder = "Ex: I. WIESE";
                return;
            }
        },
        "searchData.objectOfSearch": function() {
            this.searchData.filter.type = null
            this.items = []
        }
    },
    created: function() {
        getTime().then((value) => {
            let date_start = moment(value).set({hour:7,minute:0,second:0,millisecond:0})
            this.datetimeOptions_start.defaultDate = moment(date_start)
            let date_end = moment(value).set({hour:23,minute:0,second:0,millisecond:0})
            this.datetimeOptions_end.defaultDate = moment(date_end)
            console.log(date);
            console.log(this.datetimeOptions.defaultDate);
        })
    },
    methods: {
        // info(item, index, button) {
        //     this.modalInfo.title = `Row index: ${index}`;
        //     this.modalInfo.content = JSON.stringify(item, null, 2);
        //     this.$root.$emit("bv::show::modal", "modalInfo", button);
        // },
        // resetModal() {
        //     this.modalInfo.title = "";
        //     this.modalInfo.content = "";
        // },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        checkDetails(key){
            if (key.toString().substring(0,1) == '_') {
                return false
            }
            for (var field in this.fields) {
                if (this.fields.hasOwnProperty(field)) {
                    if (this.fields[field].key == key) {
                        return false
                    }
                }
            }

            return true
        },
        search() {
            this.items = []
            var startDate = moment(new Date(this.searchData.datetimeInterval.start)).format()
            var endDate = moment(new Date(this.searchData.datetimeInterval.end)).format()
            var schedule = parseHourToSchedule(this.searchData.datetimeInterval.start, this.searchData.datetimeInterval.end)
            console.log(this.searchData.datetimeInterval.start);
            console.log(schedule);
            if (! this.searchData.objectOfSearch) {
                const setLessons = (lesson) => {
                    for (var i = 0; i < lesson.length; i++) {
                        var scheduleSorted = sortSchedule(lesson[i].schedule)
                        this.items.push({
                            title: lesson[i].discipline_name,
                            responsable: lesson[i].responsable,
                            room: lesson[i].room,
                            interval: {
                                start: scheduleSorted[0].toUpperCase(),
                                end: scheduleSorted[(scheduleSorted.length)-1].toUpperCase()
                            },
                            discipline_cod: {
                                label: 'Código da disciplina',
                                item: lesson[i].discipline_cod
                            },
                            allSchedule: {
                                label: 'Horários',
                                item: scheduleSorted
                            }
                        })
                    }
                }
                const setEvents = (evnts) => {
                    for (var i = 0; i < evnts.length; i++) {
                        console.log(evnts[i]);
                        this.items.push({
                            title: evnts[i].title,
                            responsable: evnts[i].responsable,
                            room: evnts[i].room,
                            interval: {
                                start:moment(evnts[i].stardDate).utc().format('DD/MM/YY HH:mm'),
                                end:moment(evnts[i].finalDate).utc().format('DD/MM/YY HH:mm')
                            },
                            description: {
                                label: 'Descrição',
                                item: evnts[i].description
                            },
                            status: {
                                label: 'Status',
                                item: evnts[i].status
                            },
                            repeat:{
                                label: 'Repetição',
                                item:  evnts[i].repeat
                            },
                            created: {
                                label: 'Criado em',
                                item: evnts[i].timestamp
                            }
                        })
                    }
                }
                if (! this.searchData.filter.type) {
                    events.atInterval(startDate, endDate).then((evnts) => {
                        setEvents(evnts)
                    })
                    lessons.bySchedule({"schedule":schedule}).then((lessons) => {
                        setLessons(lessons)
                    })
                } else if (this.searchData.filter.type == 'room') {
                    var room = this.searchData.filter.value.toUpperCase()
                    events.atRoomAtInterval(room, startDate, endDate).then((evnts) => {
                        setEvents(evnts)
                    })
                    lessons.atRoomAtSchedule(room, {"schedule":schedule}).then((lessons) => {
                        setLessons(lessons)
                    })
                } else if (this.searchData.filter.type == 'responsable') {
                    var responsable = this.searchData.filter.value.toUpperCase()
                    events.byResponsableAtInterval(responsable, startDate, endDate).then((evnts) => {
                        setEvents(evnts)
                    })
                    lessons.byResponsableAtSchedule(responsable, {"schedule":schedule}).then((lessons) => {
                        setLessons(lessons)
                    })
                }
            } else if (this.searchData.objectOfSearch == 'lessons') {
                const setLessons = (lesson) => {
                    for (var i = 0; i < lesson.length; i++) {
                        var scheduleSorted = sortSchedule(lesson[i].schedule)
                        this.items.push({
                            title: lesson[i].discipline_cod,
                            discipline_name: lesson[i].discipline_name,
                            responsable: lesson[i].responsable,
                            room: lesson[i].room,
                            interval: {
                                start: scheduleSorted[0].toUpperCase(),
                                end: scheduleSorted[(scheduleSorted.length)-1].toUpperCase()
                            },
                            allSchedule: {
                                label: 'Horários',
                                item: scheduleSorted
                            }
                        })
                    }
                }
                if (! this.searchData.filter.type) {
                    lessons.bySchedule({"schedule":schedule}).then((lessons) => {
                        setLessons(lessons)
                    })
                } else if (this.searchData.filter.type == 'room') {
                    var room = this.searchData.filter.value.toUpperCase()
                    lessons.atRoomAtSchedule(room, {"schedule":schedule}).then((lessons) => {
                        setLessons(lessons)
                    })
                } else if (this.searchData.filter.type == 'responsable') {
                    var responsable = this.searchData.filter.value.toUpperCase()
                    lessons.byResponsableAtSchedule(responsable, {"schedule":schedule}).then((lessons) => {
                        setLessons(lessons)
                    })
                } else if (this.searchData.filter.type == 'discipline_cod') {
                    var discipline_cod = this.searchData.filter.value.toUpperCase()
                    lessons.byDisciplineCodAtSchedule(discipline_cod, {"schedule":schedule}).then((lessons) => {
                        console.log(lessons);
                        setLessons(lessons)
                    })
                }
            } else if (this.searchData.objectOfSearch == 'events') {
                const setEvents = (evnts) => {
                    for (var i = 0; i < evnts.length; i++) {
                        console.log(evnts[i]);
                        this.items.push({
                            title: evnts[i].title,
                            responsable: evnts[i].responsable,
                            room: evnts[i].room,
                            interval: {
                                start:moment(evnts[i].stardDate).utc().format('DD/MM/YY HH:mm'),
                                end:moment(evnts[i].finalDate).utc().format('DD/MM/YY HH:mm')
                            },
                            description: {
                                label: 'Descrição',
                                item: evnts[i].description
                            },
                            status: evnts[i].status,
                            repeat:{
                                label: 'Repetição',
                                item:  evnts[i].repeat
                            },
                            created: {
                                label: 'Criado em',
                                item: evnts[i].timestamp
                            }
                        })
                    }
                }
                if (! this.searchData.filter.type) {
                    events.atInterval(startDate, endDate).then((evnts) => {
                        setEvents(evnts)
                    })
                } else if (this.searchData.filter.type == 'room') {
                    var room = this.searchData.filter.value.toUpperCase()
                    events.atRoomAtInterval(room, startDate, endDate).then((evnts) => {
                        setEvents(evnts)
                    })
                } else if (this.searchData.filter.type == 'responsable') {
                    var responsable = this.searchData.filter.value.toUpperCase()
                    events.byResponsableAtInterval(responsable, startDate, endDate).then((evnts) => {
                        setEvents(evnts)
                    })
                } else if (this.searchData.filter.type == 'status') {
                    var status = this.searchData.filter.value
                    events.byStatus(status, startDate, endDate).then((evnts) => {
                        setEvents(evnts)
                    })
                }

            }

            this.totalRows = this.items.length
        }
    }
};
</script>
