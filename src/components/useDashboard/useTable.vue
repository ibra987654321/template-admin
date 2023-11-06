<template>
  <v-data-table
    :items="itemsWithIndex"
    :item-class="itemClasses"
    :headers="header"
    :show-select="$props.selectRow"
    :loading="loading1"
    item-key="id"
    :show-expand="!!spoilerHeader"
    :footer-props="pagination"
    :class="headerCentered ? 'table-centered' : ''"
  >
    <template v-slot:top>
      <div class="padding">
        <v-dialog
          v-if="$props.selectRow"
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="$props.postDispatch"
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Создать группу
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="group.groupName"
                      label="Название группы"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="group.curatorName"
                      label="Имя куратора"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-menu
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      class="mx-auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="group.startEducationDate"
                          label="Дата начало"
                          readonly
                          outlined
                          dense
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="group.startEducationDate"
                        @input="menu1 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Отмена
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-if="$props.showToEdit && !$props.selectRow"
          v-model="dialog"
          :max-width="dialogWidth"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-if="searchDispatch"
              v-model="search"
              :label="$props.searchTitle"
              outlined
              full-width
              hide-details
              dense
              class="my-4 select"
            ></v-text-field>
            <div class="d-flex justify-space-between">
              <h2 v-if="$props.title">
                {{ $props.title }}
              </h2>
              <v-btn
                v-if="postDispatch"
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ formTitle }}
              </v-btn>
            </div>
          </template>
          <v-alert
            v-if="afterOpenEditText.length > 36"
            type="success"
          >
            {{ afterOpenEditText }}
          </v-alert>
          <use-dialog-content
            :title="formTitle"
            :edit-block="$props.showToEdit"
            :edited-item="editedItem"
            :table-data="$props.childTable"
            :data="childTableData"
            :view="viewOnly"
            @close="close()"
            @save="save($event)"
          ></use-dialog-content>
        </v-dialog>
        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="text-h5">
              Вы действительно хотите удалить?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeDelete"
              >
                Отмена
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="deleteItemConfirm"
              >
                OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-if="$props.selectGroup"
          v-model="dialog1"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2 ml-3"
              v-bind="attrs"
              v-on="on"
            >
              Добавить в существующую
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Добавить</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-select
                      v-model="$props.selectGroup.model"
                      :items="$props.selectGroup.items"
                      label="Выбор группы"
                      class="select"
                      hide-details
                      outlined
                      dense
                      @change="selectForGroup($event)"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Отмена
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-select
          v-if="$props.selectForApi"
          v-model="$props.selectForApi.model"
          :items="$props.selectForApi.items"
          class="select"
          hide-details
          outlined
          dense
          @change="selected()"
        >
        </v-select>
      </div>
    </template>
    <template
      v-if="changeFilter"
      v-slot:[`item.${$props.filters.change.value}`]="{item}"
    >
      {{ $props.filters.change.change(item.gender) }}
    </template>
    <template
      v-if="statusFilter"
      v-slot:[`item.${$props.filters.status}`]="{item}"
    >
      {{ item[$props.filters.status] | status }}
    </template>
    <template
      v-for="(date, idx) in $props.filters.date"
      v-if="dateFilter"
      v-slot:[`item.${date}`]="{item}"
    >
      <div v-if="item[$props.filters.date[idx]] !== null">
        {{ item[$props.filters.date[idx]] | date}}
      </div>
      <div v-else></div>
    </template>
    <template
      v-for="(chips, idx) in $props.filters.chips"
      v-if="chipsFilter"
      v-slot:[`item.${chips}`]="{item}"
    >
      <div v-if="item[$props.filters.chips[idx]] !== null">
        <v-chip
          class="ma-2"
          v-for="(item, index) in item[$props.filters.chips[idx]]"
          :color="color[index]"
        >
          {{ item.slice(13,25) }}
        </v-chip>
      </div>
    </template>
    <template
      v-for="(min, idx) in $props.filters.minute"
      v-if="minuteFilter"
      v-slot:[`item.${min}`]="{item}"
    >
      <div v-if="item[$props.filters.minute[idx]] !== null">
        {{ item[$props.filters.minute[idx]] | time}}
      </div>
      <div v-else></div>
    </template>
    <template
      v-if="truncateFilter"
      v-slot:[`item.${$props.truncate.text}`]="{item}"
    >
      <span v-if="!item.show">{{ truncateText(item, 30) }}</span>

      <span v-else>{{ item[$props.truncate.text] }}</span>
      <a v-if="item[$props.truncate.text]" @click="item.show = !item.show">
        {{ item.show  ? 'скрыть' : 'еще' }}
      </a>
    </template>
    <template
      v-for="(check, idx) in $props.filters.checkbox"
      v-if="checkFilter"
      v-slot:[`item.${check}`]="{item}"
    >
      <v-checkbox
        v-model="item[$props.filters.checkbox[idx]]"
        disabled
      ></v-checkbox>
    </template>
    <template
      v-if="redirectFilter"
      v-slot:[`item.${$props.filters.redirect}`]="{item}"
    >
      <a
        color="primary"
        target="_blank"
        :href="item[$props.filters.redirect]"
      >
        Перейти
      </a>
    </template>
    <template v-slot:item.detail="{item}">
      <v-btn
        color="primary"
        small
        outlined
        rounded
        @click="$router.push('/education/group/candidateDetail/' + item.id)"
      >
        Подробнее
      </v-btn>
    </template>
    <template v-slot:item.function="{item}">
      <v-btn
        color="primary"
        small
        outlined
        rounded
        @click="$props.function(item)"
      >
        Подробнее
      </v-btn>
    </template>
    <template
      v-if="$props.slots"
      v-slot:[`item.${$props.slots.column}`]="{item}"
    >
      <v-edit-dialog>
        <v-btn :color="item[$props.slots.column] ? 'primary' : 'success'" small>
          {{ item[$props.slots.column] ? item[$props.slots.column] : 'пусто' }}
        </v-btn>
        <template v-slot:input>
          <v-card>
            <v-card-text class="my-1 mx-1">
              <v-select
                v-model="item[$props.slots.column]"
                :label="$props.slots.label"
                :items="$props.slots.data"
                outlined
                dense
                hide-details
                @change="
                (e) => {
                  if (item[$props.slots.column] === 'Очистить') (item[$props.slots.column] = '')
                  $store.dispatch($props.slots.dispatch, item).then(() => $emit('changed'))
                }"
              ></v-select>
            </v-card-text>
          </v-card>

        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.getItem="{item}">
      <v-btn
        color="primary"
        small
        rounded
        @click="$emit('getItem', item)"
      >
        {{getItemBtn ? getItemBtn : 'Изменеие'}}
      </v-btn>
    </template>
    <template v-slot:item.returnBtn="{item}">
      <v-btn
        color="warning"
        small
        rounded
        @click="$emit('returned', item)"
      >
        {{returnBtn ? returnBtn : 'Изменеие'}}
      </v-btn>
    </template>
    <template v-slot:item.fileName="{ item }">
      <v-speed-dial

        direction="left"
        dark
        small
      >
        <template v-slot:activator>
          <v-btn
            v-model="fab"
            color="blue darken-2"
            dark
            fab
          >
            <v-icon v-if="fab">
              {{ icons.mdiClose }}
            </v-icon>
            <v-icon v-else>
              {{ icons.mdiFormatListBulletedSquare }}
            </v-icon>
          </v-btn>
        </template>
        <v-btn
          v-if="uploadDispatch"
          fab
          dark
          small
          color="green"
          @click="$refs.refInputEl.click()"
        >
          <v-icon>{{ icons.mdiFile }}</v-icon>
          <input
            ref="refInputEl"
            type="file"
            accept=".jpeg,.png,.jpg,GIF,.docx,rar"
            :hidden="true"
            @change="selectFile($event, item.id)"
          />
        </v-btn>
        <div v-if="item.fileName !== null">
          <v-btn
            v-if="uploadDispatch"
            fab
            dark
            small
            color="error"
            @click="$emit('deleteFileParam',item)"
          >
            <v-icon>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            small
            color="indigo"
            @click="uploadFile(item.fileName, item.id)"
          >
            <v-icon>{{ icons.mdiDownload }}</v-icon>
          </v-btn>
        </div>

      </v-speed-dial>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        {{ icons.edit }}
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
        v-if="deleteDispatch"
      >
        {{ icons.deleted }}
      </v-icon>
    </template>
    <template v-if="spoilerHeader" v-slot:expanded-item="{ headers, item }">
      <td
        :colspan="headers.length"
        class="bg-gradient-primary py-1 px-1"
      >
        <v-data-table
          :headers="spoilerHeader"
          :items="[item]"
          item-key="name"
          class="elevation-1"
          hide-default-footer
        >
          <template
            v-if="redirectFilter"
            v-slot:[`item.${$props.filters.redirect}`]="{item}"
          >
            <a
              color="primary"
              target="_blank"
              :href="item[$props.filters.redirect]"
            >
              Перейти
            </a>
          </template>
          <template
            v-for="(min, idx) in $props.filters.minute"
            v-if="minuteFilter"
            v-slot:[`item.${min}`]="{item}"
          >
            <div v-if="item[$props.filters.minute[idx]] !== null">
              {{ item[$props.filters.minute[idx]] | time}}
            </div>
            <div v-else></div>
          </template>
          <template
            v-for="(date, idx) in $props.filters.date"
            v-if="dateFilter"
            v-slot:[`item.${date}`]="{item}"
          >
            <div v-if="item[$props.filters.date[idx]] !== null">
              {{ item[$props.filters.date[idx]] | date}}
            </div>
            <div v-else></div>
          </template>
          <template
            v-for="(chips, idx) in $props.filters.chips"
            v-if="chipsFilter"
            v-slot:[`item.${chips}`]="{item}"
          >
            <div v-if="item[$props.filters.chips[idx]] !== null">
              <v-chip
                class="ma-2"
                color="primary"
              >
                {{ item[$props.filters.chips[idx]] }} dfs
              </v-chip>
            </div>
          </template>
