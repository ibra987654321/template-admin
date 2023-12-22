<template>
  <v-card :disabled="disabled">
    <v-card-title>
      <span class="text-h5">{{$props.title}}</span>
    </v-card-title>

    <v-card-text v-if="load">
      <v-container>
        <v-row>
          <v-col
            v-for="(item, idx) in $props.editBlock"
            :key="idx"
            cols="12"
            :md="item.col"
          >
            <v-text-field
              v-if="item.type === 'input'"
              v-model.trim="editedItem[item.value]"
              :label="item.label"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-if="item.type === 'input-number'"
              v-model="editedItem[item.value]"
              :label="item.label"
              type="number"
              outlined
              dense
            ></v-text-field>
            <v-checkbox
              v-if="item.type === 'checkbox'"
              v-model="editedItem[item.value]"
              :label="item.label"
            ></v-checkbox>
            <v-select
              v-if="item.type === 'select'"
              v-model="editedItem[item.value]"
              :label="item.label"
              outlined
              dense
              :items="item.data"
              @change="item.fn ? item.fn(editedItem[item.value]) : ''"
            ></v-select>
            <div v-if="item.type === 'dynamic-select'">
              <div class="mb-3">{{item.label}}</div>
              <v-row v-for="(editArr, idx) in editedItem[item.value]">
                <v-col v-for="select in item.params" :cols="select.col">
                  <v-select
                    v-model="editArr[select.value]"
                    :label="select.label"
                    outlined
                    dense
                    :items="select.data"
                    @change="select.fn ? select.fn(editedItem[item.value]) : ''"
                  ></v-select>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    color="primary"
                    dark
                    fab
                    small
                    @click="editedItem[item.value].splice(idx, 1)"
                  >
                    <v-icon>{{ icons.mdiMinus }}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                dark
                fab
                @click="item.fn ? item.fn(editedItem[item.value], item.newItem) : ''"
              >
                <v-icon>{{ icons.mdiPlus }}</v-icon>
              </v-btn>
            </div>
            <v-select
              v-if="item.type === 'select-add'"
              v-model="editedItem[item.value]"
              :label="item.label"
              :item-text="item.params.text"
              :item-value="item.params.value"
              outlined
              dense
              :items="item.data"
            ></v-select>
            <v-select
              v-if="item.type === 'select-check'"
              v-model="selected['menu' + idx]"
              :items="item.data"
              :label="item.label"
              @change="select($event, item.value)"
              chips
              outlined
              dense
              multiple
            >
              <template v-slot:prepend-item>
                <v-list-item
                  ripple
                  @mousedown.prevent
                  @click="toggle(item.data, idx, item.value)"
                >
                  <v-list-item-action>
                    <v-icon :color="selected['menu' + idx].length > 0 ? 'indigo darken-4' : ''">
                      {{ selected['menu' + idx].length === item.data.length ? icons.mdiCloseBox : icons.mdiMinusBox }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      Выбрать все
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>
            <v-select
              v-if="item.type === 'select-check-edit'"
              v-model="editedItem[item.value]"
              :items="item.data"
              :label="item.label"
              @change="select($event, item.value)"
              chips
              outlined
              dense
              multiple
            >
            </v-select>
            <v-select
              v-if="item.type === 'select-check-edit=params'"
              v-model="editedItem[item.value]"
              :items="item.data"
              :item-text="item.params.text"
              :item-value="item.params.value"
              :label="item.label"
              @change="select($event, item.value)"
              chips
              outlined
              dense
              multiple
            >
            </v-select>
            <v-textarea
              v-if="item.type === 'textarea'"
              outlined
              v-model="editedItem[item.value]"
              :label="item.label"
            ></v-textarea>
            <v-menu
              v-if="item.type === 'date'"
              :key="'menu' + idx"
              v-model="date['menu' + idx]"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              class="mx-auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="editedItem[item.value]"
                  :label="item.label"
                  outlined
                  dense
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="editedItem[item.value]"
                @input="date['menu' + idx] = false"
              ></v-date-picker>
            </v-menu>
            <div v-if="item.type === 'date-time'">
              <v-datetime-picker
                v-model="editedItem[item.value]"
                :label="item.label"
                :title-edit="title"
                date-format="dd-MM-yyyy"
                time-format="HH:mm:ss"
                :dialog-width="Number(400)"
                :time-picker-props="dateTimeOptions"
                :text-field-props="textFieldProps"
              >
                <template slot="dateIcon">
                  Дата
                </template>
                <template slot="timeIcon">
                  Время
                </template>
                <template
                  slot="actions"
                  slot-scope="{ parent }"
                >
                  <v-btn
                    color="primary"
                    @click.native="parent.clearHandler"
                    outlined
                  >
                    Отмена
                  </v-btn>
                  <v-btn
                    color="primary darken-1"
                    @click="parent.okHandler"
                  >
                    Готово
                  </v-btn>
                </template>
              </v-datetime-picker>
            </div>
            <div>
            </div>
          </v-col>
          <v-col cols="12" v-if="$props.tableData && $props.title !== 'Создать'">
            <use-data-table
              :data="ChildData"
              :put-dispatch="$props.tableData.actions.putDispatch"
              :post-dispatch="$props.tableData.actions.postDispatch"
              :delete-dispatch="$props.tableData.actions.deleteDispatch"
              :headers="$props.tableData.header"
              :edited-items="$props.tableData.editedItem"
              :show-to-edit="$props.tableData.showToEdit"
              @newItem="$emit('newItem')"
            ></use-data-table>
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
        v-if="!view"
        color="blue darken-1"
        text
        :loading="loading"
        @click="save"
      >
        {{saveBtn}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import useDataTable from '@/components/useDashboard/useDataTable'
import {mdiCloseBox, mdiMinusBox, mdiPlus, mdiMinus} from '@mdi/js'
export default {
  name: 'useDialogContent',
  components: {
    useDataTable,
  },
  props: {
    loading: Boolean,
    title: String,
    disabled: Boolean,
    editedItem: Object,
    defaultItem: Object,
    editBlock: Array,
    addBlock: Object,
    tableData: Object,
    data: Array,
    view: Boolean,
    saveBtn: {
      type: String,
      default: 'Сохранить'
    }
  },
  data: () => ({
    date: {
      menu: false,
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
    },
    selected: {
      menu0: [],
      menu1: [],
      menu2: [],
      menu3: [],
      menu4: [],
      menu5: [],
      menu6: [],
      menu7: [],
      menu8: [],
      menu9: [],
    },
    dateTimeOptions: {
      format: '24hr',
    },
    textFieldProps: {
      outlined: 'outlined',
      dense: 'dense',
    },
    load: false,
    icons: {
      mdiCloseBox,
      mdiMinusBox,
      mdiPlus,
      mdiMinus
    }
  }),
  computed: {
    ChildData() {
      return this.$props.data
    },
  },
  watch: {
  },
  mounted() {
    setTimeout(() => this.load = true, 0)
  },
  methods: {
    async save() {
      await this.$emit('save', this.editedItem)
    },
    close() {
      this.$emit('close')
    },
    select(event, value) {
      this.editedItem[value] = event.slice()
    },
    toggle (data, idx, value) {
      this.$nextTick(() => {
        if (this.selected['menu' + idx].length === data.length) {
          this.selected['menu' + idx] = []
          this.editedItem[value] = []
        } else {
          this.selected['menu' + idx] = data.slice()
          this.editedItem[value] = data.slice()
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
