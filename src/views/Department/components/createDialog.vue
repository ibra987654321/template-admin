<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
      >{{$props.textBtn}}</v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="mb-8" >Добавление </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="item.name"
                outlined
                label="Название"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="item.status"
                outlined
                label="Статус"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="item.productId"
                label="Товар"
                :items="items"
                item-value="id"
                item-text="name"
                hide-details
                outlined
                class="mr-2"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="item.amount"
                outlined
                type="number"
                label="Количество"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
<!--              <v-file-input-->
<!--                v-model="newMessage.file"-->
<!--                accept="image/*"-->
<!--                @change="handleFileChange"-->
<!--                show-size-->
<!--                show-overflow-->
<!--                label="Выбрать изображение"-->
<!--              ></v-file-input>-->
              <input type="file" @change="handleFileChange" accept="image/*" />
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn
            text
            @click="dialog = false"
          >Закрыть</v-btn>
          <v-btn
            color="primary"
            @click="save"
            :disabled="!valid"
          >Создать</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  name: 'createDialog',
  props: {
    textBtn: String,
    propItem: Object
  },
  data:() => ({
    dialog: false,
    loading: false,
    item: {
      "name": "",
      "status": "",
      "productId": 0,
      "departmentId": 0,
      "amount": null
    },
    cameraNotSupported: false,
    newMessage: {
      file: null
    },
    items: [],
    capturedPhoto: null,
    photoFile: null,
  }),
  mounted() {
    this.$store.dispatch('getProduct')
      .then(r => {
        this.items = r.data
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
  },
  computed: {
    valid() {
      return !!(this.item.name && this.item.status && this.item.amount && this.item.productId);
    },

  },
  watch: {
    'dialog'(v) {
      if (this.propItem) {
        this.item.name = this.propItem.name
        this.item.productId = this.propItem.goods.product.id
        this.item.amount = this.propItem.amount
      }
    }
  },
  methods: {
    save() {
      this.loading = true
      this.item.departmentId = this.$route.params.id
      if (this.propItem) {
        if (this.newMessage.file !== null) {
          this.$store.dispatch('uploadImg',{
            file: this.newMessage.file,
            id: this.propItem.id
          })
            .then(() => {
              this.$emit('success', '')
              this.item = {
                "name": "",
                "status": "",
                "productId": 0,
                "departmentId": 0,
                "amount": 0
              }
              this.dialog = false
              this.loading = false
            })
          return
        }
        this.dialog = false
        this.loading = false
      } else {
        this.$store.dispatch('createSet', this.item)
          .then(r => {
            if (this.newMessage.file !== null) {
              this.$store.dispatch('uploadImg',{
                file: this.newMessage.file,
                id: r.data.id
              })
                .then(() => {
                  this.$emit('success', r.data)
                  this.item = {
                    "name": "",
                    "status": "",
                    "productId": 0,
                    "departmentId": 0,
                    "amount": 0
                  }
                  this.dialog = false
                  this.loading = false
                })
              return
            }
            this.dialog = false
            this.loading = false

          })
          .catch(error => {
            const errorMessage = error.response ? error.response.data : 'Unknown error';
            this.$store.commit('setSnackbars', errorMessage);
            this.loading = false
          });
      }

    },
    capturePhoto() {
      // Получение доступа к камере
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Отображение видеопотока в video элементе (если необходимо)
          const video = document.createElement("video");
          video.srcObject = stream;
          document.body.appendChild(video);

          // Захват кадра
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          video.addEventListener("loadeddata", () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Преобразование кадра в base64 строку
            this.photoFile = canvas.toDataURL("image/png");

            // Остановка потока
            stream.getTracks().forEach((track) => track.stop());

            // Удаление элементов
            document.body.removeChild(video);
            document.body.removeChild(canvas);
          });
        })
        .catch((error) => {
          console.error("Ошибка при получении доступа к камере:", error);
        });
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newMessage.file = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.capturedPhoto = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    uploadPhoto() {
      if (this.photoFile) {
        // Отправка файла на бэкенд
        const formData = new FormData();
        formData.append("multipartFile", this.photoFile);

        console.log(formData)
      }
    },
  },

}
</script>

<style scoped>

</style>