<!--          <template-->
<!--            v-if="truncate"-->
<!--            v-for="(trunc, idx) in $props.truncate"-->
<!--            v-slot:[`item.${trunc.text}`]="{item}"-->
<!--          >-->
<!--            <span v-if="!item.show">{{ truncateText(item[trunc.text], 30) }}</span>-->
<!--            <span v-else>{{ item[trunc.text] }}</span>-->
<!--            <a v-if="item[trunc.text] ? item[trunc.text].length > 30 : false" @click="item.show = !item.show">-->
<!--              {{ item.show ? 'скрыть' : 'еще' }}-->
<!--            </a>-->
<!--          </template>-->
          <template
            v-for="(check, idx) in $props.filters.checkbox"
            v-if="checkFilter"
            v-slot:[`item.${check}`]="{item}"
          >
            <v-checkbox
              v-model="item[$props.filters.checkbox[idx]]"
              disabled
            ></v-checkbox>
          </template>
        </v-data-table>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import {
  mdiCheckOutline,
  mdiClipboardOutline,
  mdiClipboardPlayOutline, mdiClose, mdiCloseOutline,
  mdiDelete, mdiDownload, mdiFile, mdiFormatListBulletedSquare,
  mdiPen, mdiPencil,
} from '@mdi/js'
import useDialogContent from '@/components/useDashboard/useDialogContent'
import datePickerFormat from '@/filters/datePickerFormat'

export default {
  components: {
    useDialogContent,
  },
  props: {
    loading: Boolean,
    headers: Array,
    headerCentered: Boolean | false,
    items: Array,
    function: Function,
    spoilerHeader: Array,
    selectRow: Boolean | null,
    selectGroup: Object,
    showToEdit: Array,
    filters: Object,
    editedItems: Object,
    defaultItem: Object,
    afterOpenEditDispatch: String,
    getDispatch: String,
    putDispatch: String,
    deleteDispatch: String,
    postDispatch: String,
    uploadDispatch: String,
    downloadDispatch: String,
    selectForApi: Object,
    getDispatchId: String,
    childTable: Object,
    searchDispatch: String,
    searchTitle: String,
    title: String,
    truncate: Object,
    slots: Object,
    getItemBtn: String,
    returnBtn: String,
    viewOnly: {
      type: Boolean,
      default() {
        return false
      }
    },
    itemsPerPageOptions: {
      type: Array,
      default(){
        return [15,20,50]
      }
    },
    dialogWidth: {
      type: String,
      default() {
        return '1200px'
      }
    }
  },
  data: () => ({
    color: [
      'primary',
      'accent',
      'info',
      'success',
      'secondary',
      'warning',
      'error',
    ],
    showFullText: false,
    loading1: false,
    search: '',
    fab: false,
    currentFile: undefined,
    childTableData: [],
    menu1: false,
    selectedGroup: '',
    data: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {},
    afterOpenEditText: '',
    icons: {
      edit: mdiPen,
      deleted: mdiDelete,
      mdiCheckOutline,
      mdiClipboardOutline,
      mdiClipboardPlayOutline,
      mdiCloseOutline,
      mdiFormatListBulletedSquare,
      mdiPencil,
      mdiFile,
      mdiDownload,
      mdiDelete,
      mdiClose,
    },
    pagination: {}
  }),
  computed: {
    header() {
      this.pagination.itemsPerPageOptions = this.$props.itemsPerPageOptions
      return this.$props.headers
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Создать' : 'Изменить'
    },
    dateFilter() {
      if (this.$props.filters) {
        if (this.$props.filters.date) {
          return this.$props.filters.date
        }
      }
    },
    minuteFilter() {
      if (this.$props.filters) {
        if (this.$props.filters.minute) {
          return this.$props.filters.minute
        }
      }
    },
    truncateFilter() {
      if (this.$props.truncate) {
          return this.$props.truncate
      }
    },
    statusFilter() {
      if (this.$props.filters) {
        if (this.$props.filters.status) {
          return this.$props.filters.status
        }
      }
    },
    checkFilter() {
      if (this.$props.filters) {
        if (this.$props.filters.checkbox) {
          return this.$props.filters.checkbox
        }
      }
    },
    chipsFilter() {
      if (this.$props.filters) {
        if (this.$props.filters.chips) {
          return this.$props.filters.chips
        }
      }
    },
    changeFilter() {
      if (this.$props.filters) {
        if (this.$props.filters.change) {
          return this.$props.filters.change.value
        }
      }
    },
    // eslint-disable-next-line consistent-return
    redirectFilter() {
      if (this.$props.filters) {
        if (this.$props.filters.redirect) {
          return this.$props.filters.redirect
        }
      }
    },
    selectedModel() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.$props.selectForApi.model = this.$props.selectForApi.modelEquals
      return this.$props.selectForApi.model
    },
    // eslint-disable-next-line consistent-return,vue/return-in-computed-property
    itemsWithIndex() {
      if (!this.$props.getDispatch) {
        this.loading1 = this.$props.loading
        this.data = this.$props.items
      }
      return this.data.map(
        (items, index) => ({
          ...items,
          index: index + 1,
        }),
      )
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    async search(val) {
      if (val) {
        this.data = await this.$store.dispatch(this.$props.searchDispatch, val)
      }
    },
    '$props.items': function (v) {
      this.data = v
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.$props.selectForApi) {
         this.loading1 = true
        this.$store.dispatch(this.$props.getDispatch, this.selectedModel).then(r => {
          this.data = r.data
          this.loading1 = false
        })
      }
    })
    setTimeout(() => {
      if (this.getDispatchId) {
         this.loading1 = true
        this.$store.dispatch(this.$props.getDispatch, this.getDispatchId).then(r => {
          this.data = r.data
          this.loading1 = false
        })
      }
    })
    setTimeout(() => {
      if (!this.$props.selectForApi && !this.getDispatchId) {
        if (this.$props.getDispatch) {
           this.loading1 = true
          this.$store.dispatch(this.$props.getDispatch)
            .then(r => {
              this.data = r.data
              this.loading1 = false
            })
        }
      }
    })
    this.editedItem = this.$props.editedItems
  },
  methods: {
    itemClasses(item) {
      return item.listeningAgain ? 'red' : ''
    },
    selected() {
       this.loading1 = true
      this.$store.dispatch(this.$props.getDispatch, this.$props.selectForApi.model)
        .then(r => {
          this.data = r
          this.loading1 = false
        })
    },

    truncateText(item, length) {
      if (item) {
        this.data.map(i => {
          if (i.id === item.id) {
            item.show = false
          }
        })
        if (item[this.$props.truncate.text]) {
          return item[this.$props.truncate.text].substring(0, length)
        } else {
          return item[this.$props.truncate.text]
        }
      }

    },
    selectForGroup(v) {
      this.selectedGroup = v
    },

    editItem(item) {
      if (this.$props.afterOpenEditDispatch) {
        this.$store.dispatch(this.$props.afterOpenEditDispatch, item.id)
          .then(r => {
            this.afterOpenEditText = r
          })
      }
      if (this.$props.childTable) {
        this.$store.dispatch(this.$props.childTable.actions.getDispatch, item.id)
          .then(r => {
            this.childTableData = r
          })
      }
      this.editedIndex = this.itemsWithIndex.indexOf(item)
      const date = this.$props.showToEdit.filter(i => i.type === 'date-time')
      if (date) {
        date.map(i => {
          if (item[i.value]) {
            item[i.value] = datePickerFormat(item[i.value])
          }
        })
      }
      this.editedItem = { ...item }
      this.dialog = true
    },
    fabs() {
      return this.fab
    },
    selectFile(file, id) {
      this.currentFile = file.target.files[0]
      if (id) {
        this.uploadFile(null, id)
      }
    },
    async uploadFile(file, id) {
      if (file) {
        await this.$store.dispatch(this.$props.downloadDispatch, {file, id })
      } else {
        await this.$store.dispatch(this.$props.uploadDispatch, {file:this.currentFile, id })
          .then(() => {
            this.$emit('uploadSuccess')
          })
      }
    },
    deleteItem(item) {
      this.editedIndex = this.itemsWithIndex.indexOf(item)
      this.editedItem = { ...item }
      this.dialogDelete = true
    },
    deleteItemGroup(item) {
      this.editedIndex = this.itemsWithIndex.indexOf(item)
      this.editedItem = { ...item }
      this.deleteItemConfirm()
    },

    deleteItemConfirm() {
      const item = this.data.splice(this.editedIndex, 1)
      this.$store.dispatch(this.$props.deleteDispatch, ...item)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    async save(event) {
      if (this.editedIndex > -1) {
        await this.$store.dispatch(this.putDispatch, this.editedItem)
          .then(r => {
            if (r !== undefined) {
              Object.assign(this.data[this.editedIndex], r.data)
              this.close()
            }
          })
      } else {
        this.$store.dispatch(this.postDispatch, event)
          .then((r) => {
            if (r !== undefined) {
              this.data.unshift(r.data)
              this.close()
            }
          })
      }

    },
    getRowColorClass(item) {
      // Возвращайте имя класса в зависимости от данных элемента
      if (item.active) {
        return 'row-color-red';
      } else {
        return '';
      }
    }
  },
}
</script>

<style scoped>
.row-color-red {
  border:1px solid #7c34ff; /* Красный цвет */
}
.red {
  background-color: lightgreen; /* Измените цвет на желаемый */
}
.select {
  width: 100%;
  max-width: 400px;
  margin: 10px;
}

</style>
<style>
.table-centered thead tr th {
  vertical-align: super;
}
.red {
  background-color: #3b2563; /* Измените цвет на желаемый */
}
.slot {
  min-width: 60px;
  height: 20px;
  padding-left: 5px;
  border-radius: 10px;
  border:1px solid #7c34ff;
}
</style>
